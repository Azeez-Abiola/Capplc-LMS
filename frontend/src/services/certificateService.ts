import api from '../lib/axios'

export interface Certificate {
  id: string
  serial_no: string
  user_id: string
  course_id: string
  certificate_url: string
  issued_at: string
  courses?: {
    title: string
  }
}

export const certificateService = {
  async getMyCertificates(): Promise<Certificate[]> {
    const { data } = await api.get('certificates')
    return data
  },

  async verifyCertificate(serialNo: string): Promise<Certificate> {
    const { data } = await api.get(`certificates/verify/${serialNo}`)
    return data
  },

  async getAllCertificatesAdmin(): Promise<any[]> {
    const { data } = await api.get('certificates/admin/all')
    return data
  }
}
