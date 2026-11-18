/**
 * Minimal stand-in for the Supabase JS client, covering exactly what the app
 * uses: auth session handling and simple `from(table).select().eq()` reads.
 */
import { getDb, type Row } from './db'

const SESSION_KEY = 'sb-cap-auth-token'
type Listener = (event: string, session: any) => void
const listeners = new Set<Listener>()

export function buildUser(profile: Row) {
  return {
    id: profile.id,
    aud: 'authenticated',
    role: 'authenticated',
    email: profile.email,
    email_confirmed_at: profile.created_at,
    created_at: profile.created_at,
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: {
      role: profile.role,
      first_name: profile.first_name,
      last_name: profile.last_name,
      phone: profile.phone,
      state: profile.state,
    },
  }
}

export function buildSession(profile: Row) {
  const expires_in = 7 * 24 * 3600
  return {
    access_token: `mock-token.${profile.id}`,
    refresh_token: `mock-refresh.${profile.id}`,
    token_type: 'bearer',
    expires_in,
    expires_at: Math.floor(Date.now() / 1000) + expires_in,
    user: buildUser(profile),
  }
}

/** Resolve a mock bearer token back to a profile row. */
export function profileFromToken(token: string | null | undefined): Row | null {
  if (!token?.startsWith('mock-token.')) return null
  const id = token.slice('mock-token.'.length)
  return getDb().profiles.find(p => p.id === id) ?? null
}

function readSession(): any | null {
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const s = JSON.parse(raw)
    const profile = profileFromToken(s?.access_token)
    // Rebuild from the DB so role/name edits are reflected
    return profile ? buildSession(profile) : null
  } catch { return null }
}

function writeSession(session: any | null) {
  try {
    if (session) window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
    else window.sessionStorage.removeItem(SESSION_KEY)
  } catch { /* ignore */ }
}

function emit(event: string, session: any) {
  // Async like the real client, so callers finish their own work first
  setTimeout(() => listeners.forEach(l => l(event, session)), 0)
}

class QueryBuilder implements PromiseLike<{ data: any; error: any }> {
  private filters: ((r: Row) => boolean)[] = []
  private mode: 'many' | 'single' | 'maybe' = 'many'
  private table: string
  constructor(table: string) { this.table = table }
  select(_cols?: string) { return this }
  eq(col: string, val: any) { this.filters.push(r => r[col] === val); return this }
  neq(col: string, val: any) { this.filters.push(r => r[col] !== val); return this }
  in(col: string, vals: any[]) { this.filters.push(r => vals.includes(r[col])); return this }
  order() { return this }
  limit() { return this }
  single() { this.mode = 'single'; return this }
  maybeSingle() { this.mode = 'maybe'; return this }
  private run() {
    const rows = ((getDb() as any)[this.table] as Row[] | undefined) ?? []
    const out = rows.filter(r => this.filters.every(f => f(r))).map(r => ({ ...r }))
    if (this.mode === 'many') return { data: out, error: null }
    if (this.mode === 'single' && out.length !== 1)
      return { data: null, error: { code: 'PGRST116', message: 'JSON object requested, multiple (or no) rows returned' } }
    return { data: out[0] ?? null, error: null }
  }
  then<T1 = any, T2 = never>(ok?: ((v: { data: any; error: any }) => T1 | PromiseLike<T1>) | null, fail?: ((e: any) => T2 | PromiseLike<T2>) | null) {
    return Promise.resolve(this.run()).then(ok, fail)
  }
}

export function createMockSupabase() {
  return {
    auth: {
      async getSession() { return { data: { session: readSession() }, error: null } },
      async getUser() {
        const s = readSession()
        return { data: { user: s?.user ?? null }, error: s ? null : { message: 'Auth session missing!' } }
      },
      async setSession(input: { access_token: string }) {
        const profile = profileFromToken(input?.access_token)
        if (!profile) return { data: { session: null, user: null }, error: { message: 'Invalid session' } }
        const session = buildSession(profile)
        writeSession(session)
        emit('SIGNED_IN', session)
        return { data: { session, user: session.user }, error: null }
      },
      async signInWithPassword({ email, password }: { email: string; password: string }) {
        const db = getDb()
        const u = db.users.find(x => x.email.toLowerCase() === email.toLowerCase() && x.password === password)
        const profile = u && db.profiles.find(p => p.id === u.id)
        if (!profile) return { data: { session: null, user: null }, error: { message: 'Invalid login credentials' } }
        const session = buildSession(profile)
        writeSession(session)
        emit('SIGNED_IN', session)
        return { data: { session, user: session.user }, error: null }
      },
      async signOut() { writeSession(null); emit('SIGNED_OUT', null); return { error: null } },
      async verifyOtp() { return { data: { session: readSession(), user: readSession()?.user ?? null }, error: null } },
      async resend() { return { data: {}, error: null } },
      onAuthStateChange(cb: Listener) {
        listeners.add(cb)
        return { data: { subscription: { id: String(listeners.size), unsubscribe: () => listeners.delete(cb) } } }
      },
    },
    from(table: string) { return new QueryBuilder(table) },
  }
}
