import { Request, Response } from 'express'
import { supabase } from '../config/supabase'

export const uploadFile = async (req: Request, res: Response) => {
  try {
    const file = req.file
    const { bucket } = req.body || { bucket: 'thumbnails' }

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const fileExt = file.originalname.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `${fileName}`

    // Check if bucket exists, if not create it
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    if (!buckets?.find(b => b.name === bucket)) {
      try {
        await supabase.storage.createBucket(bucket, { public: true })
      } catch (e: any) {
        // Ignore if already exists (avoids race condition errors)
      }
    }

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    res.json({ url: publicUrl })
  } catch (error: any) {
    console.error('[UPLOAD_ERROR]', error)
    res.status(500).json({ error: error.message })
  }
}
