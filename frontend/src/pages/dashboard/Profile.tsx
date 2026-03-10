import { Edit3, Briefcase, Award, ShieldCheck, Globe, Lock, Bell, Eye, Loader2, CheckCircle2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { authService } from '../../services/authService'
import { userService } from '../../services/userService'
import { toast } from 'react-hot-toast'

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '', phone: '', specialization: '', location: '' })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getCurrentUser()
        setUser(data)
        setFormData({
          first_name: data?.user_metadata?.first_name || '',
          last_name: data?.user_metadata?.last_name || '',
          email: data?.email || '',
          phone: data?.user_metadata?.phone || '',
          specialization: data?.user_metadata?.specialization || 'Luxury Residential',
          location: data?.user_metadata?.location || 'Lagos, Nigeria',
        })
      } catch (error) {
        console.error('Profile fetch error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleUpdateProfile = async () => {
    try {
      await userService.updateProfile(formData)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 size={32} className="animate-spin text-primary-500" />
        <p className="text-xs font-medium text-slate-400">Loading your profile...</p>
      </div>
    )
  }

  const firstName = formData.first_name || 'Painter'
  const lastName = formData.last_name || ''
  const painterId = user?.id?.substring(0, 6).toUpperCase() || 'PRO'

  return (
    <div className="space-y-10 animate-slide-up pb-10">
      
      {/* Profile Header */}
      <div className="flex flex-col lg:flex-row items-center gap-8 pb-10 border-b border-slate-100">
         <div className="relative shrink-0">
            <div className="h-32 w-32 rounded-3xl bg-white border border-slate-200 p-1 shadow-sm overflow-hidden relative z-10 transition-transform hover:scale-105 duration-500">
               <div className="h-full w-full bg-primary-100 rounded-2xl flex items-center justify-center text-primary-500 text-3xl font-bold">
                 {firstName.charAt(0)}{lastName.charAt(0)}
               </div>
            </div>
            <button className="absolute -bottom-2 -right-2 h-10 w-10 bg-primary-500 text-white rounded-xl flex items-center justify-center border-4 border-white shadow-lg hover:bg-primary-600 transition-all z-20">
               <Edit3 size={18} />
            </button>
         </div>

         <div className="flex-1 text-center lg:text-left space-y-4">
            <div className="space-y-2">
               <h1 className="text-3xl font-bold text-secondary-900 leading-none">{firstName} {lastName}</h1>
               <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
                  <span className="bg-primary-500 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">Certified Professional</span>
                  <span className="bg-secondary-900 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">ID: {painterId}</span>
               </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-2xl font-medium">
              Professional painter specialized in {formData.specialization.toLowerCase()} projects based in {formData.location}.
            </p>
         </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-2 p-1 bg-slate-100/50 rounded-2xl w-fit">
         {[
           { id: 'profile', label: 'Basic Info', icon: <Briefcase size={14} /> },
           { id: 'security', label: 'Security', icon: <Lock size={14} /> },
           { id: 'notifications', label: 'Notifications', icon: <Bell size={14} /> },
         ].map((tab) => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-white text-primary-500 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-secondary-900'}`}
           >
             {tab.icon} {tab.label}
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
         
         {/* Main Form Area */}
         <div className="lg:col-span-8 space-y-8">
            
            {activeTab === 'profile' && (
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-8 animate-slide-up text-left">
                 <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                    <h3 className="text-sm font-bold text-secondary-900 uppercase tracking-widest">Personal Information</h3>
                    <div className="flex items-center gap-2">
                       <ShieldCheck size={16} className="text-green-500" />
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Account</span>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <DetailGroup label="First Name" value={formData.first_name} onChange={(v) => setFormData({...formData, first_name: v})} />
                    <DetailGroup label="Last Name" value={formData.last_name} onChange={(v) => setFormData({...formData, last_name: v})} />
                    <DetailGroup label="Email Address" value={formData.email} type="email" onChange={(v) => setFormData({...formData, email: v})} />
                    <DetailGroup label="Phone Number" value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} />
                    <DetailGroup label="Specialization" value={formData.specialization} onChange={(v) => setFormData({...formData, specialization: v})} />
                    <DetailGroup label="Location" value={formData.location} onChange={(v) => setFormData({...formData, location: v})} />
                 </div>

                 <div className="pt-6 border-t border-slate-50 flex gap-4">
                    <button onClick={handleUpdateProfile} className="flex-1 h-12 bg-secondary-900 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-[0.98]">
                      Save Changes
                    </button>
                    <button className="px-10 h-12 bg-white border border-slate-200 text-slate-400 font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                      Reset
                    </button>
                 </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-8 animate-slide-up text-left">
                 <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                    <h3 className="text-sm font-bold text-secondary-900 uppercase tracking-widest">Security Settings</h3>
                    <div className="flex items-center gap-2">
                       <Lock size={16} className="text-primary-500" />
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secure Access</span>
                    </div>
                 </div>

                 <div className="space-y-6 max-w-md">
                    <DetailGroup label="Current Password" value="••••••••••••" isStatic />
                    <DetailGroup label="New Password" value="" placeholder="Enter new password" />
                    <DetailGroup label="Confirm Password" value="" placeholder="Confirm new password" />
                    
                    <button className="w-full h-12 bg-primary-500 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-primary-600 transition-all shadow-lg active:scale-[0.98]">
                       Update Password
                    </button>
                 </div>

                 <div className="pt-6 border-t border-slate-50">
                    <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                       <div className="flex items-center gap-4">
                          <Eye size={20} className="text-slate-400" />
                          <div className="space-y-0.5">
                             <p className="text-xs font-bold text-secondary-900 uppercase tracking-tight">Two-Factor Authentication</p>
                             <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Add an extra layer of security to your account.</p>
                          </div>
                       </div>
                       <button className="text-xs font-bold text-primary-500 uppercase tracking-widest hover:underline">Enable</button>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'notifications' && (
               <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-8 animate-slide-up text-left">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                    <h3 className="text-sm font-bold text-secondary-900 uppercase tracking-widest">Notification Preferences</h3>
                    <div className="flex items-center gap-2">
                       <Globe size={16} className="text-primary-500" />
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Always Connected</span>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <ToggleItem label="Course Updates" desc="New lessons and technical resources." active />
                    <ToggleItem label="Certification Alerts" desc="Updates on your badges and professional ladder." active />
                    <ToggleItem label="Security Alerts" desc="Important notifications about account access." active />
                    <ToggleItem label="Product News" desc="New product launches from CAP PLC." />
                 </div>

                 <button className="w-full h-12 bg-secondary-900 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-[0.98] shadow-lg">
                    Save Preferences
                 </button>
               </div>
            )}
         </div>

         {/* Sidebar Stats */}
         <div className="lg:col-span-4 space-y-8 text-left">
            <div className="bg-secondary-900 p-8 rounded-2xl text-white relative overflow-hidden group shadow-xl">
               <div className="absolute top-0 right-0 h-40 w-40 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
               <h3 className="text-[10px] font-bold uppercase tracking-widest mb-8 border-b border-white/10 pb-4 text-slate-500">Your Activity</h3>
               <div className="grid grid-cols-2 gap-8 relative z-10">
                  <WhiteStat icon={<Award size={24} />} label="Badges Earned" value="03" />
                  <WhiteStat icon={<ShieldCheck size={24} />} label="Total Points" value="1.2k" />
               </div>
               <div className="pt-8 mt-8 border-t border-white/5 relative z-10">
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-4">Account Status</p>
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                     <div className="h-10 w-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg">
                        <CheckCircle2 size={18} className="text-white" />
                     </div>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Identity Verified</p>
                  </div>
               </div>
            </div>

            <div className="bg-red-50 p-8 rounded-2xl border border-red-100">
               <h4 className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-4">Danger Zone</h4>
               <button className="w-full py-3 border border-red-200 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-all active:scale-[0.98]">
                  Delete Account
               </button>
            </div>
         </div>

      </div>
    </div>
  )
}

function DetailGroup({ label, value, type = 'text', placeholder = '', isStatic = false, onChange }: { label: string; value: string; type?: string; placeholder?: string; isStatic?: boolean; onChange?: (v: string) => void }) {
  return (
    <div className="space-y-2 text-left">
       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">{label}</label>
       {isStatic ? (
         <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 h-12 flex items-center text-xs font-bold text-slate-400 cursor-not-allowed">
           {value}
         </div>
       ) : (
         <input 
           type={type}
           value={value}
           onChange={(e) => onChange?.(e.target.value)}
           placeholder={placeholder}
           className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 h-12 text-xs font-bold text-secondary-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 outline-none transition-all placeholder:text-slate-300 placeholder:font-medium"
         />
       )}
    </div>
  )
}

function WhiteStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="space-y-3">
       <div className="text-primary-500">{icon}</div>
       <div className="space-y-1">
          <p className="text-3xl font-bold tracking-tight text-white leading-none">{value}</p>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
       </div>
    </div>
  )
}

function ToggleItem({ label, desc, active = false }: { label: string; desc: string; active?: boolean }) {
  const [isActive, setIsActive] = useState(active)
  return (
    <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white transition-all group text-left">
       <div className="space-y-1">
          <p className="text-xs font-bold text-secondary-900 uppercase tracking-tight">{label}</p>
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{desc}</p>
       </div>
       <button 
         onClick={() => setIsActive(!isActive)}
         className={`h-6 w-10 rounded-full relative transition-colors shrink-0 ml-4 ${isActive ? 'bg-primary-500 shadow-lg shadow-primary-500/30' : 'bg-slate-200'}`}
       >
          <div className={`absolute top-1 h-4 w-4 bg-white rounded-full transition-all shadow-sm ${isActive ? 'right-1' : 'left-1'}`} />
       </button>
    </div>
  )
}
