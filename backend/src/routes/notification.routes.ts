import { Router } from 'express'
import * as notificationController from '../controllers/notification.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.get('/', authenticate, notificationController.getNotifications)
router.put('/:id/read', authenticate, notificationController.markAsRead)
router.put('/read-all', authenticate, notificationController.markAllAsRead)

export default router
