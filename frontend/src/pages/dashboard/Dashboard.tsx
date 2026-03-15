import { Play, CheckCircle2, Award, ArrowRight, Layout, BookOpen, Target, Shield } from 'lucide-react'
import LogoLoader from '../../components/ui/LogoLoader'
import { NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { analyticsService } from '../../services/analyticsService'
import type { UserStats } from '../../services/analyticsService'
import { useAuth } from '../../hooks/useAuth'
import OnboardingModal from '../../components/dashboard/OnboardingModal'
import { notificationService, type Notification } from '../../services/notificationService'

export default function Dashboard() {
  const { user, profile, loading: authLoading } = useAuth()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    // Role-based redirection safeguard
    if (!authLoading && profile) {
      if (profile.role === 'super_admin') {
        navigate('/super-admin')
        return
      }
      if (profile.role === 'admin') {
        navigate('/admin')
        return
      }
    }

    const fetchData = async () => {
      try {
        if (!user) return;
        
        const statsData = await analyticsService.getUserStats()
        setStats(statsData)

        // Fetch notifications
        const notifs = await notificationService.getNotifications()
        setNotifications(notifs.slice(0, 3)) // Only show top 3 on dashboard
        
        if (profile && !profile.onboarding_completed) {
          setShowOnboarding(true)
        }
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

    if (!authLoading) {
      fetchData()
    }
  }, [user, profile, authLoading, navigate])

  if (loading || authLoading) {
    return (
      <LogoLoader fullscreen />
    )
  }

  const firstName = profile?.first_name || user?.user_metadata?.first_name || 'Professional'

  return (
    <div className="space-y-8 animate-slide-up pb-10">
      
      {/* Welcome & Progress Section */}
      <div className="flex flex-col lg:flex-row gap-8 items-stretch text-left">
        {/* Main Welcome Hero */}
        <div className="flex-1 p-6 md:p-8 bg-white rounded-2xl relative overflow-hidden group border border-slate-100 shadow-sm transition-all flex flex-col justify-between">
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
                 <NavLink to="/my-courses" className="group/btn inline-flex items-center justify-center gap-3 bg-secondary-900 text-white px-6 py-3.5 rounded-xl font-bold text-[10px] shadow-sm active:scale-95 transition-all hover:bg-black uppercase tracking-[0.2em]">
                    Resume Course <Play size={14} fill="currentColor" className="group-hover/btn:translate-x-1 transition-transform" />
                 </NavLink>
                 <NavLink to="/my-courses" className="inline-flex items-center justify-center gap-3 bg-white text-secondary-900 border border-slate-200 px-6 py-3.5 rounded-xl font-bold text-[10px] shadow-sm active:scale-95 transition-all hover:border-primary-500 uppercase tracking-[0.2em]">
                    View Curriculum
                 </NavLink>
              </div>
           </div>
        </div>

        {/* Actionable Goal Card */}
        <div className="w-full lg:w-80 p-6 md:p-8 bg-secondary-900 rounded-2xl relative overflow-hidden flex flex-col justify-between group shadow-sm">
           <div className="absolute -top-10 -right-10 h-32 w-32 bg-primary-500/20 rounded-full blur-2xl group-hover:bg-primary-500/30 transition-colors pointer-events-none" />
           <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-start">
                 <div className="h-12 w-12 bg-white/10 rounded-xl border border-white/10 flex items-center justify-center text-primary-500 transition-transform group-hover:scale-110 shadow-sm">
                    <Target size={24} />
                 </div>
                 <span className="text-[9px] font-bold text-white/40 uppercase tracking-[0.25em] pt-1.5">Current Objective</span>
              </div>
              <div className="space-y-2">
                 <h3 className="text-lg font-bold text-white tracking-tight leading-none">
                    {stats?.completedCourses === 0 ? 'Start Training' : 'Elite Milestone'}
                 </h3>
                 <p className="text-[11px] font-medium text-slate-400 leading-relaxed max-w-[200px]">
                    {stats?.completedCourses === 0 ? 'Pick a course from the library to begin.' : 'Complete the next module to upgrade your certification.'}
                 </p>
              </div>
           </div>
           
           <div className="relative z-10 space-y-4 pt-6">
              <div className="flex justify-between items-end">
                 <span className="text-3xl font-bold text-white tabular-nums leading-none tracking-tight">
                    {stats?.enrolledCourses ? Math.round((stats.completedCourses / stats.enrolledCourses) * 100) : 0}
                    <span className="text-primary-500 text-xl">%</span>
                 </span>
                 <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Completion</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                 <div className="h-full bg-primary-500 transition-all duration-1000 relative" style={{ width: `${stats?.enrolledCourses ? (stats.completedCourses / stats.enrolledCourses) * 100 : 0}%` }} />
              </div>
           </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
         <StatTile icon={<Layout size={20} />} label="Enrolled Courses" value={stats?.enrolledCourses?.toString() || "0"} color="text-blue-500" />
         <StatTile icon={<CheckCircle2 size={20} />} label="Courses Completed" value={stats?.completedCourses?.toString() || "0"} color="text-green-500" />
         <StatTile icon={<Award size={20} />} label="Certificates Earned" value={stats?.certificatesIssued?.toString() || "0"} color="text-secondary-900" />
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
               {stats?.enrolledCourseData && stats.enrolledCourseData.length > 0 ? (
                 stats.enrolledCourseData.map((enrollment: any, i: number) => (
                   <div key={i} onClick={() => navigate(`/play/${enrollment.course_id}`)} className="p-5 md:p-6 bg-white border border-slate-100 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-5 group hover:shadow-md transition-all shadow-sm cursor-pointer hover:border-primary-100">
                      <div className="h-16 w-24 shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-slate-100">
                         <img src={enrollment.courses.thumbnail_url || 'https://images.unsplash.com/photo-1595841055318-502a55099399?auto=format&fit=crop&q=80&w=2070'} alt={enrollment.courses.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 space-y-3 text-left w-full">
                         <div className="flex items-center justify-between">
                            <span className={`px-2 py-1 bg-slate-50 border border-slate-100 rounded text-[8px] font-bold uppercase tracking-[0.2em] ${enrollment.courses.tier_access === 'elite' ? 'text-primary-500' : 'text-slate-500'}`}>{enrollment.courses.tier_access} Track</span>
                            <span className="text-[9px] font-bold text-slate-400">{enrollment.status}</span>
                         </div>
                         <h4 className="text-sm font-bold text-secondary-900 tracking-tight leading-snug truncate pr-4 group-hover:text-primary-500 transition-colors uppercase">{enrollment.courses.title}</h4>
                      </div>
                      <button className="h-12 w-full sm:w-12 bg-slate-50 text-secondary-900 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-primary-500 group-hover:text-white transition-all shrink-0 border border-slate-100">
                         <Play size={16} fill="currentColor" className="ml-0.5" />
                      </button>
                   </div>
                 ))
               ) : (
                 <div className="p-12 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100 space-y-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No active courses found</p>
                    <NavLink to="/video-library" className="inline-flex py-2 px-4 bg-primary-500 text-white rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-primary-600 transition-all">Explore Library</NavLink>
                 </div>
               )}
            </div>
         </div>

         {/* Communications Hub */}
         <div className="lg:col-span-4 space-y-6">
            <h2 className="text-lg font-bold text-secondary-900 tracking-tight px-2">Notifications</h2>
            <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm transition-all space-y-6 flex flex-col h-[calc(100%-3rem)]">
               <div className="flex-1 space-y-6">
                  {notifications.length > 0 ? (
                    notifications.map((n, i) => (
                      <div key={i} className="flex gap-4 group cursor-pointer border-l-2 border-transparent hover:border-primary-500 pl-2 -ml-2 transition-all">
                         <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all shadow-sm shrink-0 ${
                            n.type === 'SUCCESS' ? 'bg-green-50 text-green-500 border border-green-100' :
                            n.type === 'ALERT' ? 'bg-orange-50 text-orange-500 border border-orange-100' : 'bg-primary-50 text-primary-500 border border-primary-100'
                         }`}>
                            {n.type === 'SUCCESS' ? <Award size={16} /> : n.type === 'INFO' ? <BookOpen size={16} /> : <Shield size={16} />}
                         </div>
                         <div className="space-y-1 text-left pt-0.5">
                            <p className="text-xs font-bold text-secondary-900 leading-tight group-hover:text-primary-500 transition-colors uppercase tracking-tight">{n.title}</p>
                            <p className="text-[10px] font-medium text-slate-500 leading-relaxed">{n.message}</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest pt-1">{new Date(n.created_at).toLocaleDateString()}</p>
                         </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center space-y-3">
                       <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No recent alerts</p>
                       <p className="text-[11px] font-medium text-slate-400">Everything up to date.</p>
                    </div>
                  )}
               </div>
               <button onClick={() => window.dispatchEvent(new Event('openNotifications'))} className="w-full py-3 bg-slate-50 border border-slate-100 text-slate-500 text-[9px] font-bold hover:bg-white hover:border-primary-500 hover:text-primary-500 transition-all shadow-sm rounded-xl uppercase tracking-[0.2em] active:scale-95 mt-auto">
                  View All
               </button>
            </div>
         </div>
      </div>

      {showOnboarding && <OnboardingModal userProfile={profile} onComplete={() => setShowOnboarding(false)} />}
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
