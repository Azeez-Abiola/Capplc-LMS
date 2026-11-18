/**
 * In-browser mock database. Seeded on first load and persisted to localStorage,
 * so changes made while testing (new courses, profile edits…) survive reloads
 * in that browser. Call resetMockDb() to start fresh.
 */
import { DEMO_PASSWORD } from './config'

const STORAGE_KEY = 'cap-mock-db-v1'

export type Row = Record<string, any>
export interface MockDb {
  users: { id: string; email: string; password: string }[]
  profiles: Row[]
  companies: Row[]
  courses: Row[]
  modules: Row[]
  enrollments: Row[]
  user_progress: Row[]
  certificates: Row[]
  payments: Row[]
  subscription_tiers: Row[]
  subscriptions: Row[]
  notifications: Row[]
}

const daysAgo = (d: number, h = 0) => new Date(Date.now() - d * 864e5 - h * 36e5).toISOString()
const daysAhead = (d: number) => new Date(Date.now() + d * 864e5).toISOString()
let seq = 0
export const uid = (prefix = 'id') =>
  `${prefix}-${Date.now().toString(36)}-${(seq++).toString(36)}${Math.random().toString(36).slice(2, 6)}`

const VIDEO_A = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
const VIDEO_B = 'https://www.w3schools.com/html/mov_bbb.mp4'
const thumb = (seed: string) => `https://picsum.photos/seed/${seed}/800/450`

