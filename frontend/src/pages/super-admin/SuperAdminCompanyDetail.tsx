import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Users, 
  Video, 
  ChevronLeft,
  Edit,
  Save,
  Shield
} from 'lucide-react'
import LogoLoader from '../../components/ui/LogoLoader'
import { superAdminService, type CompanyRegistryEntry } from '../../services/superAdminService'
import { toast } from 'react-hot-toast'

export default function SuperAdminCompanyDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [company, setCompany] = useState<CompanyRegistryEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<CompanyRegistryEntry>>({})
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (id) fetchCompany()
  }, [id])

  const fetchCompany = async () => {
    try {
      setLoading(true)
      const companies = await superAdminService.getCompanies()
      const found = companies.find(c => String(c.id) === String(id))
      if (found) {
        setCompany(found)
        setFormData(found)
      } else {
        toast.error('Company not found')
        navigate('/super-admin/companies')
      }
    } catch (error) {
      toast.error('Failed to load company details')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!id || !formData) return
    setIsSaving(true)
    try {
      // Ensure we send both mappings if backend expects one
      const payload = {
        ...formData,
        subscription_tier: formData.tier
      }
      await superAdminService.updateCompany(id, payload)
      toast.success('Company updated successfully')
      setIsEditing(false)
      fetchCompany()
    } catch (error) {
      toast.error('Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <LogoLoader fullscreen logoSrc="/1879-logo.png" label="Retrieving enterprise records..." />
    )
  }

  if (!company) return null

  return (
    <div className="animate-slide-up space-y-10 pb-20">
      {/* Navigation Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-8">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/super-admin/companies')}
            className="h-12 w-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-secondary-900 transition-all shadow-sm active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="text-left">
            <h1 className="text-2xl font-black text-secondary-900 tracking-tight leading-none lowercase">
               <span className="capitalize">{company.name}</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Enterprise Resource ID: {company.id}</p>
          </div>
        </div>
        <div className="flex gap-4">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-8 py-3.5 bg-secondary-900 text-white font-bold rounded-2xl text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all shadow-xl shadow-black/10 active:scale-95"
            >
              <Edit size={16} /> See and edit information
            </button>
          ) : (
            <div className="flex gap-3">
              <button 
                onClick={() => { setIsEditing(false); setFormData(company); }}
                className="px-6 py-3.5 bg-slate-50 text-slate-500 font-bold rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-8 py-3.5 bg-red-500 text-white font-bold rounded-2xl text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 active:scale-95 min-w-[160px] justify-center"
              >
                {isSaving ? <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Save size={16} /> Save Changes</>}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Glance Card */}
        <div className="space-y-10">
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-40 w-40 bg-red-50 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 opacity-50" />
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="h-32 w-32 rounded-[2.5rem] bg-white p-1.5 shadow-2xl shadow-red-500/10 mb-8 overflow-hidden border border-slate-50">
                {company.logo_url ? (
                  <img src={company.logo_url} alt={company.name} className="h-full w-full object-contain rounded-[2rem]" />
                ) : (
                  <div className="h-full w-full bg-slate-50 rounded-[2rem] flex items-center justify-center text-4xl font-black text-red-500 uppercase">
                    {company.name.charAt(0)}
                  </div>
                )}
              </div>
              
              <h2 className="text-2xl font-black text-secondary-900 tracking-tighter mb-2">{company.name}</h2>
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${company.status === 'active' ? 'bg-green-50 text-green-500 border-green-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                {company.status}
              </div>

              <div className="w-full h-px bg-slate-50 my-10" />

              <div className="grid grid-cols-2 w-full gap-4">
                <div className="bg-slate-50/50 rounded-3xl p-6 text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tier</p>
                  <p className="text-sm font-black text-secondary-900 flex items-center gap-2 italic uppercase">
                    {company.tier} <Shield size={14} className="text-primary-500" />
                  </p>
                </div>
                <div className="bg-slate-50/50 rounded-3xl p-6 text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Revenue</p>
                  <p className="text-sm font-black text-secondary-900 tabular-nums">₦{Number(company.revenue || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 gap-6">
            <StatCard icon={<Users size={20} />} label="Professional Painters" value={company.users} subValue={`Limit: ${company.max_users}`} />
            <StatCard icon={<Video size={20} />} label="Exclusive Courses" value={company.max_video_upload} subValue="Available Content" />
          </div>
        </div>

        {/* Detailed Information */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-secondary-900 rounded-2xl flex items-center justify-center text-white">
                     <Building2 size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-secondary-900 capitalize tracking-tight">Enterprise Information</h3>
               </div>
            </div>

            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
              <InfoEditable 
                label="Official Email" 
                value={company.official_email || 'Not provided'} 
                icon={<Mail size={18} />} 
                isEditing={isEditing}
                onChange={(val) => setFormData({...formData, official_email: val})}
                fieldValue={formData.official_email}
              />
              <InfoEditable 
                label="Official Phone" 
                value={company.official_phone || 'Not provided'} 
                icon={<Phone size={18} />} 
                isEditing={isEditing}
                onChange={(val) => setFormData({...formData, official_phone: val})}
                fieldValue={formData.official_phone}
              />
              <InfoEditable 
                label="Registered Address" 
                value={company.address || 'Not provided'} 
                icon={<MapPin size={18} />} 
                isEditing={isEditing}
                isFull
                onChange={(val) => setFormData({...formData, address: val})}
                fieldValue={formData.address}
              />
              <InfoEditable 
                label="Branding (Logo URL)" 
                value={company.logo_url || 'No logo hosted'} 
                icon={<Globe size={18} />} 
                isEditing={isEditing}
                isFull
                onChange={(val) => setFormData({...formData, logo_url: val})}
                fieldValue={formData.logo_url}
              />
            </div>
          </div>

          {/* Controls & Configuration */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden text-left">
             <div className="p-10 border-b border-slate-50 bg-slate-50/30">
                <h3 className="text-lg font-bold text-secondary-900 uppercase tracking-widest">Enterprise Platform Settings</h3>
             </div>
             <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Subscription Tier Management</label>
                   <select 
                     disabled={!isEditing}
                     value={formData.tier}
                     onChange={(e) => setFormData({...formData, tier: e.target.value as any})}
                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/10 focus:border-red-500 outline-none transition-all disabled:opacity-70 disabled:bg-white"
                   >
                     <option value="FREE">FREE (Entry Level)</option>
                     <option value="PRO">PRO (Growing Enterprise)</option>
                     <option value="ELITE">ELITE (High Capacity)</option>
                   </select>
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Operational Status</label>
                   <select 
                     disabled={!isEditing}
                     value={formData.status}
                     onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/10 focus:border-red-500 outline-none transition-all disabled:opacity-70 disabled:bg-white"
                   >
                     <option value="active">Active Operation</option>
                     <option value="inactive">Suspended / Inactive</option>
                   </select>
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">User Seat Allocation</label>
                   <input 
                     type="number"
                     disabled={!isEditing}
                     value={formData.max_users}
                     onChange={(e) => setFormData({...formData, max_users: Number(e.target.value)})}
                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/10 focus:border-red-500 outline-none transition-all disabled:opacity-70 disabled:bg-white"
                   />
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Course Content Limit</label>
                   <input 
                     type="number"
                     disabled={!isEditing}
                     value={formData.max_video_upload}
                     onChange={(e) => setFormData({...formData, max_video_upload: Number(e.target.value)})}
                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/10 focus:border-red-500 outline-none transition-all disabled:opacity-70 disabled:bg-white"
                   />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, subValue }: { icon: any, label: string, value: string | number | undefined, subValue: string }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-primary-500/20 transition-all text-left">
      <div className="flex gap-5 items-center">
        <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary-500 group-hover:text-white transition-all shadow-sm">
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
          <p className="text-2xl font-black text-secondary-900 tabular-nums">{value}</p>
        </div>
      </div>
      <div className="text-right">
        <span className="text-[9px] font-black text-primary-500 bg-primary-50 px-3 py-1.5 rounded-full uppercase tracking-widest">{subValue}</span>
      </div>
    </div>
  )
}

function InfoEditable({ label, value, icon, isEditing, onChange, fieldValue, isFull }: { label: string, value: string, icon: any, isEditing: boolean, onChange: (val: string) => void, fieldValue?: string, isFull?: boolean }) {
  return (
    <div className={`space-y-4 ${isFull ? 'md:col-span-2' : ''} group`}>
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary-500 transition-colors border border-slate-100">
          {icon}
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{label}</p>
      </div>
      {isEditing ? (
        <input 
          type="text"
          value={fieldValue || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter company ${label.toLowerCase()}...`}
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/10 focus:border-red-500 outline-none transition-all placeholder:text-slate-300"
        />
      ) : (
        <p className="text-sm font-bold text-secondary-900 leading-relaxed pl-1">{value}</p>
      )}
    </div>
  )
}
