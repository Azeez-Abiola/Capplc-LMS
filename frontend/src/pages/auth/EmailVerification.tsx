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
      <div className="h-16 w-16 bg-slate-50 text-primary-500 rounded-xl border border-slate-200 flex items-center justify-center mx-auto shadow-sm">
        <Mail size={28} />
      </div>

      <div className="text-center space-y-3 px-4">
        <h1 className="text-2xl font-bold text-secondary-900 tracking-tight">Verify Your Email</h1>
        <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-sm mx-auto">
          We've sent a 6-digit verification code to <strong className="text-secondary-900">{email}</strong>. 
          Please enter it below to activate your account.
        </p>
      </div>

      {/* Code Input */}
      <div className="flex justify-center gap-3">
        {otp.map((digit, i) => (
          <input 
            key={i} 
            ref={el => { inputRefs.current[i] = el; }}
            type="text" 
            maxLength={1} 
            value={digit}
            onChange={(e) => handleInputChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="h-14 w-12 bg-slate-50 border border-slate-200 rounded-xl text-center text-xl font-bold text-secondary-900 focus:ring-4 focus:ring-primary-50 focus:border-primary-500 focus:bg-white outline-none transition-all shadow-sm"
          />
        ))}
      </div>

      <button 
        onClick={handleVerify}
        disabled={verifying}
        className="w-full bg-primary-500 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-primary-600 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm uppercase tracking-widest disabled:opacity-50"
      >
        {verifying ? <Loader2 size={18} className="animate-spin" /> : <>Verify Email <ArrowRight size={18} /></>}
      </button>

      <div className="text-center space-y-6">
        <div className="relative py-2 px-8">
           <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
           </div>
           <div className="relative flex justify-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
              <span className="bg-white px-4">Didn't receive the code?</span>
           </div>
        </div>

        <button 
          onClick={handleResend}
          disabled={resending}
          className="inline-flex items-center gap-2 text-xs font-bold text-primary-500 hover:text-primary-600 uppercase tracking-widest transition-all disabled:opacity-50 group"
        >
          {resending ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />}
          {resending ? 'Resending...' : 'Resend Code'}
        </button>

        <p className="pt-2">
           <NavLink to="/login" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-secondary-900 uppercase tracking-widest transition-colors">
              <ArrowLeft size={14} /> Back to Login
           </NavLink>
        </p>
      </div>

      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center gap-4 text-left">
         <div className="h-10 w-10 bg-white text-green-500 rounded-lg border border-slate-100 flex items-center justify-center shadow-sm shrink-0">
            <ShieldCheck size={20} />
         </div>
         <div>
            <p className="text-xs font-bold text-secondary-900 uppercase tracking-widest">Secure Verification</p>
            <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-wider">Multi-factor security protects your account from unauthorized access.</p>
         </div>
      </div>
    </div>
  )
}
