import { NavLink, useSearchParams } from 'react-router-dom'
import { CheckCircle2, XCircle, Download, ShieldCheck, RefreshCcw, ArrowRight } from 'lucide-react'

export default function PaymentStatus() {
  const [searchParams] = useSearchParams()
  const status = searchParams.get('status') || 'success'

  return (
    <div className="max-w-xl mx-auto space-y-10 animate-slide-up py-10 text-left">
      {status === 'success' ? (
        <>
          <div className="space-y-6">
            <div className="h-20 w-20 bg-green-50 text-green-500 rounded-3xl flex items-center justify-center border border-green-100 shadow-sm relative shrink-0 transition-transform hover:scale-110">
               <CheckCircle2 size={40} className="relative z-10" />
            </div>
            <div className="space-y-3">
               <h1 className="text-3xl font-bold text-secondary-900 tracking-tight leading-none">Payment Successful</h1>
               <p className="text-slate-500 font-medium max-w-sm text-sm leading-relaxed">
                 Your transaction has been processed securely. Your professional account is now active.
               </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-10 space-y-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all">
             <div className="space-y-5">
                <StatusRow label="Reference ID" value="MON-29384-ELITE" isPrimary />
                <StatusRow label="Active Plan" value="Elite Monthly" />
                <StatusRow label="Total Amount" value="₦15,000.00" isBold />
             </div>

             <div className="grid grid-cols-2 gap-4 pt-4">
                <button className="flex items-center justify-center gap-3 bg-slate-50 border border-slate-100 text-slate-500 font-bold py-4 rounded-2xl hover:bg-white hover:border-primary-500 hover:text-primary-500 transition-all text-[10px] uppercase tracking-widest active:scale-95 shadow-sm">
                   <Download size={18} /> Invoice
                </button>
                <NavLink to="/subscription" className="flex items-center justify-center gap-3 bg-secondary-900 text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-black transition-all text-[10px] uppercase tracking-widest active:scale-95">
                   Billing
                </NavLink>
             </div>
          </div>

          <NavLink to="/" className="w-full bg-primary-500 text-white font-bold py-5 rounded-3xl shadow-xl hover:bg-primary-600 transition-all flex items-center justify-center gap-4 text-xs uppercase tracking-[0.2em] active:scale-95">
             Return to Dashboard <ArrowRight size={20} />
          </NavLink>
        </>
      ) : (
        <>
          <div className="space-y-6">
            <div className="h-20 w-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center border border-red-100 shadow-sm relative shrink-0 transition-transform hover:scale-110">
               <XCircle size={40} className="relative z-10" />
            </div>
            <div className="space-y-3">
               <h1 className="text-3xl font-bold text-secondary-900 tracking-tight leading-none">Payment Failed</h1>
               <p className="text-slate-500 font-medium max-w-sm text-sm leading-relaxed">
                 We couldn't process your transaction. Please verify your details and try again.
               </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-10 space-y-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all">
             <div className="p-6 bg-red-50/50 rounded-2xl border border-red-50 flex items-start gap-5">
                <div className="h-12 w-12 bg-white rounded-xl border border-red-50 flex items-center justify-center text-red-500 shadow-sm shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div className="pt-1">
                   <p className="text-[11px] font-bold text-red-900 uppercase tracking-widest">System Message</p>
                   <p className="text-[10px] font-medium text-red-700 mt-2 leading-relaxed">
                      Insufficient funds or bank server timeout. Please try again or use a different payment method.
                   </p>
                </div>
             </div>
             
             <div className="flex flex-col sm:flex-row gap-4">
                <NavLink to="/subscription" className="flex-1 flex items-center justify-center gap-3 bg-secondary-900 text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-black transition-all text-[10px] uppercase tracking-widest active:scale-95">
                   <RefreshCcw size={18} /> Retry Payment
                </NavLink>
                <button className="flex-1 flex items-center justify-center gap-3 bg-white border border-slate-100 text-secondary-900 font-bold py-4 rounded-2xl hover:bg-slate-50 transition-all text-[10px] uppercase tracking-widest active:scale-95 shadow-sm">
                   Switch Method
                </button>
             </div>
          </div>

          <NavLink to="/" className="block text-center text-[11px] font-bold text-slate-400 hover:text-primary-500 uppercase tracking-[0.25em] transition-all pt-4">
             &larr; Back to Dashboard
          </NavLink>
        </>
      )}
    </div>
  )
}

function StatusRow({ label, value, isPrimary = false, isBold = false }: { label: string; value: string; isPrimary?: boolean; isBold?: boolean }) {
  return (
    <div className="flex justify-between items-center py-4 border-b border-slate-50">
       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] leading-none">{label}</span>
       <span className={`text-[11px] font-bold uppercase tracking-widest leading-none ${isPrimary ? 'text-primary-500' : isBold ? 'text-secondary-900 text-sm' : 'text-slate-500'}`}>{value}</span>
    </div>
  )
}
