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
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = (Array.isArray(users) ? users : []).filter(user => 
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-10 animate-slide-up pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 text-left">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 tracking-tight leading-none">Account Registry</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage platform users and access levels.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
           <div className="bg-white border border-slate-200 rounded-xl flex items-center px-4 py-2.5 shadow-sm group focus-within:ring-4 focus-within:ring-primary-50 transition-all flex-1 sm:flex-none">
              <Search size={18} className="text-slate-400 group-focus-within:text-primary-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search database..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm font-medium ml-3 w-full sm:w-64 text-secondary-900 placeholder:text-slate-300 tracking-tight" 
              />
           </div>
           <button className="h-11 w-full sm:w-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary-500 transition-all shadow-sm">
             <Filter size={18} />
           </button>
        </div>
      </div>

      {/* Registry Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all">
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/30 border-b border-slate-100 whitespace-nowrap">
                   <tr>
                      <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] min-w-[250px]">Professional Profile</th>
                      <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] min-w-[150px]">Status</th>
                      <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] min-w-[150px]">Management</th>
                      <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] min-w-[150px]">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {loading ? (
                     <tr>
                       <td colSpan={4} className="px-10 py-24 text-center">
                         <Loader2 size={32} className="animate-spin text-primary-500 mx-auto" />
                         <p className="text-xs font-bold text-slate-400 mt-6 uppercase tracking-widest">Accessing records...</p>
                       </td>
                     </tr>
                   ) : filteredUsers.length > 0 ? (
                     filteredUsers.map((user, i) => (
                       <tr key={user.id || i} className="hover:bg-slate-50/50 transition-all group">
                          <td className="px-10 py-8">
                             <div className="flex items-center gap-5">
                                <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-50 shadow-sm group-hover:bg-primary-500 group-hover:text-white transition-all">
                                   <UserIcon size={20} />
                                </div>
                                <div>
                                   <p className="text-sm font-bold text-secondary-900 leading-none group-hover:text-primary-500 transition-colors uppercase tracking-tight">{user.first_name} {user.last_name}</p>
                                   <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{user.email}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-10 py-8">
                             <div className="flex items-center gap-3">
                                <div className={`h-2.5 w-2.5 rounded-full ${user.status === 'active' ? 'bg-green-500 shadow-sm' : 'bg-slate-200'}`} />
                                <span className="text-[10px] font-bold text-secondary-900 uppercase tracking-[0.1em]">{user.status}</span>
                             </div>
                          </td>
                          <td className="px-10 py-8">
                             <button className="bg-white border border-slate-200 text-slate-500 px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:border-primary-500 hover:text-primary-500 transition-all shadow-sm active:scale-95">View Profile</button>
                          </td>
                          <td className="px-10 py-8">
                             <div className="flex gap-3">
                                <button className="h-10 w-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 hover:text-secondary-900 hover:border-slate-300 transition-all active:scale-95 shadow-sm"><ArrowUpRight size={18} /></button>
                                <button className="h-10 w-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 hover:text-primary-500 hover:border-primary-500 transition-all active:scale-95 shadow-sm"><MoreHorizontal size={18} /></button>
                             </div>
                          </td>
                       </tr>
                     ))
                   ) : (
                     <tr>
                       <td colSpan={4} className="px-10 py-24 text-center">
                         <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No matching records found</p>
                       </td>
                     </tr>
                   )}
                </tbody>
             </table>
          </div>
          <div className="p-8 bg-slate-50/30 flex justify-between items-center border-t border-slate-50">
             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Database Content: {filteredUsers.length} Users</p>
             <div className="flex gap-3">
                <button className="h-11 px-8 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-secondary-900 transition-all active:scale-95 shadow-sm uppercase tracking-widest">Previous</button>
                <button className="h-11 px-8 bg-secondary-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all shadow-xl active:scale-95 uppercase tracking-widest">Next Page</button>
             </div>
          </div>
       </div>

      {/* Status Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
         <div className="p-10 bg-secondary-900 rounded-3xl relative overflow-hidden group shadow-xl">
            <div className="absolute top-0 right-0 h-64 w-64 bg-primary-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex flex-col justify-between h-full space-y-12">
               <div className="flex justify-between items-start">
                  <div className="h-14 w-14 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-white shadow-inner group-hover:scale-110 transition-transform">
                    <Shield size={28} />
                  </div>
                  <div className="text-right">
                     <p className="text-4xl font-bold text-primary-500 leading-none tabular-nums">100%</p>
                     <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-3">Compliance</p>
                  </div>
               </div>
               <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-white tracking-tight">System Integrity</h3>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-sm">All user accounts are automatically audited and verified against standard safety protocols.</p>
               </div>
            </div>
         </div>

         <div className="p-10 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-10 group hover:shadow-xl transition-all">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-6">Bulk Management Tools</h4>
            <div className="grid grid-cols-2 gap-4">
               <UtilityAction icon={<Mail size={18} />} label="Notify All" />
               <UtilityAction icon={<Phone size={18} />} label="Direct SMS" />
               <UtilityAction icon={<CheckCircle2 size={18} />} label="Force Verify" />
               <UtilityAction icon={<XCircle size={18} />} label="Suspend All" />
            </div>
         </div>
      </div>

    </div>
  )
}

function UtilityAction({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 group/item hover:bg-white hover:border-primary-500 hover:shadow-lg transition-all cursor-pointer flex items-center gap-4 active:scale-95 shadow-sm">
       <div className="text-slate-400 group-hover/item:text-primary-500 transition-all">{icon}</div>
       <span className="text-[10px] font-bold text-secondary-900 uppercase tracking-widest">{label}</span>
    </div>
  )
}

function UserIcon(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
