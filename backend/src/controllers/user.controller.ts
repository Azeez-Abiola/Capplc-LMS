import { Request, Response } from 'express'
import { supabase } from '../config/supabase'

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const userRole = req.user?.user_metadata?.role || 'user'
    const isSuperAdmin = userRole === 'super_admin'
    
    let query = supabase.from('profiles').select('*')

    if (!isSuperAdmin) {
       // Regular admins only see their company users
       // Need to fetch company_id for the admin first
       const { data: adminProfile } = await supabase
         .from('profiles')
         .select('company_id')
         .eq('id', req.user?.id)
         .maybeSingle()
       
       if (adminProfile?.company_id) {
          query = query.eq('company_id', adminProfile.company_id).neq('role', 'super_admin')
       } else {
          // If admin has no company, they might see nothing or just themselves
          query = query.eq('id', req.user?.id)
       }
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
       console.error('[USER_ERROR] Get All Users:', error.message)
       throw error
    }

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw error
    if (!data) return res.status(404).json({ error: 'User not found' })

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const { data, error } = await supabase
      .from('profiles')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()

    if (error) throw error

    res.json(data[0])
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      console.error('[USER_ERROR] Get Profile:', error.message)
      throw error
    }

    res.json(data)
  } catch (error: any) {
    console.error('[USER_ERROR] Get Profile:', {
      userId: req.user?.id,
      message: error.message,
      stack: error.stack
    })
    res.status(500).json({ error: error.message })
  }
}

export const updateProfile = async (req: Request, res: Response) => {
  let filteredUpdate: any = {}
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const updateData = req.body
    
    // Only allow specific columns to be updated from the profile
    const allowedColumns = ['first_name', 'last_name', 'phone', 'state', 'city', 'years_of_experience', 'specialty', 'onboarding_completed', 'interests']
    
    for (const key of allowedColumns) {
      if (updateData[key] !== undefined) {
        filteredUpdate[key] = updateData[key]
      }
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(filteredUpdate)
      .eq('id', userId)
      .select()

    if (error) {
      console.error('[USER_ERROR] Update Profile Result:', { error, userId })
      throw error
    }

    if (!data || data.length === 0) {
      console.warn('[USER_WARN] Update Profile: No rows affected', { userId, filteredUpdate })
      return res.status(404).json({ error: 'Profile not found or no changes made' })
    }

    res.json(data[0])
  } catch (error: any) {
    console.error('[USER_ERROR] Update Profile:', {
      userId: req.user?.id,
      updateData: filteredUpdate,
      message: error.message,
      stack: error.stack
    })
    res.status(500).json({ error: error.message })
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updateData = req.body
    
    // Allowed fields for admin to update
    const allowedFields = ['first_name', 'last_name', 'role', 'status', 'phone', 'state', 'city']
    const filteredUpdate: any = { updated_at: new Date().toISOString() }
    
    for (const key of allowedFields) {
      if (updateData[key] !== undefined) {
        filteredUpdate[key] = updateData[key]
      }
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(filteredUpdate)
      .eq('id', id)
      .select()

    if (error) throw error
    if (!data || data.length === 0) return res.status(404).json({ error: 'User not found' })

    res.json(data[0])
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const deactivateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        status: 'inactive', 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()

    if (error) throw error
    if (!data || data.length === 0) return res.status(404).json({ error: 'User not found' })

    res.json({ message: 'User deactivated successfully' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
