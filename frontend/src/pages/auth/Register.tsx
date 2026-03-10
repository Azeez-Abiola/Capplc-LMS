import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Phone, ArrowRight, MapPin, Loader2, Eye, EyeOff } from 'lucide-react'
import { authService } from '../../services/authService'
import { toast } from 'react-hot-toast'

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    state: 'Lagos',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters.')
      setLoading(false)
      return
    }

    try {
      await authService.register(formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        state: formData.state
      })
      toast.success('Registration successful! Your account is active.')
      navigate('/login')
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.message || 'Registration failed'
      toast.error(typeof errorMsg === 'string' ? errorMsg : 'Check credentials and try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-10 animate-slide-up text-left">
      
      {/* Strategic Header */}
      <div className="space-y-2">
         <h2 className="text-3xl font-bold text-secondary-900 tracking-tight leading-none">Register</h2>
         <p className="text-sm font-medium text-slate-400">Join the CAP PLC digital ecosystem.</p>
      </div>

      <form className="space-y-6" onSubmit={handleRegister}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InputGroup 
            label="First Name" 
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            icon={<User size={18} />} 
            placeholder="John" 
            required
          />
          <InputGroup 
            label="Last Name" 
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            icon={<User size={18} />} 
            placeholder="Doe" 
            required
          />
        </div>

        <InputGroup 
          label="Email Address" 
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          icon={<Mail size={18} />} 
          type="email" 
          placeholder="email@example.com" 
          required
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InputGroup 
            label="Phone" 
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            icon={<Phone size={18} />} 
            placeholder="+234..." 
            required
          />
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Location/State</label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors pointer-events-none">
                 <MapPin size={18} />
              </div>
              <select 
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-3xl pl-14 pr-6 py-2.5 text-sm font-medium focus:ring-4 focus:ring-primary-50 focus:border-primary-500 outline-none transition-all appearance-none cursor-pointer text-secondary-900 uppercase tracking-tight"
              >
                 <option value="Lagos">Lagos</option>
                 <option value="Abuja">Abuja</option>
                 <option value="Oyo">Oyo</option>
                 <option value="Rivers">Rivers</option>
              </select>
            </div>
          </div>
        </div>

        <InputGroup 
          label="Create Password" 
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          icon={<Lock size={18} />} 
          type={showPassword ? 'text' : 'password'} 
          placeholder="••••••••" 
          required
          togglePassword={() => setShowPassword(!showPassword)}
          showPassword={showPassword}
        />

        <div className="flex items-start gap-4 pl-2 pt-2 text-left group cursor-pointer select-none">
           <input type="checkbox" id="terms" required className="h-5 w-5 rounded-lg border-slate-200 text-primary-500 focus:ring-4 focus:ring-primary-50 mt-0.5 accent-primary-500 cursor-pointer transition-all" />
           <label htmlFor="terms" className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest cursor-pointer">
             I verify that I have read and agree to the <span className="text-primary-500 hover:text-black transition-all underline underline-offset-4">Terms</span> & <span className="text-primary-500 hover:text-black transition-all underline underline-offset-4">Privacy Standards</span>.
           </label>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-secondary-900 text-white font-bold py-4 rounded-3xl shadow-xl hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3 group text-xs uppercase tracking-[0.2em] shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <>Complete Enrollment <ArrowRight size={18} /></>}
        </button>
      </form>

      <div className="pt-6 border-t border-slate-50 text-center">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-none">
           Already a Professional? <NavLink to="/login" className="text-primary-500 hover:text-secondary-900 transition-all ml-2 underline underline-offset-4">Sign In</NavLink>
        </p>
      </div>
    </div>
  )
}

function InputGroup({ label, icon, placeholder, name, value, onChange, type = 'text', required = false, togglePassword, showPassword }: { 
  label: string; icon: React.ReactNode; placeholder?: string; type?: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean;
  togglePassword?: () => void; showPassword?: boolean;
}) {
  const isPassword = name === 'password'

  return (
    <div className="space-y-2 text-left">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">{label}</label>
      <div className="relative group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors pointer-events-none">
          {icon}
        </div>
        <input 
          type={type} 
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={`w-full bg-slate-50 border border-slate-200 rounded-3xl pl-14 ${isPassword ? 'pr-14' : 'pr-6'} py-2.5 text-sm font-medium focus:ring-4 focus:ring-primary-50 focus:border-primary-500 outline-none transition-all text-secondary-900 placeholder:text-slate-200 tracking-tight`}
        />
        {isPassword && togglePassword && (
          <button 
            type="button" 
            onClick={togglePassword}
            className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-300 hover:text-primary-500 transition-colors"
          >
             {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  )
}
