import { Search, UserPlus, MoreHorizontal, Mail, Phone, ExternalLink, Shield } from 'lucide-react'
import { useState } from 'react'

export default function TeamManagement() {
  const [painters] = useState([
    { id: 1, name: 'Bolu K.', email: 'bolu@example.com', phone: '08012345678', progress: 85, status: 'Active' },
    { id: 2, name: 'Sarah O.', email: 'sarah@example.com', phone: '08098765432', progress: 42, status: 'Active' },
    { id: 3, name: 'Imran A.', email: 'imran@example.com', phone: '08123456789', progress: 10, status: 'Pending' },
  ])

  return (
    <div className="space-y-10 animate-slide-up pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 text-left">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-secondary-900 tracking-tight leading-none">Team <span className="text-primary-500">Roster</span></h1>
          <p className="text-slate-500 text-sm font-medium">Monitor your professional painters and their certification paths.</p>
        </div>
        <button className="h-12 px-6 bg-secondary-900 text-white rounded-xl flex items-center justify-center font-bold text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95 gap-2">
           <UserPlus size={16} /> Invite Painter
        </button>
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
             <div className="flex items-center gap-4 bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-inner w-full md:w-80 group focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
                <Search size={16} className="text-slate-400 group-focus-within:text-primary-500" />
                <input type="text" placeholder="Filter team..." className="bg-transparent border-none outline-none text-xs font-medium w-full text-secondary-900" />
             </div>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                   <tr>
                      <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Painter</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Training Progress</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {painters.map((p) => (
                      <tr key={p.id} className="group hover:bg-slate-50 transition-colors">
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-4 text-left">
                               <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400 group-hover:bg-primary-500 group-hover:text-white transition-all">
                                  {p.name.charAt(0)}
                               </div>
                               <div>
                                  <p className="text-sm font-bold text-secondary-900">{p.name}</p>
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${p.status === 'Active' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-slate-100 text-slate-400'}`}>
                                     {p.status}
                                  </span>
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <div className="space-y-1">
                               <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                  <Mail size={12} className="text-slate-300" /> {p.email}
                               </div>
                               <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                  <Phone size={12} className="text-slate-300" /> {p.phone}
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <div className="w-48 space-y-2">
                               <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                  <span className="text-slate-400">Mastery</span>
                                  <span className="text-secondary-900">{p.progress}%</span>
                               </div>
                               <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-primary-500" style={{ width: `${p.progress}%` }} />
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <button className="h-10 w-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary-500 hover:border-primary-500 transition-all active:scale-95 shadow-sm">
                               <MoreHorizontal size={18} />
                            </button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
      </div>

      {/* Roster Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="p-8 bg-secondary-900 rounded-3xl text-left relative overflow-hidden">
            <Shield className="absolute -bottom-6 -right-6 h-32 w-32 text-white/5 rotate-12" />
            <p className="text-[10px] font-bold text-primary-500 uppercase tracking-widest mb-4">Quality Assurance</p>
            <h3 className="text-xl font-bold text-white mb-6">Certified Workforce</h3>
            <div className="flex items-center gap-6">
               <div className="text-center">
                  <p className="text-3xl font-black text-white">4</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Fully Certified</p>
               </div>
               <div className="h-10 w-px bg-white/10" />
               <div className="text-center">
                  <p className="text-3xl font-black text-white">12</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">In Training</p>
               </div>
            </div>
         </div>
         <div className="p-8 bg-white border border-slate-100 rounded-3xl text-left">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Onboarding</p>
            <h3 className="text-xl font-bold text-secondary-900 mb-6">Invitation Code</h3>
            <div className="flex items-center gap-3">
               <code className="bg-slate-50 px-4 py-3 rounded-xl border border-dashed border-slate-200 font-mono text-sm text-secondary-900 flex-1">
                  CAP-BIZ-7734
               </code>
               <button className="h-12 w-12 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 transition-all active:scale-95">
                  <ExternalLink size={18} />
               </button>
            </div>
            <p className="text-[10px] font-medium text-slate-400 mt-4 leading-relaxed">Share this code with your painters. They will be automatically linked to your roster upon registration.</p>
         </div>
      </div>

    </div>
  )
}
