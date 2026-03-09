// Course service — API calls for course-related operations
import api from '../lib/axios'
import type { Course } from '../types'

export const courseService = {
  async getCourses(): Promise<Course[]> {
    const { data } = await api.get('courses')
    return data
  },

  async getCourseById(id: string): Promise<Course> {
    const { data } = await api.get(`courses/${id}`)
    return data
  },

  async createCourse(course: Partial<Course>): Promise<Course> {
    const { data } = await api.post('courses', course)
    return data
  },

  async updateCourse(id: string, course: Partial<Course>): Promise<Course> {
    const { data } = await api.put(`courses/${id}`, course)
    return data
  },

  async deleteCourse(id: string): Promise<void> {
    await api.delete(`courses/${id}`)
  },

  async getEnrolledCourses(): Promise<any[]> {
    const { data } = await api.get('courses/my-courses')
    return data
  },
}
