import { Users, Target, ShieldCheck, Award, Zap, Calendar } from 'lucide-react'
import LogoLoader from '../../components/ui/LogoLoader'
import { useState, useEffect } from 'react'
import { analyticsService } from '../../services/analyticsService'
import type { AdminStats } from '../../services/analyticsService'

export default function Analytics() {
  const [activeDate, setActiveDate] = useState('30D')
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [detailed, setDetailed] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, d] = await Promise.all([
          analyticsService.getAdminStats(),
          analyticsService.getDetailedEngagementAdmin()
        ])
        setStats(s)
        setDetailed(d)
      } catch (error) {
        console.error('Analytics error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <LogoLoader fullscreen />
    )
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const activityData = detailed?.activity || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  return (
    <div className="space-y-10 animate-slide-up pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 text-left">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-secondary-900 leading-none">Platform Performance</h1>
          <p className="text-slate-500 text-sm font-medium">Detailed insights into user engagement and module completion.</p>
        </div>
        <div className="relative shrink-0">
           <select 
             value={activeDate}
             onChange={(e) => setActiveDate(e.target.value)}
             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
           >
              <option value="24H">Last 24 Hours</option>
              <option value="7D">Last 7 Days</option>
              <option value="30D">Last 30 Days</option>
              <option value="YTD">Year to Date</option>
           </select>
           <button className="flex items-center gap-3 px-5 py-3 h-11 bg-white border border-slate-200 rounded-xl shadow-sm text-secondary-900 group hover:border-primary-500 transition-all flex-1 sm:flex-none">
             <Calendar size={18} className="text-slate-400 group-hover:text-primary-500 transition-colors" />
             <span className="text-xs font-bold uppercase tracking-widest">{activeDate === '24H' ? 'Last 24 Hours' : activeDate === '7D' ? 'Last 7 Days' : activeDate === 'YTD' ? 'Year to Date' : 'Last 30 Days'}</span>
           </button>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
         <AnalyticsStatCard title="Total Users" value={stats?.totalUsers.toString() || "0"} trend={`+${stats?.growth || 0}%`} icon={<Users size={22} />} description="Registered professionals." />
         <AnalyticsStatCard title="Engagement" value={`${Math.round(((stats?.dailyEngagement || 0) / (stats?.totalUsers || 1)) * 100)}%`} trend="Active" icon={<Zap size={22} />} description="Daily active interaction." />
         <AnalyticsStatCard title="Certifications" value={stats?.totalCertificates.toString() || "0"} trend="Validated" icon={<Target size={22} />} description="Unique credentials issued." />
         <AnalyticsStatCard title="Company Subscriptions" value={stats?.activeSubscriptions.toString() || "0"} trend="Active" icon={<ShieldCheck size={22} />} description="Teams on premium tracks." />
      </div>

      {/* Detailed Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start text-left">
         
         {/* Main Activity Chart Area */}
         <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl p-10 shadow-sm hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
               <div>
                  <h3 className="text-sm font-bold text-secondary-900 uppercase tracking-widest">Platform Activity Momentum</h3>
                  <p className="text-[10px] font-medium text-slate-400 mt-1">Monthly progression of active users.</p>
               </div>
               <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-primary-500 rounded-full shadow-sm"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">User Activity</span>
               </div>
            </div>
            
            <div className="h-[350px] flex items-end gap-3 px-2">
               {activityData.map((val: number, i: number) => {
                  const maxVal = Math.max(...activityData, 1)
                  const height = (val / maxVal) * 100
                  return (
                    <div key={i} className="flex-1 group relative">
                       <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-secondary-900 text-white text-[9px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {val} entries
                       </div>
                       <div 
                         className="w-full bg-slate-50 border border-slate-50 rounded-lg group-hover:bg-primary-500 transition-all duration-300 cursor-pointer relative shadow-inner"
                         style={{ height: `${height}%` }}
                       />
                       <p className="text-[9px] font-bold text-slate-300 text-center mt-6 uppercase tracking-tight group-hover:text-secondary-900 transition-colors">
                         {months[i]}
                       </p>
                    </div>
                  )
               })}
            </div>
         </div>

         {/* Supplemental Statistics Feed */}
         <div className="lg:col-span-4 space-y-10">
            <div className="p-8 bg-secondary-900 rounded-3xl relative overflow-hidden group shadow-xl transition-all hover:scale-[1.02] h-full">
               <div className="flex items-center gap-4 border-b border-white/10 pb-6 mb-8 relative z-10">
                  <div className="h-10 w-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                    <Award size={22} className="text-primary-500" />
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest leading-none">Certificate Distribution</h3>
               </div>
               <div className="space-y-6 relative z-10">
                  {detailed?.distribution && detailed.distribution.some((d: any) => d.value > 0) ? (
                    detailed.distribution.map((d: any, i: number) => {
                      const total = detailed.distribution.reduce((acc: number, cur: any) => acc + cur.value, 0) || 1
                      const percent = Math.round((d.value / total) * 100)
                      return <ChartRatio key={i} label={d.label} value={percent} />
                    })
                  ) : (
                    <div className="py-10 text-center space-y-4">
                       <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">No certificates issued yet</p>
                    </div>
                  )}
               </div>
               <div className="pt-8 border-t border-white/5 relative z-10 mt-8 text-center space-y-4">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.25em]">Registry Engagement</p>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
                     <div className="h-full bg-primary-500 shadow-[0_0_15px_rgba(255,94,36,0.3)] transition-all" style={{ width: stats?.totalCertificates ? '100%' : '0%' }} />
                  </div>
               </div>
               <div className="absolute top-0 right-0 h-[250px] w-[250px] bg-primary-500/5 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2" />
            </div>
         </div>

      </div>
    </div>
  )
}

function AnalyticsStatCard({ title, value, trend, icon, description }: { title: string; value: string; trend: string; icon: React.ReactNode; description: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl flex flex-col justify-between group hover:border-primary-100 hover:shadow-xl transition-all border border-slate-100 shadow-sm h-56">
       <div className="flex justify-between items-start">
          <div className="h-12 w-12 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-all shadow-inner group-hover:scale-110">
            {icon}
          </div>
          <span className="bg-primary-50/50 text-primary-500 text-[9px] font-bold px-3 py-1.5 rounded-lg border border-primary-100 uppercase tracking-widest shadow-sm">
            {trend}
          </span>
       </div>
       <div className="space-y-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
          <h3 className="text-2xl font-bold text-secondary-900 tracking-tight leading-none tabular-nums">{value}</h3>
          <p className="text-[10px] font-medium text-slate-400 leading-none pt-1">{description}</p>
       </div>
    </div>
  )
}

function ChartRatio({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-3">
       <div className="flex justify-between items-end">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{label}</p>
          <p className="text-[10px] font-bold text-primary-500 leading-none">{value}%</p>
       </div>
       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
          <div className="h-full bg-primary-500 shadow-sm" style={{ width: `${value}%` }} />
       </div>
    </div>
  )
}
