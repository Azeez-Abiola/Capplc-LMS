import { Router } from 'express'
import { getAllUsers, getUserById, updateUserStatus, getProfile, updateProfile, updateUser, deactivateUser } from '../controllers/user.controller'
import { authenticate, authorize } from '../middleware/auth.middleware'

const router = Router()

// Profile routes
router.get('/profile', authenticate, getProfile)
router.put('/profile', authenticate, updateProfile)

// Admin only routes
router.get('/', authenticate, authorize(['admin', 'super_admin']), getAllUsers)
router.get('/:id', authenticate, authorize(['admin', 'super_admin']), getUserById)
router.put('/:id', authenticate, authorize(['admin', 'super_admin']), updateUser)
router.put('/:id/status', authenticate, authorize(['admin', 'super_admin']), updateUserStatus)
router.post('/:id/deactivate', authenticate, authorize(['admin', 'super_admin']), deactivateUser)

export default router
