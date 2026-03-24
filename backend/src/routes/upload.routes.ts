import { Router } from 'express'
import multer from 'multer'
import { uploadFile } from '../controllers/upload.controller'
import { authenticate, authorize } from '../middleware/auth.middleware'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

router.post('/', authenticate, authorize(['admin', 'super_admin']), upload.single('file'), uploadFile)

export default router
