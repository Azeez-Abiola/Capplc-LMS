import { Request, Response } from 'express'
import { supabase } from '../config/supabase'

export const getUserCertificates = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const { data, error } = await supabase
      .from('certificates')
      .select('*, courses(title)')
      .eq('user_id', userId)
      .order('issued_at', { ascending: false })

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const issueCertificate = async (req: Request, res: Response) => {
  try {
    const { user_id, course_id, certificate_url } = req.body
    
    const { data, error } = await supabase
      .from('certificates')
      .insert([{
        user_id,
        course_id,
        certificate_url,
        issued_at: new Date().toISOString()
      }])
      .select()

    if (error) throw error

    res.status(201).json(data[0])
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const verifyCertificate = async (req: Request, res: Response) => {
  try {
    const { serial_no } = req.params
    const { data, error } = await supabase
      .from('certificates')
      .select('*, profiles(first_name, last_name), courses(title)')
      .eq('serial_no', serial_no)
      .single()

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
