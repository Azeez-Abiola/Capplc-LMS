import { Search, Filter, Download, Award, MoreHorizontal, ChevronRight, ShieldCheck } from 'lucide-react'

export default function CertificateManagement() {
  return (
    <div className="space-y-8 animate-slide-up pb-10">
      
      {/* ── HEADER SECTION ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-secondary-500 uppercase tracking-widest leading-none">Credential Registry</h1>
          <p className="text-slate-500 text-sm font-medium">Accreditation Oversight • Digital Badge Issuance • Security Verification</p>
        </div>
        <div className="flex gap-3">
           <div className="bg-white border border-slate-200 rounded-lg flex items-center px-4 py-2.5 shadow-sm group focus-within:ring-2 focus-within:ring-primary-100 transition-all">
              <Search size={16} className="text-slate-400" />
              <input type="text" placeholder="Lookup Cert ID..." className="bg-transparent border-none outline-none text-xs font-bold ml-2 w-48 text-secondary-500 placeholder:text-slate-300" />
           </div>
           <button className="h-10 w-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary-500 transition-all shadow-sm">
             <Filter size={16} />
           </button>
        </div>
      </div>

      {/* ── ISSUANCE TABLE ── */}
      <div className="bento-card overflow-hidden bg-white shadow-md">
         <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-sm font-bold text-secondary-500 uppercase tracking-widest leading-none">Accreditation Flux Record</h3>
            <div className="flex items-center gap-2">
               <ShieldCheck size={14} className="text-primary-500" />
               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">System Authenticated</span>
            </div>
         </div>
         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
               <thead className="bg-slate-50/30 border-b border-slate-100">
                  <tr>
                     <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Recipient</th>
                     <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Credential ID</th>
                     <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Generation Date</th>
                     <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Classification</th>
                     <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Management</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {[
                    { name: 'Imran Ali', id: 'CAP-22-993', date: 'MAR 12, 2026', cat: 'MASTERY' },
                    { name: 'Sarah Biu', id: 'CAP-22-102', date: 'MAR 10, 2026', cat: 'STANDARD' },
                    { name: 'David Okafor', id: 'CAP-22-045', date: 'MAR 08, 2026', cat: 'MASTERY' },
                    { name: 'Michael Taiwo', id: 'CAP-22-221', date: 'MAR 05, 2026', cat: 'ADVANCED' },
                  ].map((cert, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group cursor-pointer border-l-2 border-l-transparent hover:border-l-primary-500">
                       <td className="px-6 py-4">
                          <p className="text-xs font-bold text-secondary-500 uppercase tracking-tight">{cert.name}</p>
                       </td>
                       <td className="px-6 py-4">
                          <p className="text-[10px] font-bold text-primary-500 tabular-nums tracking-widest">{cert.id}</p>
                       </td>
                       <td className="px-6 py-4">
                          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{cert.date}</p>
                       </td>
                       <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded bg-slate-50 text-slate-400 border border-slate-200 text-[8px] font-bold uppercase tracking-widest group-hover:bg-white group-hover:text-primary-500 transition-all">{cert.cat}</span>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex gap-2">
                             <button className="h-8 w-8 bg-white border border-slate-200 rounded flex items-center justify-center text-slate-300 hover:text-primary-500 hover:border-primary-500 transition-all shadow-sm"><Download size={14} /></button>
                             <button className="h-8 w-8 bg-white border border-slate-200 rounded flex items-center justify-center text-slate-300 hover:text-primary-500 hover:border-primary-500 transition-all shadow-sm"><MoreHorizontal size={14} /></button>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
         <div className="p-4 bg-slate-50/30 text-center border-t border-slate-100">
            <button className="text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:text-primary-500 transition-colors flex items-center justify-center gap-1 mx-auto">Initialize New Batch Production <ChevronRight size={12} /></button>
         </div>
      </div>

      {/* ── SECURITY & STATS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bento-card p-8 bg-secondary-900 border-none relative overflow-hidden group h-60 flex flex-col justify-between shadow-xl transition-transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 h-40 w-40 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="flex justify-between items-start relative z-10">
               <div className="h-12 w-12 bg-white/10 rounded flex items-center justify-center text-primary-500 border border-white/10 shadow-lg">
                  <Award size={24} />
               </div>
               <span className="text-[9px] font-bold bg-primary-500 text-white px-3 py-1 rounded border border-primary-400 tracking-widest shadow-md">HARDWARE SIGNED</span>
            </div>
            <div className="relative z-10">
               <h3 className="text-xl font-bold text-white uppercase tracking-widest leading-none">Security Layer: <span className="text-primary-500">AES-256</span></h3>
               <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest pt-4">All generated credentials utilize encrypted cryptographic signatures for integrity.</p>
            </div>
         </div>

         <div className="bento-card p-6 flex flex-col justify-between h-60 bg-white shadow-md hover:border-primary-500 transition-all">
            <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest border-b border-slate-50 pb-4">Ecosystem Accuracy</h4>
            <div className="grid grid-cols-3 gap-4 py-4">
               <CertMetric value="2.4k" label="TOTAL ISSUANCE" />
               <CertMetric value="98.2%" label="VERIFICATION" />
               <CertMetric value="03" label="REVOKED OPS" isDanger />
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full w-[94%] bg-primary-500" />
            </div>
         </div>
      </div>

    </div>
  )
}

function CertMetric({ value, label, isDanger = false }: { value: string; label: string; isDanger?: boolean }) {
  return (
    <div className="space-y-1">
       <p className={`text-2xl font-bold tracking-tighter leading-none ${isDanger ? 'text-red-500' : 'text-secondary-500'}`}>{value}</p>
       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pt-1 leading-none">{label}</p>
    </div>
  )
}
