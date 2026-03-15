// Payment service — API calls for Monnify payment integration
import api from '../lib/axios'
import type { Payment, SubscriptionTier } from '../types'

export const paymentService = {
  async initializePayment(tier: SubscriptionTier) {
    const { data } = await api.post('/payments/initialize', { tier })
    return data
  },

  async verifyPayment(transactionReference: string) {
    const { data } = await api.post('/payments/verify', { transactionReference })
    return data
  },

  async getPaymentHistory(): Promise<Payment[]> {
    const { data } = await api.get('/payments/history')
    return data
  },

  async getAllPaymentsAdmin(): Promise<Payment[]> {
    const { data } = await api.get('/payments/admin/all')
    return data
  },
}
