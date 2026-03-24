import api from '../lib/axios'

export interface UserProfile {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  state: string
  city?: string
  whatsapp_number?: string
  role: string
  status: 'active' | 'inactive' | 'suspended'
  specialty?: string
  years_of_experience?: string
  onboarding_completed?: boolean
  interests?: string[]
  created_at: string
}

export const userService = {
  async getAllUsers(): Promise<UserProfile[]> {
    const { data } = await api.get('users')
    return data
  },

  async getUserById(id: string): Promise<UserProfile> {
    const { data } = await api.get(`users/${id}`)
    return data
  },

  async updateUserStatus(id: string, status: string): Promise<UserProfile> {
    const { data } = await api.put(`users/${id}/status`, { status })
    return data
  },

  async getProfile(): Promise<UserProfile> {
    const { data } = await api.get('users/profile')
    return data
  },

  async updateProfile(profileData: any): Promise<any> {
    const { data } = await api.put('users/profile', profileData)
    return data
  },

  async updateUser(id: string, userData: any): Promise<UserProfile> {
    const { data } = await api.put(`users/${id}`, userData)
    return data
  },

  async deactivateUser(id: string): Promise<void> {
    await api.post(`users/${id}/deactivate`)
  }
}
