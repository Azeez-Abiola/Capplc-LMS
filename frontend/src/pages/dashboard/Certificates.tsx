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
        console.error('Certificates error:', error)
        setCerts([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
     return (
       <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
         <Loader2 size={32} className="animate-spin text-primary-500" />
         <p className="text-xs font-medium text-slate-400">Loading certificates...</p>
       </div>
     )
  }

  const latestCert = certs[0]
  const userName = user?.user_metadata?.first_name + ' ' + user?.user_metadata?.last_name || 'Professional'

  return (
    <div className="space-y-10 animate-slide-up pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-secondary-900 tracking-tight">Certificates</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage and download your professional certifications.</p>
        </div>
        <div className="flex bg-white px-5 py-2.5 border border-slate-200 rounded-xl items-center gap-2 shadow-sm w-full md:w-auto justify-center md:justify-start">
           <Star size={16} fill="currentColor" className="text-primary-500" />
           <span className="text-[10px] font-bold text-secondary-900 uppercase tracking-widest leading-none">Verified Painter</span>
        </div>
      </div>

      {/* Featured Certificate Card */}
      {latestCert && (
        <div className="bg-secondary-900 rounded-3xl relative overflow-hidden group shadow-xl transition-all hover:shadow-2xl text-left">
           <div className="p-8 lg:p-14 flex flex-col lg:flex-row items-center gap-14 relative z-10">
              
              {/* Certificate Preview Card */}
              <div className="w-full sm:w-[420px] aspect-[4/3] bg-white rounded-2xl shadow-2xl p-8 flex flex-col justify-between border-[12px] border-slate-50 relative">
                 <div className="flex justify-between items-start">
                    <img src="/Capplc-logo.png" className="h-6 opacity-30 grayscale" alt="Logo" />
                    <ShieldCheck size={32} className="text-primary-500" />
                 </div>
                 <div className="text-center space-y-4">
                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-2">Award of Achievement</p>
                    <h3 className="text-xl font-bold text-secondary-900 leading-tight uppercase tracking-tight">{latestCert?.courses?.title}</h3>
                    <div className="h-[2px] w-12 bg-primary-500 mx-auto my-6" />
                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">Awarded specifically to <br/> <span className="text-secondary-900 font-bold block mt-1">{userName}</span></p>
                 </div>
                 <div className="flex justify-between items-end border-t border-slate-50 pt-6">
                    <div className="text-left space-y-1">
                       <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Reg No.</p>
                       <p className="text-[10px] font-mono text-secondary-900">{latestCert?.serial_no.split('-').pop()}</p>
                    </div>
                    <Award size={24} className="text-slate-100" />
                 </div>
              </div>

              {/* Certificate Content */}
              <div className="flex-1 space-y-8 text-center lg:text-left">
                 <div className="space-y-4">
                    <span className="bg-primary-500 text-white text-[11px] font-bold px-4 py-2 rounded-full uppercase tracking-wider">Latest Achievement</span>
                    <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">{latestCert?.courses?.title}</h2>
                    <p className="text-slate-400 text-base font-medium leading-relaxed max-w-md">
                      This certificate validates your mastery and professional competence in this specific module.
                    </p>
                 </div>
                 
                 <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4">
                    <button className="h-14 w-full sm:w-auto px-10 bg-white text-secondary-900 rounded-xl font-bold text-xs hover:bg-slate-100 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 uppercase tracking-widest">
                       <Download size={18} /> Download PDF
                    </button>
                    <button className="h-14 w-full sm:w-auto px-10 bg-white/10 text-white rounded-xl font-bold text-xs hover:bg-white/20 transition-all flex items-center justify-center gap-3 border border-white/10 active:scale-95 uppercase tracking-widest">
                       <ExternalLink size={18} /> Share Link
                    </button>
                 </div>
              </div>
           </div>
           <div className="absolute top-0 right-0 h-[400px] w-[400px] bg-primary-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        </div>
      )}

      {/* Secondary Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
         {certs.map((cert) => (
           <div key={cert.id} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group">
              <div className="flex justify-between items-start mb-10">
                 <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center text-primary-500 border border-slate-50 group-hover:bg-primary-500 group-hover:text-white transition-all shadow-sm">
                   <ShieldCheck size={28} />
                 </div>
                 <button className="h-12 w-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary-500 hover:border-primary-500 transition-all active:scale-95 shadow-sm">
                    <Download size={18} />
                 </button>
              </div>
              <div className="space-y-8">
                 <div className="space-y-3">
                    <h4 className="text-base font-bold text-secondary-900 leading-tight group-hover:text-primary-500 transition-colors uppercase tracking-tight line-clamp-2">{cert.courses?.title}</h4>
                    <div className="flex items-center gap-3">
                       <p className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <Calendar size={14} /> {new Date(cert.issued_at).toLocaleDateString()}
                       </p>
                       <span className="h-1 w-1 bg-slate-200 rounded-full" />
                       <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Verified</span>
                    </div>
                 </div>
                 <div className="pt-6 border-t border-slate-50 flex justify-between items-center cursor-pointer group/link">
                    <p className="text-[10px] font-bold text-slate-400 group-hover/link:text-secondary-900 transition-colors uppercase tracking-widest">ID: {cert.serial_no.split('-').pop()}</p>
                    <ChevronRight size={16} className="text-slate-300 group-hover/link:text-primary-500 transition-all" />
                 </div>
              </div>
           </div>
          ))}
      </div>

      {certs.length === 0 && !loading && (
        <div className="py-24 text-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
           <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No certificates earned yet</p>
           <p className="text-xs font-medium text-slate-300 mt-2">Complete courses to unlock and download your awards.</p>
        </div>
      )}

    </div>
  )
}
