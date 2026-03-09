import { Clock, Award, Trophy, BarChart3, Target, Calendar, ChevronRight } from 'lucide-react'

export default function MyProgress() {
  return (
    <div className="space-y-8 animate-slide-up pb-10">
      
      {/* ── HEADER SECTION ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-secondary-500">Learning Analytics</h1>
          <p className="text-slate-500 text-sm">Quantifiable breakdown of your professional development.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-white border border-slate-200 rounded-lg flex items-center px-4 py-2 gap-2 shadow-sm">
             <Calendar size={14} className="text-primary-500" />
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active since Mar 2026</span>
           </div>
        </div>
      </div>

      {/* ── METRICS GRID (GEOMETRIC) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         <ProgressStatCard icon={<Trophy size={20} />} title="Global Ranking" value="#42" subtitle="Top 5% Ecosystem" trend="+2 POS" />
         <ProgressStatCard icon={<Clock size={20} />} title="Workshop Hours" value="124 hrs" subtitle="3h 15m / Session" trend="+12H" />
         <ProgressStatCard icon={<BarChart3 size={20} />} title="Expertise Tier" value="Master" subtitle="Intermed. Level 14" trend="+1 LVL" />
         <ProgressStatCard icon={<Target size={20} />} title="Module Quizzes" value="94.2%" subtitle="Exam Performance" trend="+2.5%" />
      </div>

      {/* ── MAIN ANALYTICS GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
         
         {/* Learning Momentum Chart */}
         <div className="lg:col-span-8 bento-card p-8">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
               <h3 className="text-lg font-bold text-secondary-500 uppercase tracking-widest">Weekly Engagement</h3>
               <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-primary-500 rounded-sm"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Watch Time</span>
               </div>
            </div>
            <div className="h-[280px] flex items-end gap-5 px-4">
               {[40, 65, 30, 85, 45, 75, 55].map((val, i) => (
                  <div key={i} className="flex-1 group relative">
                     <div 
                       className="w-full bg-slate-50 border border-slate-100 rounded-t group-hover:bg-primary-500 transition-all duration-300 cursor-pointer relative"
                       style={{ height: `${val}%` }}
                     />
                     <p className="text-[10px] font-bold text-slate-300 text-center mt-4">
                       {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][i]}
                     </p>
                  </div>
               ))}
            </div>
         </div>

         {/* Module Progress Breakdown */}
         <div className="lg:col-span-4 space-y-8">
            <div className="bento-card p-6">
               <h3 className="text-base font-bold text-secondary-500 uppercase tracking-widest mb-6 border-b border-slate-100 pb-4">Module Proficiency</h3>
               <div className="space-y-6">
                  <ModuleProgressBar label="Surface Preparation" progress={85} />
                  <ModuleProgressBar label="Luxury Finishes" progress={42} />
                  <ModuleProgressBar label="Industrial Spraying" progress={15} />
                  <ModuleProgressBar label="Color Matching" progress={68} />
               </div>
               <button className="w-full mt-8 py-3.5 text-[10px] font-bold bg-secondary-500 text-white rounded-md hover:bg-black transition-all uppercase tracking-widest shadow-md">
                 DOWNLOAD DETAILED LOG
               </button>
            </div>

            <div className="bento-card p-6 bg-primary-500 text-white group overflow-hidden relative">
               <div className="relative z-10 space-y-4">
                  <div className="h-10 w-10 bg-white/10 rounded flex items-center justify-center border border-white/20">
                     <Award size={20} />
                  </div>
                  <div className="space-y-1">
                     <h4 className="text-sm font-bold uppercase tracking-tight">Requirement Gap</h4>
                     <p className="text-3xl font-bold tracking-tighter">15h 22m Remaining</p>
                  </div>
                  <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest border-t border-white/10 pt-4">FOR ADVANCED SPRAYING CERTIFICATE</p>
                  <button className="w-full py-2 bg-white text-primary-500 text-[10px] font-bold rounded shadow-lg flex items-center justify-center gap-2 group/btn uppercase tracking-widest">
                     Resumes Goal <ChevronRight size={14} />
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
    <div className="bento-card p-6 h-52 flex flex-col justify-between group hover:border-primary-500 transition-all">
       <div className="flex justify-between items-start">
          <div className="h-10 w-10 bg-slate-50 rounded-md border border-slate-200 flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-all shadow-sm">
            {icon}
          </div>
          <span className="bg-primary-50 text-primary-500 text-[9px] font-bold px-2 py-1 rounded border border-primary-100 uppercase tracking-tighter shadow-sm">
            {trend}
          </span>
       </div>
       <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
          <h3 className="text-2xl font-bold text-secondary-500 tracking-tight leading-none">{value}</h3>
          <p className="text-[10px] font-medium text-slate-400">{subtitle}</p>
       </div>
    </div>
  )
}

function ModuleProgressBar({ label, progress }: { label: string; progress: number }) {
  return (
    <div className="space-y-2">
       <div className="flex justify-between items-end">
          <p className="text-[11px] font-bold text-secondary-500 tracking-tight uppercase tracking-widest">{label}</p>
          <p className="text-[10px] font-bold text-primary-500">{progress}%</p>
       </div>
       <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
          <div className="h-full bg-primary-500" style={{ width: `${progress}%` }} />
       </div>
    </div>
  )
}
