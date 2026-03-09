import axios from 'axios'

const api = axios.create({
  baseURL: '/api/',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach auth token
api.interceptors.request.use((config) => {
  // Try to find the supabase token in localStorage
  const supabaseTokenKey = Object.keys(localStorage).find(key => key.startsWith('sb-') && key.endsWith('-auth-token'));
  if (supabaseTokenKey) {
    const session = JSON.parse(localStorage.getItem(supabaseTokenKey) || '{}');
    const token = session.access_token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
})

// Response interceptor — handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // In a real app, you might want to trigger a logout or refresh the token
    }
    return Promise.reject(error)
  }
)

export default api
