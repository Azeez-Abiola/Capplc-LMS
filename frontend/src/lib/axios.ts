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
  const supabaseTokenKey = Object.keys(localStorage).find(key => key.includes('auth-token'));
  if (supabaseTokenKey) {
    try {
      const session = JSON.parse(localStorage.getItem(supabaseTokenKey) || '{}');
      const token = session.access_token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('Failed to parse token session', e);
    }
  }
  return config;
})

// Response interceptor — handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
       // Clear session if unauthorized to avoid loop
       // window.location.href = '/login'; 
    }
    return Promise.reject(error)
  }
)

export default api
