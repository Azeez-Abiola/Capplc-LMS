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
    <div className="space-y-12 animate-slide-up py-4 w-full text-secondary-900 text-left">
      <div className="h-24 w-24 bg-blue-50/50 text-primary-500 rounded-[2rem] border border-blue-100 flex items-center justify-center mx-auto shadow-xl transition-all hover:scale-105">
        <Mail size={40} />
      </div>

      <div className="text-center space-y-4 px-4">
        <h1 className="text-4xl font-extrabold text-secondary-900 tracking-tight">Security Code</h1>
        <p className="text-slate-400 font-semibold leading-relaxed max-w-sm mx-auto uppercase tracking-widest text-[11px]">
          A 6-digit code was dispatched to <span className="text-secondary-900 font-black">{email}</span>
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
            className="h-16 w-12 bg-blue-50/30 border border-slate-200 rounded-2xl text-center text-2xl font-black text-secondary-900 focus:ring-4 focus:ring-primary-50 focus:border-primary-500 focus:bg-white outline-none transition-all shadow-sm"
          />
        ))}
      </div>

      <button 
        onClick={handleVerify}
        disabled={verifying}
        className="w-full bg-secondary-900 text-white font-black py-5 rounded-full shadow-2xl hover:bg-black transition-all active:scale-[0.98] flex items-center justify-center gap-4 text-[11px] uppercase tracking-[0.2em] disabled:opacity-50"
      >
        {verifying ? <Loader2 size={24} className="animate-spin" /> : <>Activate Account <ArrowRight size={20} /></>}
      </button>

      <div className="text-center space-y-8">
        <div className="relative py-2 px-8">
           <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
           </div>
           <div className="relative flex justify-center text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
              <span className="bg-white px-6">Transmission issues?</span>
           </div>
        </div>

        <button 
          onClick={handleResend}
          disabled={resending}
          className="inline-flex items-center gap-3 text-[11px] font-black text-primary-500 hover:text-secondary-900 uppercase tracking-[0.2em] transition-all disabled:opacity-50 group"
        >
          {resending ? <Loader2 size={20} className="animate-spin" /> : <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-700" />}
          {resending ? 'Re-transmitting...' : 'Resend Security Code'}
        </button>

        <p className="pt-4">
           <NavLink to="/login" className="inline-flex items-center gap-3 text-[11px] font-black text-slate-400 hover:text-secondary-900 uppercase tracking-[0.2em] transition-all">
              <ArrowLeft size={18} /> Return to Login
           </NavLink>
        </p>
      </div>

      <div className="bg-blue-50/20 p-8 rounded-[2rem] border border-blue-100/50 flex items-center gap-5 text-left">
         <div className="h-14 w-14 bg-white text-green-500 rounded-2xl border border-slate-100 flex items-center justify-center shadow-xl shrink-0 transition-transform hover:scale-110">
            <ShieldCheck size={28} />
         </div>
         <div>
            <p className="text-[10px] font-black text-secondary-900 uppercase tracking-widest">Encrypted Key</p>
            <p className="text-[10px] font-semibold text-slate-400 mt-2 leading-relaxed uppercase tracking-wider">Multi-factor security protocol is active for your account safety.</p>
         </div>
      </div>
    </div>
  )
}
