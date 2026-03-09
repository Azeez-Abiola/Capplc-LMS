import { Edit3, Mail, Phone, MapPin, Briefcase, Award, ShieldCheck, ChevronRight, Globe, Lock, Bell, Eye, Loader2, CheckCircle2 } from 'lucide-react'
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
        console.error('Failed to fetch profile:', error)
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
        <Loader2 size={40} className="animate-spin text-primary-500" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Accessing Identity Node...</p>
      </div>
    )
  }

  const firstName = formData.first_name || 'Professional'
  const lastName = formData.last_name || ''
  const painterId = user?.id?.substring(0, 4).toUpperCase() || 'NODE'

  return (
    <div className="space-y-8 animate-slide-up pb-10">
      
      {/* ── HEADER & AVATAR SECTION ── */}
      <div className="flex flex-col lg:flex-row items-center gap-10 pb-8 border-b border-slate-200">
         <div className="relative group shrink-0">
            <div className="h-40 w-40 rounded bg-white border border-slate-200 p-1 shadow-md overflow-hidden relative z-10 transition-transform hover:scale-105 duration-500">
               <div className="h-full w-full bg-primary-100 rounded-sm flex items-center justify-center text-primary-500 text-4xl font-black">
                 {firstName.charAt(0)}{lastName.charAt(0)}
               </div>
            </div>
            <button className="absolute -bottom-2 -right-2 h-10 w-10 bg-primary-500 text-white rounded flex items-center justify-center border-2 border-white shadow-lg hover:bg-primary-600 transition-all z-20 active:scale-95">
               <Edit3 size={18} />
            </button>
         </div>

         <div className="flex-1 text-center lg:text-left space-y-4">
            <div className="space-y-2">
               <h1 className="text-3xl font-bold tracking-tight text-secondary-500 uppercase tracking-widest leading-none">{firstName} {lastName}</h1>
               <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
                  <span className="bg-primary-500 text-white px-3 py-1.5 rounded text-[9px] font-bold uppercase tracking-[0.2em] shadow-sm">ELITE TIER MEMBER</span>
                  <span className="bg-secondary-500 text-white px-3 py-1.5 rounded text-[9px] font-bold uppercase tracking-[0.2em] border border-white/10">CAP ID: #{painterId}-PRO</span>
               </div>
            </div>
            <p className="text-slate-500 text-base leading-relaxed max-w-2xl font-medium">
              Mastering premium architectural finishes through the CAP Business Pro ecosystem. 
              Specializing in {formData.specialization.toLowerCase()} projects across {formData.location}.
            </p>
         </div>
      </div>

      {/* ── TABS NAVIGATION ── */}
      <div className="flex items-center gap-2 p-1 bg-slate-100/50 border border-slate-200 rounded w-fit">
         {[
           { id: 'profile', label: 'Professional Identity', icon: <Briefcase size={14} /> },
           { id: 'security', label: 'Security Protocols', icon: <ShieldCheck size={14} /> },
           { id: 'notifications', label: 'Comm. Vectors', icon: <Bell size={14} /> },
         ].map((tab) => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={`px-6 py-2 rounded text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-white text-primary-500 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-secondary-500'}`}
           >
             {tab.icon} {tab.label}
           </button>
         ))}
      </div>

      {/* ── PROFILE MAIN GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
         
         {/* Dynamic Content Area */}
         <div className="lg:col-span-8 space-y-8">
            
            {activeTab === 'profile' && (
              <div className="bento-card p-8 space-y-8 animate-slide-up text-left">
                 <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-secondary-500 uppercase tracking-widest leading-none">Identity Credentials</h3>
                    <div className="flex items-center gap-2">
                       <ShieldCheck size={14} className="text-green-500" />
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sovereign Validation</span>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <DetailGroup label="First Designation" value={formData.first_name} onChange={(v) => setFormData({...formData, first_name: v})} />
                    <DetailGroup label="Surname" value={formData.last_name} onChange={(v) => setFormData({...formData, last_name: v})} />
                    <DetailGroup label="Email Identifier" value={formData.email} type="email" onChange={(v) => setFormData({...formData, email: v})} />
                    <DetailGroup label="Phone Line" value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} />
                    <DetailGroup label="Market Focus" value={formData.specialization} onChange={(v) => setFormData({...formData, specialization: v})} />
                    <DetailGroup label="Operational HQ" value={formData.location} onChange={(v) => setFormData({...formData, location: v})} />
                 </div>

                 <div className="pt-10 border-t border-slate-100 flex gap-4">
                    <button onClick={handleUpdateProfile} className="flex-1 py-4 bg-secondary-900 text-white font-bold rounded text-[11px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg shadow-black/10 active:scale-[0.98]">
                      UPDATE PROFESSIONAL PROFILE
                    </button>
                    <button className="px-12 py-4 bg-white border border-slate-200 text-slate-400 font-bold rounded text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                      RESET
                    </button>
                 </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bento-card p-8 space-y-8 animate-slide-up text-left">
                 <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-secondary-500 uppercase tracking-widest leading-none">Security Threshold</h3>
                    <div className="flex items-center gap-2">
                       <Lock size={14} className="text-primary-500" />
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AES-256 Protected</span>
                    </div>
                 </div>

                 <div className="space-y-6 max-w-md">
                    <DetailGroup label="Current Password" value="••••••••••••" isStatic />
                    <DetailGroup label="Replacement Password" value="" placeholder="Enter new configuration..." />
                    <DetailGroup label="Confirm Replacement" value="" placeholder="Repeat new configuration..." />
                    
                    <div className="pt-4 flex items-center gap-4">
                       <button className="flex-1 py-4 bg-primary-500 text-white font-bold rounded text-[11px] uppercase tracking-[0.2em] hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/10 active:scale-[0.98]">
                         SYNC SECURITY UPDATE
                       </button>
                    </div>
                 </div>

                 <div className="pt-8 border-t border-slate-100">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded border border-slate-100">
                       <div className="flex items-center gap-4">
                          <Eye size={20} className="text-slate-300" />
                          <div className="space-y-0.5">
                             <p className="text-[10px] font-bold text-secondary-500 uppercase tracking-widest">Multifactor Challenge</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase">Increased account extraction security</p>
                          </div>
                       </div>
                       <button className="text-[10px] font-bold text-primary-500 uppercase tracking-widest hover:underline">ENABLE</button>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'notifications' && (
               <div className="bento-card p-8 space-y-8 animate-slide-up text-left">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-secondary-500 uppercase tracking-widest leading-none">Communication Vectors</h3>
                    <div className="flex items-center gap-2">
                       <Globe size={14} className="text-blue-500" />
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Broadcast Active</span>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <ToggleItem label="Workshop Alerts" desc="Broadcasts when new technical learning assets are deployed." active />
                    <ToggleItem label="Accreditation Sync" desc="Notifications for certificate issuance and professional ladder progress." active />
                    <ToggleItem label="Security Heartbeat" desc="Critical account access and login validation alerts." active />
                    <ToggleItem label="Marketing Pulse" desc="Updates on CAP PLC product launches and partner incentives." />
                 </div>

                 <button className="w-full py-4 bg-secondary-900 text-white font-bold rounded text-[11px] uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-[0.98]">
                    SAVE COMMUNICATION PREFERENCES
                 </button>
               </div>
            )}
         </div>

         {/* Stats Sidebar */}
         <div className="lg:col-span-4 space-y-8">
            <div className="bento-card p-8 bg-secondary-900 border-none text-white relative overflow-hidden group shadow-xl">
               <div className="absolute top-0 right-0 h-40 w-40 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
               <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 relative z-10 border-b border-white/10 pb-4 text-slate-500">Professional Standing</h3>
               <div className="grid grid-cols-2 gap-8 relative z-10">
                  <WhiteStat icon={<Award size={24} />} label="Active Certs" value="03" />
                  <WhiteStat icon={<ShieldCheck size={24} />} label="Ecosystem XP" value="1.2k" />
               </div>
               <div className="pt-10 mt-10 border-t border-white/5 relative z-10">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Verification Layer</p>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded border border-white/10">
                     <div className="h-8 w-8 bg-primary-500 rounded flex items-center justify-center shadow-lg">
                        <CheckCircle2 size={16} className="text-white" />
                     </div>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">SYST. VALIDATED</p>
                  </div>
               </div>
            </div>

            <div className="bento-card p-6 bg-red-50/50 border-red-100">
               <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-[0.3em] mb-4">RESTRICTED ZONE</h4>
               <button className="w-full py-3 border border-red-200 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded hover:bg-red-500 hover:text-white transition-all active:scale-[0.98]">
                  FLUSH SYSTEM ACCOUNT
               </button>
            </div>
         </div>

      </div>
    </div>
  )
}

