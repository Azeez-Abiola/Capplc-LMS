import axios from 'axios'
import { getSafeSession, clearSafeSessionCache, getInternalToken, setInternalToken } from './supabase'

let tempToken: string | null = null

export const clearSessionCache = () => {
  clearSafeSessionCache()
}

export const setTempToken = (token: string | null) => {
  tempToken = token
}

const api = axios.create({
  baseURL: '/api/',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach auth token
api.interceptors.request.use(async (config) => {
  // 1. Priority: Temp token (set right after login, before Supabase finishes)
  const token = tempToken || getInternalToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    return config
  }

  // 2. Fallback: fetch from Supabase session (cached + deduped)
  try {
    const result = await getSafeSession()
    const sessionToken = result?.data?.session?.access_token
    if (sessionToken) {
      setInternalToken(sessionToken)
      config.headers.Authorization = `Bearer ${sessionToken}`
    }
  } catch {
    // Quiet fail — request proceeds without auth header
  }
  return config
})

// Response interceptor — auto-retry on 401 once with a fresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Only retry once, and only for 401s
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Force-refresh the session
      clearSafeSessionCache()
      try {
        const result = await getSafeSession()
        const freshToken = result?.data?.session?.access_token
        if (freshToken) {
          setInternalToken(freshToken)
          originalRequest.headers.Authorization = `Bearer ${freshToken}`
          return api(originalRequest) // Retry the request
        }
      } catch {
        // Give up silently
      }
    }

    return Promise.reject(error)
  }
)

export default api
