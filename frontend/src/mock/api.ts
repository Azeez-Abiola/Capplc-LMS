/**
 * Mock backend: an axios adapter that answers every /api call in the browser,
 * mirroring the Express controllers' response shapes and role checks.
 */
import { AxiosError, AxiosHeaders, type AxiosAdapter, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { getDb, saveDb, uid, type Row } from './db'
import { buildSession, buildUser, profileFromToken } from './supabaseClient'

class HttpError extends Error {
  status: number
  constructor(status: number, message: string) { super(message); this.status = status }
}

interface Ctx {
  params: Record<string, string>
  query: URLSearchParams
  body: any
  user: Row | null
}
type Auth = false | true | string[]
type Handler = (ctx: Ctx) => any

const now = () => new Date().toISOString()
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const byNewest = (k: string) => (a: Row, b: Row) => new Date(b[k]).getTime() - new Date(a[k]).getTime()
const pick = (r: Row | undefined, keys: string[]) => r ? Object.fromEntries(keys.map(k => [k, r[k]])) : null

// ── Helpers mirroring backend joins ──
const db = () => getDb()
const findOr404 = <T extends Row>(rows: T[], id: string, what: string) => {
  const r = rows.find(x => x.id === id)
  if (!r) throw new HttpError(404, `${what} not found`)
  return r
}
const modulesOf = (courseId: string) => db().modules.filter(m => m.course_id === courseId).sort((a, b) => a.order - b.order)
const courseSummary = (c: Row) => {
  const mods = modulesOf(c.id)
  return { ...c, modules: mods.map(m => pick(m, ['id', 'title', 'order'])), module_count: [{ count: mods.length }] }
}
const companyIdOf = (u: Row | null) => (u?.role === 'super_admin' ? null : u?.company_id ?? null)
const progressWithModule = (p: Row): Row => {
  const m = db().modules.find(x => x.id === p.lesson_id)
  return { ...p, modules: m ? { course_id: m.course_id, title: m.title } : null }
}
const lastPositionFor = (userId: string, courseId: string) => {
  const latest = db().user_progress.filter(p => p.user_id === userId).map(progressWithModule)
    .filter(p => p.modules?.course_id === courseId).sort(byNewest('last_watched_at'))[0]
  let lastPosition = '00:00'
  if (latest?.current_time) lastPosition = `${Math.floor(latest.current_time / 60)}:${String(Math.floor(latest.current_time % 60)).padStart(2, '0')}`
  return { lastPosition, lastLessonTitle: latest?.modules?.title || '' }
}
const activeSub = (userId: string) => db().subscriptions.find(s => s.user_id === userId && s.status === 'active')
const tierById = (id: string) => db().subscription_tiers.find(t => t.id === id)
const tierByName = (name: string) => db().subscription_tiers.find(t => t.name.toUpperCase() === String(name).toUpperCase())

function recomputeEnrollment(userId: string, courseId: string) {
  const mods = modulesOf(courseId)
  if (!mods.length) return
  const done = db().user_progress.filter(p => p.user_id === userId && p.is_completed && mods.some(m => m.id === p.lesson_id)).length
  const progress = Math.round((done / mods.length) * 100)
  let e = db().enrollments.find(x => x.user_id === userId && x.course_id === courseId)
  if (!e) { e = { id: uid('enr'), user_id: userId, course_id: courseId, enrolled_at: now(), created_at: now() }; db().enrollments.push(e) }
  e.progress = progress
  e.status = progress === 100 ? 'completed' : 'active'
  if (progress === 100 && !db().certificates.some(c => c.user_id === userId && c.course_id === courseId)) issueCertificate(userId, courseId)
}

function issueCertificate(userId: string, courseId: string) {
  const profile = db().profiles.find(p => p.id === userId)
  const course = db().courses.find(c => c.id === courseId)
  if (!profile || !course) throw new HttpError(404, 'User or Course not found')
  const serial = `CAP-${Date.now()}-${Math.random().toString(16).slice(2, 10).toUpperCase()}`
  const cert = {
    id: uid('cert'), user_id: userId, course_id: courseId, company_id: profile.company_id ?? null, serial_no: serial, issued_at: now(),
    certificate_url: `https://placehold.co/1200x850/0f172a/ffffff/png?text=${encodeURIComponent(`CAP Academy Certificate\n${profile.first_name} ${profile.last_name}\n${course.title}\n${serial}`)}`,
  }
  db().certificates.push(cert)
  db().notifications.push({ id: uid('n'), user_id: userId, title: 'Certificate issued', message: `You earned a certificate for ${course.title}.`, type: 'SUCCESS', is_read: false, created_at: now() })
  return cert
}

function setSubscription(userId: string, tierName: string, ref?: string) {
  const tier = tierByName(tierName)
  if (!tier) throw new HttpError(400, `Unknown tier ${tierName}`)
  db().subscriptions.filter(s => s.user_id === userId && s.status === 'active').forEach(s => { s.status = 'cancelled'; s.updated_at = now() })
  if (tier.name === 'FREE') return null
  const end = new Date(); end.setFullYear(end.getFullYear() + 1)
  const sub = { id: uid('sub'), user_id: userId, tier_id: tier.id, status: 'active', start_date: now(), end_date: end.toISOString(), last_payment_ref: ref ?? null, created_at: now(), updated_at: now() }
  db().subscriptions.push(sub)
  return sub
}

function scopedProfiles(user: Row) {
  const companyId = companyIdOf(user)
  if (user.role === 'super_admin') return db().profiles
  if (companyId) return db().profiles.filter(p => p.company_id === companyId && p.role !== 'super_admin')
  return db().profiles.filter(p => p.id === user.id)
}

// ── Route table ──
const routes: [string, string, Auth, Handler][] = [
  // Auth
  ['POST', 'auth/login', false, ({ body }) => {
    const u = db().users.find(x => x.email.toLowerCase() === String(body?.email || '').toLowerCase() && x.password === body?.password)
    const profile = u && db().profiles.find(p => p.id === u.id)
    if (!profile) throw new HttpError(400, 'Invalid login credentials')
    const session = buildSession(profile)
    return { message: 'Login successful', session, user: session.user }
  }],
  ['POST', 'auth/register', false, ({ body }) => {
    const email = String(body?.email || '').trim().toLowerCase()
    if (!email || !body?.password) throw new HttpError(400, 'Email and password are required')
    if (db().users.some(u => u.email.toLowerCase() === email)) throw new HttpError(400, 'This email is already registered. Please sign in instead.')
    const company = body.company_code ? db().companies.find(c => c.invitation_code === String(body.company_code).toUpperCase()) : null
    const id = uid('u')
    const profile = {
      id, email, first_name: body.first_name ?? '', last_name: body.last_name ?? '', phone: body.phone ?? '', state: body.state ?? '',
      city: body.city ?? null, whatsapp_number: body.whatsapp_number ?? null, years_of_experience: body.years_of_experience ?? null,
      specialty: body.specialty ?? null, role: 'painter', status: 'active', company_id: company?.id ?? null, company_code: company?.invitation_code ?? null,
      onboarding_completed: false, interests: [], created_at: now(), updated_at: now(),
    }
    db().users.push({ id, email, password: body.password })
    db().profiles.push(profile)
    return { status: 201, data: { message: 'Registration successful. (Demo mode: no email is sent — you can sign in right away.)', user: buildUser(profile) } }
  }],
  ['POST', 'auth/logout', false, () => ({ message: 'Logged out' })],
  ['POST', 'auth/reset-password', false, () => ({ message: 'Demo mode: password reset emails are not sent.' })],
  ['POST', 'auth/forgot-password', false, () => ({ message: 'Demo mode: password reset emails are not sent.' })],

  // Users
  ['GET', 'users/profile', true, ({ user }) => user],
  ['PUT', 'users/profile', true, ({ user, body }) => {
    for (const k of ['first_name', 'last_name', 'phone', 'state', 'city', 'years_of_experience', 'specialty', 'onboarding_completed', 'interests'])
      if (body?.[k] !== undefined) user![k] = body[k]
    user!.updated_at = now()
    return user
  }],
  ['GET', 'users', ['admin', 'super_admin'], ({ user }) => [...scopedProfiles(user!)].sort(byNewest('created_at'))],
  ['GET', 'users/:id', ['admin', 'super_admin'], ({ params }) => findOr404(db().profiles, params.id, 'User')],
  ['PUT', 'users/:id/status', ['admin', 'super_admin'], ({ params, body }) => Object.assign(findOr404(db().profiles, params.id, 'User'), { status: body?.status, updated_at: now() })],
  ['PUT', 'users/:id', ['admin', 'super_admin'], ({ params, body }) => {
    const p = findOr404(db().profiles, params.id, 'User')
    for (const k of ['first_name', 'last_name', 'role', 'status', 'phone', 'state', 'city']) if (body?.[k] !== undefined) p[k] = body[k]
    p.updated_at = now()
    return p
  }],
  ['POST', 'users/:id/deactivate', ['admin', 'super_admin'], ({ params }) => {
    Object.assign(findOr404(db().profiles, params.id, 'User'), { status: 'inactive', updated_at: now() })
    return { message: 'User deactivated successfully' }
  }],

  // Courses
  ['GET', 'courses', false, ({ query }) => {
    let list = db().courses
    const status = query.get('status'), tier = query.get('tier')
    if (status === 'published') list = list.filter(c => c.is_published)
    if (status === 'draft') list = list.filter(c => !c.is_published)
    if (tier) list = list.filter(c => c.tier_access === tier)
    return [...list].sort(byNewest('created_at')).map(courseSummary)
  }],
  ['GET', 'courses/my-courses', true, ({ user }) => db().enrollments.filter(e => e.user_id === user!.id).map(e => {
    const c = db().courses.find(x => x.id === e.course_id)
    return { ...e, courses: c ? courseSummary(c) : null, ...lastPositionFor(user!.id, e.course_id) }
  })],
  ['GET', 'courses/admin/all', ['admin'], () => [...db().courses].sort(byNewest('created_at')).map(c => ({ ...c, modules: modulesOf(c.id).map(m => pick(m, ['id', 'title', 'order'])) }))],
  ['POST', 'courses/enroll', true, ({ user, body }) => {
    if (!body?.courseId) throw new HttpError(400, 'Missing user or course ID')
    const existing = db().enrollments.find(e => e.user_id === user!.id && e.course_id === body.courseId)
    if (existing) return { message: 'Already enrolled', enrollment: { id: existing.id } }
    if (!db().courses.some(c => c.id === body.courseId)) throw new HttpError(500, 'insert or update on table "enrollments" violates foreign key constraint')
    const e = { id: uid('enr'), user_id: user!.id, course_id: body.courseId, status: 'enrolled', progress: 0, enrolled_at: now(), created_at: now() }
    db().enrollments.push(e)
    return { status: 201, data: e }
  }],
  ['GET', 'courses/:id', false, ({ params }) => {
    const c = db().courses.find(x => x.id === params.id)
    if (!c) throw new HttpError(500, 'JSON object requested, multiple (or no) rows returned')
    const mods = modulesOf(c.id)
    return { ...c, modules: mods.map(m => ({ ...m, lessons: [] })), module_count: [{ count: mods.length }] }
  }],
  ['POST', 'courses', ['admin'], ({ body }) => {
    if (!body?.title) throw new HttpError(400, 'Course title is required')
    const c = {
      id: uid('crs'), title: body.title, slug: null, description: body.description || '', tier_access: body.tier_access || 'free',
      level: body.level || 'Beginner', thumbnail_url: body.thumbnail || body.thumbnail_url || null, video_url: body.video_url || null,
      duration: body.duration_minutes ? String(body.duration_minutes) : '0', rating: 0, category_id: null, archived_at: null,
      is_published: body.status === 'published' || body.status === 'active' || body.is_published === true, created_at: now(), updated_at: now(),
    }
    db().courses.push(c)
    return { status: 201, data: c }
  }],
  ['PATCH', 'courses/:id', ['admin'], ({ params, body }) => updateCourse(params.id, body)],
  ['PUT', 'courses/:id', ['admin'], ({ params, body }) => updateCourse(params.id, body)],
  ['POST', 'courses/:id/archive', ['admin'], ({ params }) => ({ message: 'Course archived successfully', course: Object.assign(findOr404(db().courses, params.id, 'Course'), { is_published: false, archived_at: now() }) })],
  ['POST', 'courses/:id/restore', ['admin'], ({ params }) => ({ message: 'Course restored successfully', course: Object.assign(findOr404(db().courses, params.id, 'Course'), { is_published: false, archived_at: null }) })],
  ['DELETE', 'courses/:id', ['admin'], ({ params }) => {
    const d = db()
    d.courses = d.courses.filter(c => c.id !== params.id)
    d.modules = d.modules.filter(m => m.course_id !== params.id)
    d.enrollments = d.enrollments.filter(e => e.course_id !== params.id)
    d.certificates = d.certificates.filter(c => c.course_id !== params.id)
    return { status: 204, data: '' }
  }],

  // Modules (the playable lessons)
  ['GET', 'modules/course/:courseId', false, ({ params }) => modulesOf(params.courseId).map(m => ({ ...m, lessons: [] }))],
  ['PUT', 'modules/course/:courseId/reorder', ['admin'], ({ params, body }) => {
    if (!Array.isArray(body?.orderedIds)) throw new HttpError(400, 'orderedIds must be an array of module IDs')
    body.orderedIds.forEach((id: string, i: number) => { const m = db().modules.find(x => x.id === id && x.course_id === params.courseId); if (m) m.order = i + 1 })
    return modulesOf(params.courseId)
  }],
  ['GET', 'modules/:id', false, ({ params }) => {
    const m = db().modules.find(x => x.id === params.id)
    if (!m) throw new HttpError(500, 'JSON object requested, multiple (or no) rows returned')
    return { ...m, lessons: [] }
  }],
  ['POST', 'modules', ['admin'], ({ body }) => {
    if (!body?.course_id || !body?.title) throw new HttpError(400, 'course_id and title are required')
    const m = {
      id: uid('mod'), course_id: body.course_id, title: body.title, description: body.description ?? null,
      order: body.order ?? modulesOf(body.course_id).length + 1, duration: body.duration ?? null,
      video_url: body.video_url ?? null, thumbnail_url: body.thumbnail_url ?? null, created_at: now(), updated_at: now(),
    }
    db().modules.push(m)
    return { status: 201, data: m }
  }],
  ['PATCH', 'modules/:id', ['admin'], ({ params, body }) => Object.assign(findOr404(db().modules, params.id, 'Module'), body, { updated_at: now() })],
  ['DELETE', 'modules/:id', ['admin'], ({ params }) => {
    db().modules = db().modules.filter(m => m.id !== params.id)
    return { status: 204, data: '' }
  }],

  // Progress
  ['POST', 'progress/sync', true, ({ user, body }) => {
    if (!body?.lesson_id) throw new HttpError(400, 'Missing required data')
    const percent = body.duration ? Math.min(Math.round((body.current_time / body.duration) * 100), 100) : 0
    let p = db().user_progress.find(x => x.user_id === user!.id && x.lesson_id === body.lesson_id)
    if (!p) { p = { id: uid('up'), user_id: user!.id, lesson_id: body.lesson_id, is_completed: false }; db().user_progress.push(p) }
    Object.assign(p, { current_time: body.current_time, last_watched_at: now(), is_completed: p.is_completed || percent >= 95 })
    const mod = db().modules.find(m => m.id === body.lesson_id)
    if (mod) recomputeEnrollment(user!.id, mod.course_id)
    return progressWithModule(p)
  }],
  ['POST', 'progress/complete', true, ({ user, body }) => {
    let p = db().user_progress.find(x => x.user_id === user!.id && x.lesson_id === body?.lesson_id)
    if (!p) { p = { id: uid('up'), user_id: user!.id, lesson_id: body?.lesson_id, current_time: 0, last_watched_at: now() }; db().user_progress.push(p) }
    Object.assign(p, { is_completed: true, completed_at: now() })
    const mod = db().modules.find(m => m.id === body?.lesson_id)
    if (mod) recomputeEnrollment(user!.id, mod.course_id)
    return p
  }],
  ['GET', 'progress/course/:courseId', true, ({ user, params }) =>
    db().user_progress.filter(p => p.user_id === user!.id).map(progressWithModule).filter(p => p.modules?.course_id === params.courseId)],

  // Certificates
  ['GET', 'certificates', true, ({ user }) => db().certificates.filter(c => c.user_id === user!.id).sort(byNewest('issued_at'))
    .map(c => ({ ...c, courses: pick(db().courses.find(x => x.id === c.course_id), ['title']) }))],
  ['GET', 'certificates/admin/all', ['admin'], ({ user }) => {
    const companyId = companyIdOf(user)
    return db().certificates.filter(c => !companyId || c.company_id === companyId).sort(byNewest('issued_at')).map(c => ({
      ...c,
      profiles: pick(db().profiles.find(p => p.id === c.user_id), ['first_name', 'last_name', 'email']),
      courses: pick(db().courses.find(x => x.id === c.course_id), ['title', 'tier_access']),
    }))
  }],
  ['GET', 'certificates/verify/:serial', false, ({ params }) => {
    const c = db().certificates.find(x => x.serial_no === params.serial)
    if (!c) throw new HttpError(404, 'Certificate not found')
    return { ...c, profiles: pick(db().profiles.find(p => p.id === c.user_id), ['first_name', 'last_name', 'email']), courses: pick(db().courses.find(x => x.id === c.course_id), ['title']) }
  }],
  ['POST', 'certificates/issue', ['admin'], ({ body }) => ({ status: 201, data: issueCertificate(body?.user_id, body?.course_id) })],

  // Subscriptions & payments
  ['GET', 'subscriptions/tiers', false, () => [...db().subscription_tiers].sort((a, b) => a.price - b.price)],
  ['GET', 'subscriptions/current', true, ({ user }) => {
    const s = activeSub(user!.id)
    if (!s) return { message: 'No active subscription found' }
    const t = tierById(s.tier_id)
    // `tier` / `current_period_end` are what the Subscription page reads
    return { ...s, subscription_tiers: t, tier: t?.name ?? 'FREE', current_period_end: s.end_date }
  }],
  ['POST', 'subscriptions', true, ({ user, body }) => {
    const t = tierByName(body?.tier)
    const ref = `CAP-REF-${Date.now()}`
    if (t && t.price > 0) db().payments.push({ id: uid('pay'), user_id: user!.id, company_id: user!.company_id ?? null, amount: t.price, currency: 'NGN', status: 'completed', reference: ref, payment_method: 'monnify', tier_id: t.id, created_at: now(), updated_at: now() })
    return setSubscription(user!.id, body?.tier, ref) ?? { message: 'Moved to FREE plan' }
  }],
  ['POST', 'subscriptions/update', true, ({ user, body }) => setSubscription(user!.id, tierById(body?.tier_id)?.name ?? body?.tier_id)],
  ['POST', 'payments/initialize', true, ({ user, body }) => {
    const t = tierByName(body?.tier) ?? tierById(body?.tier_id)
    const reference = `CAP-REF-${Date.now()}`
    const pay = { id: uid('pay'), user_id: user!.id, company_id: user!.company_id ?? null, amount: body?.amount ?? t?.price ?? 0, currency: 'NGN', status: 'pending', reference, payment_method: 'monnify', tier_id: t?.id ?? null, created_at: now(), updated_at: now() }
    db().payments.push(pay)
    return { message: 'Payment initialized', reference, data: pay }
  }],
  ['POST', 'payments/verify', true, ({ body }) => {
    const ref = body?.reference ?? body?.transactionReference
    const pay = db().payments.find(p => p.reference === ref)
    if (!pay) throw new HttpError(404, 'Payment not found')
    Object.assign(pay, { status: 'completed', updated_at: now() })
    if (pay.tier_id) setSubscription(pay.user_id, tierById(pay.tier_id)?.name ?? 'FREE', ref)
    return { message: 'Payment verified and subscription activated', data: pay }
  }],
  ['GET', 'payments/history', true, ({ user }) => db().payments.filter(p => p.user_id === user!.id).sort(byNewest('created_at'))],
  ['GET', 'payments/admin/all', ['admin'], ({ user }) => {
    const companyId = companyIdOf(user)
    return db().payments.filter(p => !companyId || p.company_id === companyId).sort(byNewest('created_at'))
      .map(p => ({ ...p, profiles: pick(db().profiles.find(x => x.id === p.user_id), ['first_name', 'last_name', 'email']) }))
  }],

  // Notifications
  ['GET', 'notifications', true, ({ user }) => db().notifications.filter(n => n.user_id === user!.id).sort(byNewest('created_at')).slice(0, 20)],
  ['PUT', 'notifications/read-all', true, ({ user }) => {
    db().notifications.filter(n => n.user_id === user!.id).forEach(n => { n.is_read = true })
    return { message: 'All notifications marked as read' }
  }],
  ['PUT', 'notifications/:id/read', true, ({ user, params }) => {
    const n = db().notifications.find(x => x.id === params.id && x.user_id === user!.id)
    if (n) n.is_read = true
    return { message: 'Notification marked as read' }
  }],

  // Analytics (company admins — scoped to their company)
  ['GET', 'analytics/admin', ['admin'], ({ user }) => {
    const d = db(), companyId = companyIdOf(user)
    const profiles = companyId ? d.profiles.filter(p => p.company_id === companyId && p.role !== 'super_admin') : d.profiles
    const memberIds = new Set(profiles.map(p => p.id))
    const yesterday = Date.now() - 864e5
    return {
      totalUsers: profiles.length,
      totalCourses: d.courses.length,
      totalCertificates: d.certificates.filter(c => !companyId || c.company_id === companyId).length,
      activeSubscriptions: d.subscriptions.filter(s => s.status === 'active' && (!companyId || memberIds.has(s.user_id))).length,
      revenue: d.payments.filter(p => p.status === 'completed' && (!companyId || p.company_id === companyId)).reduce((s, p) => s + Number(p.amount), 0),
      dailyEngagement: d.user_progress.filter(p => new Date(p.last_watched_at).getTime() >= yesterday).length,
      growth: 12.5,
      companyName: companyId ? d.companies.find(c => c.id === companyId)?.name ?? 'Global HQ' : 'Global HQ',
      recentUsers: [...profiles].sort(byNewest('created_at')).slice(0, 5),
    }
  }],
  ['GET', 'analytics/admin/detailed', ['admin'], ({ user }) => {
    const d = db(), companyId = companyIdOf(user), year = new Date().getFullYear()
    const activity = MONTHS.map(() => 0)
    d.profiles.filter(p => !companyId || p.company_id === companyId).forEach(p => {
      const dt = new Date(p.created_at); if (dt.getFullYear() === year) activity[dt.getMonth()]++
    })
    const dist: Record<string, number> = { ELITE: 0, PRO: 0, free: 0 }
    d.certificates.filter(c => !companyId || c.company_id === companyId).forEach(c => {
      const t = d.courses.find(x => x.id === c.course_id)?.tier_access || 'free'; if (t in dist) dist[t]++
    })
    const recentActivity = d.enrollments
      .map(e => ({ e, p: d.profiles.find(x => x.id === e.user_id), c: d.courses.find(x => x.id === e.course_id) }))
      .filter(x => !companyId || x.p?.company_id === companyId).sort((a, b) => byNewest('created_at')(a.e, b.e)).slice(0, 6)
      .map(({ e, p, c }) => {
        const diff = Math.floor((Date.now() - new Date(e.created_at).getTime()) / 60000)
        const time_ago = diff < 1 ? 'Just now' : diff < 60 ? `${diff}m ago` : diff < 1440 ? `${Math.floor(diff / 60)}h ago` : `${Math.floor(diff / 1440)}d ago`
        return { user_name: `${p?.first_name} ${p?.last_name?.charAt(0)}.`, action_type: e.status === 'completed' ? 'Completed' : 'Started', resource_name: c?.title, time_ago }
      })
    return {
      activity,
      distribution: [{ label: 'Elite Mastery', value: dist.ELITE }, { label: 'Pro Professional', value: dist.PRO }, { label: 'Standard Practical', value: dist.free }],
      recentActivity,
    }
  }],
  ['GET', 'analytics/user', true, ({ user }) => {
    const d = db()
    const enrollments = d.enrollments.filter(e => e.user_id === user!.id).sort(byNewest('enrolled_at'))
    const progress = d.user_progress.filter(p => p.user_id === user!.id)
    const completed = progress.filter(p => p.is_completed).length
    return {
      enrolledCourses: enrollments.length,
      completedCoursesCount: completed,
      dashboardProgress: enrollments.length ? Math.round(enrollments.reduce((s, e) => s + (e.progress || 0), 0) / enrollments.length) : 0,
      certificatesIssued: d.certificates.filter(c => c.user_id === user!.id).length,
      totalXp: completed * 50,
      enrolledCourseData: enrollments.map(e => {
        const c = d.courses.find(x => x.id === e.course_id)
        return {
          id: e.id, status: e.status, course_id: e.course_id, progress: e.progress,
          courses: c ? { ...pick(c, ['id', 'title', 'description', 'thumbnail_url', 'tier_access', 'level', 'duration']), module_count: [{ count: modulesOf(c.id).length }] } : null,
          ...lastPositionFor(user!.id, e.course_id),
        }
      }),
    }
  }],

  // Super admin
  ['GET', 'super-admin/overview', ['super_admin'], () => {
    const d = db(), monthAgo = Date.now() - 30 * 864e5
    const painters = d.profiles.filter(p => p.role !== 'super_admin')
    return {
      totalCompanies: d.companies.length,
      activeSubscriptions: d.subscriptions.filter(s => s.status === 'active').length,
      totalPainters: painters.length,
      platformRevenue: d.payments.filter(p => p.status === 'completed').reduce((s, p) => s + Number(p.amount), 0),
      newCompanies: d.companies.filter(c => new Date(c.created_at).getTime() >= monthAgo).length,
      newPainters: painters.filter(p => new Date(p.created_at).getTime() >= monthAgo).length,
      tiers: {
        free: d.companies.filter(c => c.subscription_tier === 'FREE').length,
        pro: d.companies.filter(c => c.subscription_tier === 'PRO').length,
        elite: d.companies.filter(c => c.subscription_tier === 'ELITE').length,
      },
    }
  }],
  ['GET', 'super-admin/companies', ['super_admin'], () => {
    const d = db()
    return [...d.companies].sort(byNewest('created_at')).map(c => ({
      id: c.id, name: c.name, tier: c.subscription_tier, users: d.profiles.filter(p => p.company_id === c.id).length,
      exclusive_courses: 0, status: c.subscription_status || 'active',
      revenue: d.payments.filter(p => p.status === 'completed' && p.company_id === c.id).reduce((s, p) => s + Number(p.amount), 0),
      logo_url: c.logo_url, official_email: c.official_email, official_phone: c.official_phone, address: c.address,
      max_users: c.max_users, max_video_upload: c.max_video_upload, createdAt: c.created_at,
    }))
  }],
  ['POST', 'super-admin/companies', ['super_admin'], ({ body }) => {
    const c = {
      id: uid('co'), name: body?.name, max_users: body?.max_users || 10, max_video_upload: body?.max_video_upload || 5, logo_url: body?.logo_url ?? null,
      subscription_tier: body?.subscription_tier || 'FREE', invitation_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
      subscription_status: 'active', official_email: body?.official_email, official_phone: body?.official_phone, address: body?.address,
      admin_id: null, created_at: now(), updated_at: now(),
    }
    db().companies.push(c)
    return { status: 201, data: c }
  }],
  ['PUT', 'super-admin/companies/:id', ['super_admin'], ({ params, body }) => {
    const c = findOr404(db().companies, params.id, 'Company')
    const map: Row = { ...body, subscription_tier: body?.subscription_tier || body?.tier, subscription_status: body?.status }
    for (const k of ['name', 'max_users', 'max_video_upload', 'logo_url', 'subscription_tier', 'subscription_status', 'official_email', 'official_phone', 'address'])
      if (map[k] !== undefined) c[k] = map[k]
    c.updated_at = now()
    return c
  }],
  ['GET', 'super-admin/analytics', ['super_admin'], () => {
    const d = db()
    return {
      kpis: [
        { label: 'Total Users', value: d.profiles.filter(p => p.role !== 'super_admin').length, change: '12', description: 'Active professionals' },
        { label: 'Active Companies', value: d.companies.length, change: '2', description: 'B2B accounts' },
        { label: 'Certificates Issued', value: d.certificates.length, change: '8', description: 'Credentials awarded' },
        { label: 'Total Enrollments', value: d.enrollments.length, change: '24', description: 'Total engagement' },
      ],
      growth: { users: 34, revenue: 28, retention: 92 },
      courseMetrics: d.courses.slice(0, 5).map(c => ({
        title: c.title, enrolled: d.enrollments.filter(e => e.course_id === c.id).length, completions: d.certificates.filter(x => x.course_id === c.id).length,
      })),
      engagementTrend: [
        { day: 'Mon', value: 72 }, { day: 'Tue', value: 85 }, { day: 'Wed', value: 91 }, { day: 'Thu', value: 68 },
        { day: 'Fri', value: 54 }, { day: 'Sat', value: 30 }, { day: 'Sun', value: 22 },
      ],
    }
  }],
  ['GET', 'super-admin/revenue', ['super_admin'], () => {
    const d = db(), monthly: Record<string, number> = {}
    const completed = d.payments.filter(p => p.status === 'completed')
    completed.forEach(p => { const k = MONTHS[new Date(p.created_at).getMonth()]; monthly[k] = (monthly[k] || 0) + Number(p.amount) })
    const paying = d.companies.filter(c => c.subscription_tier !== 'FREE')
    return {
      trend: MONTHS.map(m => ({ month: m, amount: monthly[m] || 0 })).filter(m => m.amount > 0 || MONTHS.indexOf(m.month) <= new Date().getMonth()),
      totalRevenue: completed.reduce((s, p) => s + Number(p.amount), 0),
      mrr: paying.reduce((s, c) => s + (c.subscription_tier === 'PRO' ? 50000 : c.subscription_tier === 'ELITE' ? 150000 : 0), 0),
      payingCompanies: paying.length,
    }
  }],

  // Media
  ['POST', 'uploads', ['admin', 'super_admin'], ({ body }) => {
    const file = body instanceof FormData ? body.get('file') : null
    if (!(file instanceof Blob)) throw new HttpError(400, 'No file uploaded')
    // Object URLs only live for this browser session — fine for demo previews
    return { url: URL.createObjectURL(file) }
  }],
  ['POST', 'videos/signed-url', true, ({ body }) => {
    if (!body?.bucket || !body?.path) throw new HttpError(400, 'Storage bucket and path are required')
    return { signedUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4' }
  }],
  ['GET', 'videos/list/:courseId', ['admin'], ({ params }) => modulesOf(params.courseId).filter(m => m.video_url)
    .map(m => ({ name: `${m.title}.mp4`, id: m.id, created_at: m.created_at, metadata: { mimetype: 'video/mp4' } }))],
]

function updateCourse(id: string, body: Row) {
  const c = findOr404(db().courses, id, 'Course')
  if (body.title) c.title = body.title
  if (body.description !== undefined) c.description = body.description
  if (body.tier_access) c.tier_access = body.tier_access
  if (body.level) c.level = body.level
  if (body.thumbnail !== undefined || body.thumbnail_url !== undefined) c.thumbnail_url = body.thumbnail || body.thumbnail_url
  if (body.video_url !== undefined) c.video_url = body.video_url
  if (body.duration_minutes) c.duration = String(body.duration_minutes)
  if (body.status !== undefined || body.is_published !== undefined)
    c.is_published = body.status === 'published' || body.status === 'active' || body.is_published === true
  c.updated_at = now()
  return c
}

const compiled = routes.map(([method, pattern, auth, handler]) => {
  const keys: string[] = []
  const re = new RegExp('^' + pattern.replace(/:(\w+)/g, (_, k) => { keys.push(k); return '([^/]+)' }) + '$')
  return { method, re, keys, auth, handler }
})

function getAuthHeader(config: InternalAxiosRequestConfig): string | undefined {
  const h: any = config.headers
  return (typeof h?.get === 'function' ? h.get('Authorization') : h?.Authorization) ?? undefined
}

export const mockAdapter: AxiosAdapter = async (config) => {
  const method = (config.method || 'get').toUpperCase()
  const full = new URL(config.url || '', 'http://mock.local/api/')
  const path = full.pathname.replace(/^\/api\//, '').replace(/^\/+|\/+$/g, '')
  const query = new URLSearchParams(full.search)
  Object.entries(config.params || {}).forEach(([k, v]) => query.set(k, String(v)))
  let body: any = config.data
  if (typeof body === 'string') { try { body = JSON.parse(body) } catch { /* keep raw */ } }

  // Small delay so loading states behave like a real network
  await new Promise(r => setTimeout(r, 120 + Math.random() * 180))

  const respond = (status: number, data: any): AxiosResponse => {
    const response: AxiosResponse = { data, status, statusText: String(status), headers: new AxiosHeaders(), config, request: {} }
    if (status >= 200 && status < 300) return response
    throw new AxiosError(data?.error || `Request failed with status code ${status}`,
      status >= 500 ? AxiosError.ERR_BAD_RESPONSE : AxiosError.ERR_BAD_REQUEST, config, {}, response)
  }

  let pathMatched = false
  for (const r of compiled) {
    const m = path.match(r.re)
    if (!m) continue
    pathMatched = true
    if (r.method !== method) continue
    const params = Object.fromEntries(r.keys.map((k, i) => [k, decodeURIComponent(m[i + 1])]))
    const user = profileFromToken(getAuthHeader(config)?.replace(/^Bearer\s+/i, ''))
    if (r.auth && !user) return respond(401, { error: 'Access denied. No token provided.' })
    if (Array.isArray(r.auth) && !r.auth.includes(user!.role)) return respond(403, { error: 'Forbidden: Insufficient permissions' })
    try {
      const result = r.handler({ params, query, body, user })
      saveDb()
      if (result && typeof result === 'object' && 'status' in result && 'data' in result && Object.keys(result).length === 2)
        return respond(result.status, result.data)
      return respond(200, result)
    } catch (e: any) {
      if (e instanceof AxiosError) throw e
      return respond(e instanceof HttpError ? e.status : 500, { error: e?.message || 'Mock server error' })
    }
  }
  return respond(404, { error: pathMatched ? `Method ${method} not allowed on /api/${path}` : `Route /api/${path} not found` })
}
