import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase, getSafeSession, setInternalToken } from '../lib/supabase';
import { authService } from '../services/authService';
import { type UserProfile } from '../services/userService';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType {
  user: SupabaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  const fetchProfile = async (userId: string) => {
    try {
      // Add a 5-second timeout so it never hangs forever
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()
      
      clearTimeout(timeout);
      if (error) throw error;
      if (data && mountedRef.current) setProfile(data);
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        console.warn('[AUTH] Profile fetch failed:', err);
      }
    }
  };

  useEffect(() => {
    mountedRef.current = true;

    const initAuth = async () => {
      try {
        const result = await getSafeSession();
        const session = result?.data?.session;
        
        if (session) {
          setInternalToken(session.access_token);
        }
        
        if (mountedRef.current && session?.user) {
          setUser(session.user);
          // Don't await — let profile load in background so loading finishes fast
          fetchProfile(session.user.id);
        }
      } catch (error: any) {
        if (error?.name !== 'AbortError') {
           console.error('[AUTH] Initialization error:', error);
        }
      } finally {
        // Always set loading false, regardless of profile fetch status
        if (mountedRef.current) setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mountedRef.current) return;
      
      console.log(`[AUTH] Event: ${event}`);

      if (session) {
        setInternalToken(session.access_token);
        setUser(session.user);
        // Fire-and-forget profile fetch — never block the auth state change
        fetchProfile(session.user.id);
      } else {
        setInternalToken(null);
        setUser(null);
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  const signOut = async () => {
    try {
      setUser(null);
      setProfile(null);
      setInternalToken(null);
      window.sessionStorage.clear();
      await authService.logout();
    } catch (error) {
      console.error('SignOut context error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
