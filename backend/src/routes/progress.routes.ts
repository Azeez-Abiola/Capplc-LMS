import { Router } from 'express'
import { syncVideoProgress, markComplete, getCourseProgress } from '../controllers/progress.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.post('/sync', authenticate, syncVideoProgress)
router.post('/complete', authenticate, markComplete)
router.get('/course/:courseId', authenticate, getCourseProgress)

export default router
