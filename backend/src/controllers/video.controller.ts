import { Request, Response } from 'express'
import { supabase } from '../config/supabase'

/**
 * Generate a signed URL for a video file in Supabase Storage.
 * This ensures videos can only be viewed by authorized users for a limited time.
 */
export const getSignedVideoUrl = async (req: Request, res: Response) => {
  try {
    const { bucket, path } = req.body

    if (!bucket || !path) {
      return res.status(400).json({ error: 'Storage bucket and path are required' })
    }

    // Default expiration: 1 hour (3600 seconds)
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 3600)

    if (error) throw error

    res.json({ signedUrl: data.signedUrl })
  } catch (error: any) {
    console.error('[VIDEO_SIGNED_URL_ERROR]', error)
    res.status(500).json({ error: 'Failed to generate signed video URL' })
  }
}

/**
 * Lists available videos in a course folder (Admin only)
 */
export const listCourseVideos = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.courseId as string

    const { data, error } = await supabase.storage
      .from('course-videos')
      .list(courseId || '')

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