function seed(): MockDb {
  // ── Companies ──
  const companies = [
    { id: 'co-captest', name: 'CAP Test Painters Ltd', invitation_code: 'CAPTEST', admin_id: 'u-admin', subscription_tier: 'PRO', subscription_status: 'active', max_users: 25, max_video_upload: 10, official_email: 'companyadmin@captest.dev', official_phone: '08000000001', address: '1 Test Avenue, Ikeja, Lagos', logo_url: null, created_at: daysAgo(120) },
    { id: 'co-lagos', name: 'Lagos Coatings Co', invitation_code: 'LAGCOAT', admin_id: null, subscription_tier: 'ELITE', subscription_status: 'active', max_users: 100, max_video_upload: 50, official_email: 'ops@lagoscoatings.test', official_phone: '08000000002', address: '14 Marina Rd, Lagos Island', logo_url: null, created_at: daysAgo(75) },
    { id: 'co-abuja', name: 'Abuja Finishers', invitation_code: 'ABJFIN', admin_id: null, subscription_tier: 'FREE', subscription_status: 'active', max_users: 10, max_video_upload: 5, official_email: 'hello@abujafinishers.test', official_phone: '08000000003', address: 'Plot 22 Wuse II, Abuja', logo_url: null, created_at: daysAgo(12) },
    { id: 'co-ph', name: 'Garden City Decor', invitation_code: 'GCDECO', admin_id: null, subscription_tier: 'PRO', subscription_status: 'pending', max_users: 20, max_video_upload: 10, official_email: 'team@gcdecor.test', official_phone: '08000000004', address: '5 Aba Rd, Port Harcourt', logo_url: null, created_at: daysAgo(4) },
  ]

  // ── Profiles (login accounts first, then background painters) ──
  const p = (id: string, email: string, first: string, last: string, role: string, company: string | null, state: string, created: number, extra: Row = {}) => ({
    id, email, first_name: first, last_name: last, role, company_id: company,
    company_code: companies.find(c => c.id === company)?.invitation_code ?? null,
    phone: '080' + String(Math.abs([...id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7))).padStart(8, '0').slice(0, 8),
    state, city: state === 'Lagos' ? 'Ikeja' : state, status: 'active', specialty: 'Interior Finishing',
    years_of_experience: '3-5', onboarding_completed: true, interests: ['Decorative Finishes'],
    whatsapp_number: null, created_at: daysAgo(created), updated_at: daysAgo(created), ...extra,
  })
  const profiles = [
    p('u-super', 'superadmin@captest.dev', 'Sade', 'Platform', 'super_admin', null, 'Lagos', 200, { specialty: null }),
    p('u-admin', 'companyadmin@captest.dev', 'Chidi', 'Okafor', 'admin', 'co-captest', 'Abuja', 120),
    p('u-free', 'painter.free@captest.dev', 'Tunde', 'Bakare', 'painter', 'co-captest', 'Lagos', 40),
    p('u-pro', 'painter.pro@captest.dev', 'Ngozi', 'Eze', 'painter', 'co-captest', 'Enugu', 60, { specialty: 'Texture & Silk', years_of_experience: '5-10' }),
    p('u-elite', 'painter.elite@captest.dev', 'Musa', 'Bello', 'painter', 'co-captest', 'Kano', 90, { specialty: 'Industrial Coating', years_of_experience: '10+' }),
    p('u-solo', 'painter.solo@captest.dev', 'Ada', 'Nwosu', 'painter', null, 'Rivers', 8, { years_of_experience: '1-3' }),
    p('u-bg1', 'kemi.adeyemi@captest.dev', 'Kemi', 'Adeyemi', 'painter', 'co-captest', 'Oyo', 20),
    p('u-bg2', 'ibrahim.sule@captest.dev', 'Ibrahim', 'Sule', 'painter', 'co-captest', 'Kaduna', 3, { status: 'inactive' }),
    p('u-bg3', 'efe.omoregie@captest.dev', 'Efe', 'Omoregie', 'painter', 'co-lagos', 'Edo', 50),
    p('u-bg4', 'bola.martins@captest.dev', 'Bola', 'Martins', 'painter', 'co-lagos', 'Lagos', 15),
    p('u-bg5', 'yusuf.danjuma@captest.dev', 'Yusuf', 'Danjuma', 'painter', 'co-abuja', 'FCT', 6),
  ]
  const users = profiles.map(pr => ({ id: pr.id, email: pr.email, password: DEMO_PASSWORD }))

  // ── Courses & modules (modules are the playable lessons) ──
  const courseDefs = [
    { id: 'crs-prep', title: 'Mastering Surface Prep: The CAP Standard', tier: 'free', level: 'Beginner', dur: '105', mods: ['Introduction & Safety', 'Cleaning & Sanding', 'Filling Cracks Like a Pro', 'Priming Fundamentals'] },
    { id: 'crs-colour', title: 'Colour Theory for Painters', tier: 'free', level: 'Beginner', dur: '60', mods: ['The Colour Wheel', 'Choosing Palettes for Clients', 'Working with CAP Colour Cards'] },
    { id: 'crs-luxury', title: 'Luxury Finishes: Silk & Texture Portfolio', tier: 'PRO', level: 'Intermediate', dur: '130', mods: ['Silk Finish Basics', 'Texture Rollers & Tools', 'Marble Effects', 'Client Walkthroughs'] },
    { id: 'crs-business', title: 'Running a Profitable Painting Business', tier: 'PRO', level: 'Intermediate', dur: '90', mods: ['Pricing Your Jobs', 'Writing Quotes', 'Winning Repeat Clients'] },
    { id: 'crs-industrial', title: 'Industrial Coating: Airless Spraying Mastery', tier: 'ELITE', level: 'Advanced', dur: '195', mods: ['Airless Equipment Setup', 'Spray Patterns & Overlap', 'Large-Scale Project Planning', 'Maintenance & Safety'] },
    { id: 'crs-draft', title: 'Waterproofing Systems (Draft)', tier: 'PRO', level: 'Advanced', dur: '45', mods: ['Membranes Overview'], draft: true },
  ]
  const courses: Row[] = []
  const modules: Row[] = []
  courseDefs.forEach((c, ci) => {
    courses.push({
      id: c.id, title: c.title, slug: c.id, tier_access: c.tier, level: c.level, duration: c.dur,
      description: `${c.title} — a hands-on CAP Academy course with practical demonstrations and site-ready techniques.`,
      thumbnail_url: thumb(c.id), video_url: VIDEO_A, rating: 4.5 + (ci % 5) / 10,
      is_published: !c.draft, archived_at: null, category_id: null,
      created_at: daysAgo(150 - ci * 20), updated_at: daysAgo(10),
    })
    c.mods.forEach((title, mi) => modules.push({
      id: `${c.id}-m${mi + 1}`, course_id: c.id, title, order: mi + 1,
      description: `Lesson ${mi + 1} of ${c.title}.`, duration: `${8 + mi * 4} min`,
      video_url: mi % 2 ? VIDEO_B : VIDEO_A, thumbnail_url: thumb(`${c.id}-${mi}`),
      created_at: daysAgo(140 - ci * 20), updated_at: daysAgo(10),
    }))
  })

  // ── Tiers & subscriptions ──
  const subscription_tiers = [
    { id: 'tier-free', name: 'FREE', price: 0, level: 0, features: ['Free courses'], created_at: daysAgo(300) },
    { id: 'tier-pro', name: 'PRO', price: 5000, level: 1, features: ['All PRO courses', 'Certificates'], created_at: daysAgo(300) },
    { id: 'tier-elite', name: 'ELITE', price: 15000, level: 2, features: ['Everything in PRO', 'ELITE masterclasses'], created_at: daysAgo(300) },
  ]
  const subscriptions = [
    { id: 'sub-pro', user_id: 'u-pro', tier_id: 'tier-pro', status: 'active', start_date: daysAgo(30), end_date: daysAhead(335), last_payment_ref: 'CAP-REF-PRO-001', created_at: daysAgo(30), updated_at: daysAgo(30) },
    { id: 'sub-elite', user_id: 'u-elite', tier_id: 'tier-elite', status: 'active', start_date: daysAgo(60), end_date: daysAhead(305), last_payment_ref: 'CAP-REF-ELITE-001', created_at: daysAgo(60), updated_at: daysAgo(60) },
    { id: 'sub-bg3', user_id: 'u-bg3', tier_id: 'tier-pro', status: 'active', start_date: daysAgo(40), end_date: daysAhead(325), last_payment_ref: 'CAP-REF-BG3-001', created_at: daysAgo(40), updated_at: daysAgo(40) },
  ]

  // ── Payments (spread across recent months for revenue charts) ──
  const pay = (id: string, user: string, company: string | null, amount: number, d: number, status = 'completed', tier = 'tier-pro') =>
    ({ id, user_id: user, company_id: company, amount, currency: 'NGN', status, reference: `CAP-REF-${id.toUpperCase()}`, payment_method: 'monnify', tier_id: tier, created_at: daysAgo(d), updated_at: daysAgo(d) })
  const payments = [
    pay('p1', 'u-pro', 'co-captest', 5000, 30),
    pay('p2', 'u-elite', 'co-captest', 15000, 60, 'completed', 'tier-elite'),
    pay('p3', 'u-bg3', 'co-lagos', 5000, 40),
    pay('p4', 'u-bg4', 'co-lagos', 15000, 95, 'completed', 'tier-elite'),
    pay('p5', 'u-bg1', 'co-captest', 5000, 130),
    pay('p6', 'u-free', 'co-captest', 5000, 2, 'failed'),
    pay('p7', 'u-bg5', 'co-abuja', 5000, 1, 'pending'),
    pay('p8', 'u-bg4', 'co-lagos', 15000, 160, 'completed', 'tier-elite'),
  ].map(x => ({ ...x, reference: x.id === 'p1' ? 'CAP-REF-PRO-001' : x.id === 'p2' ? 'CAP-REF-ELITE-001' : x.reference }))

  // ── Enrollments, progress, certificates ──
  const enr = (user: string, course: string, progress: number, d: number) =>
    ({ id: `enr-${user}-${course}`, user_id: user, course_id: course, status: progress >= 100 ? 'completed' : progress > 0 ? 'active' : 'enrolled', progress, enrolled_at: daysAgo(d), created_at: daysAgo(d) })
  const enrollments = [
    enr('u-free', 'crs-prep', 50, 10),
    enr('u-pro', 'crs-prep', 100, 28), enr('u-pro', 'crs-luxury', 25, 6),
    enr('u-elite', 'crs-prep', 100, 55), enr('u-elite', 'crs-luxury', 100, 40), enr('u-elite', 'crs-industrial', 50, 3),
    enr('u-solo', 'crs-colour', 0, 1),
    enr('u-bg1', 'crs-colour', 67, 12), enr('u-bg3', 'crs-business', 33, 9),
  ]
  const user_progress: Row[] = []
  const prog = (user: string, course: string, upto: number, d: number) => {
    modules.filter(m => m.course_id === course).slice(0, upto).forEach((m, i) =>
      user_progress.push({ id: `up-${user}-${m.id}`, user_id: user, lesson_id: m.id, current_time: 95 + i * 13, is_completed: true, last_watched_at: daysAgo(d, i), completed_at: daysAgo(d, i) }))
  }
  prog('u-free', 'crs-prep', 2, 0); prog('u-pro', 'crs-prep', 4, 20); prog('u-pro', 'crs-luxury', 1, 0)
  prog('u-elite', 'crs-prep', 4, 50); prog('u-elite', 'crs-luxury', 4, 30); prog('u-elite', 'crs-industrial', 2, 0)
  prog('u-bg1', 'crs-colour', 2, 1); prog('u-bg3', 'crs-business', 1, 2)

  const cert = (user: string, course: string, company: string | null, d: number, n: number) => {
    const serial = `CAP-${1700000000000 + n * 7919}-${(n * 2654435761 >>> 0).toString(16).slice(0, 8).toUpperCase()}`
    const name = profiles.find(x => x.id === user)!
    const title = courses.find(x => x.id === course)!.title
    return { id: `cert-${n}`, user_id: user, course_id: course, company_id: company, serial_no: serial, issued_at: daysAgo(d),
      certificate_url: `https://placehold.co/1200x850/0f172a/ffffff/png?text=${encodeURIComponent(`CAP Academy Certificate\n${name.first_name} ${name.last_name}\n${title}\n${serial}`)}` }
  }
  const certificates = [cert('u-pro', 'crs-prep', 'co-captest', 18, 1), cert('u-elite', 'crs-prep', 'co-captest', 48, 2), cert('u-elite', 'crs-luxury', 'co-captest', 25, 3)]

  // ── Notifications ──
  const notifications: Row[] = []
  const note = (user: string, title: string, message: string, type: string, d: number, read = false) =>
    notifications.push({ id: uid('n'), user_id: user, title, message, type, is_read: read, created_at: daysAgo(d, 2) })
  for (const u of ['u-free', 'u-pro', 'u-elite', 'u-solo']) note(u, 'Welcome to CAP Academy', 'Your account is ready. Start with Surface Prep.', 'INFO', 7, true)
  note('u-free', 'Upgrade to PRO', 'Unlock Luxury Finishes and business courses.', 'ALERT', 1)
  note('u-pro', 'Certificate issued', 'You earned a certificate for Mastering Surface Prep.', 'SUCCESS', 18)
  note('u-elite', 'New ELITE masterclass', 'Industrial Coating module 3 is now live.', 'INFO', 0)
  note('u-admin', 'New painter joined', 'Kemi Adeyemi joined CAP Test Painters Ltd.', 'INFO', 2)
  note('u-super', 'New company pending', 'Garden City Decor is awaiting activation.', 'ALERT', 4)

  return { users, profiles, companies, courses, modules, enrollments, user_progress, certificates, payments, subscription_tiers, subscriptions, notifications }
}

let db: MockDb | null = null

export function getDb(): MockDb {
  if (db) return db
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) db = JSON.parse(raw)
  } catch { /* storage unavailable or corrupt — reseed */ }
  if (!db) { db = seed(); saveDb() }
  return db!
}

export function saveDb() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(db)) } catch { /* in-memory only */ }
}

export function resetMockDb() {
  db = seed()
  saveDb()
}
