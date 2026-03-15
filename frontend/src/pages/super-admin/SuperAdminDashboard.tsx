import { useState, useEffect } from 'react'
import { Building2, Users, CreditCard, ShieldCheck, ArrowRight, Globe, TrendingUp, Plus, X } from 'lucide-react'
import LogoLoader from '../../components/ui/LogoLoader'
import { toast } from 'react-hot-toast'
import { superAdminService, type PlatformStats, type CompanyRegistryEntry } from '../../services/superAdminService'
import CustomDropdown from '../../components/ui/CustomDropdown'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate, NavLink } from 'react-router-dom'

export default function SuperAdminDashboard() {
  const { profile, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [companies, setCompanies] = useState<CompanyRegistryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCompany, setSelectedCompany] = useState<CompanyRegistryEntry | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  const modalTierOptions = [
    { id: 'FREE', label: 'Free' },
    { id: 'PRO', label: 'Pro' },
    { id: 'ELITE', label: 'Elite' }
  ]

  useEffect(() => {
    // Role-based redirection safeguard
    if (!authLoading && profile) {
      if (profile.role !== 'super_admin') {
        navigate(profile.role === 'admin' ? '/admin' : '/dashboard')
        return
      }
    }

    const fetchDashboardData = async () => {
      try {
        const [statsData, companiesData] = await Promise.all([
          superAdminService.getPlatformStats(),
          superAdminService.getCompanies()
        ])
        setStats(statsData)
        setCompanies(companiesData)
      } catch (error) {
        console.error('Failed to fetch super admin data:', error)
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading && profile) {
      fetchDashboardData()
    }
  }, [profile, authLoading, navigate])

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
      setFormData({ name: '', max_users: 10, max_video_upload: 5, logo_url: '', subscription_tier: 'FREE', official_email: '', official_phone: '', address: '' })
      // Refresh data
      const [statsData, companiesData] = await Promise.all([
        superAdminService.getPlatformStats(),
        superAdminService.getCompanies()
      ])
      setStats(statsData)
      setCompanies(companiesData)
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

  return (
    <>
      <div className="space-y-10 animate-slide-up pb-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left border-b border-slate-200 dark:border-white/5 pb-10">
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <div className="h-2 w-12 bg-red-500 rounded-full" />
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-[0.3em]">1879 · Super Admin</span>
             </div>
             <h1 className="text-3xl font-bold text-secondary-900 dark:text-white tracking-tight leading-none uppercase">
                Dashboard
             </h1>
             <p className="text-slate-500 dark:text-white/40 font-medium max-w-lg text-sm leading-relaxed">Global platform overview and enterprise management.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="h-12 px-8 bg-secondary-900 text-white font-bold rounded-xl text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-black/10 active:scale-95 flex items-center gap-3"
          >
             <Plus size={16} /> Register Company
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           <SuperMetric icon={<Building2 size={22} />} label="Registered Companies" value={stats?.totalCompanies || 0} />
           <SuperMetric icon={<ShieldCheck size={22} />} label="Active Subscriptions" value={stats?.activeSubscriptions || 0} accent color="red" />
           <SuperMetric icon={<Users size={22} />} label="Total Users" value={stats?.totalPainters || 0} />
           <SuperMetric icon={<CreditCard size={22} />} label="Platform Revenue" value={`₦${stats?.platformRevenue?.toLocaleString() || 0}`} accent color="red" />
        </div>

        {/* Companies Table */}
        <div className="bg-white dark:bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-white/[0.06] overflow-hidden shadow-sm">
           <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center">
                    <Globe size={20} className="text-red-500" />
                 </div>
                 <div className="text-left">
                    <h3 className="text-sm font-bold text-secondary-900 dark:text-white uppercase tracking-widest leading-none">Company Registry</h3>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest mt-1">All registered B2B accounts</p>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                 <span className="text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest">System Online</span>
              </div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-transparent">
                    <tr>
                       <th className="px-8 py-5 text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest">Company</th>
                       <th className="px-8 py-5 text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest">Subscription</th>
                       <th className="px-8 py-5 text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest">Users</th>
                       <th className="px-8 py-5 text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest">Revenue</th>
                       <th className="px-8 py-5 text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest">Status</th>
                       <th className="px-8 py-5 text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 dark:divide-white/[0.03]">
                    {companies.map((c) => (
                       <tr key={c.id} className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-all">
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center justify-center border border-slate-200 dark:border-white/10 font-bold text-red-500 text-xs group-hover:bg-red-500 group-hover:text-white transition-all overflow-hidden">
                                   {c.logo_url ? (
                                      <img src={c.logo_url} alt={c.name} className="h-full w-full object-cover" />
                                   ) : (
                                      c.name.charAt(0)
                                   )}
                                </div>
                                <p className="text-sm font-bold text-secondary-900 dark:text-white group-hover:text-red-500 transition-colors">{c.name}</p>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <span className={`px-3 py-1.5 rounded-lg text-[9px] font-bold tracking-widest uppercase border ${c.tier === 'ELITE' ? 'bg-red-500/10 text-red-500 dark:text-red-400 border-red-500/20' : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-white/30 border-slate-200 dark:border-white/10'}`}>
                                {c.tier}
                             </span>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-2">
                                <Users size={14} className="text-slate-300 dark:text-white/20" />
                                <span className="text-sm font-bold text-secondary-900 dark:text-white tabular-nums">{c.users || 0}</span>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <p className="text-sm font-bold text-secondary-900 dark:text-white tabular-nums">₦{c.revenue.toLocaleString()}</p>
                          </td>
                          <td className="px-8 py-6">
                             <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border w-fit ${c.status === 'active' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-white/30 border-slate-200 dark:border-white/10'}`}>
                                <div className={`h-1.5 w-1.5 rounded-full ${c.status === 'active' ? 'bg-red-500' : 'bg-slate-400'}`} />
                                <span className="text-[9px] font-bold uppercase tracking-widest">{c.status}</span>
                             </div>
                          </td>
                            <td className="px-6 py-5 text-right">
                              <NavLink 
                                to={`/super-admin/companies/${c.id}`} 
                                className="h-10 w-10 bg-white border border-slate-100 rounded-xl inline-flex items-center justify-center text-slate-300 hover:text-red-500 hover:border-red-500 hover:bg-red-50 transition-all shadow-sm active:scale-90"
                              >
                                 <ArrowRight size={18} />
                              </NavLink>
                            </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
           <div className="p-6 border-t border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/30 dark:bg-transparent">
              <p className="text-[10px] font-bold text-slate-400 dark:text-white/20 uppercase tracking-widest">{companies.length} companies registered</p>
              <button className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:text-red-400 transition-colors">View All →</button>
           </div>
        </div>

        {/* Subscription Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white dark:bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-white/[0.06] p-8 text-left shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                 <ShieldCheck size={18} className="text-red-500" />
                 <h3 className="text-sm font-bold text-secondary-900 dark:text-white uppercase tracking-widest">Subscription Tiers</h3>
              </div>
              <div className="space-y-6">
                 <TierRow label="Elite Partners" value={stats?.tiers?.elite || 0} color="bg-red-500" />
                 <TierRow label="Pro Accounts" value={stats?.tiers?.pro || 0} color="bg-red-400" />
                 <TierRow label="Free Tier" value={stats?.tiers?.free || 0} color="bg-slate-400" />
              </div>
           </div>
           <div className="bg-secondary-900 rounded-2xl p-8 text-left relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-red-500/10 to-transparent pointer-events-none" />
              <div className="relative z-10">
                 <TrendingUp size={32} className="text-red-500 mb-6" />
                 <h3 className="text-xl font-bold text-white tracking-tight mb-2">Growth Report</h3>
                 <p className="text-white/40 text-sm font-medium mb-8 leading-relaxed">Your platform has grown significantly in the last 30 days reaching new milestones.</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-left">
                       <p className="text-2xl font-bold text-white tracking-tight">{stats?.newCompanies || 0}</p>
                       <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">New Companies</p>
                    </div>
                     <div className="text-left">
                        <p className="text-2xl font-bold text-white tracking-tight">{stats?.newPainters || 0}</p>
                        <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">New Users</p>
                     </div>
                    <div className="text-left">
                       <p className="text-2xl font-bold text-white tracking-tight">
                           {stats?.totalCompanies ? Math.round(((stats.newCompanies || 0) / (stats.totalCompanies || 1)) * 100) : 0}%
                        </p>
                       <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Growth</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Register Company Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-slide-up" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => {
                setIsModalOpen(false)
                setSelectedCompany(null)
                setFormData({ name: '', max_users: 10, max_video_upload: 5, logo_url: '', subscription_tier: 'FREE', official_email: '', official_phone: '', address: '' })
              }}
              className="absolute top-6 right-6 text-slate-400 hover:text-secondary-900 dark:hover:text-white"
            >
              <X size={20} />
            </button>
            <div className="h-12 w-12 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center mb-6">
               <Building2 size={24} />
            </div>
            <h3 className="text-xl font-bold text-secondary-900 dark:text-white tracking-tight leading-none mb-2">
              {selectedCompany ? 'Edit Company' : 'Register Company'}
            </h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              {selectedCompany ? 'Update existing partner information and limits.' : 'Add a new B2B partner to the global CAP Business Pro network.'}
            </p>
            
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
              </div>

              <div className="space-y-2 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Company Logo (URL)</label>
                <input 
                  type="url" 
                  value={formData.logo_url}
                  onChange={(e) => setFormData({...formData, logo_url: e.target.value})}
                  placeholder="https://example.com/logo.png"
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Max Users</label>
                    <input 
                      required
                      type="number" 
                      value={formData.max_users}
                      onChange={(e) => setFormData({...formData, max_users: parseInt(e.target.value)})}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all dark:text-white"
                    />
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Max Videos</label>
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
                       let u = 10, v = 5;
                       if (val === 'PRO') { u = 50; v = 50; }
                       else if (val === 'ELITE') { u = 1000; v = 9999; }
                       setFormData({...formData, subscription_tier: val, max_users: u, max_video_upload: v})
                    }}
                  />
                  <div className="mt-4 p-4 bg-red-500/5 rounded-xl border border-red-500/10">
                     <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest">Plan Selection</p>
                     <p className="text-[10px] text-slate-400 mt-1 font-medium">Limits auto-adjust based on the selected enterprise tier.</p>
                  </div>
                </div>
              </div>

               <button 
                disabled={isSubmitting}
                type="submit"
                className="w-full py-4 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all shadow-xl shadow-red-500/20 flex items-center justify-center gap-2 active:scale-95"
              >
                {isSubmitting ? <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Plus size={16} />}
                Confirm Registration
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

function SuperMetric({ icon, label, value, accent = false, color = 'red' }: { icon: React.ReactNode; label: string; value: string | number; accent?: boolean, color?: string }) {
  return (
    <div className={`p-8 rounded-2xl border transition-all hover:translate-y-[-4px] shadow-sm text-left ${accent ? `bg-${color}-500/5 dark:bg-${color}-500/10 border-${color}-500/20` : 'bg-white dark:bg-white/[0.03] border-slate-100 dark:border-white/[0.06]'}`}>
       <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-6 shadow-sm ${accent ? `bg-${color}-500 text-white` : 'bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-white/40'}`}>
          {icon}
       </div>
       <p className="text-3xl font-bold text-secondary-900 dark:text-white tracking-tight leading-none mb-2 tabular-nums">{value}</p>
       <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${accent ? `text-${color}-500 dark:text-${color}-400` : 'text-slate-400 dark:text-white/30'}`}>{label}</p>
    </div>
  )
}

function TierRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center justify-between group">
       <div className="flex items-center gap-3">
          <div className={`h-2 w-2 rounded-full ${color}`} />
          <p className="text-sm font-bold text-secondary-900 dark:text-white/60">{label}</p>
       </div>
       <span className="text-sm font-bold text-secondary-900 dark:text-white tabular-nums">{value}</span>
    </div>
  )
}
