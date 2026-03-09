import { Award, Download, ShieldCheck, Star, Calendar, ChevronRight, ExternalLink, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { certificateService } from '../../services/certificateService'
import type { Certificate } from '../../services/certificateService'
import { authService } from '../../services/authService'

export default function Certificates() {
  const [certs, setCerts] = useState<Certificate[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, certRes] = await Promise.all([
          authService.getCurrentUser(),
          certificateService.getMyCertificates()
        ])
        setUser(userRes)
        setCerts(Array.isArray(certRes) ? certRes : [])
      } catch (error) {
        console.error('Failed to fetch certificates:', error)
        // Fallback to mock
        setCerts([
          { id: '1', serial_no: 'CAP-2026-993-PRO', courses: { title: 'Modern Surface Prep & Decontamination' }, issued_at: '2026-02-12', certificate_url: '#' },
          { id: '2', serial_no: 'CAP-2026-102-MAST', courses: { title: 'Luxury Texture Portfolio: Part 1' }, issued_at: '2026-01-05', certificate_url: '#' },
        ] as any)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
     return (
       <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
         <Loader2 size={40} className="animate-spin text-primary-500" />
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Accessing Credential Ledger...</p>
       </div>
     )
  }

  const latestCert = certs[0]
  const userName = user?.user_metadata?.first_name?.toUpperCase() + ' ' + user?.user_metadata?.last_name?.toUpperCase() || 'IMRAN ALI'

  return (
    <div className="space-y-8 animate-slide-up pb-10">
      
      {/* ── HEADER SECTION ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-1 text-left">
          <h1 className="text-3xl font-bold tracking-tight text-secondary-500 uppercase">Professional Credentials</h1>
          <p className="text-slate-500 text-sm font-medium">Download and verify your CAP Business Pro accredited certificates.</p>
        </div>
        <div className="flex bg-white dark:bg-zinc-900 px-4 py-2 border border-slate-200 dark:border-white/5 rounded-lg items-center gap-2 shadow-sm w-full md:w-auto justify-center md:justify-start">
           <Star size={16} fill="currentColor" className="text-primary-500" />
           <span className="text-[10px] font-bold text-secondary-500 dark:text-white uppercase tracking-widest">Verified Accreditation Status</span>
        </div>
      </div>

      {/* ── HIGHLIGHTED CERTIFICATE ── */}
      <div className="bento-card p-1 bg-secondary-900 border-none relative overflow-hidden group">
         <div className="p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-10 relative z-10">
            {/* The physical-look certificate card */}
            <div className="w-full sm:w-[400px] aspect-[4/3] bg-white rounded-lg shadow-2xl p-4 sm:p-6 flex flex-col justify-between border-4 border-slate-200/20 max-w-full">
               <div className="flex justify-between items-start">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center p-1.5 bg-slate-50 rounded border border-slate-100">
                     <img src="/Capplc-logo.png" className="h-full w-full object-contain grayscale opacity-20" alt="Logo" />
                  </div>
                  <ShieldCheck size={28} strokeWidth={1.5} className="text-primary-500 sm:w-8 sm:h-8" />
               </div>
               <div className="text-center space-y-2">
                  <p className="text-[7px] sm:text-[8px] font-bold text-slate-300 uppercase tracking-[0.3em] leading-none">CERTIFICATE OF COMPLETION</p>
                  <h3 className="text-base sm:text-xl font-bold text-secondary-500 uppercase tracking-tight line-clamp-2">{latestCert?.courses?.title || 'Advanced Master Certification'}</h3>
                  <div className="h-px w-16 sm:w-24 bg-slate-100 mx-auto my-2 sm:my-3" />
                  <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase">Awarded to <span className="text-secondary-500">{userName}</span></p>
               </div>
               <div className="flex justify-between items-end border-t border-slate-50 pt-3 sm:pt-4">
                  <div className="text-left">
                     <p className="text-[6px] sm:text-[7px] font-bold text-slate-300 uppercase leading-none">Serial No.</p>
                     <p className="text-[8px] sm:text-[9px] font-bold text-secondary-500 font-mono mt-1">{latestCert?.serial_no || 'CAP-NODE-AUTH-00'}</p>
                  </div>
                  <div className="h-6 w-6 sm:h-8 sm:w-8 bg-slate-50 rounded border border-slate-100 flex items-center justify-center">
                     <Award size={14} className="text-slate-200" />
                  </div>
               </div>
            </div>

            <div className="flex-1 space-y-6 text-center lg:text-left">
               <div className="space-y-3">
                  <span className="bg-primary-500 text-white text-[9px] font-bold px-3 py-1.5 rounded uppercase tracking-[0.2em] leading-none">LATEST ACCREDITATION</span>
                  <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight uppercase">Advanced Professional <br /> Accreditation Mastery</h2>
                  <p className="text-slate-400 text-base font-medium leading-relaxed max-w-lg">
                    This certification validates proficiency in high-end luxury finishing 
                    and surface restoration techniques for premium CAP products.
                  </p>
               </div>
               
               <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 pt-2">
                  <button className="w-full sm:w-auto bg-white text-secondary-500 px-8 py-3.5 rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95">
                    <Download size={16} /> EXPORT PDF
                  </button>
                  <button className="w-full sm:w-auto bg-white/10 text-white px-8 py-3.5 rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-2 border border-white/10 active:scale-95">
                    <ExternalLink size={16} /> SHARE LINK
                  </button>
               </div>
            </div>
         </div>
      </div>

      {/* ── ALL CERTIFICATES LIST ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {certs.map((cert) => (
           <div key={cert.id} className="bento-card p-6 flex flex-col justify-between group hover:border-primary-500 transition-all bg-white dark:bg-secondary-800 text-left">
              <div className="flex justify-between items-start mb-6">
                 <div className="h-12 w-12 bg-slate-50 rounded-md flex items-center justify-center text-primary-500 border border-slate-200 group-hover:bg-primary-500 group-hover:text-white transition-all">
                   <ShieldCheck size={24} />
                 </div>
                 <button className="h-9 w-9 bg-white rounded border border-slate-200 flex items-center justify-center text-slate-300 hover:text-primary-500 hover:border-primary-500 transition-all shadow-sm active:scale-95">
                    <Download size={16} />
                 </button>
              </div>
              <div className="space-y-4">
                 <div className="space-y-1">
                    <h4 className="text-lg font-bold text-secondary-500 dark:text-white group-hover:text-primary-500 transition-colors uppercase tracking-tight">{cert.courses?.title}</h4>
                    <div className="flex items-center gap-3">
                       <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          <Calendar size={12} /> {new Date(cert.issued_at).toLocaleDateString()}
                       </div>
                       <span className="h-1 w-1 bg-slate-200 rounded-full" />
                       <span className="text-[9px] font-bold text-slate-300 uppercase">ACCREDITED</span>
                    </div>
                 </div>
                 <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex justify-between items-center group/btn cursor-pointer">
                    <p className="text-[9px] font-bold text-slate-400 group-hover/btn:text-secondary-500 dark:group-hover/btn:text-white transition-colors uppercase tracking-widest">VALIDATE PORTAL</p>
                    <ChevronRight size={14} className="text-slate-300 group-hover/btn:text-primary-500 transition-all" />
                 </div>
              </div>
           </div>
         ))}
      </div>

    </div>
  )
}
