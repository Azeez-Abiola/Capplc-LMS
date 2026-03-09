import { NavLink, useSearchParams } from 'react-router-dom'
import { CheckCircle2, XCircle, Download, ShieldCheck, RefreshCcw, ArrowRight } from 'lucide-react'

export default function PaymentStatus() {
  const [searchParams] = useSearchParams()
  const status = searchParams.get('status') || 'success'

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-slide-up py-10">
      {status === 'success' ? (
        <>
          <div className="text-center space-y-4">
            <div className="h-20 w-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-xl relative shrink-0">
               <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-10" />
               <CheckCircle2 size={40} className="relative z-10" />
            </div>
            <h1 className="text-3xl font-extrabold text-secondary-500 tracking-tight leading-none uppercase">Payment Successful</h1>
            <p className="text-slate-500 font-medium max-w-sm mx-auto text-sm">
              Welcome to <strong>ELITE Membership</strong>. Your transaction has been processed securely.
            </p>
          </div>

          <div className="bento-card p-8 space-y-6 bg-white shadow-2xl border-slate-100">
             <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-bold border-b border-dashed border-slate-100 pb-3">
                   <span className="text-slate-400 uppercase tracking-widest pl-1">Transaction Ref:</span>
                   <span className="text-primary-500">MON-29384-ELITE</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold border-b border-dashed border-slate-100 pb-3">
                   <span className="text-slate-400 uppercase tracking-widest pl-1">Plan Activated:</span>
                   <span className="text-secondary-500">ELITE Monthly</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold border-b border-dashed border-slate-100 pb-3">
                   <span className="text-slate-400 uppercase tracking-widest pl-1">Total Paid:</span>
                   <span className="text-secondary-500 font-extrabold">₦15,000.00</span>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-3 pt-2">
                <button className="flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 text-slate-500 font-bold py-3 rounded hover:bg-slate-100 transition-all text-[10px] uppercase tracking-widest active:scale-95">
                   <Download size={14} strokeWidth={3} /> Get Invoice
                </button>
                <NavLink to="/subscription" className="flex items-center justify-center gap-2 bg-secondary-900 text-white font-bold py-3 rounded shadow-lg hover:bg-black transition-all text-[10px] uppercase tracking-widest active:scale-95">
                   Manage Plan
                </NavLink>
             </div>
          </div>

          <NavLink to="/" className="w-full bg-primary-500 text-white font-black py-4 rounded shadow-xl hover:bg-primary-600 transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-widest active:scale-[0.98]">
             Proceed to Dashboard <ArrowRight size={18} strokeWidth={3} />
          </NavLink>
        </>
      ) : (
        <>
          <div className="text-center space-y-4">
            <div className="h-20 w-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-xl relative shrink-0">
               <XCircle size={40} className="relative z-10" />
            </div>
            <h1 className="text-3xl font-extrabold text-secondary-500 tracking-tight leading-none uppercase">Transaction Failed</h1>
            <p className="text-slate-500 font-medium max-w-sm mx-auto text-sm">
              Something went wrong with your payment. Your money is safe.
            </p>
          </div>

          <div className="bento-card p-8 space-y-6 bg-white shadow-xl border-slate-100">
             <div className="p-4 bg-red-50 rounded border border-red-100 flex items-start gap-4 text-left">
                <ShieldCheck size={24} className="text-red-500 shrink-0 mt-0.5" />
                <div>
                   <p className="text-xs font-extrabold text-red-900 leading-tight uppercase tracking-tight">Failure Reason</p>
                   <p className="text-[11px] font-medium text-red-700 mt-1 leading-relaxed">
                      Insufficient funds or bank server timeout. Please try again or use a different payment method.
                   </p>
                </div>
             </div>
             
             <div className="flex flex-col sm:flex-row gap-3">
                <NavLink to="/subscription" className="flex-1 flex items-center justify-center gap-2 bg-secondary-900 text-white font-bold py-3 rounded shadow-lg hover:bg-black transition-all text-xs uppercase tracking-widest active:scale-95">
                   <RefreshCcw size={16} strokeWidth={3} /> Try Again
                </NavLink>
                <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 text-secondary-500 font-bold py-3 rounded hover:bg-slate-50 transition-all text-xs uppercase tracking-widest active:scale-95">
                   Switch Method
                </button>
             </div>
          </div>

          <NavLink to="/" className="block text-center text-[10px] font-black text-slate-400 hover:text-primary-500 uppercase tracking-widest transition-all">
             &larr; Back to Dashboard
          </NavLink>
        </>
      )}
    </div>
  )
}
