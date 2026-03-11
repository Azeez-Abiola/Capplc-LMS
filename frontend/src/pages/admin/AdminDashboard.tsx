import { Users, BookOpen, Award, TrendingUp, ArrowRight, Shield, Plus, Loader2, Target, Zap, Clock } from 'lucide-react'
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
        console.error('AdminDashboard error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
     return (
       <div className="h-[60vh] flex flex-col items-center justify-center space-y-6 text-left">
          <div className="h-16 w-16 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center shadow-inner">
            <Loader2 size={32} className="animate-spin text-primary-500" />
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.25em]">Accessing platform data...</p>
       </div>
     )
  }

  return (
    <div className="space-y-12 animate-slide-up pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-4 border-b border-slate-50 text-left">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-secondary-900 tracking-tight leading-none">Admin Overview</h1>
          <p className="text-slate-500 text-sm font-medium">Core platform metrics and ecosystem oversight.</p>
        </div>
        <button className="h-14 px-10 bg-secondary-900 text-white rounded-2xl flex items-center gap-4 font-bold text-xs hover:bg-black transition-all shadow-xl active:scale-95 uppercase tracking-[0.2em]">
          <Plus size={20} /> Create New Module
        </button>
      </div>

      {/* Dynamic Performance Analytics Section */}
      <div className="space-y-8 text-left">
         {/* Top Stat Tiles */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AdminMetricCard icon={<Users size={24} />} label="Total Users" value={stats?.totalUsers.toLocaleString() || "0"} trend="+12.4%" />
            <AdminMetricCard icon={<Target size={24} />} label="User Retention" value="94.8%" trend="+2.1%" />
            <AdminMetricCard icon={<Zap size={24} />} label="Average Completion" value="4.2x" trend="+0.5%" />
         </div>

         {/* Chart & Quick Links row */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
               {/* Main Chart Card */}
               <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm transition-all space-y-10 group h-full">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                     <div className="space-y-1">
                        <h3 className="text-sm font-bold text-secondary-900 uppercase tracking-widest">Monthly User Activity</h3>
                        <p className="text-[10px] font-medium text-slate-400">Monthly progression of user engagement.</p>
                     </div>
                     <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <div className="h-2.5 w-2.5 bg-primary-500 rounded-full shadow-sm" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none pr-2">Active Users</span>
                     </div>
                  </div>
                  
                  <div className="h-[250px] flex items-end gap-5 px-2">
                     {[45, 68, 32, 88, 52, 78, 62, 98, 48, 84, 58, 72].map((val, i) => (
                        <div key={i} className="flex-1 group/bar relative">
                           <div 
                             className="w-full bg-slate-50 border border-slate-50 rounded-lg group-hover/bar:bg-secondary-900 transition-all duration-500 cursor-pointer relative shadow-inner group-hover/bar:shadow-md"
                             style={{ height: `${val}%` }}
                           >
                              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-3 opacity-0 group-hover/bar:opacity-100 transition-all">
                                 <span className="bg-primary-500 text-white text-[9px] font-bold px-2 py-1 rounded shadow-sm">{val}k</span>
                              </div>
                           </div>
                           <p className="text-[10px] font-bold text-slate-400 text-center mt-4 transition-colors group-hover/bar:text-secondary-900">
                             {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][i]}
                           </p>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Quick Commands */}
            <div className="lg:col-span-4 space-y-6">
               <h2 className="text-lg font-bold text-secondary-900 tracking-tight px-2">Quick Links</h2>
               <div className="space-y-3">
                  <AdminLink to="/admin/users" icon={<Users size={18} />} label="Manage Users" count={stats?.totalUsers.toString()} />
                  <AdminLink to="/admin/courses" icon={<BookOpen size={18} />} label="Manage Courses" count={stats?.totalCourses.toString()} />
                  <AdminLink to="/admin/certificates" icon={<Award size={18} />} label="Certificates" count={stats?.totalCertificates.toString()} />
                  <AdminLink to="/admin/security" icon={<Shield size={18} />} label="Settings" status="OK" />
               </div>
               
               <div className="p-8 bg-secondary-900 rounded-2xl relative overflow-hidden shadow-md transition-all">
                  <div className="relative z-10 space-y-6">
                     <div className="space-y-2">
                        <p className="text-[9px] font-bold text-primary-500 uppercase tracking-[0.2em] leading-none">Export Data</p>
                        <h3 className="text-xl font-bold text-white tracking-tight leading-snug">Generate Platform <br/> Report</h3>
                        <p className="text-[11px] font-medium text-slate-400 leading-relaxed max-w-[200px]">Download a detailed summary of platform statistics.</p>
                     </div>
                     <button className="w-full py-3.5 bg-white text-secondary-900 font-bold text-[10px] rounded-xl shadow-sm hover:bg-primary-500 hover:text-white transition-all active:scale-95 uppercase tracking-widest">
                        Download Report
                     </button>
                  </div>
                  <div className="absolute top-0 right-0 h-[250px] w-[250px] bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
               </div>
            </div>
         </div>
      </div>

      {/* System Activity Hub */}
      <div className="space-y-6 text-left">
         <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold text-secondary-900 tracking-tight">Recent System Activity</h2>
            <div className="flex gap-2">
               <button className="h-8 px-4 bg-slate-50 border border-slate-100 rounded-md text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:bg-white transition-all">Today</button>
               <button className="h-8 px-4 bg-white border border-slate-100 rounded-md text-[9px] font-bold text-secondary-900 uppercase tracking-widest hover:border-primary-500 transition-all">All Time</button>
            </div>
         </div>
         <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm transition-all">
            <div className="divide-y divide-slate-100">
               {[
                 { user: 'Boluwatife Okafor', action: 'Earned Certificate', module: 'Modern Decon', time: '2m ago', type: 'CERT' },
                 { user: 'Michael Taiwo', action: 'Watched Lesson', module: 'LUX_TEXTURE_01', time: '4m ago', type: 'PLAY' },
                 { user: 'Sarah Biu', action: 'Logged In', module: 'AUTH_PROTOCOL', time: '12m ago', type: 'SEC' },
                 { user: 'John Doe', action: 'Paid Subscription', module: 'ELITE_TIER', time: '24m ago', type: 'PAY' },
                 { user: 'Chukuma', action: 'Finished Course', module: 'INDUSTRIAL_SPRAY_04', time: '45m ago', type: 'COMPLETE' },
               ].map((activity, i) => (
                 <div key={i} className="p-6 hover:bg-slate-50 transition-all flex items-center justify-between group cursor-pointer border-l-4 border-l-transparent hover:border-l-primary-500">
                    <div className="flex items-center gap-5">
                       <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${
                          activity.type === 'CERT' ? 'bg-green-50 text-green-500' :
                          activity.type === 'PLAY' ? 'bg-primary-50 text-primary-500' :
                          activity.type === 'SEC' ? 'bg-blue-50 text-blue-500' :
                          activity.type === 'PAY' ? 'bg-purple-50 text-purple-500' : 'bg-slate-50 text-slate-400'
                       }`}>
                          {activity.type === 'CERT' ? <Award size={18} /> : 
                           activity.type === 'PLAY' ? <Clock size={18} /> : 
                           activity.type === 'SEC' ? <Shield size={18} /> : <TrendingUp size={18} />}
                       </div>
                       <div className="space-y-1">
                          <p className="text-sm font-bold text-secondary-900 leading-none">
                             <span className="text-primary-500 hover:text-primary-600 transition-colors">{activity.user}</span>
                          </p>
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activity.action}</span>
                             <div className="h-1 w-1 bg-slate-200 rounded-full" />
                             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{activity.module}</span>
                          </div>
                       </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activity.time}</span>
                 </div>
               ))}
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
               <NavLink to="/admin/logs" className="text-[10px] font-bold text-primary-500 hover:text-primary-600 transition-colors inline-flex items-center gap-2 uppercase tracking-[0.2em]">
                  View Full Activity Log <ArrowRight size={14} />
               </NavLink>
            </div>
         </div>
      </div>
    </div>
  )
}

function AdminMetricCard({ icon, label, value, trend }: { icon: React.ReactNode; label: string; value: string; trend: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all flex flex-col items-start gap-4">
       <div className="flex justify-between items-start w-full">
          <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
             {icon}
          </div>
          <span className="bg-green-50 text-green-600 text-[9px] font-bold px-2 py-1 rounded-md border border-green-100 uppercase tracking-widest">{trend}</span>
       </div>
       <div className="space-y-1 text-left">
          <p className="text-2xl font-bold text-secondary-900 tracking-tight leading-none tabular-nums uppercase">{value}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
       </div>
    </div>
  )
}

function AdminLink({ to, icon, label, count, status }: { to: string; icon: React.ReactNode; label: string; count?: string; status?: string }) {
  return (
    <NavLink to={to} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-primary-500 transition-all group active:scale-[0.98]">
       <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-secondary-900 group-hover:text-white transition-all">
             {icon}
          </div>
          <span className="text-[11px] font-bold text-secondary-900 uppercase tracking-widest">{label}</span>
       </div>
       {count && <span className="text-[10px] font-bold text-slate-400 tabular-nums">{count}</span>}
       {status && <span className="bg-green-50 text-green-500 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border border-green-100">{status}</span>}
    </NavLink>
  )
}
