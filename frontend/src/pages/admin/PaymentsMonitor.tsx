import { Search, Activity, ArrowUpRight, CheckCircle2, AlertCircle, TrendingUp, DollarSign, Download, X, Calendar, User, Receipt, CreditCard } from 'lucide-react'
import LogoLoader from '../../components/ui/LogoLoader'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { paymentService } from '../../services/paymentService'
import { analyticsService } from '../../services/analyticsService'

export default function PaymentsMonitor() {
  const [selectedTx, setSelectedTx] = useState<any>(null)
  const [payments, setPayments] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [payData, statsData] = await Promise.all([
          paymentService.getAllPaymentsAdmin(),
          analyticsService.getAdminStats()
        ])
        setPayments(payData || [])
        setStats(statsData)
      } catch (err) {
        console.error('Payments error:', err)
        toast.error('Failed to load transaction history')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <LogoLoader fullscreen />
  }

  return (
    <>
      <div className="space-y-10 animate-slide-up pb-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 text-left">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-secondary-900 leading-none">Payments &amp; Revenue</h1>
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
             <button onClick={() => toast.success('Table data exported')} className="h-11 px-6 bg-secondary-900 text-white border border-secondary-900 rounded-xl flex items-center justify-center font-bold text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95 gap-2">
               <Download size={14} /> Export
             </button>
          </div>
        </div>

        {/* Revenue Snapshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
           <PaymentMetricCard title="Total Platform Revenue" value={`₦${(stats?.revenue || 0).toLocaleString()}`} trend="Live" icon={<DollarSign size={24} />} isPrimary />
           <PaymentMetricCard title="Active Subscriptions" value={stats?.activeSubscriptions?.toString() || '0'} trend="System" icon={<Activity size={24} />} />
           <PaymentMetricCard title="Total Company Teams" value={stats?.totalUsers?.toString() || '0'} trend="Verified" icon={<TrendingUp size={24} />} />
        </div>

        {/* Transaction Records */}
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/10 text-left">
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
                        <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Payer/Company Name</th>
                        <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Service Plan</th>
                        <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Amount (NGN)</th>
                        <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Status</th>
                        <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {payments.length > 0 ? (
                       payments.map((tx: any, i: number) => (
                         <tr key={i} className="hover:bg-slate-50/50 transition-colors group cursor-pointer border-l-4 border-l-transparent hover:border-l-primary-500">
                            <td className="px-10 py-8 text-left">
                               <div className="space-y-1.5">
                                  <p className="text-sm font-bold text-secondary-900 uppercase tracking-tight group-hover:text-primary-500 transition-colors">{tx.profiles?.first_name} {tx.profiles?.last_name}</p>
                                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-none">{new Date(tx.created_at).toLocaleDateString()}</p>
                               </div>
                            </td>
                            <td className="px-10 py-8 text-left">
                               <span className={`px-3 py-1.5 rounded-lg text-[9px] font-bold tracking-widest uppercase border transition-all ${tx.subscription_tiers?.name === 'ELITE' ? 'bg-primary-50/50 text-primary-500 border-primary-50 group-hover:bg-primary-500 group-hover:text-white group-hover:border-primary-500' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>{tx.subscription_tiers?.name === 'ELITE' ? 'Elite Enterprise' : tx.subscription_tiers?.name === 'PRO' ? 'Pro Company' : 'N/A'}</span>
                            </td>
                            <td className="px-10 py-8 text-left">
                               <p className={`text-xl font-bold tracking-tighter tabular-nums ${tx.status === 'failed' ? 'line-through text-slate-200' : 'text-secondary-900'}`}>₦{Number(tx.amount || 0).toLocaleString()}</p>
                            </td>
                            <td className="px-10 py-8 text-left">
                               <div className={`flex items-center gap-3 px-3 py-1.5 rounded-lg border w-fit shadow-xs ${tx.status === 'completed' ? 'bg-green-50 text-green-600 border-green-100' : tx.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                                  {tx.status === 'completed' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                                  <span className="text-[10px] font-bold uppercase tracking-widest leading-none">{tx.status}</span>
                               </div>
                            </td>
                            <td className="px-10 py-8 text-left">
                               <button onClick={(e) => { e.stopPropagation(); setSelectedTx(tx); }} className="h-11 w-11 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 hover:text-primary-500 hover:border-primary-500 transition-all shadow-sm active:scale-95"><ArrowUpRight size={18} /></button>
                            </td>
                         </tr>
                       ))
                    ) : (
                       <tr>
                          <td colSpan={5} className="py-20 text-center">
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No transactions found</p>
                          </td>
                       </tr>
                    )}
                  </tbody>
               </table>
            </div>
            <div className="p-8 bg-slate-50/30 flex justify-center sm:justify-between items-center border-t border-slate-50 gap-4">
               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block uppercase">Latest platform records</p>
               <div className="flex gap-3">
                  <button className="h-11 px-8 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-secondary-900 transition-all active:scale-95 shadow-sm uppercase tracking-widest">Previous</button>
                  <button className="h-11 px-8 bg-secondary-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all shadow-xl active:scale-95 uppercase tracking-widest">Next Page</button>
               </div>
            </div>
         </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedTx(null)}>
          <div className="bg-white rounded-[2.5rem] max-w-2xl w-full shadow-2xl animate-slide-up overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4 text-left">
                   <div className={`h-12 w-12 rounded-xl flex items-center justify-center border ${selectedTx.status === 'completed' ? 'bg-green-50 text-green-500 border-green-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                      <Receipt size={24} />
                   </div>
                   <div>
                      <h3 className="text-xl font-bold text-secondary-900 tracking-tight leading-none">Transaction Record</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{selectedTx.reference}</p>
                   </div>
                </div>
                <button onClick={() => setSelectedTx(null)} className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                   <X size={18} />
                </button>
             </div>

             <div className="space-y-6 mb-10 text-left">
                <ModalDetailRow icon={<User size={16} />} label="Company / Payer" value={`${selectedTx.profiles?.first_name} ${selectedTx.profiles?.last_name}`} subValue={selectedTx.profiles?.email} />
                <ModalDetailRow icon={<TrendingUp size={16} />} label="Service Plan" value={`${selectedTx.subscription_tiers?.name === 'ELITE' ? 'Elite Enterprise' : selectedTx.subscription_tiers?.name === 'PRO' ? 'Pro Company' : 'N/A'}`} />
                <ModalDetailRow icon={<DollarSign size={16} />} label="Amount Paid" value={`₦${Number(selectedTx.amount || 0).toLocaleString()}`} isSuccess={selectedTx.status === 'completed'} />
                <ModalDetailRow icon={<CreditCard size={16} />} label="Gateway Method" value="Gateway Active" />
                <ModalDetailRow icon={<Calendar size={16} />} label="Timestamp" value={new Date(selectedTx.created_at).toLocaleString()} />
             </div>

             <div className="pt-8 border-t border-slate-50 flex gap-4">
                <button onClick={() => setSelectedTx(null)} className="flex-1 py-4 bg-slate-50 hover:bg-slate-100 text-secondary-900 font-bold rounded-xl text-[10px] uppercase tracking-widest transition-all">Close</button>
                <button onClick={() => toast.success('Receipt sent to customer')} className="flex-1 py-4 bg-secondary-900 hover:bg-black text-white font-bold rounded-xl text-[10px] uppercase tracking-widest transition-all shadow-xl">Resend Receipt</button>
             </div>
          </div>
        </div>
      )}
    </>
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

function ModalDetailRow({ icon, label, value, subValue, isSuccess = false }: { icon: React.ReactNode; label: string; value: string; subValue?: string; isSuccess?: boolean }) {
  return (
    <div className="flex items-start gap-4 text-left">
       <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 mt-0.5 border border-slate-100">
          {icon}
       </div>
       <div className="space-y-1">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">{label}</p>
          <p className={`text-sm font-bold tracking-tight ${isSuccess ? 'text-green-600' : 'text-secondary-900'}`}>{value}</p>
          {subValue && <p className="text-[10px] font-medium text-slate-400">{subValue}</p>}
       </div>
    </div>
  )
}
