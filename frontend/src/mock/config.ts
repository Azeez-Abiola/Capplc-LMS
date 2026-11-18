/**
 * Demo mode: runs the whole app in the browser with simulated accounts and data.
 * No Supabase or backend is contacted while it is on.
 *
 * ON by default. To switch back to the real Supabase + API stack, set
 *   VITE_MOCK_MODE=false
 * in frontend/.env (and in the Vercel project's environment variables).
 */
export const MOCK_MODE = import.meta.env.VITE_MOCK_MODE !== 'false'

export const DEMO_PASSWORD = 'CapTest#2026'

export const DEMO_ACCOUNTS = [
  { label: 'Super Admin', email: 'superadmin@captest.dev', note: 'Platform owner' },
  { label: 'Company Admin', email: 'companyadmin@captest.dev', note: 'CAP Test Painters Ltd' },
  { label: 'Painter · Free', email: 'painter.free@captest.dev', note: 'No subscription' },
  { label: 'Painter · PRO', email: 'painter.pro@captest.dev', note: 'PRO plan' },
  { label: 'Painter · ELITE', email: 'painter.elite@captest.dev', note: 'ELITE plan' },
  { label: 'Painter · Independent', email: 'painter.solo@captest.dev', note: 'No company' },
] as const
