import { Search, Filter, Activity, ArrowUpRight, CheckCircle2, AlertCircle, TrendingUp, DollarSign, ChevronRight } from 'lucide-react'

export default function PaymentsMonitor() {
  return (
    <div className="space-y-8 animate-slide-up pb-10">
      
      {/* ── HEADER SECTION ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-secondary-500 uppercase tracking-widest leading-none">Financial Ledger</h1>
          <p className="text-slate-500 text-sm font-medium">Revenue Monitoring • Transactional Gateway Audit • Subscription Tracking</p>
        </div>
        <div className="flex gap-3">
           <div className="bg-white border border-slate-200 rounded-lg flex items-center px-4 py-2.5 shadow-sm group focus-within:ring-2 focus-within:ring-primary-100 transition-all">
              <Search size={16} className="text-slate-400" />
              <input type="text" placeholder="Lookup TX-ID..." className="bg-transparent border-none outline-none text-xs font-bold ml-2 w-48 text-secondary-500 placeholder:text-slate-300" />
           </div>
           <button className="h-10 w-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary-500 transition-all shadow-sm">
             <Filter size={16} />
           </button>
        </div>
      </div>

      {/* ── REVENUE METRICS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
         <PaymentMetricCard title="Gross Ecosystem Revenue" value="₦2,450,000" trend="+15% MTD" icon={<DollarSign size={20} />} isPrimary />
         <PaymentMetricCard title="Gateway Processing" value="₦1,240,000" trend="Active Bridge" icon={<Activity size={20} />} />
         <PaymentMetricCard title="Churn Protection" value="94.2%" trend="+2.4% MoM" icon={<TrendingUp size={20} />} />
      </div>

      {/* ── TRANSACTION LEDGER ── */}
      <div className="bento-card overflow-hidden bg-white shadow-md">
         <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-sm font-bold text-secondary-500 uppercase tracking-widest">Live Transaction Stream</h3>
            <div className="flex items-center gap-2">
               <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">MONNIFY GATEWAY LINKED</span>
            </div>
         </div>
         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
               <thead className="bg-slate-50/30 border-b border-slate-100">
                  <tr>
                     <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Professional Identity</th>
                     <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Billing Tier</th>
                     <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Amount (NGN)</th>
                     <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                     <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Management</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {[
                    { id: 'TX-993-A', name: 'Imran Ali', tier: 'ELITE PRO', amount: '15,000.00', status: 'Approved', date: '2 MINS AGO' },
                    { id: 'TX-102-B', name: 'Sarah Biu', tier: 'STANDARD', amount: '5,000.00', status: 'Approved', date: '15 MINS AGO' },
                    { id: 'TX-045-C', name: 'David Okafor', tier: 'ELITE PRO', amount: '15,000.00', status: 'Declined', date: '1 HOUR AGO' },
                    { id: 'TX-221-D', name: 'Michael Taiwo', tier: 'STANDARD', amount: '5,000.00', status: 'Approved', date: '3 HOURS AGO' },
                  ].map((tx, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group cursor-pointer border-l-2 border-l-transparent hover:border-l-primary-500">
                       <td className="px-6 py-4">
                          <div className="space-y-0.5">
                             <p className="text-xs font-bold text-secondary-500 uppercase tracking-tight">{tx.name}</p>
                             <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{tx.date}</p>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-[8px] font-bold tracking-widest uppercase border ${tx.tier === 'ELITE PRO' ? 'bg-primary-50 text-primary-500 border-primary-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>{tx.tier}</span>
                       </td>
                       <td className="px-6 py-4">
                          <p className={`text-lg font-bold tracking-tighter tabular-nums ${tx.status === 'Declined' ? 'line-through text-slate-200' : 'text-secondary-500'}`}>₦{tx.amount}</p>
                       </td>
                       <td className="px-6 py-4">
                          <div className={`flex items-center gap-2 px-2 py-1 rounded w-fit border ${tx.status === 'Approved' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                             {tx.status === 'Approved' ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                             <span className="text-[8px] font-bold uppercase tracking-widest">{tx.status}</span>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <button className="h-8 w-8 bg-white border border-slate-200 rounded flex items-center justify-center text-slate-300 hover:text-primary-500 hover:border-primary-500 transition-all shadow-sm"><ArrowUpRight size={14} /></button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
         <div className="p-4 bg-slate-50/30 text-center border-t border-slate-100">
            <button className="text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:text-primary-500 transition-colors flex items-center justify-center gap-1 mx-auto">Access Historical Ledger (12,400 Records) <ChevronRight size={12} /></button>
         </div>
      </div>

    </div>
  )
}

function PaymentMetricCard({ title, value, trend, icon, isPrimary = false }: { title: string; value: string; trend: string; icon: React.ReactNode; isPrimary?: boolean }) {
  return (
    <div className={`bento-card p-8 flex flex-col justify-between h-52 transition-transform hover:-translate-y-1 ${isPrimary ? 'bg-secondary-900 border-none text-white shadow-xl' : 'bg-white shadow-md'}`}>
       <div className="flex justify-between items-start">
          <div className={`h-10 w-10 rounded border flex items-center justify-center shadow-sm ${isPrimary ? 'bg-white/10 text-primary-500 border-white/5' : 'bg-slate-50 text-primary-500 border-slate-200'}`}>
            {icon}
          </div>
          <span className={`text-[9px] font-bold px-2 py-1 rounded border uppercase tracking-widest shadow-sm ${isPrimary ? 'bg-primary-500 text-white border-primary-400' : 'bg-primary-50 text-primary-500 border-primary-100'}`}>
            {trend}
          </span>
       </div>
       <div className="space-y-1">
          <p className={`text-[9px] font-bold uppercase tracking-widest border-l-2 pl-3 ${isPrimary ? 'border-primary-500 text-slate-500' : 'border-slate-100 text-slate-300'}`}>{title}</p>
          <h3 className={`text-2xl font-bold tracking-tight ${isPrimary ? 'text-white' : 'text-secondary-500'}`}>{value}</h3>
       </div>
    </div>
  )
}
