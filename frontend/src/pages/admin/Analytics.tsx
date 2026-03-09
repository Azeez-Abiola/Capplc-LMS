import { Users, Target, ShieldCheck, Award, Zap, Clock, ChevronRight } from 'lucide-react'

export default function Analytics() {
  return (
    <div className="space-y-8 animate-slide-up pb-10">
      
      {/* ── HEADER SECTION ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-secondary-500 uppercase tracking-widest leading-none">System Analytics</h1>
          <p className="text-slate-500 text-sm font-medium">Ecosystem Pulse • Painter Retention & Module Velocity Metrics</p>
        </div>
        <div className="flex p-1 bg-slate-100/50 rounded-lg border border-slate-100">
           {['24H', '7D', '30D', 'YTD'].map((period) => (
             <button 
               key={period} 
               className={`px-4 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all ${period === '30D' ? 'bg-white text-primary-500 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-secondary-500'}`}
             >
               {period}
             </button>
           ))}
        </div>
      </div>

      {/* ── METRIC TILES ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         <AnalyticsStatCard title="Painter Flux" value="1.2k" trend="+12%" icon={<Users size={20} />} description="Daily active professional count" />
         <AnalyticsStatCard title="Interaction" value="68.4%" trend="+5.2%" icon={<Zap size={20} />} description="Module engagement baseline" />
         <AnalyticsStatCard title="Certs Issued" value="142" trend="+14" icon={<Target size={20} />} description="Accreditation generation rate" />
         <AnalyticsStatCard title="Retention" value="94.2%" trend="+2.4%" icon={<ShieldCheck size={20} />} description="Subscription stability Index" />
      </div>

      {/* ── DATA VISUALIZATION GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
         
         {/* Main Chart */}
         <div className="lg:col-span-8 bento-card p-8 bg-white shadow-md">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
               <h3 className="text-sm font-bold text-secondary-500 uppercase tracking-widest">Platform Traffic Momentum</h3>
               <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-primary-500 rounded-sm"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Painter Activity</span>
               </div>
            </div>
            
            <div className="h-[320px] flex items-end gap-3 px-2">
               {[40, 65, 30, 85, 45, 75, 55, 95, 40, 80, 50, 65].map((val, i) => (
                  <div key={i} className="flex-1 group relative">
                     <div 
                       className="w-full bg-slate-50 border border-slate-100 rounded-t group-hover:bg-primary-500 transition-all duration-300 cursor-pointer relative"
                       style={{ height: `${val}%` }}
                     />
                     <p className="text-[9px] font-bold text-slate-300 text-center mt-4">
                       {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                     </p>
                  </div>
               ))}
            </div>
         </div>

         {/* Sidebar Mix */}
         <div className="lg:col-span-4 space-y-8">
            <div className="bento-card p-6 bg-secondary-900 border-none relative overflow-hidden group shadow-xl">
               <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6 relative z-10">
                  <Award size={20} className="text-primary-500" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">Accreditation Distribution</h3>
               </div>
               <div className="space-y-5 relative z-10">
                  <ChartRatio label="Luxury Mastery" value={45} />
                  <ChartRatio label="Surface Standards" value={30} />
                  <ChartRatio label="Safety Elite" value={15} />
                  <ChartRatio label="Project Mgmt" value={10} />
               </div>
               <div className="pt-6 border-t border-white/5 relative z-10 mt-6 text-center">
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">Goal Alignment: 200 MTD</p>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full w-[71%] bg-primary-500" />
                  </div>
               </div>
            </div>

            <div className="bento-card p-6 bg-primary-500 text-white relative overflow-hidden group">
               <div className="relative z-10 space-y-4">
                  <div className="h-10 w-10 bg-white/10 rounded flex items-center justify-center border border-white/10">
                     <Clock size={20} />
                  </div>
                  <div className="space-y-1">
                     <h4 className="text-sm font-bold uppercase tracking-tight">Ecosystem Speed</h4>
                     <p className="text-2xl font-bold tracking-tighter">+4.2 Avg. Pacing Factor</p>
                  </div>
                  <button className="w-full py-2.5 bg-white text-primary-500 text-[10px] font-bold rounded flex items-center justify-center gap-2 group/btn uppercase tracking-widest shadow-md">
                     Optimize Logic <ChevronRight size={14} />
                  </button>
               </div>
            </div>
         </div>

      </div>
    </div>
  )
}

function AnalyticsStatCard({ title, value, trend, icon, description }: { title: string; value: string; trend: string; icon: React.ReactNode; description: string }) {
  return (
    <div className="bento-card p-6 h-52 flex flex-col justify-between group hover:border-primary-500 transition-all bg-white shadow-sm">
       <div className="flex justify-between items-start">
          <div className="h-10 w-10 bg-slate-50 rounded border border-slate-200 flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-all shadow-sm">
            {icon}
          </div>
          <span className="bg-primary-50 text-primary-500 text-[9px] font-bold px-2 py-1 rounded border border-primary-100 uppercase tracking-widest shadow-sm">
            {trend}
          </span>
       </div>
       <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
          <h3 className="text-2xl font-bold text-secondary-500 tracking-tight leading-none">{value}</h3>
          <p className="text-[9px] font-medium text-slate-400 uppercase leading-none pt-1">{description}</p>
       </div>
    </div>
  )
}

function ChartRatio({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-2">
       <div className="flex justify-between items-end">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">{label}</p>
          <p className="text-[9px] font-bold text-primary-500 leading-none">{value}%</p>
       </div>
       <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
          <div className="h-full bg-primary-500" style={{ width: `${value}%` }} />
       </div>
    </div>
  )
}
