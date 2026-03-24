import { Router } from 'express'
import * as SuperAdminController from '../controllers/super-admin.controller'
import { authenticate, requireSuperAdmin } from '../middleware/auth.middleware'

const router = Router()

/**
 * All Super Admin routes require authentication and super_admin role
 */
router.use(authenticate, requireSuperAdmin)

// Dashboard Overview
router.get('/overview', SuperAdminController.getPlatformOverview)

// Companies Management
router.get('/companies', SuperAdminController.getCompaniesList)
router.post('/companies', SuperAdminController.createCompany)
router.put('/companies/:id', SuperAdminController.updateCompany)

// Analytics & KPIs
router.get('/analytics', SuperAdminController.getPlatformAnalytics)

// Revenue & Billing
router.get('/revenue', SuperAdminController.getRevenueReport)

export default router
