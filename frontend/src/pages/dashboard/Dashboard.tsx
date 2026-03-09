import { Play, CheckCircle2, Award, Clock, ArrowRight, Bell, Layout, BookOpen, Settings, Loader2 } from 'lucide-react'
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
        console.error('Failed to fetch dashboard data:', error)
        // Fallback stats
        setStats({
          enrolledCourses: 4,
          completedCourses: 2,
          certificatesIssued: 1,
          totalXp: 1250
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 size={40} className="animate-spin text-primary-500" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Accessing Professional Node...</p>
      </div>
    )
  }

  const firstName = user?.user_metadata?.first_name || 'Professional'

  return (
    <div className="space-y-10 animate-slide-up pb-10">
      
      {/* ── WELCOME & PRIMARY KPI ── */}
      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        <div className="flex-1 bento-card p-6 sm:p-10 bg-secondary-900 border-none relative overflow-hidden group shadow-2xl">
           <div className="absolute top-0 right-0 h-48 w-48 bg-primary-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
           <div className="relative z-10 flex flex-col justify-between h-full space-y-8">
              <div className="space-y-1">
                 <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-[0.2em] leading-tight text-left">Welcome back, {firstName}</h1>
                 <p className="text-primary-500 text-[10px] font-black uppercase tracking-[0.3em] font-heading mt-2 text-left">Elite Tier Professional // HQ-Lagos Sector</p>
              </div>
              <div className="flex flex-col sm:flex-row flex-wrap gap-6 sm:gap-8 items-start sm:items-end">
                 <div className="flex gap-8">
                    <div className="space-y-1 text-left">
                       <p className="text-4xl sm:text-5xl font-black text-white tabular-nums leading-none">84<span className="text-primary-500 text-2xl sm:text-3xl">%</span></p>
                       <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Efficiency</p>
                    </div>
                    <div className="space-y-1 text-left">
                       <p className="text-4xl sm:text-5xl font-black text-white tabular-nums leading-none">{stats?.completedCourses || 0}</p>
                       <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Completed</p>
                    </div>
                 </div>
                 <div className="h-12 w-px bg-white/10 hidden md:block" />
                 <NavLink to="/video-library" className="w-full sm:w-auto group/btn inline-flex items-center justify-center gap-4 bg-primary-500 text-white px-8 py-4 rounded-md font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-xl active:scale-95">
                    INITIALIZE LEARNING <Play size={16} fill="currentColor" />
                 </NavLink>
              </div>
           </div>
        </div>

        <div className="lg:w-80 bento-card p-8 bg-white shadow-xl flex flex-col justify-between group cursor-pointer hover:border-primary-500 transition-all border-slate-100">
           <div className="space-y-6">
              <div className="flex justify-between items-start">
                 <div className="h-12 w-12 bg-slate-50 rounded border border-slate-100 flex items-center justify-center text-primary-500 transition-transform group-hover:scale-110">
                    <Award size={24} />
                 </div>
                 <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest pt-1 underline">NEXT MILESTONE</span>
              </div>
              <div className="space-y-2 text-left">
                 <h3 className="text-sm font-black text-secondary-500 uppercase tracking-widest">Global Master Certificate</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed tracking-tighter">Requires 12.4 more XP for unlock.</p>
              </div>
           </div>
           <div className="pt-6 border-t border-slate-50">
              <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-primary-500 transition-all duration-1000" style={{ width: '88%' }} />
              </div>
           </div>
        </div>
      </div>

      {/* ── SECONDARY METRICS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatCard icon={<Layout size={18} />} label="Total Enrollment" value={stats?.enrolledCourses.toString() || "0"} color="text-blue-500" />
         <StatCard icon={<BookOpen size={18} />} label="Active Sessions" value="06" color="text-primary-500" />
         <StatCard icon={<CheckCircle2 size={18} />} label="Validation Verified" value={stats?.completedCourses.toString() || "0"} color="text-green-500" />
         <StatCard icon={<Clock size={18} />} label="Hours Logged" value="120" color="text-secondary-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* ── COURSE MONITOR ── */}
         <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-2">
               <h2 className="text-lg font-black text-secondary-500 uppercase tracking-widest leading-none flex items-center gap-3">
                  <div className="h-1.5 w-6 bg-primary-500 rounded" /> 
                  Active Tracks
               </h2>
               <NavLink to="/my-courses" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary-500 transition-colors">VIEW_ALL_NODES</NavLink>
            </div>
            
            <div className="space-y-4">
               {[
                 { title: 'Modern Surface Prep & Decontamination', color: 'bg-blue-500', progress: 65, status: 'RESUME_SESSION' },
                 { title: 'Luxury Texture Portfolio: Part 1', color: 'bg-primary-500', progress: 24, status: 'RESUME_SESSION' },
                 { title: 'Color Mixology for Interior Walls', color: 'bg-secondary-500', progress: 8, status: 'INITIALIZE' },
               ].map((track, i) => (
                 <div key={i} className="bento-card p-6 flex items-center gap-8 group hover:border-slate-300 transition-all cursor-pointer">
                    <div className={`h-14 w-1 shadow-md ${track.color}`} />
                    <div className="flex-1 space-y-2 text-left">
                       <h4 className="text-xs font-black text-secondary-500 uppercase tracking-widest">{track.title}</h4>
                       <div className="flex items-center gap-4">
                          <div className="flex-1 h-1 bg-slate-50 rounded-full overflow-hidden">
                             <div className={`h-full ${track.color} transition-all duration-700`} style={{ width: `${track.progress}%` }} />
                          </div>
                          <span className="text-[10px] font-black text-slate-300 tabular-nums">{track.progress}%</span>
                       </div>
                    </div>
                    <button className="hidden sm:flex items-center gap-2 text-[10px] font-black text-primary-500 uppercase tracking-widest group-hover:underline">
                       {track.status} <ArrowRight size={14} />
                    </button>
                 </div>
               ))}
            </div>
         </div>

         {/* ── SYSTEM FEED / ASSETS ── */}
         <div className="lg:col-span-4 space-y-6">
            <h2 className="text-lg font-black text-secondary-500 uppercase tracking-widest px-2 leading-none flex items-center gap-3">
               <div className="h-1.5 w-6 bg-secondary-900 rounded" /> 
               System Pulse
            </h2>
            <div className="bento-card p-8 bg-slate-50 border-slate-100 space-y-6">
               {[
                 { msg: 'Global Master Certificate issued to your node.', time: '2m ago', icon: <Award size={14} /> },
                 { msg: 'New Luxury Texture Session deployed.', time: '1h ago', icon: <Bell size={14} /> },
                 { msg: 'Security Check: Password sync complete.', time: '4h ago', icon: <Settings size={14} /> },
               ].map((pulse, i) => (
                 <div key={i} className="flex gap-4 group">
                    <div className="h-9 w-9 bg-white border border-slate-200 rounded flex items-center justify-center text-slate-300 group-hover:text-primary-500 transition-colors shadow-sm shrink-0">
                       {pulse.icon}
                    </div>
                    <div className="space-y-1 text-left">
                       <p className="text-[10px] font-bold text-secondary-500 leading-snug uppercase tracking-tight">{pulse.msg}</p>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{pulse.time}</p>
                    </div>
                 </div>
               ))}
               <button className="w-full py-4 border border-slate-200 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded hover:bg-white hover:text-secondary-500 transition-all shadow-sm">
                  INITIALIZE_ALL_LOGS
               </button>
            </div>
         </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="bento-card p-6 flex flex-col items-start gap-4 hover:shadow-lg transition-all border-slate-100 group">
       <div className={`${color} h-10 w-10 bg-slate-50 border border-slate-100 rounded flex items-center justify-center shadow-sm transition-transform group-hover:scale-110`}>
          {icon}
       </div>
       <div className="text-left space-y-1">
          <p className="text-2xl font-black text-secondary-500 tabular-nums leading-none tracking-tight">{value}</p>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
       </div>
    </div>
  )
}
