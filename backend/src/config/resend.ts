import { Resend } from 'resend'
import { config } from './index'

export const resend = new Resend(config.email.resendApiKey)
