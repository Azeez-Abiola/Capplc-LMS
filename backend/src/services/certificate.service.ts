import PDFDocument from 'pdfkit'
import { supabase } from '../config/supabase'
import path from 'path'

interface CertData {
  userName: string
  courseName: string
  serialNo: string
  completionDate: string
}

/**
 * Generates a PDF certificate and uploads it to Supabase Storage
 * Returns the public URL of the certificate
 */
export async function generateCertificatePDF(data: CertData): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4',
        margin: 0
      })

      const chunks: any[] = []
      doc.on('data', chunk => chunks.push(chunk))
      doc.on('end', async () => {
        const result = Buffer.concat(chunks)
        const fileName = `certificates/${data.serialNo}.pdf`

        // Upload to Supabase Storage
        const { error: uploadErr } = await supabase.storage
          .from('certificates')
          .upload(fileName, result, {
            contentType: 'application/pdf',
            upsert: true
          })

        if (uploadErr) return reject(uploadErr)

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from('certificates')
          .getPublicUrl(fileName)

        resolve(publicUrl)
      })

      // ── Certificate Design ──

      // Background Color
      doc.rect(0, 0, doc.page.width, doc.page.height).fill('#ffffff')
      
      // Border
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
         .lineWidth(5)
         .stroke('#d4af37') // Gold border

      // Branding
      doc.fillColor('#1a1a1a')
         .fontSize(40)
         .text('CAP Business Pro', 0, 100, { align: 'center' })
      
      doc.fontSize(20)
         .text('Professional Skills Certification', 0, 150, { align: 'center' })

      // Main Text
      doc.moveDown(2)
      doc.fillColor('#555555')
         .fontSize(18)
         .text('This is to certify that', { align: 'center' })
      
      doc.moveDown(1)
      doc.fillColor('#000000')
         .fontSize(35)
         .text(data.userName, { align: 'center' })

      doc.moveDown(1)
      doc.fillColor('#555555')
         .fontSize(18)
         .text('has successfully completed the course', { align: 'center' })

      doc.moveDown(1)
      doc.fillColor('#d4af37')
         .fontSize(25)
         .text(data.courseName, { align: 'center' })

      // Footer Data
      doc.moveDown(3)
      doc.fillColor('#555555')
         .fontSize(12)
         .text(`Date of Completion: ${data.completionDate}`, 100, 480)
         .text(`Certificate ID: ${data.serialNo}`, 100, 500)

      doc.text('Authorised Signature', 550, 480)
      doc.moveTo(550, 475).lineTo(750, 475).stroke()

      doc.end()
    } catch (err) {
      reject(err)
    }
  })
}
