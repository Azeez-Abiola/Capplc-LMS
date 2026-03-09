import { Users, BookOpen, Award, TrendingUp, Bell, ArrowRight, Shield, Activity, Plus, Loader2 } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { analyticsService } from '../../services/analyticsService'
import type { AdminStats } from '../../services/analyticsService'

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await analyticsService.getAdminStats()
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch admin stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
     return (
       <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
         <Loader2 size={40} className="animate-spin text-primary-500" />
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Processing Dashboard Data...</p>
       </div>
     )
  }

  return (
    <div className="space-y-10 animate-slide-up pb-10">
      
      {/* ── HEADER SECTION ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-1 text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-secondary-500 uppercase tracking-widest leading-none">Admin Dashboard</h1>
          <p className="text-slate-500 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Core Platform Analytics • Status: Synchronized</p>
        </div>
        <div className="flex gap-3">
           <button className="h-12 px-6 bg-secondary-900 text-white rounded flex items-center gap-3 font-bold text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95">
              <Plus size={16} /> Deploy Module
           </button>
           <button className="h-12 w-12 bg-white border border-slate-200 rounded flex items-center justify-center text-slate-400 hover:text-primary-500 transition-all shadow-sm">
             <Bell size={18} />
           </button>
        </div>
      </div>

      {/* ── CORE METRICS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         <MetricCard 
           icon={<Users size={24} />} 
           label="Total Painters" 
           value={stats?.totalUsers.toLocaleString() || "0"} 
           trend={`+${stats?.growth}%`} 
           trendUp 
           color="text-blue-500"
         />
         <MetricCard 
           icon={<BookOpen size={24} />} 
           label="Active Modules" 
           value={stats?.totalCourses.toString() || "0"} 
           trend="+3" 
           trendUp 
           color="text-primary-500"
         />
         <MetricCard 
           icon={<Award size={24} />} 
           label="Certs Issued" 
           value={stats?.totalCertificates.toLocaleString() || "0"} 
           trend="+84" 
           trendUp 
           color="text-green-500"
         />
         <MetricCard 
           icon={<TrendingUp size={24} />} 
           label="Net Revenue" 
           value={`₦${((stats?.revenue || 0) / 1000000).toFixed(1)}M`} 
           trend="+22%" 
           trendUp 
           color="text-secondary-500"
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* ── LIVE ACTIVITY FEED ── */}
         <div className="lg:col-span-8 space-y-6 text-left">
            <div className="flex items-center justify-between px-2">
               <h2 className="text-lg font-black text-secondary-500 uppercase tracking-widest leading-none flex items-center gap-3">
                  <div className="h-1.5 w-6 bg-primary-500 rounded" /> 
                  Recent Activity Registry
               </h2>
               <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">REALTIME_INPUT</span>
               </div>
            </div>

            <div className="bento-card overflow-hidden bg-white shadow-md">
               <div className="divide-y divide-slate-50">
                  {[
                    { user: 'Boluwatife Okafor', action: 'Verified Certification', module: 'Modern Decon', time: '2m ago' },
                    { user: 'Michael Taiwo', action: 'Initialized Session', module: 'LUX_TEXTURE_01', time: '4m ago' },
                    { user: 'Sarah Biu', action: 'Sync Security Update', module: 'AUTH_PROTOCOL', time: '12m ago' },
                    { user: 'John Doe', action: 'Subscription Renewal', module: 'ELITE_TIER', time: '24m ago' },
                    { user: 'Chukuma', action: 'Module Completion', module: 'INDUSTRIAL_SPRAY_04', time: '45m ago' },
                  ].map((activity, i) => (
                    <div key={i} className="p-6 hover:bg-slate-50 transition-all group flex items-center justify-between cursor-pointer">
                       <div className="flex items-center gap-6">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary-500 shadow-[0_0_10px_rgba(255,94,36,0.5)]" />
                          <div className="space-y-1">
                             <p className="text-[11px] font-black text-secondary-500 uppercase tracking-tight">
                                <span className="text-primary-500">{activity.user}</span> • {activity.action}
                             </p>
                             <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]">{activity.module}</p>
                          </div>
                       </div>
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{activity.time}</span>
                    </div>
                  ))}
               </div>
               <div className="p-6 bg-slate-50/50 border-t border-slate-100">
                  <NavLink to="/admin/logs" className="text-[10px] font-black text-primary-500 uppercase tracking-widest hover:underline flex items-center justify-center gap-2">
                     VIEW AUDIT LOGS <ArrowRight size={14} />
                  </NavLink>
               </div>
            </div>
         </div>

         {/* ── URGENT ACTIONS / SHORTCUTS ── */}
         <div className="lg:col-span-4 space-y-6 text-left">
            <h2 className="text-lg font-black text-secondary-500 uppercase tracking-widest px-2 leading-none flex items-center gap-3">
               <div className="h-1.5 w-6 bg-secondary-900 rounded" /> 
               Quick Actions
            </h2>
            <div className="space-y-4">
               <AdminLink to="/admin/users" icon={<Users size={18} />} label="Painter Directory" count={stats?.totalUsers.toString()} />
               <AdminLink to="/admin/courses" icon={<BookOpen size={18} />} label="Asset Repository" count={stats?.totalCourses.toString()} />
               <AdminLink to="/admin/certificates" icon={<Award size={18} />} label="Credential Ledger" count={stats?.totalCertificates.toString()} />
               <AdminLink to="/admin/security" icon={<Shield size={18} />} label="Security Node" status="SECURE" />
               <AdminLink to="/admin/analytics" icon={<Activity size={18} />} label="Global Market Pulse" status="ACTIVE" />
            </div>
            <div className="bento-card p-8 bg-primary-500 border-none group cursor-pointer shadow-md">
               <div className="space-y-2">
                  <p className="text-[9px] font-black text-white/60 uppercase tracking-[0.3em]">REPORT EXPORT</p>
                  <h3 className="text-lg font-black text-white uppercase tracking-widest leading-none">Weekly Performance Report</h3>
               </div>
               <button className="mt-8 w-full py-4 bg-white text-primary-500 font-bold text-[10px] uppercase tracking-widest rounded shadow-md hover:-translate-y-1 transition-all active:scale-95">
                  INITIALIZE EXPORT
               </button>
            </div>
         </div>
      </div>

    </div>
  )
}

