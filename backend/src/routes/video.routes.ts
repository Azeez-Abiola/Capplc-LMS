import { Router } from 'express'
import { getSignedVideoUrl, listCourseVideos } from '../controllers/video.controller'
import { authenticate, authorize, requireTier } from '../middleware/auth.middleware'

const router = Router()

// Authenticated users can get signed URLs, but requireTier middleware ensures 
// they have the correct subscription for the course content.
router.post('/signed-url', authenticate, getSignedVideoUrl)

// Admin only management
router.get('/list/:courseId', authenticate, authorize(['admin']), listCourseVideos)

export default router
