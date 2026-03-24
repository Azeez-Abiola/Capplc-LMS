import { Router } from 'express'
import {
  getAllCourses,
  getAllCoursesAdmin,
  getCourseById,
  createCourse,
  updateCourse,
  archiveCourse,
  restoreCourse,
  deleteCourse,
  getEnrolledCourses,
  enrollInCourse
} from '../controllers/course.controller'
import { authenticate, authorize, requireTier } from '../middleware/auth.middleware'

const router = Router()

// ── Public routes ───────────────────────────────────────────────
router.get('/', getAllCourses)
router.get('/my-courses', authenticate, getEnrolledCourses)
router.post('/enroll', authenticate, enrollInCourse)
router.get('/:id', getCourseById)

// ── Tier-gated content ──────────────────────────────────────────
// (To be used when fetching actual course content/videos)

// ── Admin-only course management ────────────────────────────────
router.get('/admin/all', authenticate, authorize(['admin']), getAllCoursesAdmin)
router.post('/', authenticate, authorize(['admin']), createCourse)
router.patch('/:id', authenticate, authorize(['admin']), updateCourse)
router.put('/:id', authenticate, authorize(['admin']), updateCourse)

// Soft-delete (archive) and restore
router.post('/:id/archive', authenticate, authorize(['admin']), archiveCourse)
router.post('/:id/restore', authenticate, authorize(['admin']), restoreCourse)

// Hard delete (emergency)
router.delete('/:id', authenticate, authorize(['admin']), deleteCourse)

export default router
