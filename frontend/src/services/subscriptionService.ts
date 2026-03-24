import api from '../lib/axios'

export interface SubscriptionInfo {
  id: string;
  user_id: string;
  tier: string;
  status: string;
  current_period_end: string;
}

export const subscriptionService = {
  async getCurrentSubscription(): Promise<SubscriptionInfo> {
    const { data } = await api.get('subscriptions/current')
    return data
  },

  async subscribe(tier: string): Promise<any> {
    const { data } = await api.post('subscriptions', { tier })
    return data
  }
}
