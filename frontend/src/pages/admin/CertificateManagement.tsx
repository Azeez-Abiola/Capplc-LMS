import { Search, Filter, Download, Award, MoreHorizontal, ChevronRight, ShieldCheck } from 'lucide-react'

export default function CertificateManagement() {
  return (
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
                className="bg-transparent border-none outline-none text-sm font-medium ml-3 w-48 text-secondary-900 placeholder:text-slate-300 tracking-tight" 
              />
           </div>
           <button className="h-11 w-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary-500 transition-all shadow-sm">
             <Filter size={18} />
           </button>
        </div>
      </div>

      {/* Registry Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
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
                   {[
                     { name: 'Imran Ali', id: 'CAP-22-993', date: 'MAR 12, 2026', cat: 'Mastery' },
                     { name: 'Sarah Biu', id: 'CAP-22-102', date: 'MAR 10, 2026', cat: 'Standard' },
                     { name: 'David Okafor', id: 'CAP-22-045', date: 'MAR 08, 2026', cat: 'Mastery' },
                     { name: 'Michael Taiwo', id: 'CAP-22-221', date: 'MAR 05, 2026', cat: 'Advanced' },
                   ].map((cert, i) => (
                     <tr key={i} className="hover:bg-slate-50/50 transition-colors group cursor-pointer border-l-4 border-l-transparent hover:border-l-primary-500">
                        <td className="px-10 py-8">
                           <p className="text-sm font-bold text-secondary-900 uppercase tracking-tight group-hover:text-primary-500 transition-colors">{cert.name}</p>
                        </td>
                        <td className="px-10 py-8">
                           <p className="text-[11px] font-bold text-primary-500 tabular-nums tracking-widest bg-primary-50/50 px-3 py-1.5 rounded-lg border border-primary-50 inline-block">{cert.id}</p>
                        </td>
                        <td className="px-10 py-8">
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cert.date}</p>
                        </td>
                        <td className="px-10 py-8">
                           <span className="px-3 py-1.5 rounded-lg bg-slate-50 text-slate-400 border border-slate-100 text-[9px] font-bold uppercase tracking-widest group-hover:bg-secondary-900 group-hover:text-white group-hover:border-secondary-900 transition-all">{cert.cat}</span>
                        </td>
                        <td className="px-10 py-8">
                           <div className="flex gap-3">
                              <button className="h-10 w-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 hover:text-primary-500 hover:border-primary-500 transition-all shadow-sm active:scale-95"><Download size={18} /></button>
                              <button className="h-10 w-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 hover:text-secondary-900 hover:border-secondary-900 transition-all shadow-sm active:scale-95"><MoreHorizontal size={18} /></button>
                           </div>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
          <div className="p-8 bg-slate-50/30 text-center border-t border-slate-50">
             <button className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] hover:text-primary-500 transition-all flex items-center justify-center gap-3 mx-auto active:scale-95">
                Issue New Global Certificate <ChevronRight size={14} />
             </button>
          </div>
       </div>

      {/* Security Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
         <div className="bg-secondary-900 p-10 rounded-3xl relative overflow-hidden group shadow-xl transition-all hover:scale-[1.02]">
            <div className="absolute top-0 right-0 h-64 w-64 bg-primary-500/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
            <div className="relative z-10 flex flex-col justify-between h-full space-y-12">
               <div className="flex justify-between items-start">
                  <div className="h-14 w-14 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-primary-500 shadow-inner group-hover:scale-110 transition-transform">
                    <Award size={28} />
                  </div>
                  <span className="text-[10px] font-bold bg-primary-500 text-white px-4 py-2 rounded-xl shadow-lg uppercase tracking-widest">Digital Auth Verified</span>
               </div>
               <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-white tracking-tight">Security Protocol</h3>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-sm">All credentials utilize encrypted cryptographic signatures ensuring complete platform integrity.</p>
               </div>
            </div>
         </div>

         <div className="bg-white border border-slate-100 p-10 rounded-3xl shadow-sm space-y-10 group hover:shadow-xl transition-all">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-6 leading-none">Global Accuracy Index</h4>
            <div className="grid grid-cols-3 gap-6 py-4">
               <CertMetric value="2.4k" label="TOTAL ISSUANCE" />
               <CertMetric value="98.2%" label="VERIFICATION" />
               <CertMetric value="03" label="REVOKED" isDanger />
            </div>
            <div className="space-y-3">
               <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full w-[94%] bg-primary-500 shadow-[0_0_15px_rgba(255,94,36,0.3)] transition-all" />
               </div>
               <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest text-center">94% Registry Health Score</p>
            </div>
         </div>
      </div>

    </div>
  )
}

function CertMetric({ value, label, isDanger = false }: { value: string; label: string; isDanger?: boolean }) {
  return (
    <div className="space-y-3">
       <p className={`text-3xl font-bold tracking-tight leading-none tabular-nums ${isDanger ? 'text-red-500' : 'text-secondary-900 group-hover:text-primary-500 transition-colors'}`}>{value}</p>
       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none pt-1">{label}</p>
    </div>
  )
}
