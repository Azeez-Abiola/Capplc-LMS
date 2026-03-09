import { Request, Response } from 'express'
import { supabase } from '../config/supabase'
import { sendEmail } from '../utils/email'

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, first_name, last_name, phone, state } = req.body

    // 1. Create user in Supabase Auth using Admin API for auto-confirmation
    // This bypasses the email rate limit and 'inactive' status barrier
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name,
        last_name,
        phone,
        state,
        role: 'painter'
      }
    })

    if (authError) throw authError

    // 2. The profile is automatically created via the 'on_auth_user_created' 
    // database trigger using the meta_data provided above.
    
    // 3. Send Orientation Email (Transactional, non-blocking)
    if (authData.user) {
      try {
        await sendEmail({
          to: email,
          subject: 'Access Granted: CAP Business Pro',
          html: `<h1>Welcome, ${first_name}!</h1>
                 <p>Your professional account is active. You can now access the full LMS suite.</p>
                 <p>Login here: <a href="http://localhost:3000/login">Business Pro Portal</a></p>`
        })
      } catch (emailError) {
        console.warn('[SILENT_FAIL] Orientation email failed:', emailError)
      }
    }

    res.status(201).json({ 
      message: 'Registration successful. Account is active.',
      user: authData.user 
    })
  } catch (error: any) {
    console.error('[REGISTRATION_ERROR]', error)
    res.status(400).json({ error: error.message })
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
    res.status(401).json({ error: error.message })
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
