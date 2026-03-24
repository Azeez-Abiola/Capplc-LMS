import api, { clearSessionCache, setTempToken } from '../lib/axios'
import { supabase, safeSetSession } from '../lib/supabase'

export const authService = {
  async register(email: string, password: string, metadata: Record<string, any>) {
    const response = await api.post('auth/register', { 
      email, 
      password, 
      ...metadata
    })
    return response.data
  },

  async login(email: string, password: string) {
    const response = await api.post('auth/login', { email, password })
    if (response.data.session) {
      clearSessionCache() // Clear cache so next request gets new session
      setTempToken(response.data.session.access_token)
      
      // Fire and forget setSession to avoid blocking on lock acquisition (5s)
      // The AuthContext listener will pick it up, and axios uses tempToken for now.
      safeSetSession(response.data.session).catch(err => {
        console.warn('[AUTH] Background safeSetSession warning:', err)
      })
    }
    return response.data
  },

  async logout() {
    clearSessionCache()
    try {
      // Inform backend but don't wait for it
      api.post('auth/logout').catch(() => {});
      // Sign out locally
      await supabase.auth.signOut()
    } catch (err) {
      console.warn('[AUTH] Logout warning:', err)
    }
  },

  async resetPassword(email: string) {
    await api.post('auth/reset-password', { email })
  },

  async getCurrentUser() {
    const { data } = await supabase.auth.getUser()
    return data.user
  },

  onAuthStateChange(callback: (event: string, session: unknown) => void) {
    return supabase.auth.onAuthStateChange(callback)
  },
}
