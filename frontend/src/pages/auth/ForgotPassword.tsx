import { NavLink } from 'react-router-dom'
import { Mail, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react'
import { useState } from 'react'

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="space-y-8 animate-slide-up py-4">
        <div className="h-20 w-20 bg-green-50 text-green-500 rounded flex items-center justify-center mx-auto mb-4 border border-green-100 shadow-sm">
          <ShieldCheck size={32} />
        </div>
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-secondary-500 uppercase tracking-widest leading-none">Transmission Success</h1>
          <p className="text-slate-500 text-sm font-medium">
            Recovery validation sent to <strong className="text-secondary-500">painter@cap.com.ng</strong>. <br />
            Monitor your workspace communications.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <button onClick={() => setSubmitted(false)} className="w-full bg-slate-50 text-slate-400 font-bold py-4 rounded border border-slate-200 hover:bg-slate-100 transition-all text-[10px] uppercase tracking-widest">
             RESEND VALIDATION LINK
          </button>
          <NavLink to="/login" className="w-full bg-secondary-900 text-white font-bold py-4 rounded shadow-lg text-center flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest hover:bg-black transition-all">
             <ArrowLeft size={14} /> RETURN TO ACCESS PORTAL
          </NavLink>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-slide-up py-4">
      <div className="space-y-6">
        <NavLink to="/login" className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-primary-500 uppercase tracking-[0.2em] transition-colors">
           <ArrowLeft size={14} /> BACK TO ACCESS PORTAL
        </NavLink>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-secondary-500 uppercase tracking-widest leading-none">Security Recovery</h1>
          <p className="text-slate-500 text-sm font-medium">
            Initialize password restoration sequence by validating your identifier.
          </p>
        </div>
      </div>

      <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
        <div className="space-y-1.5 font-sans">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Identifier</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors border-r border-slate-100 pr-3">
               <Mail size={16} />
            </div>
            <input 
              type="email" 
              required
              placeholder="professional@cap.com"
              className="w-full bg-slate-50 border border-slate-200 rounded pl-14 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-primary-100 focus:border-primary-500 focus:bg-white outline-none transition-all text-secondary-500 placeholder:text-slate-300"
            />
          </div>
        </div>

        <button type="submit" className="w-full bg-primary-500 text-white font-bold py-4.5 rounded shadow-lg hover:bg-primary-600 transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 group text-[11px] uppercase tracking-widest shadow-md">
          INITIALIZE RECOVERY <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </form>

      <div className="p-6 bg-slate-50 rounded border border-slate-100">
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed text-center">
           Critical Problem? Contact Support Node: <span className="text-secondary-500">support@capplc.com</span> or <span className="text-secondary-500">+234-800-CAP-PRO</span>.
         </p>
      </div>
    </div>
  )
}
