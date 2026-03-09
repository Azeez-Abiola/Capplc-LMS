import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import { authService } from '../../services/authService'
import { toast } from 'react-hot-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await authService.login(email, password)
      toast.success('Login successful!')
      // Check role and redirect accordingly
      const user = data.user || await authService.getCurrentUser()
      if (user?.user_metadata?.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-12 animate-slide-up">
      
      {/* Strategic Header */}
      <div className="text-center md:text-left">
         <div className="h-1.5 w-12 bg-primary-500 rounded hidden md:block" />
         <h2 className="text-4xl font-extrabold tracking-tight text-secondary-500 dark:text-white uppercase tracking-[0.3em] leading-none mt-4">Login</h2>
      </div>

      {/* Form Container - Minimalist/Transparent */}
      <form className="space-y-8 bg-transparent p-0 border-none" onSubmit={handleLogin}>
        <div className="space-y-3">
           <label className="text-[11px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em] ml-1">Email</label>
           <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 dark:text-slate-800 transition-colors border-r border-slate-100 dark:border-white/5 pr-4 group-focus-within:text-primary-500">
                 <Mail size={16} />
              </div>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="professional@cap.com.ng"
                className="w-full bg-slate-50 dark:bg-zinc-900/30 border border-slate-200 dark:border-white/10 rounded-md py-5 pl-16 pr-5 text-sm font-bold text-secondary-500 dark:text-white placeholder:text-slate-200 dark:placeholder:text-slate-800 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none uppercase tracking-tighter" 
              />
           </div>
        </div>

        <div className="space-y-3">
           <div className="flex justify-between items-center px-1">
              <label className="text-[11px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em]">Password</label>
              <NavLink to="/forgot-password" title="password recovery" className="text-[10px] font-bold text-primary-500 uppercase tracking-widest hover:underline transition-all">Forgot Key?</NavLink>
           </div>
           <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 dark:text-slate-800 transition-colors border-r border-slate-100 dark:border-white/5 pr-4 group-focus-within:text-primary-500">
                 <Lock size={16} />
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-50 dark:bg-zinc-900/30 border border-slate-200 dark:border-white/10 rounded-md py-5 pl-16 pr-5 text-sm font-bold text-secondary-500 dark:text-white placeholder:text-slate-200 dark:placeholder:text-slate-800 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none tracking-widest" 
              />
           </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-5 bg-primary-500 text-white font-bold rounded-md shadow-lg shadow-primary-500/20 hover:bg-primary-600 transition-all text-[12px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
           {loading ? <Loader2 size={18} className="animate-spin" /> : <>Login <ArrowRight size={18} /></>}
        </button>
      </form>

      {/* Redirect Utility */}
      <div className="pt-4 border-t border-slate-50 dark:border-white/5">
        <p className="text-center text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
           No Account? <NavLink to="/register" className="text-primary-500 hover:text-black dark:hover:text-white underline-offset-4 hover:underline transition-all">Register Module</NavLink>
        </p>
      </div>

    </div>
  )
}
