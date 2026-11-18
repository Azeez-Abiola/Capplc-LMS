/**
 * Logs in as every seeded test account (via the backend's own /api/auth/login)
 * and checks that role-based access behaves as expected.
 *
 * Requires the backend running (npm run dev) — defaults to http://localhost:5050.
 * Run:  npx ts-node src/scripts/verify_test_accounts.ts
 */
import axios from 'axios'

const API = (process.env.API_URL || 'http://localhost:5050') + '/api'
const PASSWORD = process.env.SEED_TEST_PASSWORD || 'CapTest#2026'

// [endpoint, roles that should be allowed]
const CHECKS: [string, string[]][] = [
  ['/users/profile', ['super_admin', 'admin', 'painter']],
  ['/courses', ['super_admin', 'admin', 'painter']],
  ['/users', ['super_admin', 'admin']],
  ['/super-admin/overview', ['super_admin']],
]

const ACCOUNTS = [
  ['superadmin@captest.dev', 'super_admin'],
  ['companyadmin@captest.dev', 'admin'],
  ['painter.free@captest.dev', 'painter'],
  ['painter.pro@captest.dev', 'painter'],
  ['painter.elite@captest.dev', 'painter'],
  ['painter.solo@captest.dev', 'painter'],
]

function findToken(obj: any): string | undefined {
  if (!obj || typeof obj !== 'object') return
  if (typeof obj.access_token === 'string') return obj.access_token
  for (const v of Object.values(obj)) { const t = findToken(v); if (t) return t }
}

async function main() {
  let failures = 0
  for (const [email, role] of ACCOUNTS) {
    let token: string | undefined
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password: PASSWORD })
      token = findToken(res.data)
    } catch (e: any) {
      console.log(`❌ ${email}: login failed (${e.response?.status} ${JSON.stringify(e.response?.data)})`)
      failures++; continue
    }
    if (!token) { console.log(`❌ ${email}: no access_token in login response`); failures++; continue }

    const results: string[] = []
    for (const [path, allowed] of CHECKS) {
      const expectOk = allowed.includes(role)
      const status = await axios.get(`${API}${path}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.status).catch(e => e.response?.status ?? 0)
      const ok = expectOk ? status >= 200 && status < 300 : status === 403
      if (!ok) failures++
      results.push(`${ok ? '✓' : '✗'} ${path} ${status}`)
    }
    console.log(`${email.padEnd(28)} [${role}]  ${results.join('  ')}`)
  }
  console.log(failures ? `\n❌ ${failures} check(s) failed` : '\n✅ All role checks passed')
  process.exit(failures ? 1 : 0)
}

main()
