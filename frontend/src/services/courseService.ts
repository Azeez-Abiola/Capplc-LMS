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
    const { data } = await api.patch(`courses/${id}`, course)
    return data
  },

  async archiveCourse(id: string): Promise<void> {
    await api.post(`courses/${id}/archive`)
  },

  async restoreCourse(id: string): Promise<void> {
    await api.post(`courses/${id}/restore`)
  },

  async deleteCourse(id: string): Promise<void> {
    await api.delete(`courses/${id}`)
  },

  async getEnrolledCourses(): Promise<any[]> {
    const { data } = await api.get('courses/my-courses')
    return data
  },

  async getAdminCourses(): Promise<Course[]> {
    const { data } = await api.get('courses/admin/all')
    return data
  },

  async enroll(courseId: string): Promise<any> {
    const { data } = await api.post('courses/enroll', { courseId })
    return data
  },

  // Module Operations
  async createModule(moduleData: any): Promise<any> {
    const { data } = await api.post('modules', moduleData)
    return data
  },

  async updateModule(id: string, moduleData: any): Promise<any> {
    const { data } = await api.patch(`modules/${id}`, moduleData)
    return data
  },

  async deleteModule(id: string): Promise<void> {
    await api.delete(`modules/${id}`)
  }
}
