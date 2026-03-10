import { Play, CheckCircle2, Award, Clock, ArrowRight, Layout, BookOpen, Loader2, Target, Zap, Shield } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { analyticsService } from '../../services/analyticsService'
import type { UserStats } from '../../services/analyticsService'
import { authService } from '../../services/authService'

export default function Dashboard() {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, statsData] = await Promise.all([
          authService.getCurrentUser(),
          analyticsService.getUserStats()
        ])
        setUser(userData)
        setStats(statsData)
      } catch (error) {
        console.error('Dashboard error:', error)
        setStats({
          enrolledCourses: 0,
          completedCourses: 0,
          certificatesIssued: 0,
          totalXp: 0
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-6 text-left">
        <div className="h-16 w-16 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center shadow-sm">
          <Loader2 size={32} className="animate-spin text-primary-500" />
        </div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.25em]">Loading workspace...</p>
      </div>
    )
  }

  const firstName = user?.user_metadata?.first_name || 'Professional'

  return (
    <div className="space-y-8 animate-slide-up pb-10">
      
      {/* Welcome & Progress Section */}
      <div className="flex flex-col lg:flex-row gap-8 items-stretch text-left">
        {/* Main Welcome Hero */}
        <div className="flex-1 p-8 bg-white rounded-2xl relative overflow-hidden group border border-slate-100 shadow-sm transition-all flex flex-col justify-between">
           <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-primary-50/50 to-transparent pointer-events-none" />
           
           <div className="relative z-10 flex flex-col justify-between h-full space-y-8">
              <div className="space-y-3">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-md border border-green-100 mb-2">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-bold uppercase tracking-widest leading-none pt-0.5">Workspace Active</span>
                 </div>
                 <h1 className="text-3xl font-bold text-secondary-900 tracking-tight leading-snug">
                    Welcome back, <br/>
                    <span className="text-primary-500">{firstName}</span>
                 </h1>
                 <p className="text-slate-500 text-sm font-medium w-full lg:max-w-sm leading-relaxed">Continue learning. You have courses pending completion.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                 <NavLink to="/video-library" className="group/btn inline-flex items-center justify-center gap-3 bg-secondary-900 text-white px-6 py-3.5 rounded-xl font-bold text-[10px] shadow-sm active:scale-95 transition-all hover:bg-black uppercase tracking-[0.2em]">
                    Resume Course <Play size={14} fill="currentColor" className="group-hover/btn:translate-x-1 transition-transform" />
                 </NavLink>
                 <button className="inline-flex items-center justify-center gap-3 bg-white text-secondary-900 border border-slate-200 px-6 py-3.5 rounded-xl font-bold text-[10px] shadow-sm active:scale-95 transition-all hover:border-primary-500 uppercase tracking-[0.2em]">
                    View Curriculum
                 </button>
              </div>
           </div>
        </div>

        {/* Actionable Goal Card */}
        <div className="lg:w-80 p-8 bg-secondary-900 rounded-2xl relative overflow-hidden flex flex-col justify-between group shadow-sm">
           <div className="absolute -top-10 -right-10 h-32 w-32 bg-primary-500/20 rounded-full blur-2xl group-hover:bg-primary-500/30 transition-colors pointer-events-none" />
           <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-start">
                 <div className="h-12 w-12 bg-white/10 rounded-xl border border-white/10 flex items-center justify-center text-primary-500 transition-transform group-hover:scale-110 shadow-sm">
                    <Target size={24} />
                 </div>
                 <span className="text-[9px] font-bold text-white/40 uppercase tracking-[0.25em] pt-1.5">Current Objective</span>
              </div>
              <div className="space-y-2">
                 <h3 className="text-lg font-bold text-white tracking-tight leading-none">Complete Module 1</h3>
                 <p className="text-[11px] font-medium text-slate-400 leading-relaxed max-w-[200px]">Achieve Elite master status by completing the next module.</p>
              </div>
           </div>
           
           <div className="relative z-10 space-y-4 pt-6">
              <div className="flex justify-between items-end">
                 <span className="text-3xl font-bold text-white tabular-nums leading-none tracking-tight">88<span className="text-primary-500 text-xl">%</span></span>
                 <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Completion</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                 <div className="h-full bg-primary-500 transition-all duration-1000 relative" style={{ width: '88%' }} />
              </div>
           </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatTile icon={<Layout size={20} />} label="Enrolled Courses" value={stats?.enrolledCourses.toString() || "0"} color="text-blue-500" />
         <StatTile icon={<Zap size={20} />} label="Active Sessions" value="02" color="text-primary-500" />
         <StatTile icon={<CheckCircle2 size={20} />} label="Courses Completed" value={stats?.completedCourses.toString() || "0"} color="text-green-500" />
         <StatTile icon={<Clock size={20} />} label="Training Hours" value="120" color="text-secondary-900" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
         {/* Learning Progress Layout */}
         <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-2">
               <h2 className="text-lg font-bold text-secondary-900 tracking-tight">Active Curriculum</h2>
               <NavLink to="/my-courses" className="text-[10px] font-bold text-primary-500 hover:text-primary-600 transition-colors uppercase tracking-[0.2em] inline-flex items-center gap-2">
                  View All <ArrowRight size={14} />
               </NavLink>
            </div>
            
            <div className="space-y-4">
               {[
                 { title: 'Modern Surface Prep & Decontamination', color: 'bg-primary-500', progress: 65, duration: '2h 15m remaining', type: 'CORE' },
                 { title: 'Luxury Texture Portfolio: Advanced Tech', color: 'bg-secondary-900', progress: 24, duration: '4h 30m remaining', type: 'ELITE' },
                 { title: 'Color Mixology for Interior Diagnostics', color: 'bg-blue-500', progress: 8, duration: '5h 00m remaining', type: 'PRO' },
               ].map((track, i) => (
                 <div key={i} className="p-6 bg-white border border-slate-100 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-5 group hover:shadow-md transition-all shadow-sm">
                    <div className="flex-1 space-y-4 text-left w-full">
                       <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 bg-slate-50 border border-slate-100 rounded text-[8px] font-bold uppercase tracking-[0.2em] ${track.type === 'ELITE' ? 'text-primary-500' : 'text-slate-500'}`}>{track.type} Track</span>
                          <span className="text-[9px] font-bold text-slate-400">{track.duration}</span>
                       </div>
                       <h4 className="text-sm font-bold text-secondary-900 tracking-tight leading-snug truncate pr-4">{track.title}</h4>
                       
                       <div className="flex items-center gap-4 w-full">
                          <div className="w-full sm:w-56 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                             <div className={`h-full ${track.color} transition-all duration-700 relative`} style={{ width: `${track.progress}%` }} />
                          </div>
                          <span className="text-[10px] font-bold text-secondary-900 tabular-nums">{track.progress}%</span>
                       </div>
                    </div>
                    <button className="h-12 w-full sm:w-12 bg-slate-50 text-secondary-900 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-primary-500 group-hover:text-white transition-all shrink-0 border border-slate-100">
                       <Play size={16} fill="currentColor" className="ml-0.5" />
                    </button>
                 </div>
               ))}
            </div>
         </div>

         {/* Communications Hub */}
         <div className="lg:col-span-4 space-y-6">
            <h2 className="text-lg font-bold text-secondary-900 tracking-tight px-2">Notifications</h2>
            <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm transition-all space-y-6 flex flex-col h-[calc(100%-3rem)]">
               <div className="flex-1 space-y-6">
                  {[
                     { msg: 'Certificate Issued', detail: 'Your credentials have been securely registered.', time: '2m ago', icon: <Award size={16} />, type: 'SUCCESS' },
                     { msg: 'New Course Available', detail: 'Advanced luxury texture techniques added.', time: '1h ago', icon: <BookOpen size={16} />, type: 'INFO' },
                     { msg: 'Security Review', detail: 'Update your password for better safety.', time: '4h ago', icon: <Shield size={16} />, type: 'ALERT' },
                  ].map((pulse, i) => (
                    <div key={i} className="flex gap-4 group cursor-pointer border-l-2 border-transparent hover:border-primary-500 pl-2 -ml-2 transition-all">
                       <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all shadow-sm shrink-0 ${
                          pulse.type === 'SUCCESS' ? 'bg-green-50 text-green-500 border border-green-100' :
                          pulse.type === 'ALERT' ? 'bg-orange-50 text-orange-500 border border-orange-100' : 'bg-primary-50 text-primary-500 border border-primary-100'
                       }`}>
                          {pulse.icon}
                       </div>
                       <div className="space-y-1 text-left pt-0.5">
                          <p className="text-xs font-bold text-secondary-900 leading-tight group-hover:text-primary-500 transition-colors">{pulse.msg}</p>
                          <p className="text-[10px] font-medium text-slate-500 leading-relaxed">{pulse.detail}</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest pt-1">{pulse.time}</p>
                       </div>
                    </div>
                  ))}
               </div>
               <button className="w-full py-3 bg-slate-50 border border-slate-100 text-slate-500 text-[9px] font-bold hover:bg-white hover:border-primary-500 hover:text-primary-500 transition-all shadow-sm rounded-xl uppercase tracking-[0.2em] active:scale-95 mt-auto">
                  View All
               </button>
            </div>
         </div>
      </div>
    </div>
  )
}

function StatTile({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all flex flex-col items-start gap-4 flex-1">
       <div className={`${color} h-12 w-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shadow-sm`}>
          {icon}
       </div>
       <div className="text-left space-y-1 w-full">
          <p className="text-2xl font-bold text-secondary-900 tabular-nums leading-none tracking-tight">{value}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-snug">{label}</p>
       </div>
    </div>
  )
}
