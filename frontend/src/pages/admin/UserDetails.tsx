import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  User,
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  ChevronLeft,
  Shield,
  Award,
  Zap,
  BookOpen,
  MessageCircle,
  Briefcase,
  History,
  Edit3,
  X,
  UserCheck
} from 'lucide-react'
import LogoLoader from '../../components/ui/LogoLoader'
import { userService, type UserProfile } from '../../services/userService'
import { toast } from 'react-hot-toast'

export default function UserDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  
  // Edit form state
  const [formData, setFormData] = useState<any>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (id) fetchUser()
  }, [id])

  const fetchUser = async () => {
    try {
      setLoading(true)
      const data = await userService.getUserById(id!)
      setUser(data)
      setFormData(data)
    } catch (error) {
      toast.error('Failed to load user details')
      navigate('/admin/users')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await userService.updateUser(user!.id, formData)
      toast.success('User updated successfully')
      setIsEditModalOpen(false)
      fetchUser() // Refresh data
    } catch (error) {
      toast.error('Failed to update user')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <LogoLoader fullscreen />
  }

  if (!user) return null

  return (
    <div className="animate-slide-up space-y-10 pb-20">
      {/* Navigation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-8 text-left gap-6">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/admin/users')}
            className="h-12 w-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-secondary-900 transition-all shadow-sm active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-secondary-900 tracking-tight leading-none lowercase">
               <span className="capitalize">{user.first_name}</span> <span className="capitalize">{user.last_name}</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{user.role} Account • Registry ID: {user.id.slice(0, 8)}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <button 
             onClick={() => setIsEditModalOpen(true)}
             className="h-12 px-8 bg-white border border-slate-200 text-secondary-900 font-bold rounded-xl text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2 active:scale-95"
           >
              <Edit3 size={14} /> Edit Business Profile
           </button>
           <div className={`px-5 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border shadow-sm ${user.status === 'active' ? 'bg-green-50 text-green-500 border-green-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
              {user.status}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Info Card */}
        <div className="lg:col-span-1 space-y-10">
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm text-left relative overflow-hidden">
             <div className="absolute top-0 right-0 h-32 w-32 bg-slate-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             
             <div className="h-24 w-24 bg-primary-50 text-primary-500 border border-primary-100 rounded-3xl flex items-center justify-center mb-8 mx-0 relative z-10">
                <User size={40} />
             </div>
             
             <div className="space-y-8 relative z-10">
                <InfoItem icon={<Mail size={16}/>} label="Email Address" value={user.email} />
                <InfoItem icon={<Phone size={16}/>} label="Direct Phone" value={user.phone || 'Not provided'} />
                <InfoItem icon={<MessageCircle size={16}/>} label="WhatsApp Line" value={user.whatsapp_number || 'Not linked'} />
                <InfoItem icon={<MapPin size={16}/>} label="Location Registry" value={user.city && user.state ? `${user.city}, ${user.state}` : user.state || 'Not specified'} />
                <InfoItem icon={<Calendar size={16}/>} label="Registered On" value={new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} />
             </div>
          </div>

          <div className="bg-secondary-900 rounded-[2.5rem] p-10 text-left shadow-2xl relative overflow-hidden group">
             <div className="relative z-10">
                <div className="h-12 w-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-8">
                   <Shield className="text-primary-500" size={24} />
                </div>
                <h3 className="text-white text-xl font-bold tracking-tight mb-2">Access Control</h3>
                <p className="text-white/40 text-xs font-medium leading-relaxed mb-8">This user has {user.role} level permissions within the enterprise registry system.</p>
                <div className="flex flex-wrap gap-2">
                   <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-primary-500 text-[9px] font-bold uppercase tracking-widest">
                      {user.role} Verified
                   </div>
                   <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/40 text-[9px] font-bold uppercase tracking-widest">
                      {user.status === 'active' ? 'Account Active' : 'Restricted'}
                   </div>
                </div>
             </div>
             <div className="absolute top-0 right-0 h-40 w-40 bg-primary-500/10 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2 group-hover:bg-primary-500/20 transition-all duration-700" />
          </div>
        </div>

        {/* Activity & Performance */}
        <div className="lg:col-span-2 space-y-10">
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatCard icon={<BookOpen size={20}/>} label="Modules Taken" value="12" />
              <StatCard icon={<Award size={20}/>} label="Certificates" value="4" />
              <StatCard icon={<Zap size={20}/>} label="Engagement" value="High" />
           </div>

           <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 text-left shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-sm font-bold text-secondary-900 uppercase tracking-widest">Professional Summary</h3>
                 <Briefcase size={18} className="text-slate-200" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                 <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Primary Specialty</p>
                    <p className="text-base font-bold text-secondary-900 lowercase"><span className="capitalize">{user.specialty || 'General Professional'}</span></p>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Years of Experience</p>
                    <p className="text-base font-bold text-secondary-900">{user.years_of_experience || '0'} Years Pro</p>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Interests</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                       {user.interests && user.interests.length > 0 ? user.interests.map((it, idx) => (
                          <span key={idx} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-slate-100">{it}</span>
                       )) : <p className="text-xs text-slate-400 font-medium">None listed</p>}
                    </div>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Onboarding Status</p>
                    <div className="flex items-center gap-2 mt-2">
                       {user.onboarding_completed ? (
                          <span className="flex items-center gap-1.5 text-green-500 text-[10px] font-bold uppercase"><UserCheck size={14}/> Completed</span>
                       ) : (
                          <span className="flex items-center gap-1.5 text-orange-400 text-[10px] font-bold uppercase"><History size={14}/> In Progress</span>
                       )}
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-slate-50/50 rounded-[2.5rem] border border-slate-100 p-12 text-center relative overflow-hidden">
              <div className="max-w-xs mx-auto space-y-4 relative z-10">
                 <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-slate-200 mx-auto shadow-sm">
                    <History size={32} />
                 </div>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Activity Log Preview</p>
                 <p className="text-xs font-medium text-slate-400 leading-relaxed">System is synchronizing latest course progress and platform interactions for this profile.</p>
              </div>
              <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-secondary-900/5 rounded-full blur-[40px]" />
           </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)}>
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl animate-slide-up p-10 relative" onClick={(e) => e.stopPropagation()}>
             <button onClick={() => setIsEditModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-secondary-900 transition-all">
                <X size={20} />
             </button>
             
             <div className="text-left mb-10">
                <div className="h-12 w-12 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                   <Edit3 size={24} />
                </div>
                <h3 className="text-2xl font-black text-secondary-900 tracking-tight leading-none mb-3">Update Profile</h3>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">Amend professional designations and contact information for this registry record.</p>
             </div>

             <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2 text-left">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">First Name</label>
                      <input 
                        type="text" 
                        value={formData.first_name || ''}
                        onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-primary-50 outline-none transition-all"
                        placeholder="John"
                      />
                   </div>
                   <div className="space-y-2 text-left">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Name</label>
                      <input 
                        type="text" 
                        value={formData.last_name || ''}
                        onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-primary-50 outline-none transition-all"
                        placeholder="Doe"
                      />
                   </div>
                   <div className="space-y-2 text-left">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</label>
                      <input 
                        type="tel" 
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-primary-50 outline-none transition-all"
                        placeholder="+234..."
                      />
                   </div>
                   <div className="space-y-2 text-left">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Status</label>
                      <select 
                        value={formData.status || 'active'}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-primary-50 outline-none transition-all"
                      >
                         <option value="active">Active</option>
                         <option value="suspended">Suspended</option>
                         <option value="inactive">Inactive</option>
                      </select>
                   </div>
                   <div className="space-y-2 text-left">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Specialty</label>
                      <input 
                        type="text" 
                        value={formData.specialty || ''}
                        onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-primary-50 outline-none transition-all"
                        placeholder="e.g. Master Painter"
                      />
                   </div>
                   <div className="space-y-2 text-left">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Direct City</label>
                      <input 
                        type="text" 
                        value={formData.city || ''}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-primary-50 outline-none transition-all"
                        placeholder="e.g. Ikeja"
                      />
                   </div>
                </div>

                <div className="pt-6">
                   <button 
                     disabled={isSubmitting}
                     type="submit" 
                     className="w-full h-14 bg-secondary-900 text-white font-bold rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50"
                   >
                      {isSubmitting ? 'Syncing...' : 'Save Registry Updates'}
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  )
}

function InfoItem({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="h-10 w-10 shrink-0 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-bold text-secondary-900 break-all">{value}</p>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-left hover:shadow-xl transition-all group">
       <div className="h-10 w-10 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all shadow-sm">
          {icon}
       </div>
       <p className="text-2xl font-black text-secondary-900 leading-none mb-1">{value}</p>
       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
    </div>
  )
}

