/**
 * Seeds a full set of TEST accounts covering every role in the platform.
 * Idempotent: safe to run repeatedly (existing users are updated, not duplicated).
 *
 *   super_admin   superadmin@captest.dev
 *   admin         companyadmin@captest.dev   (admin of "CAP Test Painters Ltd")
 *   painter FREE  painter.free@captest.dev   (member of the test company)
 *   painter PRO   painter.pro@captest.dev    (member of the test company)
 *   painter ELITE painter.elite@captest.dev  (member of the test company)
 *   painter       painter.solo@captest.dev   (independent, no company, free)
 *
 * All share the password in TEST_PASSWORD (override with env SEED_TEST_PASSWORD).
 *
 * Run:  npx ts-node src/scripts/seed_test_accounts.ts
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const url = process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !serviceKey) {
  console.error('❌ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in backend/.env')
  process.exit(1)
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

export const TEST_PASSWORD = process.env.SEED_TEST_PASSWORD || 'CapTest#2026'
const COMPANY = {
  name: 'CAP Test Painters Ltd',
  invitation_code: 'CAPTEST',
  subscription_tier: 'PRO',
  official_email: 'companyadmin@captest.dev',
  official_phone: '08000000001',
  address: '1 Test Avenue, Ikeja, Lagos',
}

type Tier = 'FREE' | 'PRO' | 'ELITE'
interface TestAccount {
  label: string
  email: string
  role: 'super_admin' | 'admin' | 'painter'
  first_name: string
  last_name: string
  state: string
  inCompany: boolean
  tier?: Tier
}

export const ACCOUNTS: TestAccount[] = [
  { label: 'Super Admin', email: 'superadmin@captest.dev', role: 'super_admin', first_name: 'Sade', last_name: 'Platform', state: 'Lagos', inCompany: false },
  { label: 'Company Admin', email: 'companyadmin@captest.dev', role: 'admin', first_name: 'Chidi', last_name: 'Okafor', state: 'Abuja', inCompany: true },
  { label: 'Painter (Free)', email: 'painter.free@captest.dev', role: 'painter', first_name: 'Tunde', last_name: 'Bakare', state: 'Lagos', inCompany: true, tier: 'FREE' },
  { label: 'Painter (PRO)', email: 'painter.pro@captest.dev', role: 'painter', first_name: 'Ngozi', last_name: 'Eze', state: 'Enugu', inCompany: true, tier: 'PRO' },
  { label: 'Painter (ELITE)', email: 'painter.elite@captest.dev', role: 'painter', first_name: 'Musa', last_name: 'Bello', state: 'Kano', inCompany: true, tier: 'ELITE' },
  { label: 'Painter (Independent)', email: 'painter.solo@captest.dev', role: 'painter', first_name: 'Ada', last_name: 'Nwosu', state: 'Rivers', inCompany: false, tier: 'FREE' },
]

async function findUserByEmail(email: string) {
  for (let page = 1; page < 50; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 })
    if (error) throw error
    const hit = data.users.find(u => u.email?.toLowerCase() === email.toLowerCase())
    if (hit) return hit
    if (data.users.length < 200) return null
  }
  return null
}

async function upsertAuthUser(acc: TestAccount, companyId: string | null) {
  const user_metadata = {
    first_name: acc.first_name,
    last_name: acc.last_name,
    phone: '0800' + Math.abs(hash(acc.email)).toString().padStart(7, '0').slice(0, 7),
    state: acc.state,
    role: acc.role,
    ...(acc.inCompany ? { company_code: COMPANY.invitation_code } : {}),
  }

  const existing = await findUserByEmail(acc.email)
  let id: string
  if (existing) {
    const { error } = await supabase.auth.admin.updateUserById(existing.id, {
      password: TEST_PASSWORD, email_confirm: true, user_metadata,
    })
    if (error) throw new Error(`update ${acc.email}: ${error.message}`)
    id = existing.id
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email: acc.email, password: TEST_PASSWORD, email_confirm: true, user_metadata,
    })
    if (error || !data.user) throw new Error(`create ${acc.email}: ${error?.message}`)
    id = data.user.id
  }

  // The handle_new_user trigger normally creates the profile; enforce the
  // values we need regardless (role, company link, onboarding done).
  const profile = {
    id,
    email: acc.email,
    first_name: acc.first_name,
    last_name: acc.last_name,
    phone: user_metadata.phone,
    state: acc.state,
    role: acc.role,
    company_id: acc.inCompany ? companyId : null,
    company_code: acc.inCompany ? COMPANY.invitation_code : null,
    onboarding_completed: true,
    updated_at: new Date().toISOString(),
  }
  let { error: pErr } = await supabase.from('profiles').upsert(profile, { onConflict: 'id' })
  if (pErr && /column/i.test(pErr.message)) {
    // Fall back to the minimum column set if the live schema differs
    const { onboarding_completed, company_code, phone, ...minimal } = profile
    ;({ error: pErr } = await supabase.from('profiles').upsert(minimal, { onConflict: 'id' }))
  }
  if (pErr) throw new Error(`profile ${acc.email}: ${pErr.message}`)
  return id
}

async function ensureCompany() {
  const { data: existing } = await supabase
    .from('companies').select('id').eq('invitation_code', COMPANY.invitation_code).maybeSingle()
  if (existing) return existing.id as string
  let { data, error } = await supabase.from('companies').insert(COMPANY).select('id').single()
  if (error && /column/i.test(error.message)) {
    const { official_email, official_phone, address, ...minimal } = COMPANY
    ;({ data, error } = await supabase.from('companies').insert(minimal).select('id').single())
  }
  if (error || !data) throw new Error(`company: ${error?.message}`)
  return data.id as string
}

async function tierIds(): Promise<Record<string, string>> {
  const { data, error } = await supabase.from('subscription_tiers').select('id, name')
  if (error) throw new Error(`subscription_tiers: ${error.message}`)
  const map: Record<string, string> = {}
  for (const t of data || []) map[String(t.name).toUpperCase()] = t.id
  return map
}

async function ensureSubscription(userId: string, tier: Tier, tiers: Record<string, string>) {
  if (tier === 'FREE') {
    // Free users have no active paid subscription
    await supabase.from('subscriptions').update({ status: 'cancelled' }).eq('user_id', userId).eq('status', 'active')
    return 'free (no subscription)'
  }
  const tierId = tiers[tier]
  if (!tierId) return `⚠️  tier ${tier} not found in subscription_tiers — skipped`
  const end = new Date(); end.setFullYear(end.getFullYear() + 1)
  const { data: active } = await supabase
    .from('subscriptions').select('id').eq('user_id', userId).eq('status', 'active')
  if (active && active.length) {
    const { error } = await supabase.from('subscriptions')
      .update({ tier_id: tierId, end_date: end.toISOString(), updated_at: new Date().toISOString() })
      .in('id', active.map(a => a.id))
    if (error) return `⚠️  ${error.message}`
  } else {
    const { error } = await supabase.from('subscriptions')
      .insert({ user_id: userId, tier_id: tierId, status: 'active', end_date: end.toISOString() })
    if (error) return `⚠️  ${error.message}`
  }
  return `${tier} active until ${end.toISOString().slice(0, 10)}`
}

function hash(s: string) {
  let h = 0
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0
  return h
}

async function main() {
  console.log(`🌱 Seeding test accounts into ${new URL(url!).host}\n`)
  const companyId = await ensureCompany()
  console.log(`🏢 Company "${COMPANY.name}" (${companyId}) invite code ${COMPANY.invitation_code}`)
  const tiers = await tierIds()

  for (const acc of ACCOUNTS) {
    const id = await upsertAuthUser(acc, companyId)
    let note = ''
    if (acc.role === 'admin') {
      const { error } = await supabase.from('companies').update({ admin_id: id }).eq('id', companyId)
      note = error ? `⚠️  admin_id link failed: ${error.message}` : 'linked as company admin'
    }
    if (acc.tier) note = await ensureSubscription(id, acc.tier, tiers)
    console.log(`✅ ${acc.label.padEnd(22)} ${acc.email.padEnd(28)} ${note}`)
  }

  console.log(`\n🔑 Password for all accounts: ${TEST_PASSWORD}`)
}

main().catch(e => { console.error('❌', e.message || e); process.exit(1) })
