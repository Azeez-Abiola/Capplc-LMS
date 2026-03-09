import dotenv from 'dotenv'

dotenv.config()

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  supabase: {
    url: process.env.SUPABASE_URL!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    anonKey: process.env.SUPABASE_ANON_KEY!,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'cap-business-pro-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  monnify: {
    apiKey: process.env.MONNIFY_API_KEY!,
    secretKey: process.env.MONNIFY_SECRET_KEY!,
    contractCode: process.env.MONNIFY_CONTRACT_CODE!,
    baseUrl: process.env.MONNIFY_BASE_URL || 'https://sandbox.monnify.com',
  },
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    user: process.env.EMAIL_USER!,
    resendApiKey: process.env.RESEND_API_KEY!,
  },
}
