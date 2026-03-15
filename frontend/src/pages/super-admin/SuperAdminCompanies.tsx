import { useState, useEffect } from 'react'
import { Search, Plus, Users, CreditCard, Play, Star, MapPin, Loader2, X, Building2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { superAdminService, type CompanyRegistryEntry } from '../../services/superAdminService'
import CustomDropdown from '../../components/ui/CustomDropdown'
import LogoLoader from '../../components/ui/LogoLoader'

export default function SuperAdminCompanies() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTier, setFilterTier] = useState('ALL')
  const [companies, setCompanies] = useState<CompanyRegistryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<CompanyRegistryEntry | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    max_users: 10,
    max_video_upload: 5,
    logo_url: '',
    subscription_tier: 'FREE',
    official_email: '',
    official_phone: '',
    address: ''
  })

  const tierOptions = [
    { id: 'ALL', label: 'All Tiers' },
    { id: 'FREE', label: 'Free' },
    { id: 'PRO', label: 'Pro' },
    { id: 'ELITE', label: 'Elite' }
  ]

  const modalTierOptions = [
    { id: 'FREE', label: 'Free' },
    { id: 'PRO', label: 'Pro' },
    { id: 'ELITE', label: 'Elite' }
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const data = await superAdminService.getCompanies()
      setCompanies(data)
    } catch (error) {
      console.error('Companies fetch error:', error)
      toast.error('Failed to load companies')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (selectedCompany) {
        await superAdminService.updateCompany(selectedCompany.id, formData)
        toast.success('Company updated successfully')
      } else {
        await superAdminService.createCompany(formData)
        toast.success('Company registered successfully')
      }
      setIsModalOpen(false)
      setSelectedCompany(null)
      setFormData({ 
        name: '', 
        max_users: 10, 
        max_video_upload: 5, 
        logo_url: '', 
        subscription_tier: 'FREE',
        official_email: '',
        official_phone: '',
        address: ''
      })
      const data = await superAdminService.getCompanies()
      setCompanies(data)
    } catch (error) {
      console.error('Failed to save company:', error)
      toast.error('Failed to save company details')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <LogoLoader fullscreen logoSrc="/1879-logo.png" />
    )
  }

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterTier === 'ALL' || c.tier === filterTier)
  )

  return (
    <div className="space-y-10 animate-slide-up pb-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left border-b border-slate-200 dark:border-white/5 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-2 w-12 bg-red-500 rounded-full" />
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-[0.3em]">B2B Enterprise</span>
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white tracking-tight leading-none">
            Company <span className="text-red-500">Registry</span>
          </h1>
          <p className="text-slate-500 dark:text-white/40 font-medium max-w-lg text-sm">Manage all registered companies, their painter access, and content libraries.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="h-12 px-8 bg-secondary-900 text-white font-bold rounded-xl text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-black/10 active:scale-95 flex items-center gap-3"
        >
          <Plus size={16} /> New Company
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search companies by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-white/20"
          />
        </div>
        <div className="w-full md:w-64">
          <CustomDropdown 
            options={tierOptions}
            value={filterTier}
            onChange={setFilterTier}
            placeholder="All Tiers"
          />
        </div>
      </div>

      {/* Company Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCompanies.length > 0 ? filteredCompanies.map((company) => (
          <div key={company.id} className="group bg-white dark:bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-white/[0.08] overflow-hidden flex flex-col shadow-sm hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 hover:-translate-y-1">
            <div className="p-8 border-b border-slate-50 dark:border-white/5 relative bg-slate-50/50 dark:bg-transparent">
              <div className="absolute top-8 right-8 px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-[9px] font-bold uppercase tracking-widest">
                {company.tier}
              </div>
              <div className="h-14 w-14 bg-secondary-900 rounded-xl flex items-center justify-center text-red-500 font-bold text-xl mb-6 shadow-xl shadow-black/10 transition-transform group-hover:scale-110 overflow-hidden">
                {company.logo_url ? (
                   <img src={company.logo_url} alt={company.name} className="h-full w-full object-cover" />
                ) : (
                   company.name.charAt(0)
                )}
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-secondary-900 dark:text-white tracking-tight leading-none mb-2">{company.name}</h3>
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Lagos, Nigeria</span>
                </div>
              </div>
            </div>
            
            <div className="p-8 space-y-6 flex-1 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50/50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Users size={14} />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Users</span>
                  </div>
                  <p className="text-xl font-bold text-secondary-900 dark:text-white tabular-nums">{company.users || 0}</p>
                </div>
                <div className="p-4 bg-slate-50/50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <CreditCard size={14} />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Revenue</span>
                  </div>
                  <p className="text-xl font-bold text-secondary-900 dark:text-white tabular-nums">₦{(company.revenue / 1000).toFixed(0)}k</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Play size={14} className="text-red-500" />
                    <span className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest">Course Library</span>
                  </div>
                  <span className="text-[10px] font-bold text-secondary-900 dark:text-white">12 Videos</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star size={14} className="text-red-500" />
                    <span className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest">Avg. Performance</span>
                  </div>
                  <span className="text-[10px] font-bold text-secondary-900 dark:text-white">84%</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50/30 dark:bg-transparent border-t border-slate-50 dark:border-white/5">
              <button 
                onClick={() => navigate(`/super-admin/companies/${company.id}`)}
                className="w-full h-12 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-secondary-900 dark:text-white font-bold rounded-xl text-[10px] uppercase tracking-widest hover:border-red-500 hover:text-red-500 transition-all active:scale-95 shadow-sm"
              >
                View Company Profile
              </button>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 bg-white dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center space-y-4">
             <Building2 size={48} className="text-slate-200 dark:text-white/10" />
             <p className="text-sm font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest">No companies found</p>
          </div>
        )}
      </div>

      {/* Register Company Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-slide-up">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => {
                setIsModalOpen(false)
                setSelectedCompany(null)
                setFormData({ name: '', max_users: 10, max_video_upload: 5, logo_url: '', subscription_tier: 'FREE', official_email: '', official_phone: '', address: '' })
              }}
              className="absolute top-6 right-6 text-slate-400 hover:text-secondary-900 dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <div className="h-12 w-12 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center mb-6">
               <Building2 size={24} />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-secondary-900 dark:text-white tracking-tight leading-none mb-2">
                {selectedCompany ? 'Edit Company' : 'Register Company'}
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                {selectedCompany ? 'Update existing partner information and limits.' : 'Add a new B2B partner to the global CAP Business Pro network.'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Company Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Paint Master Ltd"
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Official Email</label>
                      <input 
                        type="email" 
                        value={formData.official_email}
                        onChange={(e) => setFormData({...formData, official_email: e.target.value})}
                        placeholder="contact@company.com"
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all dark:text-white"
                      />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Official Number</label>
                      <input 
                        type="tel" 
                        value={formData.official_phone}
                        onChange={(e) => setFormData({...formData, official_phone: e.target.value})}
                        placeholder="+234..."
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Address</label>
                    <textarea 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="Company physical address"
                      rows={2}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all dark:text-white resize-none"
                    />
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Company Logo (URL)</label>
                    <input 
                      type="url" 
                      value={formData.logo_url}
                      onChange={(e) => setFormData({...formData, logo_url: e.target.value})}
                      placeholder="https://example.com/logo.png"
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all dark:text-white placeholder:text-slate-300"
                    />
                  </div>
                </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 text-left">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Max Users</label>
                    <input 
                      required
                      type="number" 
                      value={formData.max_users}
                      onChange={(e) => setFormData({...formData, max_users: parseInt(e.target.value)})}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Max Video Uploads</label>
                    <input 
                      required
                      type="number" 
                      value={formData.max_video_upload}
                      onChange={(e) => setFormData({...formData, max_video_upload: parseInt(e.target.value)})}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2 text-left">
                  <CustomDropdown 
                    label="Pricing Tier"
                    options={modalTierOptions}
                    value={formData.subscription_tier}
                    onChange={(val) => {
                       let newUsers = 10;
                       let newVideos = 5;
                       if (val === 'PRO') {
                          newUsers = 50;
                          newVideos = 50;
                       } else if (val === 'ELITE') {
                          newUsers = 1000;
                          newVideos = 9999;
                       }
                       setFormData({...formData, subscription_tier: val, max_users: newUsers, max_video_upload: newVideos})
                    }}
                  />
                  <div className="mt-4 p-4 bg-red-500/5 border border-red-500/20 rounded-xl space-y-2">
                     <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest">Selected Plan Limits</p>
                     <p className="text-[10px] font-medium text-slate-500 dark:text-white/60">Changing the tier automatically scales the allowed users and video allocations.</p>
                  </div>
                </div>
              </div>

              <button 
                disabled={isSubmitting}
                type="submit"
                className="w-full py-4 bg-red-500 hover:bg-primary-600 disabled:opacity-50 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all shadow-xl shadow-red-500/20 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                Confirm Registration
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
