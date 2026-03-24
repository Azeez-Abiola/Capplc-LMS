import api from '../lib/axios'

export const progressService = {
  /**
   * Syncs video timestamp for a specific lesson
   */
  async syncVideoProgress(lessonId: string, currentTime: number, duration: number): Promise<any> {
    const { data } = await api.post('progress/sync', { 
      lesson_id: lessonId, 
      current_time: currentTime, 
      duration 
    })
    return data
  },

  /**
   * Explicitly marks a lesson as completed
   */
  async markComplete(lessonId: string): Promise<any> {
    const { data } = await api.post('progress/complete', { lesson_id: lessonId })
    return data
  },

  /**
   * Get user's progress for all lessons within a course
   */
  async getCourseProgress(courseId: string): Promise<any[]> {
    const { data } = await api.get(`progress/course/${courseId}`)
    return data
  }
}