function DetailGroup({ label, value, type = 'text', placeholder = '', isStatic = false, onChange }: { label: string; value: string; type?: string; placeholder?: string; isStatic?: boolean; onChange?: (v: string) => void }) {
  return (
    <div className="space-y-1.5 text-left">
       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
       {isStatic ? (
         <div className="w-full bg-slate-50 border border-slate-100 rounded px-4 py-3.5 text-xs font-bold text-slate-400 cursor-not-allowed uppercase tracking-tighter">
           {value}
         </div>
       ) : (
         <input 
           type={type}
           value={value}
           onChange={(e) => onChange?.(e.target.value)}
           placeholder={placeholder}
           className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3.5 text-xs font-bold text-secondary-500 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all placeholder:text-slate-300 placeholder:font-normal uppercase tracking-tighter"
         />
       )}
    </div>
  )
}

function WhiteStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="space-y-2 text-left">
       <div className="text-primary-500 group-hover:scale-110 transition-transform">{icon}</div>
       <div className="space-y-1">
          <p className="text-3xl font-bold tracking-tighter text-white leading-none">{value}</p>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
       </div>
    </div>
  )
}

function ToggleItem({ label, desc, active = false }: { label: string; desc: string; active?: boolean }) {
  const [isActive, setIsActive] = useState(active)
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded border border-slate-100 hover:bg-white transition-all group text-left">
       <div className="space-y-1">
          <p className="text-xs font-bold text-secondary-500 uppercase tracking-tight">{label}</p>
          <p className="text-[10px] font-medium text-slate-400 uppercase leading-none tracking-tighter">{desc}</p>
       </div>
       <button 
         onClick={() => setIsActive(!isActive)}
         className={`h-6 w-11 rounded-full relative transition-colors shrink-0 ml-4 ${isActive ? 'bg-primary-500' : 'bg-slate-200'}`}
       >
          <div className={`absolute top-1 h-4 w-4 bg-white rounded-full transition-all shadow-sm ${isActive ? 'right-1' : 'left-1'}`} />
       </button>
    </div>
  )
}
