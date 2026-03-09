import api from '../lib/axios'
import { supabase } from '../lib/supabase'

export const authService = {
  async register(email: string, password: string, metadata: Record<string, any>) {
    const response = await api.post('auth/register', { 
      email, 
      password, 
      first_name: metadata.first_name,
      last_name: metadata.last_name,
      phone: metadata.phone,
      state: metadata.state
    })
    return response.data
  },

  async login(email: string, password: string) {
    const response = await api.post('auth/login', { email, password })
    // The backend returns a session/token. We should still sync with supabase client if needed
    // or just store the token. For now, let's assume the backend returns what we need.
    if (response.data.session) {
      await supabase.auth.setSession(response.data.session)
    }
    return response.data
  },

  async logout() {
    await api.post('auth/logout')
    await supabase.auth.signOut()
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
