import { Router } from 'express'
import * as authController from '../controllers/auth.controller'

const router = Router()

// POST /api/auth/register
router.post('/register', authController.register)

// POST /api/auth/login
router.post('/login', authController.login)

// POST /api/auth/forgot-password
router.post('/forgot-password', authController.resetPassword)

// POST /api/auth/logout
router.post('/logout', authController.logout)

export default router
