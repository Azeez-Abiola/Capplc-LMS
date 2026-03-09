import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Phone, ArrowRight, ShieldCheck, MapPin, Loader2 } from 'lucide-react'
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
  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
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
      toast.error(error.response?.data?.error || error.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-slide-up py-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-secondary-500 uppercase tracking-widest leading-none">Initialize Registry</h1>
        <p className="text-slate-500 text-sm font-medium">Begin your journey towards professional CAP PLC accreditation.</p>
      </div>

      <form className="space-y-5" onSubmit={handleRegister}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputGroup 
            label="First Name" 
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            icon={<User size={16} />} 
            placeholder="e.g. Imran" 
            required
          />
          <InputGroup 
            label="Last Name" 
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            icon={<User size={16} />} 
            placeholder="e.g. Ali" 
            required
          />
        </div>

        <InputGroup 
          label="Official Email" 
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          icon={<Mail size={16} />} 
          type="email" 
          placeholder="professional@cap.com" 
          required
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputGroup 
            label="Phone Line" 
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            icon={<Phone size={16} />} 
            placeholder="+234..." 
            required
          />
          <div className="space-y-1.5 font-sans">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Operational State</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors border-r border-slate-100 pr-3">
                 <MapPin size={16} />
              </div>
              <select 
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 rounded pl-14 pr-4 py-3.5 text-sm font-bold focus:ring-2 focus:ring-primary-100 focus:border-primary-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer text-secondary-500 uppercase"
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
          label="Access Password" 
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          icon={<Lock size={16} />} 
          type="password" 
          placeholder="••••••••" 
          required
        />

        <div className="flex items-start gap-3 pl-1 pt-1">
           <input type="checkbox" id="terms" required className="h-4 w-4 rounded border-slate-200 text-primary-500 focus:ring-primary-500 mt-0.5 accent-primary-500 cursor-pointer" />
           <label htmlFor="terms" className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest cursor-pointer select-none">
             I AUTHORIZE DATA PROCESSING UNDER CAP PLC <span className="text-primary-500 hover:underline">TERMS</span> & <span className="text-primary-500 hover:underline">PRIVACY PROTOCOLS</span>.
           </label>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-secondary-900 text-white font-bold py-4.5 rounded shadow-lg hover:bg-black hover:-translate-y-0.5 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group text-[11px] uppercase tracking-[0.2em] shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <>COMMIT REGISTRATION <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" /></>}
        </button>
      </form>

      <div className="bg-slate-50 p-4 rounded border border-slate-100 flex items-center gap-4">
         <div className="h-10 w-10 bg-white text-primary-500 rounded border border-slate-200 flex items-center justify-center shadow-sm shrink-0">
            <ShieldCheck size={20} />
         </div>
         <div className="space-y-0.5">
            <p className="text-[11px] font-bold text-secondary-500 uppercase tracking-tight">ENCRYPTED ENROLLMENT</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Global Data Protection Standards Applied</p>
         </div>
      </div>

      <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
        Registry Member? <NavLink to="/login" className="text-primary-500 hover:underline">Secure Sign In</NavLink>
      </p>
    </div>
  )
}

function InputGroup({ label, icon, placeholder, name, value, onChange, type = 'text', required = false }: { 
  label: string; icon: React.ReactNode; placeholder?: string; type?: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean 
}) {
  return (
    <div className="space-y-1.5 font-sans">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors border-r border-slate-100 pr-3">
          {icon}
        </div>
        <input 
          type={type} 
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="w-full bg-slate-50 border border-slate-200 rounded pl-14 pr-4 py-3.5 text-sm font-bold focus:ring-2 focus:ring-primary-100 focus:border-primary-500 focus:bg-white outline-none transition-all text-secondary-500 placeholder:text-slate-300"
        />
      </div>
    </div>
  )
}
