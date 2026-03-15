import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase URL or Anon Key is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  )
}

// ── SINGLETON: Prevent HMR from creating multiple GoTrueClient instances ──
// This is the ROOT CAUSE of "Lock broken by steal" errors.
// Vite HMR re-executes module code, creating duplicate clients that fight over the same lock.
const GLOBAL_KEY = '__supabase_client__'

function getOrCreateClient(): SupabaseClient {
  // Check if a client already exists on the window object (survives HMR)
  if ((window as any)[GLOBAL_KEY]) {
    return (window as any)[GLOBAL_KEY]
  }

  const client = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '', {
    auth: {
      storage: window.sessionStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storageKey: 'sb-cap-auth-token'
    }
  })

  ;(window as any)[GLOBAL_KEY] = client
  return client
}

export const supabase = getOrCreateClient()

// ── SYNC AUTH STATE FOR AXIOS ──
// Stores the token in memory so Axios never needs to call getSession()
let currentAccessToken: string | null = null

export const setInternalToken = (token: string | null) => {
  currentAccessToken = token
}

export const getInternalToken = () => currentAccessToken

// ── SESSION CACHING ──
let memorySession: { data: any; expiry: number } | null = null
let sessionPromise: Promise<any> | null = null

export const getSafeSession = async () => {
  const now = Date.now()

  // Return cached if still fresh (2s TTL)
  if (memorySession && now < memorySession.expiry) {
    return memorySession.data
  }

  // Deduplicate concurrent calls
  if (sessionPromise) return sessionPromise

  sessionPromise = supabase.auth.getSession()
    .then((result) => {
      const token = result?.data?.session?.access_token || null
      setInternalToken(token)
      memorySession = { data: result, expiry: Date.now() + 2000 }
      return result
    })
    .catch((err) => {
      // Swallow AbortErrors silently — they are expected during lock contention
      if (err?.name !== 'AbortError') {
        console.warn('[SUPABASE] Session fetch error:', err)
      }
      return { data: { session: null }, error: err }
    })
    .finally(() => {
      sessionPromise = null
    })

  return sessionPromise
}

export const clearSafeSessionCache = () => {
  memorySession = null
  sessionPromise = null
  setInternalToken(null)
}

export const safeSetSession = async (session: any) => {
  clearSafeSessionCache()
  try {
    const result = await supabase.auth.setSession(session)
    const token = result?.data?.session?.access_token || null
    setInternalToken(token)
    memorySession = { data: result, expiry: Date.now() + 2000 }
    return result
  } catch (err: any) {
    if (err?.name !== 'AbortError') {
      console.warn('[SUPABASE] safeSetSession conflict:', err)
    }
    return null
  }
}
