import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, ChevronLeft } from 'lucide-react'
import { authService } from '../../services/authService'
import { toast } from 'react-hot-toast'
import { MOCK_MODE, DEMO_ACCOUNTS, DEMO_PASSWORD } from '../../mock/config'
import { resetMockDb } from '../../mock/db'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    signIn(email, password)
  }

  const signIn = async (loginEmail: string, loginPassword: string) => {
    setLoading(true)
    try {
      const response = await authService.login(loginEmail, loginPassword)
      toast.success('Login successful!')
      
      const user = response.user
      const role = user?.user_metadata?.role || user?.app_metadata?.role
      
      if (role) {
        if (role === 'super_admin') navigate('/super-admin')
        else if (role === 'admin') navigate('/admin')
        else navigate('/dashboard')
        return
      }

      const { userService } = await import('../../services/userService')
      const profile = await userService.getProfile()
      
      if (profile?.role === 'super_admin') navigate('/super-admin')
      else if (profile?.role === 'admin') navigate('/admin')
      else navigate('/dashboard')
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.message || 'Login failed'
      toast.error(typeof errorMsg === 'string' ? errorMsg : 'Check credentials and try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-12 animate-slide-up w-full text-left">
      <NavLink to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-primary-500 transition-colors group mb-4">
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to home
      </NavLink>

      <div className="space-y-3">
        <h2 className="text-5xl font-bold text-secondary-900 tracking-tight">Sign in</h2>
        <p className="text-sm font-semibold text-slate-400">Welcome back. Please enter your credentials.</p>
      </div>

      <form className="space-y-8" onSubmit={handleLogin}>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 ml-2">Email address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-primary-500 transition-colors">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="painter@cap.com"
                className="w-full bg-blue-50/30 border border-slate-200 rounded-2xl pl-16 pr-6 py-5 text-sm font-semibold text-secondary-900 placeholder:text-slate-300 focus:ring-4 focus:ring-primary-50 focus:border-primary-500 outline-none transition-all" 
              />
            </div>
          </div>

          <div className="space-y-2 relative">
            <label className="text-[11px] font-bold text-slate-400 ml-2">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-primary-500 transition-colors">
                <Lock size={18} />
              </div>
              <input 
                type={showPassword ? 'text' : 'password'} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-blue-50/30 border border-slate-200 rounded-2xl pl-16 pr-16 py-5 text-sm font-semibold text-secondary-900 placeholder:text-slate-300 focus:ring-4 focus:ring-primary-50 focus:border-primary-500 outline-none transition-all" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-6 flex items-center text-slate-300 hover:text-primary-500 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="flex justify-end pt-2 pr-1">
              <NavLink to="/forgot-password" text-primary-500 className="text-[10px] font-bold text-primary-500 hover:text-secondary-900 transition-colors">
                Forgot password?
              </NavLink>
            </div>
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-5 bg-secondary-900 text-white font-bold rounded-2xl shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-50 group"
        >
          {loading ? (
            <Loader2 size={24} className="animate-spin" />
          ) : (
            <>
              <span className="text-sm font-bold">Sign in</span> 
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {MOCK_MODE && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-amber-800">Demo mode · test accounts</p>
              <p className="text-[11px] font-semibold text-amber-700/80 mt-1">
                Click an account to sign in. Password for all: <span className="font-mono">{DEMO_PASSWORD}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => { resetMockDb(); toast.success('Demo data reset') }}
              className="shrink-0 text-[10px] font-bold text-amber-700 hover:text-amber-900 underline underline-offset-4"
            >
              Reset data
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map(acc => (
              <button
                key={acc.email}
                type="button"
                disabled={loading}
                onClick={() => { setEmail(acc.email); setPassword(DEMO_PASSWORD); signIn(acc.email, DEMO_PASSWORD) }}
                className="text-left rounded-xl border border-amber-200 bg-white px-4 py-3 hover:border-primary-500 hover:shadow-sm transition-all disabled:opacity-50"
              >
                <span className="block text-xs font-bold text-secondary-900">{acc.label}</span>
                <span className="block text-[10px] font-semibold text-slate-400 truncate">{acc.email}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="pt-12 border-t border-slate-50 text-center">
        <p className="text-[11px] font-bold text-slate-300 leading-none">
          Don't have an account? 
          <NavLink to="/register" className="text-primary-500 hover:text-secondary-900 transition-all ml-2 underline underline-offset-8 decoration-2 font-bold">
            Create account
          </NavLink>
        </p>
      </div>
    </div>
  )
}