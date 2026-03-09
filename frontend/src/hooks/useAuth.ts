// useAuth hook — auth state management
import { useState, useEffect } from 'react'
import { authService } from '../services/authService'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check current auth state
    authService.getCurrentUser().then((u) => {
      setUser(u ?? null)
      setLoading(false)
    })

    // Listen for auth state changes
    const { data: { subscription } } = authService.onAuthStateChange((_event, session) => {
      setUser((session as { user?: SupabaseUser } | null)?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}
