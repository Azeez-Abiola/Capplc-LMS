import { NavLink } from 'react-router-dom'
import { Mail, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react'
import { useState } from 'react'

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="space-y-12 animate-slide-up text-center py-10 w-full text-secondary-900">
        <div className="h-24 w-24 bg-green-50 text-green-500 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-green-100 shadow-xl transition-all hover:scale-105">
          <ShieldCheck size={40} />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-secondary-900 tracking-tight leading-tight">Email Dispatched</h1>
          <p className="text-slate-400 text-sm font-semibold leading-relaxed max-w-xs mx-auto">
            Check your inbox for the CAP Workshop reset link.
          </p>
        </div>
        <div className="flex flex-col gap-5 pt-8">
          <button 
            onClick={() => setSubmitted(false)} 
            className="w-full bg-slate-100 text-slate-500 font-bold py-5 rounded-2xl border border-slate-200 hover:bg-white hover:text-secondary-900 transition-all text-sm active:scale-95 shadow-sm"
          >
             Resend dispatch
          </button>
          <NavLink 
            to="/login" 
            className="w-full bg-secondary-900 text-white font-bold py-5 rounded-2xl shadow-2xl text-center flex items-center justify-center gap-4 text-sm hover:bg-black transition-all active:scale-95"
          >
             <ArrowLeft size={18} /> Return to sign in
          </NavLink>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12 animate-slide-up text-left w-full text-secondary-900">
      <div className="space-y-8">
        <NavLink to="/login" className="inline-flex items-center gap-3 text-xs font-bold text-slate-400 hover:text-primary-500 transition-all pl-1">
           <ArrowLeft size={18} /> Back to workshop sign in
        </NavLink>
        <div className="space-y-3">
          <h1 className="text-5xl font-bold text-secondary-900 tracking-tight">Vault Recovery</h1>
          <p className="text-sm font-semibold text-slate-400">
            Enter your professional email to receive a restoration link.
          </p>
        </div>
      </div>

      <form className="space-y-10" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-400 ml-2 leading-none">Registered email</label>
          <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors pointer-events-none">
               <Mail size={18} />
            </div>
            <input 
              type="email" 
              required
              placeholder="professional@cap.com"
              className="w-full bg-blue-50/30 border border-slate-200 rounded-2xl pl-16 pr-6 py-5 text-sm font-semibold text-secondary-900 placeholder:text-slate-300 focus:ring-4 focus:ring-primary-50 focus:border-primary-500 outline-none transition-all tracking-tight"
            />
          </div>
        </div>

        <button type="submit" className="w-full bg-secondary-900 text-white font-bold py-5 rounded-2xl shadow-2xl hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-4 text-sm tracking-tight">
          Send recovery link <ArrowRight size={20} />
        </button>
      </form>

      <div className="p-10 bg-slate-50/50 rounded-[2rem] border border-slate-100 shadow-sm text-center">
         <p className="text-[10px] font-bold text-slate-300 leading-loose">
           Technical support: <br/>
           <span className="text-secondary-900 font-bold">support@capplc.com</span> <br/> 
           <span className="text-secondary-900 font-bold">+234-800-CAP-PRO</span>
         </p>
      </div>
    </div>
  )
}
