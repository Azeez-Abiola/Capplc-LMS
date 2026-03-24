import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Shield, ArrowUpRight, MoreHorizontal, X, Mail, Phone, MapPin, Calendar, Info } from 'lucide-react'
import LogoLoader from '../../components/ui/LogoLoader'
import { userService } from '../../services/userService'
import CustomDropdown from '../../components/ui/CustomDropdown'
import type { UserProfile } from '../../services/userService'
import { toast } from 'react-hot-toast'

export default function UserManagement() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [filterRole, setFilterRole] = useState('All')
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [actionMenu, setActionMenu] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState<Partial<UserProfile>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const usersPerPage = 5

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await userService.getAllUsers()
      setUsers(Array.isArray(data) ? data : [])
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to fetch users')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (user: UserProfile) => {
    const isActivating = user.status !== 'active'
    const action = isActivating ? 'activate' : 'deactivate'
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return
    
    try {
      if (isActivating) {
        await userService.updateUser(user.id, { status: 'active' })
      } else {
        await userService.deactivateUser(user.id)
      }
      toast.success(`User ${action}d successfully`)
      fetchUsers()
      setActionMenu(null)
    } catch (error: any) {
      toast.error(`Failed to ${action} user`)
    }
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return
    setIsSubmitting(true)
    try {
      await userService.updateUser(selectedUser.id, editFormData)
      toast.success('User updated successfully')
      setIsEditing(false)
      fetchUsers()
    } catch (error: any) {
      toast.error('Failed to update user')
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEditModal = (user: UserProfile) => {
    setSelectedUser(user)
    setEditFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      status: user.status
    })
    setIsEditing(true)
  }

  const filteredUsers = (Array.isArray(users) ? users : []).filter(user => {
    const matchesSearch = `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) || user.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === 'All' || user.role === filterRole
    return matchesSearch && matchesRole
  })

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)

  return (
    <>
      <div className="space-y-10 animate-slide-up pb-10">
        
        {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 text-left">
        <div className="text-left">
          <h1 className="text-xl font-bold text-secondary-900 tracking-tight leading-none  text-left">Your Team</h1>
          <p className="text-slate-500 text-xs font-medium mt-1 text-left">Manage professional painters and staff within your company.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
           <div className="bg-white border border-slate-200 rounded-xl flex items-center px-4 py-2.5 shadow-sm group focus-within:ring-4 focus-within:ring-primary-50 transition-all w-full sm:w-64">
              <Search size={18} className="text-slate-400 group-focus-within:text-primary-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search team..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm font-medium ml-3 w-full text-secondary-900 placeholder:text-slate-300 tracking-tight" 
              />
           </div>
           <div className="relative shrink-0 w-full sm:w-48 text-left">
              <CustomDropdown
                value={filterRole}
                onChange={(val) => { setFilterRole(val); setCurrentPage(1); }}
                options={[
                  { id: 'All', label: 'All Roles', icon: <Filter size={14} /> },
                  { id: 'admin', label: 'Admin' },
                  { id: 'user', label: 'User' },
                ]}
                className="!space-y-0"
              />
           </div>
        </div>
      </div>

      {/* Registry Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all">
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/30 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 whitespace-nowrap">
                   <tr>
                      <th className="px-10 py-6 text-[11px] font-bold text-slate-400 dark:text-slate-500   min-w-[250px]">Professional Profile</th>
                      <th className="px-10 py-6 text-[11px] font-bold text-slate-400 dark:text-slate-500   min-w-[150px]">Status</th>
                      <th className="px-10 py-6 text-[11px] font-bold text-slate-400 dark:text-slate-500   min-w-[150px]">Management</th>
                      <th className="px-10 py-6 text-[11px] font-bold text-slate-400 dark:text-slate-500   min-w-[150px]">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                   {loading ? (
                     <tr>
                       <td colSpan={4} className="px-10 py-24 text-center">
                         <LogoLoader fullscreen />
                       </td>
                     </tr>
                   ) : paginatedUsers.length > 0 ? (
                     paginatedUsers.map((user, i) => (
                       <tr key={user.id || i} className="hover:bg-slate-50/50 transition-all group cursor-pointer" onClick={() => setSelectedUser(user)}>
                          <td className="px-10 py-8">
                             <div className="flex items-center gap-5">
                                <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-50 shadow-sm group-hover:bg-primary-500 group-hover:text-white transition-all">
                                   <UserIcon size={20} />
                                </div>
                                <div>
                                   <p className="text-sm font-bold text-secondary-900 leading-none group-hover:text-primary-500 transition-colors  tracking-tight">{user.first_name} {user.last_name}</p>
                                   <p className="text-[11px] font-bold text-slate-400 mt-2  ">{user.email}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-10 py-8">
                             <div className="flex items-center gap-3">
                                <div className={`h-2.5 w-2.5 rounded-full ${user.status === 'active' ? 'bg-green-500 shadow-sm' : 'bg-slate-200'}`} />
                                <span className="text-[11px] font-bold text-secondary-900  ">{user.status}</span>
                             </div>
                          </td>
                          <td className="px-10 py-8">
                             <button className="bg-white border border-slate-200 text-slate-500 px-5 py-2 rounded-xl text-[11px] font-bold   hover:border-primary-500 hover:text-primary-500 transition-all shadow-sm active:scale-95">View Profile</button>
                          </td>
                          <td className="px-10 py-8">
                             <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                                 <button 
                                   onClick={() => setSelectedUser(user)}
                                   className="h-10 w-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 hover:text-secondary-900 hover:border-slate-300 transition-all active:scale-95 shadow-sm"
                                 >
                                   <ArrowUpRight size={18} />
                                 </button>
                                 <div className="relative">
                                    <button 
                                      type="button"
                                      onClick={(e) => { 
                                        e.stopPropagation(); 
                                        setActionMenu(actionMenu === user.id ? null : user.id); 
                                      }}
                                      className="h-10 w-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 hover:text-primary-500 hover:border-primary-500 transition-all shadow-sm"
                                    >
                                      <MoreHorizontal size={18} />
                                    </button>
                                    
                                    {actionMenu === user.id && (
                                       <div 
                                         className="absolute mt-2 right-0 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-[100] p-2 animate-slide-up" 
                                         onClick={(e) => e.stopPropagation()}
                                       >
                                           <button 
                                             type="button"
                                             className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50 hover:text-primary-500 rounded-lg transition-all  " 
                                             onClick={() => { setActionMenu(null); navigate(`/admin/users/${user.id}`); }}
                                           >
                                             See Full Info
                                           </button>
                                           <button 
                                             type="button"
                                             className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50 hover:text-primary-500 rounded-lg transition-all  " 
                                             onClick={() => { setActionMenu(null); openEditModal(user); }}
                                           >
                                             Edit member
                                           </button>
                                           <div className="h-px bg-slate-50 my-1"/>
                                           <button 
                                             type="button"
                                             className={`w-full text-left px-4 py-2.5 text-[11px] font-bold ${user.status === 'active' ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'} rounded-lg transition-all  `} 
                                             onClick={() => { setActionMenu(null); handleToggleStatus(user); }}
                                           >
                                             {user.status === 'active' ? 'Deactivate' : 'Activate'} account
                                           </button>
                                       </div>
                                    )}
                                 </div>
                             </div>
                          </td>
                       </tr>
                     ))
                   ) : (
                     <tr>
                       <td colSpan={4} className="px-10 py-24 text-center">
                         <p className="text-sm font-bold text-slate-400  ">No matching records found</p>
                       </td>
                     </tr>
                   )}
                </tbody>
             </table>
          </div>
          <div className="p-8 bg-slate-50/30 dark:bg-white/5 flex justify-between items-center border-t border-slate-50 dark:border-white/5">
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-600  ">Database Content: {filteredUsers.length} Users</p>
             <div className="flex gap-3">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-11 px-8 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed hover:text-secondary-900 dark:hover:text-white transition-all active:scale-95 shadow-sm  "
                >
                  Previous
                </button>
                <div className="h-11 flex items-center justify-center px-4 text-xs font-bold text-secondary-900 dark:text-white">{currentPage} / {totalPages || 1}</div>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="h-11 px-8 bg-secondary-900 dark:bg-primary-500 text-white rounded-xl text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black dark:hover:bg-primary-600 transition-all shadow-xl active:scale-95  "
                >
                  Next Page
                </button>
             </div>
          </div>
       </div>
      </div>

       {/* User Detail Modal */}
        {selectedUser && !isEditing && (
           <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedUser(null)}>
              <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl animate-slide-up overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="h-24 bg-slate-50 border-b border-slate-100 relative">
                   <button onClick={() => setSelectedUser(null)} className="absolute top-6 right-6 h-10 w-10 bg-white border border-slate-200 hover:bg-slate-50 text-slate-400 rounded-full flex items-center justify-center transition-all z-10">
                      <X size={18} />
                   </button>
                   <div className="absolute -bottom-8 left-10">
                      <div className="h-20 w-20 rounded-2xl bg-white p-1 shadow-2xl">
                         <div className="h-full w-full bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center border border-primary-100">
                            <UserIcon size={28} />
                         </div>
                      </div>
                   </div>
                </div>

                {/* Modal Content */}
                <div className="pt-12 pb-10 px-10 text-left">
                   <div className="flex justify-between items-start mb-10">
                      <div className="space-y-1">
                         <h2 className="text-3xl font-black text-secondary-900 tracking-tight flex items-center gap-3 lowercase">
                            <span className="capitalize">{selectedUser.first_name}</span> <span className="capitalize">{selectedUser.last_name}</span>
                            {selectedUser.role === 'admin' && <Shield size={20} className="text-primary-500" />}
                         </h2>
                         <p className="text-slate-400 font-bold   text-[11px]">{selectedUser.role} Account • ID: {selectedUser.id.slice(0,8)}</p>
                      </div>
                      <div className={`px-4 py-2 rounded-xl text-[11px] font-bold   border ${selectedUser.status === 'active' ? 'bg-green-50 text-green-500 border-green-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                         {selectedUser.status}
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-8 mb-10 pb-10 border-b border-slate-50">
                      <DetailItem icon={<Mail size={16}/>} label="Email Address" value={selectedUser.email} />
                      <DetailItem icon={<Phone size={16}/>} label="Phone Number" value={selectedUser.phone || 'Not provided'} />
                      <DetailItem icon={<MapPin size={16}/>} label="Primary Location" value={selectedUser.city && selectedUser.state ? `${selectedUser.city}, ${selectedUser.state}` : selectedUser.state || 'Not provided'} />
                      <DetailItem icon={<Calendar size={16}/>} label="Member Since" value={new Date(selectedUser.created_at || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} />
                   </div>

                   <div className="flex gap-4">
                      <button 
                        onClick={() => { setSelectedUser(null); navigate(`/admin/users/${selectedUser.id}`); }}
                        className="flex-1 h-14 bg-secondary-900 text-white font-bold rounded-xl text-[11px]   shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 hover:bg-black"
                      >
                         <Info size={16} /> See Full Info
                      </button>
                      <button 
                        onClick={() => openEditModal(selectedUser)}
                        className="flex-1 h-14 bg-primary-500 text-white font-bold rounded-xl text-[11px]   shadow-xl shadow-primary-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 hover:bg-primary-600"
                      >
                         Edit
                      </button>
                   </div>
                </div>
             </div>
          </div>
       )}

       {/* Edit User Modal */}
        {isEditing && selectedUser && (
           <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditing(false)}>
              <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-slide-up p-8 relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setIsEditing(false)} className="absolute top-6 right-6 text-slate-400 hover:text-secondary-900 transition-colors">
                   <X size={20} />
                </button>
                <div className="h-12 w-12 bg-primary-500/10 text-primary-500 rounded-xl flex items-center justify-center mb-6">
                   <Shield size={24} />
                </div>
                <div className="text-left mb-8">
                  <h3 className="text-xl font-bold text-secondary-900 tracking-tight leading-none mb-2">Edit User Access</h3>
                  <p className="text-sm font-medium text-slate-500 leading-relaxed">Update professional permissions and account status for {selectedUser.first_name}.</p>
                </div>

                <form onSubmit={handleUpdateUser} className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 text-left">
                         <label className="text-[11px] font-bold text-slate-400  ">First Name</label>
                         <input 
                           type="text" 
                           value={editFormData.first_name}
                           onChange={(e) => setEditFormData({...editFormData, first_name: e.target.value})}
                           className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                         />
                      </div>
                      <div className="space-y-2 text-left">
                         <label className="text-[11px] font-bold text-slate-400  ">Last Name</label>
                         <input 
                           type="text" 
                           value={editFormData.last_name}
                           onChange={(e) => setEditFormData({...editFormData, last_name: e.target.value})}
                           className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                         />
                      </div>
                   </div>

                   <div className="space-y-2 text-left">
                      <label className="text-[11px] font-bold text-slate-400  ">Role Type</label>
                      <select 
                        value={editFormData.role}
                        onChange={(e) => setEditFormData({...editFormData, role: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                      >
                         <option value="painter">Professional Painter</option>
                         <option value="admin">Company Admin</option>
                      </select>
                   </div>

                   <div className="space-y-2 text-left">
                      <label className="text-[11px] font-bold text-slate-400  ">Account Status</label>
                      <select 
                        value={editFormData.status}
                        onChange={(e) => setEditFormData({...editFormData, status: e.target.value as any})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                      >
                         <option value="active">Active</option>
                         <option value="suspended">Suspended</option>
                         <option value="inactive">Inactive</option>
                      </select>
                   </div>

                   <button 
                     disabled={isSubmitting}
                     type="submit"
                     className="w-full h-14 bg-secondary-900 hover:bg-black text-white font-bold rounded-xl text-xs   transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2"
                   >
                      {isSubmitting ? <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Save Changes'}
                   </button>
                </form>
              </div>
           </div>
        )}
    </>
  )
}

function DetailItem({ icon, label, value }: { icon: any, label: string, value: string }) {
   return (
      <div className="flex gap-4 group">
         <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-500 transition-all border border-slate-100">
            {icon}
         </div>
         <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400  ">{label}</p>
            <p className="text-sm font-bold text-secondary-900 truncate max-w-[180px] text-ellipsis overflow-hidden">{value}</p>
         </div>
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
