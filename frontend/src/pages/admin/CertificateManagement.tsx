import { Search, Filter, Download, Award, MoreHorizontal, ChevronRight, ShieldCheck, X, User, Calendar, ExternalLink, Bookmark } from 'lucide-react'
import LogoLoader from '../../components/ui/LogoLoader'
import { useState, useEffect } from 'react'
import { certificateService } from '../../services/certificateService'

export default function CertificateManagement() {
  const [certs, setCerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCat, setFilterCat] = useState('All')
  const [selectedCert, setSelectedCert] = useState<any>(null)

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const data = await certificateService.getAllCertificatesAdmin()
        setCerts(data)
      } catch (error) {
        console.error('Cert Management error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCerts()
  }, [])

  const filteredCerts = certs.filter(cert => {
    const name = `${cert.profiles?.first_name} ${cert.profiles?.last_name}`.toLowerCase()
    const matchesSearch = name.includes(searchQuery.toLowerCase()) || cert.serial_no.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCat = filterCat === 'All' || cert.courses?.tier_access.toUpperCase() === filterCat.toUpperCase()
    return matchesSearch && matchesCat
  })

  if (loading) {
    return (
      <LogoLoader fullscreen />
    )
  }

  return (
    <>
      <div className="space-y-10 animate-slide-up pb-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 text-left">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-secondary-900 leading-none">Certificate Management</h1>
            <p className="text-slate-500 text-sm font-medium">Manage and verify all issued professional credentials.</p>
          </div>
          <div className="flex gap-4">
             <div className="bg-white border border-slate-200 rounded-xl flex items-center px-4 py-2.5 shadow-sm group focus-within:ring-4 focus-within:ring-primary-50 transition-all">
                <Search size={18} className="text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Lookup Record ID..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm font-medium ml-3 w-48 text-secondary-900 placeholder:text-slate-300 tracking-tight" 
                />
             </div>
             <div className="relative shrink-0">
                <select 
                  value={filterCat}
                  onChange={(e) => setFilterCat(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                >
                   <option value="All">All Classifications</option>
                   <option value="Mastery">Mastery</option>
                   <option value="Advanced">Advanced</option>
                   <option value="Standard">Standard</option>
                </select>
                <button className={`h-11 w-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center transition-all shadow-sm ${filterCat !== 'All' ? 'text-primary-500 border-primary-500 bg-primary-50' : 'text-slate-400 hover:text-primary-500'}`}>
                  <Filter size={18} />
                </button>
             </div>
          </div>
        </div>

        {/* Registry Table */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30 text-left">
               <h3 className="text-xs font-bold text-secondary-900 uppercase tracking-widest leading-none">Recent Certificates Issued</h3>
               <div className="flex items-center gap-3">
                  <ShieldCheck size={16} className="text-primary-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Verified Secure</span>
               </div>
            </div>
            <div className="overflow-x-auto no-scrollbar">
               <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50/10 border-b border-slate-100 whitespace-nowrap">
                     <tr>
                        <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Recipient Professional</th>
                        <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Credential ID</th>
                        <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Date Issued</th>
                        <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Classification</th>
                        <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {filteredCerts.length > 0 ? (
                       filteredCerts.map((cert, i) => (
                         <tr key={i} className="hover:bg-slate-50/50 transition-colors group cursor-pointer border-l-4 border-l-transparent hover:border-l-primary-500">
                            <td className="px-10 py-8 text-left">
                               <p className="text-sm font-bold text-secondary-900 uppercase tracking-tight group-hover:text-primary-500 transition-colors">{cert.profiles?.first_name} {cert.profiles?.last_name}</p>
                            </td>
                            <td className="px-10 py-8 text-left">
                               <p className="text-[11px] font-bold text-primary-500 tabular-nums tracking-widest bg-primary-50/50 px-3 py-1.5 rounded-lg border border-primary-50 inline-block">{cert.serial_no.split('-').pop()}</p>
                            </td>
                            <td className="px-10 py-8 text-left">
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(cert.issued_at).toLocaleDateString()}</p>
                            </td>
                            <td className="px-10 py-8 text-left">
                               <span className="px-3 py-1.5 rounded-lg bg-slate-50 text-slate-400 border border-slate-100 text-[9px] font-bold uppercase tracking-widest group-hover:bg-secondary-900 group-hover:text-white group-hover:border-secondary-900 transition-all">{cert.courses?.tier_access}</span>
                            </td>
                            <td className="px-10 py-8 text-left">
                               <div className="flex gap-3">
                                  <button onClick={(e) => { e.stopPropagation(); window.open(cert.certificate_url, '_blank'); }} className="h-10 w-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 hover:text-primary-500 hover:border-primary-500 transition-all shadow-sm active:scale-95"><Download size={18} /></button>
                                  <button onClick={(e) => { e.stopPropagation(); setSelectedCert(cert); }} className="h-10 w-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 hover:text-secondary-900 hover:border-secondary-900 transition-all shadow-sm active:scale-95"><MoreHorizontal size={18} /></button>
                               </div>
                            </td>
                         </tr>
                       ))
                     ) : (
                       <tr>
                          <td colSpan={5} className="py-20 text-center">
                             <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mx-auto mb-4 border border-slate-100">
                               <Award size={24} />
                             </div>
                             <h3 className="text-base font-bold text-secondary-900 uppercase tracking-tight">No records found</h3>
                             <p className="text-xs font-medium text-slate-400 mt-2">Try adjusting your filters.</p>
                          </td>
                       </tr>
                     )}
                  </tbody>
               </table>
            </div>
            <div className="p-8 bg-slate-50/30 text-center border-t border-slate-50">
               <button className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] hover:text-primary-500 transition-all flex items-center justify-center gap-3 mx-auto active:scale-95">
                  Issue New Global Certificate <ChevronRight size={14} />
               </button>
            </div>
         </div>
      </div>

      {/* Certificate Details Modal (DISSOCIATED FOR PERFECT CENTERING) */}
        {selectedCert && (
           <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedCert(null)}>
              <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl animate-slide-up overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4 text-left">
                   <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-primary-50 text-primary-500 border border-primary-100">
                      <Award size={24} />
                   </div>
                   <div>
                      <h3 className="text-xl font-bold text-secondary-900 tracking-tight leading-none">Credential Details</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Verified Professional</p>
                   </div>
                </div>
                <button onClick={() => setSelectedCert(null)} className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                   <X size={18} />
                </button>
             </div>

             <div className="space-y-6 mb-10 text-left">
                <ModalDetailRow icon={<User size={16} />} label="Recipient Name" value={`${selectedCert.profiles?.first_name} ${selectedCert.profiles?.last_name}`} subValue={selectedCert.profiles?.email} />
                <ModalDetailRow icon={<Bookmark size={16} />} label="Module Studied" value={selectedCert.courses?.title} />
                <ModalDetailRow icon={<ShieldCheck size={16} />} label="Classification" value={selectedCert.courses?.tier_access} isPrimary />
                <ModalDetailRow icon={<Calendar size={16} />} label="Issuance Date" value={new Date(selectedCert.issued_at).toLocaleDateString()} />
                <ModalDetailRow icon={<ShieldCheck size={16} />} label="Verified By" value="CAP PLC Academy" />
             </div>

             <div className="pt-8 border-t border-slate-50 flex gap-4">
                <button onClick={() => setSelectedCert(null)} className="flex-1 py-4 bg-slate-50 hover:bg-slate-100 text-secondary-900 font-bold rounded-xl text-[10px] uppercase tracking-widest transition-all">Close</button>
                <button onClick={() => { window.open(selectedCert.certificate_url, '_blank'); setSelectedCert(null); }} className="flex-1 py-4 bg-secondary-900 hover:bg-black text-white font-bold rounded-xl text-[10px] uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2">
                   <ExternalLink size={14} /> Open Document
                </button>
             </div>
          </div>
        </div>
      )}
    </>
  )
}

function ModalDetailRow({ icon, label, value, subValue, isPrimary = false }: { icon: React.ReactNode; label: string; value: string; subValue?: string; isPrimary?: boolean }) {
  return (
    <div className="flex items-start gap-4 text-left">
       <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 mt-0.5 border border-slate-100">
          {icon}
       </div>
       <div className="space-y-1">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">{label}</p>
          <p className={`text-sm font-bold tracking-tight ${isPrimary ? 'text-primary-500' : 'text-secondary-900'}`}>{value}</p>
          {subValue && <p className="text-[10px] font-medium text-slate-400">{subValue}</p>}
       </div>
    </div>
  )
}
