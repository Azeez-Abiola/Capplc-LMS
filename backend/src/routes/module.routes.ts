import { Router } from 'express'
import {
  getModulesByCourse,
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
  reorderModules
} from '../controllers/module.controller'
import { authenticate, authorize } from '../middleware/auth.middleware'

const router = Router()

// Public — get modules for a course
router.get('/course/:courseId', getModulesByCourse)

// Public — get single module
router.get('/:id', getModuleById)

// Admin only — create, update, delete, reorder
router.post('/', authenticate, authorize(['admin']), createModule)
router.patch('/:id', authenticate, authorize(['admin']), updateModule)
router.delete('/:id', authenticate, authorize(['admin']), deleteModule)
router.put('/course/:courseId/reorder', authenticate, authorize(['admin']), reorderModules)

export default router
