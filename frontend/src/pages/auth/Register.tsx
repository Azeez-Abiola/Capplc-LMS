import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Phone, ArrowRight, MapPin, Loader2, Eye, EyeOff, ChevronLeft, Briefcase, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { authService } from '../../services/authService'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

export default function Register() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    whatsapp: '',
    state: 'Lagos',
    city: '',
    experience: '',
    specialty: '',
    companyCode: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const nextStep = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        toast.error('Name, Email, and Phone are required')
        return
      }
    }
    setStep(prev => prev + 1)
  }

  const prevStep = () => setStep(prev => prev - 1)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters.')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.')
      setLoading(false)
      return
    }

    try {
      await authService.register(formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        whatsapp_number: formData.whatsapp || null,
        state: formData.state,
        city: formData.city || null,
        years_of_experience: formData.experience || null,
        specialty: formData.specialty || null,
        company_code: formData.companyCode || null
      })
      toast.success('Registration initiated! Please check your email for confirmation.')
      navigate('/login')
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.message || 'Registration failed'
      toast.error(typeof errorMsg === 'string' ? errorMsg : 'Check credentials and try again')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { title: "Identity", sub: "Basic professional details", icon: <User size={18} /> },
    { title: "Profile", sub: "Expertise and location", icon: <Briefcase size={18} /> },
    { title: "Account", sub: "Security credentials", icon: <ShieldCheck size={18} /> }
  ]

  return (
    <div className="space-y-8 animate-slide-up text-left">
      
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-10 px-2">
         {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-2 group">
               <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all border ${step > i + 1 ? 'bg-primary-500 border-primary-500 text-white shadow-lg' : i + 1 === step ? 'bg-secondary-900 border-secondary-900 text-white shadow-xl scale-110' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                  {step > i + 1 ? <CheckCircle2 size={18} /> : s.icon}
               </div>
               <span className={`text-[8px] font-bold tracking-wide transition-colors ${step === i + 1 ? 'text-secondary-900' : 'text-slate-400'}`}>{s.title}</span>
            </div>
         ))}
      </div>

      <div className="space-y-2 mb-8">
         <h2 className="text-3xl font-bold text-secondary-900 tracking-tight leading-none">{steps[step-1].title} details</h2>
         <p className="text-sm font-medium text-slate-400 tracking-widest leading-none mt-2">{steps[step-1].sub}</p>
      </div>

      <form className="space-y-6" onSubmit={step === 3 ? handleRegister : (e) => { e.preventDefault(); nextStep(); }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {step === 1 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputGroup 
                    label="First name" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    icon={<User size={18} />} 
                    placeholder="John" 
                    required
                  />
                  <InputGroup 
                    label="Last name" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    icon={<User size={18} />} 
                    placeholder="Doe" 
                    required
                  />
                </div>
                <InputGroup 
                  label="Email address" 
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
                    label="Primary phone" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    icon={<Phone size={18} />} 
                    placeholder="+234..." 
                    required
                  />
                  <InputGroup 
                    label="WhatsApp number (optional)" 
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    icon={<Phone size={18} />} 
                    placeholder="+234..." 
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold text-slate-400 tracking-wide ml-2">Location/state</label>
                    <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors pointer-events-none">
                         <MapPin size={18} />
                      </div>
                      <select 
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-14 pr-6 py-2.5 text-sm font-medium focus:ring-4 focus:ring-primary-50 focus:border-primary-500 outline-none transition-all appearance-none cursor-pointer text-secondary-900 tracking-tight"
                      >
                         <option value="Lagos">Lagos</option>
                         <option value="Abuja">Abuja</option>
                         <option value="Oyo">Oyo</option>
                         <option value="Rivers">Rivers</option>
                      </select>
                    </div>
                  </div>
                  <InputGroup 
                    label="City" 
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    icon={<MapPin size={18} />} 
                    placeholder="Ikeja..." 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold text-slate-400 tracking-wide ml-2">Specialty</label>
                    <select 
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-6 py-2.5 text-sm font-medium focus:ring-4 focus:ring-primary-50 focus:border-primary-500 outline-none transition-all appearance-none cursor-pointer text-secondary-900 tracking-tight"
                    >
                       <option value="">Select specialty</option>
                       <option value="Residential">Residential</option>
                       <option value="Commercial">Commercial</option>
                       <option value="Industrial">Industrial spraying</option>
                       <option value="Texture">Luxury texture</option>
                    </select>
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold text-slate-400 tracking-wide ml-2">Experience</label>
                    <select 
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-6 py-2.5 text-sm font-medium focus:ring-4 focus:ring-primary-50 focus:border-primary-500 outline-none transition-all appearance-none cursor-pointer text-secondary-900 tracking-tight"
                    >
                       <option value="">Select experience</option>
                       <option value="0-2">0 - 2 years</option>
                       <option value="3-5">3 - 5 years</option>
                       <option value="5-10">5 - 10 years</option>
                       <option value="10+">10+ years</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <InputGroup 
                    label="Company invitation code (optional)" 
                    name="companyCode"
                    value={formData.companyCode}
                    onChange={handleInputChange}
                    icon={<Briefcase size={18} />} 
                    placeholder="e.g. CAP-JB-001" 
                  />
                  <p className="text-[10px] text-slate-400 mt-2 font-medium leading-relaxed">If your employer provided a company code, enter it here to automatically link your account to their premium subscription plan.</p>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputGroup 
                    label="Password" 
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
                  <InputGroup 
                    label="Confirm password" 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    icon={<Lock size={18} />} 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••" 
                    required
                  />
                </div>
                <div className="flex items-start gap-4 pl-2 pt-2 text-left group cursor-pointer select-none">
                   <input type="checkbox" id="terms" required className="h-5 w-5 rounded-lg border-slate-200 text-primary-500 focus:ring-4 focus:ring-primary-50 mt-0.5 accent-primary-500 cursor-pointer transition-all" />
                   <label htmlFor="terms" className="text-[10px] font-bold text-slate-400 leading-relaxed tracking-wide cursor-pointer">
                     I verify that I have read and agree to the <span className="text-primary-500 hover:text-black transition-all underline underline-offset-4">Terms</span> & <span className="text-primary-500 hover:text-black transition-all underline underline-offset-4">Privacy Standards</span>.
                   </label>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-4 pt-4">
          {step > 1 && (
            <button 
              type="button"
              onClick={prevStep}
              className="h-14 px-6 bg-slate-50 text-slate-400 hover:text-secondary-900 border border-slate-100 rounded-xl transition-all flex items-center gap-2 group shadow-sm active:scale-95"
            >
              <ChevronLeft size={18} /> Back
            </button>
          )}
          <button 
            type="submit"
            disabled={loading}
            className="flex-1 h-14 bg-secondary-900 text-white font-bold rounded-xl shadow-xl hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3 group text-[10px] tracking-wide shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : step === 3 ? <>Finalize account <ArrowRight size={18} /></> : <>Continue flow <ArrowRight size={18} /></>}
          </button>
        </div>
      </form>

      <div className="pt-8 border-t border-slate-50 text-center">
        <p className="text-[10px] font-bold text-slate-300 tracking-widest leading-none">
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
      <label className="text-[10px] font-bold text-slate-400 tracking-wide ml-2">{label}</label>
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
          className={`w-full bg-slate-50 border border-slate-200 rounded-xl pl-14 ${isPassword ? 'pr-14' : 'pr-6'} py-2.5 text-sm font-medium focus:ring-4 focus:ring-primary-50 focus:border-primary-500 outline-none transition-all text-secondary-900 placeholder:text-slate-200 tracking-tight`}
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
