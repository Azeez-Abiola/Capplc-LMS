import { useState, useEffect } from 'react'
import { DollarSign, CreditCard, Building2, Activity, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { superAdminService, type RevenueMetric, type CompanyRevenue } from '../../services/superAdminService'
import CustomDropdown from '../../components/ui/CustomDropdown'
import CustomCalendar from '../../components/ui/CustomCalendar'
import LogoLoader from '../../components/ui/LogoLoader'

export default function SuperAdminRevenue() {
  const [period, setPeriod] = useState('30d')
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [monthlyRevenue, setMonthlyRevenue] = useState<RevenueMetric[]>([])
  const [topCompanies, setTopCompanies] = useState<CompanyRevenue[]>([])
  const [loading, setLoading] = useState(true)
  const [revenueStats, setRevenueStats] = useState({ mrr: 0, payingCompanies: 0, totalRevenue: 0 })

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
        const [revData, top] = await Promise.all([
          superAdminService.getRevenueTrend(),
          superAdminService.getTopCompaniesRevenue()
        ])
        setMonthlyRevenue(revData.trend)
        setRevenueStats({
          mrr: revData.mrr,
          payingCompanies: revData.payingCompanies,
          totalRevenue: revData.totalRevenue
        })
        setTopCompanies(top)
      } catch (error) {
        console.error('Revenue fetch error:', error)
        toast.error('Failed to load revenue data')
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

  const maxAmount = Math.max(...monthlyRevenue.map(m => m.amount)) || 1

  return (
    <div className="space-y-10 animate-slide-up pb-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left border-b border-slate-200 dark:border-white/5 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-2 w-12 bg-red-500 rounded-full" />
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-[0.3em]">Financial Overview</span>
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white tracking-tight leading-none">
            Revenue <span className="text-red-500">Dashboard</span>
          </h1>
          <p className="text-slate-500 dark:text-white/40 font-medium max-w-lg text-sm">Track all subscription payments, company billing, and platform earnings.</p>
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

      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <RevenueCard icon={<DollarSign size={22} />} label="Total Revenue" value={`₦${revenueStats.totalRevenue.toLocaleString()}`} change="+34%" up />
        <RevenueCard icon={<CreditCard size={22} />} label="Monthly Recurring" value={`₦${revenueStats.mrr.toLocaleString()}`} change="+16%" up />
        <RevenueCard icon={<Building2 size={22} />} label="Paying Companies" value={revenueStats.payingCompanies.toString()} change="+2" up />
        <RevenueCard icon={<Activity size={22} />} label="Avg. Per Company" value={`₦${revenueStats.payingCompanies > 0 ? Math.round(revenueStats.totalRevenue / revenueStats.payingCompanies).toLocaleString() : 0}`} change="-5%" up={false} />
      </div>

      {/* Revenue Chart */}
      <div className="bg-white dark:bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-white/[0.06] p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8 text-left">
          <div>
            <h3 className="text-sm font-bold text-secondary-900 dark:text-white uppercase tracking-widest">Monthly Revenue Trend</h3>
            <p className="text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest mt-1">Last 6 months</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 rounded-xl">
            <TrendingUp size={14} className="text-red-500" />
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Growing</span>
          </div>
        </div>
        <div className="flex items-end gap-4 h-48">
          {monthlyRevenue.map((m, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-3">
              <p className="text-[10px] font-bold text-slate-400 dark:text-white/60 tabular-nums">₦{(m.amount / 1000000).toFixed(1)}M</p>
              <div className="w-full bg-slate-50 dark:bg-white/5 rounded-xl overflow-hidden relative group" style={{ height: `${(m.amount / maxAmount) * 100}%`, minHeight: '16px' }}>
                <div className="absolute inset-0 bg-red-500 opacity-80 group-hover:opacity-100 transition-opacity rounded-xl" />
              </div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest">{m.month}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Revenue Companies */}
      <div className="bg-white dark:bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-white/[0.06] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 dark:border-white/5 text-left">
          <h3 className="text-sm font-bold text-secondary-900 dark:text-white uppercase tracking-widest">Top Revenue Companies</h3>
          <p className="text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest mt-1">Sorted by total lifetime revenue</p>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-white/[0.03]">
          {topCompanies.length > 0 ? topCompanies.map((c, i) => (
            <div key={i} className="flex items-center justify-between px-8 py-6 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-all group">
              <div className="flex items-center gap-5">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center font-bold text-red-500 text-sm border border-slate-200 dark:border-white/10 group-hover:border-red-500 transition-all shadow-sm overflow-hidden bg-white dark:bg-transparent shrink-0">
                  {c.logo_url ? (
                    <img src={c.logo_url} alt={c.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="group-hover:text-red-600">{c.name.charAt(0)}</span>
                  )}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-secondary-900 dark:text-white group-hover:text-red-500 transition-colors">{c.name}</p>
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${c.tier === 'ELITE' ? 'text-red-500' : 'text-slate-400'}`}>{c.tier}</span>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-sm font-bold text-secondary-900 dark:text-white tabular-nums">₦{c.revenue.toLocaleString()}</p>
                  <div className={`flex items-center gap-1 justify-end ${c.growth >= 0 ? 'text-red-500' : 'text-slate-400'}`}>
                    {c.growth >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    <span className="text-[10px] font-bold">{Math.abs(c.growth)}%</span>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
               <Activity size={48} className="text-slate-200 dark:text-white/10" />
               <p className="text-sm font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest">No company revenue data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function RevenueCard({ icon, label, value, change, up }: { icon: React.ReactNode; label: string; value: string; change: string; up: boolean }) {
  return (
    <div className="bg-white dark:bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-slate-100 dark:border-white/[0.06] p-8 hover:translate-y-[-4px] transition-all shadow-sm text-left">
      <div className="flex items-center justify-between mb-6">
        <div className="h-12 w-12 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-400 dark:text-white/40 shadow-sm">{icon}</div>
        <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-[10px] font-bold ${up ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
          {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {change}
        </div>
      </div>
      <p className="text-2xl font-bold text-secondary-900 dark:text-white tracking-tight mb-1 tabular-nums">{value}</p>
      <p className="text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-[0.2em]">{label}</p>
    </div>
  )
}
