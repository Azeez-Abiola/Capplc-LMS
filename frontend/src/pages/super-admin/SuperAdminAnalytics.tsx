import { useState, useEffect } from 'react'
import { Users, Building2, Award, Activity, BarChart3, Target, Globe } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { superAdminService, type AnalyticsKPI, type CourseMetric, type EngagementMetric } from '../../services/superAdminService'
import CustomCalendar from '../../components/ui/CustomCalendar'
import CustomDropdown from '../../components/ui/CustomDropdown'
import LogoLoader from '../../components/ui/LogoLoader'

export default function SuperAdminAnalytics() {
  const [period, setPeriod] = useState('30d')
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [kpis, setKpis] = useState<AnalyticsKPI[]>([])
  const [growth, setGrowth] = useState({ users: 0, revenue: 0, retention: 0 })
  const [courseMetrics, setCourseMetrics] = useState<CourseMetric[]>([])
  const [engagementByDay, setEngagementByDay] = useState<EngagementMetric[]>([])
  const [loading, setLoading] = useState(true)

  const periodOptions = [
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
    { id: '90d', label: 'Last 90 Days' },
    { id: '1y', label: 'Last Year' }
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [kpiResponse, courses, engagement] = await Promise.all([
          superAdminService.getAnalyticsKPIs(),
          superAdminService.getCourseMetrics(),
          superAdminService.getWeeklyEngagement()
        ])
        setKpis(kpiResponse.kpis)
        setGrowth(kpiResponse.growth)
        setCourseMetrics(courses)
        setEngagementByDay(engagement)
      } catch (error) {
        console.error('Analytics fetch error:', error)
        toast.error('Failed to load analytics data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [period, selectedDate])

  if (loading) {
    return (
      <LogoLoader fullscreen logoSrc="/1879-logo.png" />
    )
  }

  const maxEngagement = Math.max(...engagementByDay.map(d => d.value))

  return (
    <div className="space-y-10 animate-slide-up pb-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left border-b border-slate-200 dark:border-white/5 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-2 w-12 bg-red-500 rounded-full" />
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-[0.3em]">Platform Intelligence</span>
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white tracking-tight leading-none">
            Analytics
          </h1>
          <p className="text-slate-500 dark:text-white/40 font-medium max-w-lg text-sm">Deep insights into platform usage, course engagement, and growth metrics.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="w-full sm:w-48 text-left">
            <CustomDropdown 
               options={periodOptions}
               value={period}
               onChange={setPeriod}
               placeholder="Select period"
               color="red"
            />
          </div>
          <div className="w-full sm:w-48">
            <CustomCalendar 
              selectedDate={selectedDate}
              onSelect={setSelectedDate}
              alignRight
              color="red"
            />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white dark:bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-white/[0.06] p-8 hover:translate-y-[-4px] transition-all text-left shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="h-12 w-12 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-red-500 shadow-sm">
                {kpi.label.includes('Users') || kpi.label.includes('Painters') ? <Users size={22} /> : 
                 kpi.label.includes('Companies') ? <Building2 size={22} /> :
                 kpi.label.includes('Certificates') ? <Award size={22} /> : <Activity size={22} />}
              </div>
              <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20">+{kpi.change}</span>
            </div>
            <p className="text-3xl font-bold text-secondary-900 dark:text-white tracking-tight leading-none mb-1 tabular-nums">{kpi.value}</p>
            <p className="text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] mb-2">{kpi.label}</p>
            <p className="text-[11px] text-slate-400/60 dark:text-white/20 font-medium">{kpi.description}</p>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Weekly Engagement Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-white/[0.06] p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8 text-left">
            <BarChart3 size={18} className="text-red-500" />
            <h3 className="text-sm font-bold text-secondary-900 dark:text-white uppercase tracking-widest">Weekly Engagement</h3>
          </div>
          <div className="flex items-end gap-3 h-40">
            {engagementByDay.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <p className="text-[9px] font-bold text-slate-400 dark:text-white/40 tabular-nums">{d.value}</p>
                <div
                  className="w-full rounded-lg bg-red-500 opacity-60 hover:opacity-100 transition-all cursor-pointer shadow-sm"
                  style={{ height: `${(d.value / maxEngagement) * 100}%`, minHeight: '8px' }}
                />
                <p className="text-[9px] font-bold text-slate-400 dark:text-white/30 uppercase">{d.day}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-slate-50 dark:border-white/5 flex justify-between text-left">
            <div>
              <p className="text-lg font-bold text-secondary-900 dark:text-white tabular-nums">67</p>
              <p className="text-[9px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest">Avg. DAU</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-secondary-900 dark:text-white tabular-nums">91</p>
              <p className="text-[9px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest">Peak (Wed)</p>
            </div>
          </div>
        </div>

        {/* Course Performance Table */}
        <div className="lg:col-span-3 bg-white dark:bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-white/[0.06] overflow-hidden shadow-sm">
          <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center gap-3 text-left">
            <Target size={18} className="text-red-500" />
            <h3 className="text-sm font-bold text-secondary-900 dark:text-white uppercase tracking-widest">Course Performance</h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-white/[0.03]">
            {courseMetrics.map((c, i) => {
              const completionRate = Math.round((c.completions / c.enrolled) * 100)
              return (
                <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-all text-left">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-secondary-900 dark:text-white mb-2">{c.title}</p>
                    <div className="flex items-center gap-4">
                      <div className="h-1.5 flex-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: `${completionRate}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-white/40 tabular-nums">{completionRate}% complete</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 text-right">
                    <div>
                      <p className="text-sm font-bold text-secondary-900 dark:text-white tabular-nums">{c.completions}/{c.enrolled}</p>
                      <p className="text-[9px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest">Enrolled</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Scaling Card */}
      <div className="bg-secondary-900 rounded-2xl p-10 text-left relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-red-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-3">
            <Globe size={28} className="text-red-500" />
            <h3 className="text-xl font-bold text-white">Platform is Scaling</h3>
            <p className="text-white/40 text-sm max-w-md font-medium leading-relaxed">
              Month-over-month growth across all key metrics. Reaching new professional milestones.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-8">
            <div className="text-left">
              <p className="text-3xl font-bold text-white">{growth.users}%</p>
              <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">User Growth</p>
            </div>
            <div className="text-left">
              <p className="text-3xl font-bold text-white">{growth.revenue}%</p>
              <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Revenue Growth</p>
            </div>
            <div className="text-left">
              <p className="text-3xl font-bold text-white">{growth.retention}%</p>
              <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Retention</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
