import { Users, TrendingUp, CreditCard, Plus, ArrowRight, ShieldCheck } from 'lucide-react'
import { useState } from 'react'

export default function CompanyDashboard() {
  const [stats] = useState({
    totalPainters: 12,
    activePainters: 8,
    certificationsEarned: 45,
    subscriptionStatus: 'Pro Company'
  })

  return (
    <div className="space-y-12 animate-slide-up pb-10">
      
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left border-b border-slate-100 pb-10">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="h-2 w-12 bg-primary-500 rounded-full" />
              <span className="text-[10px] font-bold text-primary-500 uppercase tracking-[0.3em]">Company Console</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-black text-secondary-900 tracking-tight leading-none">
              Team <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-orange-600">Dashboard</span>
           </h1>
           <p className="text-slate-500 font-medium max-w-md text-sm leading-relaxed">Manage your painting workforce and track overall training progress.</p>
        </div>
        <div className="flex gap-4">
           <button className="h-14 px-8 bg-primary-500 text-white font-bold rounded-2xl text-xs uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl shadow-primary-500/20 active:scale-95 flex items-center gap-3 group">
              <Plus size={18} /> Add New Painter
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         <StatCard icon={<Users size={24} />} label="Total Painters" value={stats.totalPainters} />
         <StatCard icon={<TrendingUp size={24} />} label="Daily Active" value={stats.activePainters} />
         <StatCard icon={<ShieldCheck size={24} />} label="Certs Earned" value={stats.certificationsEarned} />
         <StatCard icon={<CreditCard size={24} />} label="Plan" value={stats.subscriptionStatus} isPrimary />
      </div>

      {/* Team Progress Section */}
      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm text-left">
         <h3 className="text-sm font-bold text-secondary-900 uppercase tracking-widest mb-8">Recent Team Activity</h3>
         <div className="space-y-6">
            {[1, 2, 3].map((_, i) => (
               <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all">
                  <div className="flex items-center gap-4">
                     <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center font-bold text-primary-500 border border-slate-200">
                        {['BK', 'SO', 'IA'][i]}
                     </div>
                     <div>
                        <p className="text-sm font-bold text-secondary-900">{['Bolu K.', 'Sarah O.', 'Imran A.'][i]}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Completed: Color Mixology</p>
                     </div>
                  </div>
                  <button className="text-primary-500 hover:text-primary-600 transition-colors">
                     <ArrowRight size={18} />
                  </button>
               </div>
            ))}
         </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, isPrimary = false }: any) {
  return (
    <div className={`p-8 rounded-3xl border transition-all ${isPrimary ? 'bg-secondary-900 text-white border-none' : 'bg-white border-slate-100 hover:shadow-xl'}`}>
       <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-6 shadow-inner ${isPrimary ? 'bg-white/5 text-primary-500' : 'bg-slate-50 text-primary-500'}`}>
          {icon}
       </div>
       <p className="text-3xl font-black tracking-tight leading-none mb-2">{value}</p>
       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</p>
    </div>
  )
}
