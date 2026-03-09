import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ShieldCheck, Mail, RefreshCw, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { toast } from 'react-hot-toast'

export default function EmailVerification() {
  const [resending, setResending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email || ''

  useEffect(() => {
    if (!email) {
      toast.error('No email found. Please register again.')
      navigate('/register')
    }
  }, [email, navigate])

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1]
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async () => {
    const token = otp.join('')
    if (token.length < 6) {
      toast.error('Please enter the full 6-digit code')
      return
    }

    setVerifying(true)
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'signup'
      })
      if (error) throw error
      
      toast.success('Email verified successfully! You can now login.')
      navigate('/login')
    } catch (error: any) {
      toast.error(error.message || 'Verification failed')
    } finally {
      setVerifying(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email
      })
      if (error) throw error
      toast.success('Verification code resent!')
    } catch (error: any) {
      toast.error(error.message || 'Resend failed')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="space-y-8 animate-slide-up py-4">
      <div className="h-20 w-20 bg-slate-50 text-primary-500 rounded border border-slate-200 flex items-center justify-center mx-auto relative shadow-sm">
        <Mail size={32} />
      </div>

      <div className="text-center space-y-3 px-4">
        <h1 className="text-3xl font-bold text-secondary-500 uppercase tracking-widest leading-none">Identity Check</h1>
        <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-sm mx-auto">
          A security credential has been dispatched to <strong className="text-secondary-500 underline decoration-primary-500/30 underline-offset-4">{email}</strong>. 
          Intercept the 6-digit code.
        </p>
      </div>

      {/* Code Input Matrix */}
      <div className="flex justify-center gap-3">
        {otp.map((digit, i) => (
          <input 
            key={i} 
            ref={el => inputRefs.current[i] = el}
            type="text" 
            maxLength={1} 
            value={digit}
            onChange={(e) => handleInputChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="h-14 w-12 bg-slate-50 border-2 border-slate-200 rounded text-center text-xl font-bold text-secondary-500 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 focus:bg-white outline-none transition-all tabular-nums shadow-sm"
          />
        ))}
      </div>

      <button 
        onClick={handleVerify}
        disabled={verifying}
        className="w-full bg-secondary-900 text-white font-bold py-4.5 rounded shadow-lg hover:bg-black transition-all active:scale-[0.98] flex items-center justify-center gap-3 group text-[11px] uppercase tracking-[0.2em] shadow-md disabled:opacity-50"
      >
        {verifying ? <Loader2 size={18} className="animate-spin" /> : <>VALIDATE CREDENTIALS <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
      </button>

      <div className="text-center space-y-5">
        <div className="relative py-2">
           <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
           </div>
           <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-300 tracking-[0.4em]">
              <span className="bg-white px-4">NULL RESPONSE?</span>
           </div>
        </div>

        <button 
          onClick={handleResend}
          disabled={resending}
          className="inline-flex items-center gap-2.5 text-[10px] font-bold text-primary-500 hover:text-primary-600 uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {resending ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />}
          {resending ? 'RESENDING PROTOCOL...' : 'RE-DISPATCH CODE'}
        </button>

        <p className="pt-2">
           <NavLink to="/login" className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-secondary-500 uppercase tracking-[0.2em] transition-colors">
              <ArrowLeft size={14} /> BACK TO ACCESS PORTAL
           </NavLink>
        </p>
      </div>

      <div className="bg-slate-50 p-4 rounded border border-slate-100 flex items-center gap-4">
         <div className="h-10 w-10 bg-white text-green-500 rounded border border-slate-200 flex items-center justify-center shadow-sm shrink-0">
            <ShieldCheck size={20} />
         </div>
         <div className="space-y-0.5">
            <p className="text-[11px] font-bold text-secondary-500 uppercase tracking-tight">SECURITY ENFORCER</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Two-Factor Validation prevents node intrusion.</p>
         </div>
      </div>
    </div>
  )
}
