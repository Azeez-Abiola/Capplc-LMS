import { Search, Filter, Activity, ArrowUpRight, CheckCircle2, AlertCircle, TrendingUp, DollarSign, ChevronRight } from 'lucide-react'

export default function PaymentsMonitor() {
  return (
    <div className="space-y-10 animate-slide-up pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 text-left">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-secondary-900 leading-none">Payments & Revenue</h1>
          <p className="text-slate-500 text-sm font-medium">Track platform earnings and transaction history.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-white border border-slate-200 rounded-xl flex items-center px-4 py-2.5 shadow-sm group focus-within:ring-4 focus-within:ring-primary-50 transition-all">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Lookup Transaction..." 
                className="bg-transparent border-none outline-none text-sm font-medium ml-3 w-48 text-secondary-900 placeholder:text-slate-300 tracking-tight" 
              />
           </div>
           <button className="h-11 w-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary-500 transition-all shadow-sm">
             <Filter size={18} />
           </button>
        </div>
      </div>

      {/* Revenue Snapshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
         <PaymentMetricCard title="Total Platform Revenue" value="₦2,450,000" trend="+15% MTD" icon={<DollarSign size={24} />} isPrimary />
         <PaymentMetricCard title="Active Processing" value="₦1,240,000" trend="Gateway Active" icon={<Activity size={24} />} />
         <PaymentMetricCard title="Platform Renewal Rate" value="94.2%" trend="+2.4% MoM" icon={<TrendingUp size={24} />} />
      </div>

      {/* Transaction Records */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/10">
             <h3 className="text-xs font-bold text-secondary-900 uppercase tracking-widest leading-none">Recent Transactions</h3>
             <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-sm" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Gateway Operational</span>
             </div>
          </div>
          <div className="overflow-x-auto no-scrollbar">
             <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/5 border-b border-slate-100 whitespace-nowrap">
                   <tr>
                      <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Recipient</th>
                      <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Service Plan</th>
                      <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Amount (NGN)</th>
                      <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Status</th>
                      <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {[
                     { id: 'TX-993-A', name: 'Imran Ali', tier: 'Professional', amount: '15,000.00', status: 'Approved', date: '2 MINS AGO' },
                     { id: 'TX-102-B', name: 'Sarah Biu', tier: 'Standard', amount: '5,000.00', status: 'Approved', date: '15 MINS AGO' },
                     { id: 'TX-045-C', name: 'David Okafor', tier: 'Professional', amount: '15,000.00', status: 'Declined', date: '1 HOUR AGO' },
                     { id: 'TX-221-D', name: 'Michael Taiwo', tier: 'Standard', amount: '5,000.00', status: 'Approved', date: '3 HOURS AGO' },
                   ].map((tx, i) => (
                     <tr key={i} className="hover:bg-slate-50/50 transition-colors group cursor-pointer border-l-4 border-l-transparent hover:border-l-primary-500">
                        <td className="px-10 py-8">
                           <div className="space-y-1.5">
                              <p className="text-sm font-bold text-secondary-900 uppercase tracking-tight group-hover:text-primary-500 transition-colors">{tx.name}</p>
                              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-none">{tx.date}</p>
                           </div>
                        </td>
                        <td className="px-10 py-8">
                           <span className={`px-3 py-1.5 rounded-lg text-[9px] font-bold tracking-widest uppercase border transition-all ${tx.tier === 'Professional' ? 'bg-primary-50/50 text-primary-500 border-primary-50 group-hover:bg-primary-500 group-hover:text-white group-hover:border-primary-500' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>{tx.tier}</span>
                        </td>
                        <td className="px-10 py-8">
                           <p className={`text-xl font-bold tracking-tighter tabular-nums ${tx.status === 'Declined' ? 'line-through text-slate-200' : 'text-secondary-900'}`}>₦{tx.amount}</p>
                        </td>
                        <td className="px-10 py-8">
                           <div className={`flex items-center gap-3 px-3 py-1.5 rounded-lg border w-fit shadow-xs ${tx.status === 'Approved' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                              {tx.status === 'Approved' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                              <span className="text-[10px] font-bold uppercase tracking-widest leading-none">{tx.status}</span>
                           </div>
                        </td>
                        <td className="px-10 py-8">
                           <button className="h-11 w-11 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 hover:text-primary-500 hover:border-primary-500 transition-all shadow-sm active:scale-95"><ArrowUpRight size={18} /></button>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
          <div className="p-8 bg-slate-50/30 text-center border-t border-slate-50">
             <button className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] hover:text-primary-500 transition-all flex items-center justify-center gap-3 mx-auto active:scale-95">
                Download Complete Revenue History (12,400 Records) <ChevronRight size={16} />
             </button>
          </div>
       </div>

    </div>
  )
}

function PaymentMetricCard({ title, value, trend, icon, isPrimary = false }: { title: string; value: string; trend: string; icon: React.ReactNode; isPrimary?: boolean }) {
  return (
    <div className={`p-10 rounded-3xl flex flex-col justify-between h-60 transition-all hover:scale-[1.02] shadow-sm hover:shadow-xl ${isPrimary ? 'bg-secondary-900 border-none text-white' : 'bg-white border border-slate-100'}`}>
       <div className="flex justify-between items-start">
          <div className={`h-14 w-14 rounded-2xl border flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 ${isPrimary ? 'bg-white/5 text-primary-500 border-white/10' : 'bg-slate-50 text-primary-500 border-slate-100'}`}>
            {icon}
          </div>
          <span className={`text-[10px] font-bold px-4 py-2 rounded-xl border uppercase tracking-widest shadow-lg ${isPrimary ? 'bg-primary-500 text-white border-primary-400' : 'bg-primary-50/50 text-primary-500 border-primary-50'}`}>
            {trend}
          </span>
       </div>
       <div className="space-y-4">
          <p className={`text-[10px] font-bold uppercase tracking-[0.25em] border-l-4 pl-4 leading-none ${isPrimary ? 'border-primary-500 text-slate-500' : 'border-slate-100 text-slate-400'}`}>{title}</p>
          <h3 className={`text-3xl font-bold tracking-tight leading-none tabular-nums ${isPrimary ? 'text-white' : 'text-secondary-900'}`}>{value}</h3>
       </div>
    </div>
  )
}
