import { Request, Response } from 'express'
import { supabase } from '../config/supabase'
import { generateCertificatePDF } from '../services/certificate.service'
import crypto from 'crypto'

export const getUserCertificates = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const { data, error } = await supabase
      .from('certificates')
      .select('*, courses(title)')
      .eq('user_id', userId)
      .order('issued_at', { ascending: false })

    if (error) {
      console.error('[CERT_ERROR] Get User Certs:', error.message)
      // Check for common schema errors
      if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('column')) {
         return res.json([]) // Return empty list to prevent crash
      }
      throw error
    }

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

/**
 * Trigger certificate generation for a user + course
 */
export const issueCertificate = async (req: Request, res: Response) => {
  try {
    const { user_id, course_id } = req.body
    
    // 1. Fetch user and course info for the certificate
    const { data: profile, error: profErr } = await supabase.from('profiles').select('first_name, last_name').eq('id', user_id).maybeSingle()
    const { data: course, error: courErr } = await supabase.from('courses').select('title').eq('id', course_id).maybeSingle()

    if (profErr || courErr) {
       console.error('[CERT_ERROR] Issue Check:', { profErr, courErr })
       throw new Error('Database error while fetching profile or course')
    }

    if (!profile || !course) {
      return res.status(404).json({ error: 'User or Course not found' })
    }

    const serialNo = `CAP-${Date.now()}-${crypto.randomUUID().substring(0, 8).toUpperCase()}`
    const userName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Valued Student'

    // 2. Generate PDF and upload to Storage
    const pdfUrl = await generateCertificatePDF({
      userName,
      courseName: course.title,
      serialNo,
      completionDate: new Date().toLocaleDateString()
    })

    // 3. Save record to DB
    const { data, error: insErr } = await supabase
      .from('certificates')
      .insert([{
        user_id,
        course_id,
        certificate_url: pdfUrl,
        serial_no: serialNo,
        issued_at: new Date().toISOString()
      }])
      .select()

    if (insErr) throw insErr

    res.status(201).json(data[0])
  } catch (error: any) {
    console.error('[ISSUE_CERT_ERROR]', error)
    res.status(500).json({ error: error.message || 'Failed to issue certificate' })
  }
}

/**
 * Programmatic internal version of issueCertificate
 */
export const issueCertificateInternal = async (userId: string, courseId: string) => {
  try {
    const { data: profile } = await supabase.from('profiles').select('first_name, last_name').eq('id', userId).maybeSingle()
    const { data: course } = await supabase.from('courses').select('title').eq('id', courseId).maybeSingle()

    if (!profile || !course) return

    const serialNo = `CAP-${Date.now()}-${crypto.randomUUID().substring(0, 8).toUpperCase()}`
    const userName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Valued Student'

    const pdfUrl = await generateCertificatePDF({
      userName,
      courseName: course.title,
      serialNo,
      completionDate: new Date().toLocaleDateString()
    })

    await supabase
      .from('certificates')
      .insert([{
        user_id: userId,
        course_id: courseId,
        certificate_url: pdfUrl,
        serial_no: serialNo,
        issued_at: new Date().toISOString()
      }])
    
    console.log(`[CERT_INTERNAL] Successfully issued cert for user ${userId}`)
  } catch (error) {
    console.error('[CERT_INTERNAL_ERROR]', error)
  }
}

export const verifyCertificate = async (req: Request, res: Response) => {
  try {
    const { serial_no } = req.params
    const { data, error } = await supabase
      .from('certificates')
      .select('*, profiles(first_name, last_name, email), courses(title)')
      .eq('serial_no', serial_no)
      .maybeSingle()

    if (error) throw error
    if (!data) return res.status(404).json({ error: 'Certificate not found' })

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

/**
 * Admin: Fetch all certificates issued across the platform
 */
export const getAllCertificatesAdmin = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select(`
        *,
        profiles (first_name, last_name, email),
        courses (title, tier_access)
      `)
      .order('issued_at', { ascending: false })

    if (error) {
       console.error('[CERT_ERROR] Get All Certificates:', {
         message: error.message,
         details: error.details,
         hint: error.hint,
         code: error.code
       })
       throw error
    }

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Platform database error' })
  }
}
