import api from '../lib/axios'

export const videoService = {
  /**
   * Generates a signed URL for a private video file stored in Supabase Storage.
   */
  async getSignedUrl(bucket: string, path: string): Promise<{ signedUrl: string }> {
    const { data } = await api.post('videos/signed-url', { bucket, path })
    return data
  },
  
  /**
   * Admin: List videos in a course folder.
   */
  async listCourseVideos(courseId: string): Promise<any[]> {
    const { data } = await api.get(`videos/list/${courseId}`)
    return data
  }
}
