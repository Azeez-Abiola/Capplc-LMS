import { Users, Target, ShieldCheck, Award, Zap, Clock, ChevronRight } from 'lucide-react'

export default function Analytics() {
  return (
    <div className="space-y-10 animate-slide-up pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 text-left">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-secondary-900 leading-none">Platform Performance</h1>
          <p className="text-slate-500 text-sm font-medium">Detailed insights into user engagement and module completion.</p>
        </div>
        <div className="flex p-1 bg-slate-100/50 rounded-xl border border-slate-100 shadow-sm">
           {['24H', '7D', '30D', 'YTD'].map((period) => (
             <button 
               key={period} 
               className={`px-5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${period === '30D' ? 'bg-white text-primary-500 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-secondary-900'}`}
             >
               {period}
             </button>
           ))}
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
         <AnalyticsStatCard title="Active Users" value="1.2k" trend="+12%" icon={<Users size={22} />} description="Users active on the platform." />
         <AnalyticsStatCard title="Engagement" value="68.4%" trend="+5.2%" icon={<Zap size={22} />} description="Module interaction frequency." />
         <AnalyticsStatCard title="Certifications" value="142" trend="+14" icon={<Target size={22} />} description="New certificates generated." />
         <AnalyticsStatCard title="User Retention" value="94.2%" trend="+2.4%" icon={<ShieldCheck size={22} />} description="Stable account activity rate." />
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
            
            <div className="h-[350px] flex items-end gap-4 px-2">
               {[40, 65, 30, 85, 45, 75, 55, 95, 40, 80, 50, 65].map((val, i) => (
                  <div key={i} className="flex-1 group relative">
                     <div 
                       className="w-full bg-slate-50 border border-slate-50 rounded-lg group-hover:bg-primary-500 transition-all duration-300 cursor-pointer relative shadow-inner"
                       style={{ height: `${val}%` }}
                     />
                     <p className="text-[10px] font-bold text-slate-300 text-center mt-6 uppercase tracking-tight">
                       {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                     </p>
                  </div>
               ))}
            </div>
         </div>

         {/* Supplemental Statistics Feed */}
         <div className="lg:col-span-4 space-y-10">
            <div className="p-8 bg-secondary-900 rounded-3xl relative overflow-hidden group shadow-xl transition-all hover:scale-[1.02]">
               <div className="flex items-center gap-4 border-b border-white/10 pb-6 mb-8 relative z-10">
                  <div className="h-10 w-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                    <Award size={22} className="text-primary-500" />
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest leading-none">Certificate Distribution</h3>
               </div>
               <div className="space-y-6 relative z-10">
                  <ChartRatio label="Luxury Mastery" value={45} />
                  <ChartRatio label="Technical Standards" value={30} />
                  <ChartRatio label="Safety & Compliance" value={15} />
                  <ChartRatio label="Project Management" value={10} />
               </div>
               <div className="pt-8 border-t border-white/5 relative z-10 mt-8 text-center space-y-4">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.25em]">Monthly Target Completion</p>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
                     <div className="h-full w-[71%] bg-primary-500 shadow-[0_0_15px_rgba(255,94,36,0.3)] transition-all" />
                  </div>
               </div>
               <div className="absolute top-0 right-0 h-[250px] w-[250px] bg-primary-500/5 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="p-8 bg-primary-500 text-white rounded-3xl relative overflow-hidden group shadow-xl transition-all hover:shadow-primary-500/20">
               <div className="relative z-10 space-y-8">
                  <div className="h-12 w-12 bg-white/15 rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                     <Clock size={24} />
                  </div>
                  <div className="space-y-2">
                     <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">System Throughput</h4>
                     <p className="text-2xl font-bold tracking-tight">+4.2x Module Efficiency</p>
                  </div>
                  <button className="w-full py-4 bg-white text-primary-500 text-[10px] font-bold rounded-xl flex items-center justify-center gap-3 group/btn uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95 hover:bg-secondary-900 hover:text-white">
                     View Complete Stats <ChevronRight size={16} />
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
