import { NavLink } from 'react-router-dom'
import { Mail, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react'
import { useState } from 'react'

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="space-y-10 animate-slide-up text-center py-6">
        <div className="h-20 w-20 bg-green-50 text-green-500 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-green-100 shadow-sm transition-transform hover:scale-110">
          <ShieldCheck size={32} />
        </div>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-secondary-900 tracking-tight leading-none">Email Sent</h1>
          <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs mx-auto">
            We've sent a password reset link to <strong className="text-secondary-900">painter@cap.com.ng</strong>. Please check your inbox.
          </p>
        </div>
        <div className="flex flex-col gap-4 pt-4">
          <button onClick={() => setSubmitted(false)} className="w-full bg-slate-50 text-slate-400 font-bold py-4 rounded-3xl border border-slate-200 hover:bg-white hover:text-secondary-900 transition-all text-[10px] tracking-wide active:scale-95 shadow-sm">
             Resend reset link
          </button>
          <NavLink to="/login" className="w-full bg-secondary-900 text-white font-bold py-4 rounded-3xl shadow-xl text-center flex items-center justify-center gap-3 text-[10px] tracking-wide hover:bg-black transition-all active:scale-95">
             <ArrowLeft size={16} /> Return to sign in
          </NavLink>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-slide-up text-left">
      <div className="space-y-6">
        <NavLink to="/login" className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-primary-500 tracking-wide transition-colors font-sans pl-1">
           <ArrowLeft size={14} /> Back to sign in
        </NavLink>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-secondary-900 tracking-tight leading-none">Reset password</h1>
          <p className="text-sm font-medium text-slate-400">
            Enter your email to receive a password restoration link.
          </p>
        </div>
      </div>

      <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
        <div className="space-y-3 font-sans">
          <label className="text-[10px] font-bold text-slate-400 tracking-wide ml-2">Email address</label>
          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors pointer-events-none">
               <Mail size={18} />
            </div>
            <input 
              type="email" 
              required
              placeholder="professional@cap.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-3xl pl-14 pr-6 py-2.5 text-sm font-medium focus:ring-4 focus:ring-primary-50 focus:border-primary-500 outline-none transition-all text-secondary-900 placeholder:text-slate-200 tracking-tight"
            />
          </div>
        </div>

        <button type="submit" className="w-full bg-secondary-900 text-white font-bold py-4 rounded-3xl shadow-xl hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3 text-xs tracking-wide">
          Send reset link <ArrowRight size={18} />
        </button>
      </form>

      <div className="p-8 bg-slate-50/50 rounded-3xl border border-slate-50 shadow-sm">
         <p className="text-[10px] font-bold text-slate-400 tracking-wide leading-relaxed text-center">
           Need help? Reach out to support: <br/>
           <span className="text-secondary-900">support@capplc.com</span> or <span className="text-secondary-900">+234-800-CAP-PRO</span>
         </p>
      </div>
    </div>
  )
}
