import { resend } from '../config/resend'

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  return resend.emails.send({
    from: 'CAP Business Pro <onboarding@resend.dev>', // Keep for testing until capplc.com DNS is verified
    to,
    subject,
    html,
  })
}
