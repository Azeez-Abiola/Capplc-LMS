import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react'
import { authService } from '../../services/authService'
import { toast } from 'react-hot-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await authService.login(email, password)
      toast.success('Login successful!')
      const user = data.user || await authService.getCurrentUser()
      if (user?.user_metadata?.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.message || 'Login failed'
      toast.error(typeof errorMsg === 'string' ? errorMsg : 'Check credentials and try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-10 animate-slide-up text-left">
      
      {/* Strategic Header */}
      <div className="space-y-2">
         <h2 className="text-3xl font-bold text-secondary-900 tracking-tight leading-none">Sign In</h2>
         <p className="text-sm font-medium text-slate-400">Welcome back. Please enter your credentials.</p>
      </div>

      <form className="space-y-6" onSubmit={handleLogin}>
        <div className="space-y-2">
           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
           <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-primary-500 transition-colors">
                 <Mail size={18} />
              </div>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-14 pr-6 text-sm font-medium text-secondary-900 placeholder:text-slate-200 focus:ring-4 focus:ring-primary-50 focus:border-primary-500 transition-all outline-none" 
              />
           </div>
        </div>

        <div className="space-y-2">
           <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Password</label>
              <NavLink to="/forgot-password" title="password recovery" className="text-[10px] font-bold text-primary-500 hover:text-secondary-900 transition-all uppercase tracking-widest">Forgot password?</NavLink>
           </div>
           <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-primary-500 transition-colors">
                 <Lock size={18} />
              </div>
              <input 
                type={showPassword ? 'text' : 'password'} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-14 pr-14 text-sm font-medium text-secondary-900 placeholder:text-slate-200 focus:ring-4 focus:ring-primary-50 focus:border-primary-500 transition-all outline-none" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-300 hover:text-primary-500 transition-colors"
              >
                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
           </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-secondary-900 text-white font-bold rounded-xl shadow-xl hover:bg-black transition-all text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
           {loading ? <Loader2 size={18} className="animate-spin" /> : <>Sign In <ArrowRight size={18} /></>}
        </button>
      </form>

      <div className="pt-6 border-t border-slate-50 text-center">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-none">
           Don't have an account? <NavLink to="/register" className="text-primary-500 hover:text-secondary-900 transition-all ml-2 underline underline-offset-4">Create Account</NavLink>
        </p>
      </div>

    </div>
  )
}
