import { useState, useEffect } from 'react'
import { 
  Users, 
  BookOpen, 
  Award, 
  CreditCard, 
  TrendingUp, 
  ArrowRight,
  Clock,
  ChevronRight,
  Activity
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { analyticsService } from '../../services/analyticsService'
import { toast } from 'react-hot-toast'
import LogoLoader from '../../components/ui/LogoLoader'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [detailed, setDetailed] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsData, detailedData] = await Promise.all([
        analyticsService.getAdminStats(),
        analyticsService.getDetailedEngagementAdmin()
      ])
      setStats(statsData)
      setDetailed(detailedData)
    } catch (error: any) {
      console.error('Fetch error:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const cards = [
    { 
      label: 'TOTAL USERS', 
      value: stats?.totalUsers || '0', 
      icon: <Users size={20} />, 
      color: 'primary',
      trend: stats?.growth ? `+${stats.growth}%` : '+0%'
    },
    { 
      label: 'CERTIFICATES', 
      value: stats?.totalCertificates || '0', 
      icon: <Award size={20} />, 
      color: 'orange',
      trend: 'Verified'
    },
    { 
      label: 'ENROLLMENTS', 
      value: stats?.totalCourses || '0', 
      icon: <BookOpen size={20} />, 
      color: 'blue',
      trend: 'Active'
    },
    { 
      label: 'REVENUE', 
      value: `₦${Number(stats?.revenue || 0).toLocaleString()}`, 
      icon: <CreditCard size={20} />, 
      color: 'green',
      trend: 'MTD'
    },
  ]

  if (loading) {
     return (
        <LogoLoader fullscreen />
     )
  }

  return (
    <div className="space-y-12 animate-slide-up pb-12">
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 text-left">
          <div className="space-y-3">
             <div className="flex items-center gap-3">
                <div className="h-2 w-12 bg-primary-500 rounded-full" />
                <span className="text-[10px] font-bold text-primary-500 uppercase tracking-[0.3em]">Admin Dashboard</span>
             </div>
             <h1 className="text-4xl md:text-5xl font-black text-secondary-900 tracking-tight leading-none">
              CAP Plc <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-orange-600">Business Pro</span>
            </h1>
             <p className="text-slate-500 font-medium max-w-md text-sm leading-relaxed">Manage all your users/painters in one view.</p>
          </div>
          <div className="flex gap-4">
             <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="h-10 w-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-500">
                   <Clock size={20} />
                </div>
                <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Server Time</p>
                   <p className="text-sm font-bold text-secondary-900 mt-1 tabular-nums">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
             </div>
          </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="group bg-white p-8 rounded-[2rem] border border-slate-100 hover:border-primary-500/20 hover:shadow-2xl hover:shadow-primary-500/5 transition-all relative overflow-hidden text-left">
            <div className={`absolute top-0 right-0 h-24 w-24 bg-gradient-to-br from-primary-500/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700`} />
            
            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
               <div className="flex items-center justify-between">
                  <div className={`h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary-500 group-hover:text-white transition-all shadow-sm`}>
                    {card.icon}
                  </div>
                  <span className="text-[10px] font-black text-green-500 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest">{card.trend}</span>
               </div>
               <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">{card.label}</p>
                  <h3 className="text-3xl font-black text-secondary-900 tracking-tighter leading-none tabular-nums">{card.value}</h3>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Intelligence Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
         
         {/* Main Chart */}
         <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm flex flex-col">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
               <div>
                  <h3 className="text-lg font-bold text-secondary-900 tracking-tight leading-none">Analytics</h3>
                  <p className="text-xs font-medium text-slate-400 mt-2 uppercase tracking-widest">Growth Analytics • {new Date().getFullYear()}</p>
               </div>
               <div className="flex gap-2">
                  <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary-500 transition-colors cursor-pointer"><TrendingUp size={16} /></div>
               </div>
            </div>
            <div className="p-8 flex-1 flex flex-col justify-end relative h-80">
                <div className="absolute inset-x-8 bottom-8 top-8 flex flex-col justify-between pointer-events-none">
                   {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-full h-px bg-slate-50"></div>
                   ))}
                </div>
                <div className="h-full w-full flex items-end justify-between gap-2 overflow-hidden relative z-10 pt-8">
                   {(detailed?.activity || [...Array(12).fill(0)]).map((val: number, i: number) => {
                      const maxVal = Math.max(...(detailed?.activity || [1]), 1);
                      const heightPct = val > 0 ? (val / maxVal) * 100 : 5;
                      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                      return (
                         <div key={i} className="w-full flex flex-col justify-end items-center group h-full relative">
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-secondary-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg transition-all duration-300">
                               {val} users
                            </div>
                            <div className="w-full bg-slate-100 rounded-t-xl overflow-hidden group-hover:bg-primary-50 transition-colors relative flex items-end h-[85%]">
                               <div className="w-full bg-primary-500 rounded-t-xl transition-all duration-700 ease-out flex-1" style={{ height: `${heightPct}%`}}></div>
                            </div>
                            <span className="text-[9px] font-bold text-slate-400 mt-3 uppercase tracking-widest">{months[i]}</span>
                         </div>
                      );
                   })}
                </div>
            </div>
         </div>

         {/* Distribution Chart */}
         <div className="lg:col-span-4 bg-secondary-900 rounded-3xl p-10 relative overflow-hidden group shadow-xl flex flex-col">
            <div className="absolute top-0 right-0 h-64 w-64 bg-primary-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 space-y-10 flex-1">
               <div className="flex justify-between items-start">
                  <div className="h-14 w-14 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-white shadow-inner group-hover:scale-110 transition-transform">
                    <Activity size={28} />
                  </div>
                  <div className="text-right">
                     <p className="text-sm font-bold text-white uppercase tracking-widest">Distro</p>
                     <p className="text-[10px] font-bold text-primary-400 uppercase tracking-[0.2em] mt-2">Segmentation</p>
                  </div>
               </div>
               
               <div className="flex-1 min-h-[250px] flex items-center justify-center relative">
                  <div className="h-48 w-48 rounded-full border-8 border-white/5 relative flex items-center justify-center">
                     {/* A simple mock representation of distribution */}
                     <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-primary-500/80 border-r-primary-500/80 -rotate-45" />
                     <div className="absolute inset-0 rounded-full border-8 border-transparent border-b-primary-400/50 -rotate-12" />
                     <div className="text-center">
                        <p className="text-3xl font-black text-white">{detailed?.distribution?.[0]?.value || 0}</p>
                        <p className="text-[9px] font-bold text-primary-400 uppercase tracking-widest mt-1">Elite</p>
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white tracking-tight leading-none">User Mastery Levels</h3>
                  <p className="text-slate-400 text-[11px] font-medium leading-relaxed">Distribution of your workforce across training tiers.</p>
               </div>
            </div>
         </div>

         {/* Access Control Card */}
         <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm flex flex-col min-h-[400px]">
            <div className="p-8 border-b border-slate-50">
               <h3 className="text-lg font-bold text-secondary-900 tracking-tight leading-none">Manage Registered Users</h3>
               <p className="text-xs font-medium text-slate-400 mt-2 uppercase tracking-widest">Recent Registered Profiles</p>
            </div>
            <div className="flex-1 overflow-x-auto p-2">
               <table className="w-full text-left">
                  <thead className="bg-slate-50/50">
                     <tr>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">User</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {(stats?.recentUsers || []).length > 0 ? stats.recentUsers.map((user: any, i: number) => (
                        <tr key={user.id || i} className="hover:bg-slate-50/50 transition-all group">
                           <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                 <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase group-hover:bg-primary-500 group-hover:text-white transition-all">
                                    {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                                 </div>
                                 <p className="text-xs font-bold text-secondary-900 tracking-tight leading-none group-hover:text-primary-500 transition-colors uppercase">{user.first_name} {user.last_name}</p>
                              </div>
                           </td>
                           <td className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{user.role}</td>
                           <td className="px-6 py-5">
                              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${user.status === 'active' ? 'bg-green-50 text-green-500' : 'bg-slate-100 text-slate-400'}`}>{user.status}</span>
                           </td>
                           <td className="px-6 py-5">
                              <NavLink to="/admin/users" className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-300 hover:text-primary-500 hover:bg-primary-50 transition-all shadow-sm">
                                 <ChevronRight size={14} />
                              </NavLink>
                           </td>
                        </tr>
                     )) : (
                        <tr>
                           <td colSpan={4} className="px-6 py-20 text-center">
                              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No recent registrations</p>
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
            <div className="p-6 bg-slate-50/30 border-t border-slate-50 text-center">
               <NavLink to="/admin/users" className="text-[10px] font-bold text-primary-500 hover:text-primary-600 uppercase tracking-widest flex items-center justify-center gap-2 py-2">
                  View Full Registry <ArrowRight size={14} />
               </NavLink>
            </div>
         </div>

         {/* Activity Log - Right Sidebar */}
         <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm flex flex-col h-full">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
               <h3 className="text-xs font-bold text-secondary-900 uppercase tracking-widest">See Real Time Activity</h3>
               <Activity size={16} className="text-primary-500 animate-pulse" />
            </div>
            <div className="flex-1 overflow-y-auto max-h-[480px] divide-y divide-slate-50 no-scrollbar">
               {detailed?.recentActivity && detailed.recentActivity.length > 0 ? (
                 detailed.recentActivity.map((activity: any, i: number) => (
                 <div key={i} className="p-6 hover:bg-slate-50/50 transition-all group flex items-start justify-between">
                    <div className="flex gap-4">
                       <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xs font-bold group-hover:bg-primary-100 group-hover:text-primary-500 transition-all border border-slate-50 uppercase">
                          {activity.user_name?.charAt(0) || 'U'}
                       </div>
                       <div className="space-y-1.5 text-left">
                          <p className="text-sm font-bold text-secondary-900 leading-none">
                             <span className="text-primary-500 hover:text-primary-600 transition-colors font-black tracking-tight">{activity.user_name}</span>
                          </p>
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{activity.action_type || 'Activity'}</span>
                             <div className="h-1 w-1 bg-slate-200 rounded-full" />
                             <span className="text-[10px] font-bold text-slate-500 tracking-tight leading-none text-ellipsis overflow-hidden max-w-[120px] whitespace-nowrap">{activity.resource_name}</span>
                          </div>
                       </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest tabular-nums">{activity.time_ago}</span>
                 </div>
               ))) : (
                 <div className="p-10 text-center">
                   <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No recent records</p>
                 </div>
               )}
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
               <NavLink to="/admin/analytics" className="text-[11px] font-bold text-primary-500 hover:text-primary-600 transition-colors inline-flex items-center gap-2 uppercase tracking-[0.2em] py-2">
                  Analytics <ArrowRight size={14} />
               </NavLink>
            </div>
         </div>

      </div>

    </div>
  )
}
