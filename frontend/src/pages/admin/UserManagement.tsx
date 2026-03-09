import { useState, useEffect } from 'react'
import { Search, Filter, Mail, Phone, Shield, ArrowUpRight, MoreHorizontal, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { userService } from '../../services/userService'
import type { UserProfile } from '../../services/userService'
import { toast } from 'react-hot-toast'

export default function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const data = await userService.getAllUsers()
      setUsers(Array.isArray(data) ? data : [])
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to fetch users')
      // Fallback to mock data
      setUsers([
        { id: 'CAP-993-PRO', first_name: 'Imran', last_name: 'Ali', email: 'imran@cap.com', phone: '08012345678', state: 'Lagos', role: 'painter', status: 'active', created_at: new Date().toISOString() },
        { id: 'CAP-102-STD', first_name: 'Sarah', last_name: 'Biu', email: 'sarah@cap.com', phone: '08012345679', state: 'Abuja', role: 'painter', status: 'inactive', created_at: new Date().toISOString() }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = (Array.isArray(users) ? users : []).filter(user => 
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.id.toLowerCase().includes(searchQuery.toLowerCase())
  )
  return (
    <div className="space-y-8 animate-slide-up pb-10">
      
      {/* ── HEADER SECTION ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-1 text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-secondary-500 uppercase tracking-widest leading-none">Painter Directory</h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Professional Database Management • {users.length} Registered Entities</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
           <div className="bg-white border border-slate-200 rounded flex items-center px-5 py-3 shadow-sm group focus-within:ring-2 focus-within:ring-primary-100 transition-all flex-1 sm:flex-none">
              <Search size={16} className="text-slate-400 group-focus-within:text-primary-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Lookup Name or ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-[11px] font-bold ml-3 w-full sm:w-64 text-secondary-500 placeholder:text-slate-300 uppercase tracking-tight" 
              />
           </div>
           <button className="h-12 w-full sm:w-12 bg-white border border-slate-200 rounded flex items-center justify-center text-slate-400 hover:text-primary-500 transition-all shadow-sm">
             <Filter size={18} />
           </button>
        </div>
      </div>

      {/* ── TABLE INFRASTRUCTURE ── */}
      <div className="bento-card overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto no-scrollbar">
             <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50 border-b border-slate-100 whitespace-nowrap">
                   <tr>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] min-w-[250px]">Painter Identity</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] min-w-[150px]">Operational Status</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] min-w-[150px]">Action Center</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] min-w-[150px]">Management</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {loading ? (
                     <tr>
                       <td colSpan={4} className="px-8 py-20 text-center">
                         <Loader2 size={32} className="animate-spin text-primary-500 mx-auto" />
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Accessing Database Registry...</p>
                       </td>
                     </tr>
                   ) : filteredUsers.length > 0 ? (
                     filteredUsers.map((user, i) => (
                       <tr key={user.id || i} className="hover:bg-slate-50 transition-all group border-l-4 border-l-transparent hover:border-l-primary-500">
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 border-2 border-slate-50 shadow-sm">
                                   <User size={20} />
                                </div>
                                <div className="text-left">
                                   <p className="text-sm font-black text-secondary-500 uppercase tracking-tight leading-none">{user.first_name} {user.last_name}</p>
                                   <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.25em] mt-2">{user.email}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-3">
                                <div className={`h-2.5 w-2.5 rounded-full ${user.status === 'active' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-slate-300'}`} />
                                <span className="text-[10px] font-black text-secondary-500 uppercase tracking-widest">{user.status}</span>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <button className="bg-slate-50 border border-slate-100 text-slate-400 px-3 py-1.5 rounded text-[9px] font-black uppercase tracking-[0.2em] group-hover:bg-white group-hover:text-primary-500 group-hover:border-primary-500/20 transition-all shadow-sm">VIEW_PROFILE</button>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex gap-2">
                                <button className="h-10 w-10 bg-white border border-slate-100 rounded flex items-center justify-center text-slate-300 hover:text-secondary-500 hover:border-slate-300 hover:shadow-md transition-all active:scale-95"><ArrowUpRight size={18} /></button>
                                <button className="h-10 w-10 bg-white border border-slate-100 rounded flex items-center justify-center text-slate-300 hover:text-primary-500 hover:border-primary-500 hover:shadow-md transition-all active:scale-95"><MoreHorizontal size={18} /></button>
                             </div>
                          </td>
                       </tr>
                     ))
                   ) : (
                     <tr>
                       <td colSpan={4} className="px-8 py-20 text-center text-slate-400 uppercase text-[10px] font-bold tracking-widest">
                         Zero matches found in current sector.
                       </td>
                     </tr>
                   )}
                </tbody>
             </table>
          </div>
          <div className="p-8 bg-slate-50/30 flex justify-between items-center border-t border-slate-100">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em] leading-none">SHIPPING INDICES 001-004 // {users.length} MASTER LIST</p>
             <div className="flex gap-3">
                <button className="h-10 px-6 bg-white border border-slate-200 rounded text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 shadow-sm">PREV_NODE</button>
                <button className="h-10 px-6 bg-secondary-500 rounded text-[10px] font-black text-white uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95">NEXT_NODE</button>
             </div>
          </div>
       </div>

      {/* ── METRICS & UTILITIES ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bento-card p-8 bg-secondary-900 border-none relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 h-48 w-48 bg-primary-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="relative z-10 flex flex-col justify-between h-full text-left">
               <div className="flex justify-between items-start">
                  <div className="h-12 w-12 bg-white/5 rounded border border-white/10 flex items-center justify-center text-white shadow-inner group-hover:scale-110 transition-transform">
                    <Shield size={24} />
                  </div>
                  <div className="text-right">
                     <p className="text-4xl font-black text-primary-500 leading-none">100%</p>
                     <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mt-3">Compliance Score</p>
                  </div>
               </div>
               <div className="pt-12">
                  <h3 className="text-xl font-black text-white uppercase tracking-[0.3em] leading-none">Security Validation</h3>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-3 leading-relaxed">March Cycle complete: All {users.length} accounts audited against global registry standards.</p>
               </div>
            </div>
         </div>

         <div className="bento-card p-10 space-y-8 bg-white shadow-lg">
            <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] border-b border-slate-50 pb-6 text-left">INTERNAL_OPS_V3</h4>
            <div className="grid grid-cols-2 gap-4">
               <UtilityAction icon={<Mail size={16} />} label="System Notify" />
               <UtilityAction icon={<Phone size={16} />} label="SMS Update" />
               <UtilityAction icon={<CheckCircle2 size={16} />} label="Verify All" />
               <UtilityAction icon={<XCircle size={16} />} label="Suspend Ops" />
            </div>
         </div>
      </div>

    </div>
  )
}

function UtilityAction({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="p-5 bg-slate-50 rounded border border-slate-100 group hover:bg-white hover:border-primary-500 hover:shadow-xl transition-all cursor-pointer flex items-center gap-4 active:scale-95">
       <div className="text-slate-300 group-hover:text-primary-500 transition-all transform group-hover:scale-110">{icon}</div>
       <span className="text-[10px] font-black text-secondary-500 uppercase tracking-widest leading-none pt-0.5">{label}</span>
    </div>
  )
}

function User(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
