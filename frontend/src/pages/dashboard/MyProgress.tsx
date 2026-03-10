import { Clock, Award, Trophy, BarChart3, Target, Calendar, ChevronRight } from 'lucide-react'

export default function MyProgress() {
  return (
    <div className="space-y-10 animate-slide-up pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="space-y-1 text-left">
          <h1 className="text-2xl font-bold tracking-tight text-secondary-900 leading-none">My Progress</h1>
          <p className="text-slate-500 text-sm font-medium">Track your learning journey and professional growth.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-white border border-slate-200 rounded-xl flex items-center px-4 py-2 gap-2 shadow-sm">
             <Calendar size={14} className="text-primary-500" />
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Joined March 2026</span>
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         <ProgressStatCard icon={<Trophy size={20} />} title="Performance" value="#42" subtitle="Global Rank" trend="+2 positions" />
         <ProgressStatCard icon={<Clock size={20} />} title="Total Time" value="124 hrs" subtitle="3h 15m average" trend="+12 hours" />
         <ProgressStatCard icon={<BarChart3 size={20} />} title="Current Level" value="Master" subtitle="Intermediate L14" trend="+1 Level" />
         <ProgressStatCard icon={<Target size={20} />} title="Quiz Average" value="94.2%" subtitle="Exam performance" trend="+2.5%" />
      </div>

      {/* Main Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
         
         {/* Chart Section */}
         <div className="lg:col-span-8 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-left">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
               <h3 className="text-sm font-bold text-secondary-900 uppercase tracking-widest">Weekly Activity</h3>
               <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-primary-500 rounded-sm" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Learning Hours</span>
               </div>
            </div>
            <div className="h-[250px] flex items-end gap-5 px-4 pt-4">
               {[40, 65, 30, 85, 45, 75, 55].map((val, i) => (
                  <div key={i} className="flex-1 group relative">
                     <div 
                       className="w-full bg-slate-50 border border-slate-100 rounded-t-lg group-hover:bg-primary-500 transition-all duration-300 cursor-pointer"
                       style={{ height: `${val}%` }}
                     />
                     <p className="text-[10px] font-bold text-slate-300 text-center mt-4">
                       {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][i]}
                     </p>
                  </div>
               ))}
            </div>
         </div>

         {/* Breakdown Section */}
         <div className="lg:col-span-4 space-y-8 text-left">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
               <h3 className="text-xs font-bold text-secondary-900 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Skill Breakdown</h3>
               <div className="space-y-6">
                  <ModuleProgressBar label="Surface Prep" progress={85} />
                  <ModuleProgressBar label="Luxury Finishes" progress={42} />
                  <ModuleProgressBar label="Industrial Spray" progress={15} />
                  <ModuleProgressBar label="Color Matching" progress={68} />
               </div>
               <button className="w-full mt-8 py-4 text-[10px] font-bold bg-secondary-900 text-white rounded-xl hover:bg-black transition-all uppercase tracking-widest shadow-lg">
                 Export Activity Report
               </button>
            </div>

            <div className="bg-primary-500 p-8 rounded-2xl text-white group overflow-hidden relative shadow-xl">
               <div className="relative z-10 space-y-6">
                  <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                     <Award size={24} />
                  </div>
                  <div className="space-y-2">
                     <h4 className="text-xs font-bold uppercase tracking-widest text-white/70">Next Certification</h4>
                     <p className="text-3xl font-bold tracking-tight">15h 22m Left</p>
                  </div>
                  <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest border-t border-white/10 pt-4 leading-relaxed">Required for Advanced Spraying Specialist badge</p>
                  <button className="w-full py-3 bg-white text-primary-500 text-[10px] font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 group/btn uppercase tracking-widest active:scale-95 transition-all">
                     View Goals <ChevronRight size={14} />
                  </button>
               </div>
            </div>
         </div>

      </div>
    </div>
  )
}

function ProgressStatCard({ icon, title, value, subtitle, trend }: { icon: React.ReactNode; title: string; value: string; subtitle: string; trend: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-primary-500 transition-all text-left">
       <div className="flex justify-between items-start mb-6">
          <div className="h-12 w-12 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-all shadow-sm">
            {icon}
          </div>
          <span className="bg-primary-50 text-primary-500 text-[10px] font-bold px-3 py-1.5 rounded-full border border-primary-50/50 uppercase tracking-tight">
            {trend}
          </span>
       </div>
       <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
          <h3 className="text-2xl font-bold text-secondary-900 tracking-tight leading-none">{value}</h3>
          <p className="text-[10px] font-medium text-slate-400 mt-1">{subtitle}</p>
       </div>
    </div>
  )
}

function ModuleProgressBar({ label, progress }: { label: string; progress: number }) {
  return (
    <div className="space-y-2.5">
       <div className="flex justify-between items-end">
          <p className="text-[10px] font-bold text-secondary-900 uppercase tracking-widest">{label}</p>
          <p className="text-[10px] font-bold text-primary-500">{progress}%</p>
       </div>
       <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/20">
          <div className="h-full bg-primary-500 transition-all duration-1000" style={{ width: `${progress}%` }} />
       </div>
    </div>
  )
}