function MetricCard({ icon, label, value, trend, trendUp, color }: { icon: React.ReactNode; label: string; value: string; trend: string; trendUp: boolean; color: string }) {
  return (
    <div className="bento-card p-6 sm:p-8 flex flex-col items-start bg-white shadow-sm hover:shadow-md transition-all group cursor-pointer border-slate-100/50">
       <div className={`${color} h-10 w-10 sm:h-12 sm:w-12 bg-slate-50 border border-slate-100 rounded flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
          {icon}
       </div>
       <div className="mt-4 sm:mt-6 space-y-1 text-left">
          <p className="text-2xl sm:text-3xl font-black text-secondary-500 tabular-nums leading-none tracking-tight">{value}</p>
          <div className="flex items-center gap-3">
             <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] leading-none">{label}</span>
             <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${trendUp ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                {trend}
             </span>
          </div>
       </div>
    </div>
  )
}

function AdminLink({ to, icon, label, count, status }: { to: string; icon: React.ReactNode; label: string; count?: string; status?: string }) {
  return (
    <NavLink to={to} className="bento-card p-6 flex items-center justify-between group hover:border-primary-500 transition-all bg-white shadow-md">
       <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-slate-50 border border-slate-100 rounded flex items-center justify-center text-slate-300 group-hover:bg-primary-500 group-hover:text-white group-hover:border-primary-500 transition-all">
             {icon}
          </div>
          <span className="text-[10px] font-black text-secondary-500 uppercase tracking-widest leading-none pt-0.5">{label}</span>
       </div>
       {count && <span className="text-[10px] font-black text-slate-300 tabular-nums">{count}</span>}
       {status && <span className="text-[9px] font-black text-green-500 tabular-nums">{status}</span>}
    </NavLink>
  )
}
