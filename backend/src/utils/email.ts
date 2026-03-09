import { resend } from '../config/resend'

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  return resend.emails.send({
    from: 'CAP Business Pro <onboarding@resend.dev>', // Should be updated with verified domain later
    to,
    subject,
    html,
  })
}
