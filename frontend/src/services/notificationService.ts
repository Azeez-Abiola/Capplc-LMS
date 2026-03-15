import api from '../lib/axios'

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'INFO' | 'SUCCESS' | 'ALERT'
  is_read: boolean
  created_at: string
}

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    const response = await api.get('/notifications')
    return response.data
  },

  async markAsRead(id: string): Promise<void> {
    await api.put(`/notifications/${id}/read`)
  },

  async markAllAsRead(): Promise<void> {
    await api.put('/notifications/read-all')
  }
}
