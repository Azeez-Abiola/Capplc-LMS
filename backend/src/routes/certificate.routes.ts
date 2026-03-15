import { Router } from 'express'
import { getUserCertificates, issueCertificate, verifyCertificate, getAllCertificatesAdmin } from '../controllers/certificate.controller'
import { authenticate, authorize } from '../middleware/auth.middleware'

const router = Router()

router.get('/', authenticate, getUserCertificates)
router.get('/admin/all', authenticate, authorize(['admin']), getAllCertificatesAdmin)
router.get('/verify/:serial_no', verifyCertificate)
router.post('/issue', authenticate, authorize(['admin']), issueCertificate)

export default router
