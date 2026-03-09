import { Router } from 'express'
import { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse, getEnrolledCourses } from '../controllers/course.controller'
import { authenticate, authorize } from '../middleware/auth.middleware'

const router = Router()

router.get('/', getAllCourses)
router.get('/my-courses', authenticate, getEnrolledCourses)
router.get('/:id', getCourseById)

// Admin only course management
router.post('/', authenticate, authorize(['admin']), createCourse)
router.put('/:id', authenticate, authorize(['admin']), updateCourse)
router.delete('/:id', authenticate, authorize(['admin']), deleteCourse)

export default router
