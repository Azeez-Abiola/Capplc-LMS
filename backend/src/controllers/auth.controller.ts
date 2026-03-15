import { Request, Response } from 'express'
import { supabase } from '../config/supabase'
import { sendEmail } from '../utils/email'

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, first_name, last_name, phone, state, whatsapp_number, city, years_of_experience, specialty } = req.body

    // 1. Create user in Supabase Auth using standard signUp
    // This allows Supabase to handle the 'Confirm your email' flow automatically
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name,
          last_name,
          phone,
          state,
          whatsapp_number,
          city,
          years_of_experience,
          specialty,
          role: 'painter'
        }
      }
    })

    if (authError) {
      console.error('[AUTH_ERROR]', authError)
      // Custom friendly messages for common Supabase errors
      if (authError.code === 'over_email_send_rate_limit') {
        throw new Error('Supabase email limit exceeded. Please try again in an hour or contact the administrator to setup custom SMTP.')
      }
      if (authError.code === 'user_already_exists') {
        throw new Error('This email is already registered. Please sign in instead.')
      }
      throw authError
    }

    // 2. The profile is automatically created via the 'on_auth_user_created' 
    // database trigger using the meta_data provided above.
    
    // 3. Send Orientation Email (Transactional, non-blocking)
    if (authData.user) {
      try {
        if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_your_api_key_here') {
          await sendEmail({
            to: email,
            subject: 'Access Granted: CAP Business Pro',
            html: `<h1>Welcome, ${first_name}!</h1>
                   <p>Your professional account is active. You can now access the full LMS suite.</p>
                   <p>Login here: <a href="http://localhost:3000/login">Business Pro Portal</a></p>`
          })
        }
      } catch (emailError) {
        console.warn('[SILENT_FAIL] Orientation email failed:', emailError)
      }
    }

    res.status(201).json({ 
      message: 'Registration successful. Please check your email to confirm your account.',
      user: authData.user 
    })
  } catch (error: any) {
    console.error('[REGISTRATION_ERROR_DETAIL]', {
      message: error.message,
      code: error.code,
      status: error.status,
    })
    res.status(error.status || 400).json({ 
      error: error.message || 'Registration failed',
      code: error.code
    })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error

    res.json({
      message: 'Login successful',
      session: data.session,
      user: data.user
    })
  } catch (error: any) {
    console.error('[LOGIN_ERROR_DETAIL]', {
      message: error.message,
      code: error.code,
      status: error.status,
      stack: error.stack
    })
    res.status(error.status || 500).json({ 
      error: error.message || 'Login failed',
      details: error.details,
      code: error.code
    })
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    res.json({ message: 'Logged out successfully' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
    res.json({ message: 'Reset password email sent' })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}
