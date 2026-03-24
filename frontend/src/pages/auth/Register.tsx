import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Phone, ArrowRight, MapPin, Loader2, Eye, EyeOff, ChevronLeft, Briefcase, ShieldCheck, CheckCircle2, CreditCard, Zap, Gem, Shield, Calendar, Rocket } from 'lucide-react'
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
  const [selectedTier, setSelectedTier] = useState('FREE')
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'MONNIFY'>('CARD')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isTermsChecked, setIsTermsChecked] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const nextStep = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        toast.error('Identity details are required')
        return
      }
    }
    if (step === 3) {
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match.')
        return
      }
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters.')
        return
      }
    }
    setStep(prev => prev + 1)
  }

  const prevStep = () => setStep(prev => prev - 1)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

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
        company_code: formData.companyCode || null,
        subscription_tier: selectedTier
      })
      toast.success('Registration initiated! Please verify your email.')
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
    { title: "Account", sub: "Security credentials", icon: <ShieldCheck size={18} /> },
    { title: "Payment", sub: "Join the Workshop", icon: <CreditCard size={18} /> }
  ]

  return (
    <div className="space-y-8 animate-slide-up text-left w-full text-secondary-900">
      <NavLink to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-primary-500 transition-colors group mb-4">
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to home
      </NavLink>

      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-12 px-2">
        {steps.map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-3 relative cursor-pointer" onClick={() => step > i + 1 && setStep(i + 1)}>
            <div className={`h-11 w-11 rounded-xl flex items-center justify-center transition-all border-2 ${step > i + 1 ? 'bg-primary-500 border-primary-500 text-white shadow-lg' : i + 1 === step ? 'bg-secondary-900 border-secondary-900 text-white shadow-xl scale-110 font-black' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
              {step > i + 1 ? <CheckCircle2 size={18} /> : s.icon}
            </div>
            <span className={`text-[10px] font-black transition-colors ${step === i + 1 ? 'text-secondary-900' : 'text-slate-400'}`}>{s.title}</span>
            {i < steps.length - 1 && (
               <div className={`hidden sm:block absolute top-[22px] left-[52px] w-[calc(100%/5)] h-0.5 ${step > i + 1 ? 'bg-primary-500' : 'bg-slate-100'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="text-left space-y-2 mb-10">
        <h2 className="text-4xl font-bold text-secondary-900 tracking-tight leading-none">{steps[step-1].title.toLowerCase()} details</h2>
        <p className="text-sm font-semibold text-slate-400 tracking-tight leading-none mt-2">{steps[step - 1].sub}</p>
      </div>

      <form className="space-y-6" onSubmit={step === 4 ? handleRegister : (e) => { e.preventDefault(); nextStep(); }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputGroup
                    label="First name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    icon={<User size={18} />}
                    placeholder="e.g. John"
                    required
                  />
                  <InputGroup
                    label="Last name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    icon={<User size={18} />}
                    placeholder="e.g. Doe"
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
                  placeholder="name@example.com"
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
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2 text-left w-full">
                    <label className="text-[11px] font-bold text-slate-400 ml-2">Location/State</label>
                    <div className="relative group">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors pointer-events-none">
                        <MapPin size={18} />
                      </div>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full bg-blue-50/30 border border-slate-200 rounded-2xl pl-16 pr-6 py-5 text-sm font-semibold text-secondary-900 focus:ring-4 focus:ring-primary-50 focus:border-primary-500 outline-none transition-all appearance-none cursor-pointer"
                      >
                        {['Lagos', 'Abuja', 'Oyo', 'Rivers', 'Kano', 'Enugu'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <InputGroup
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    icon={<MapPin size={18} />}
                    placeholder="e.g. Ikeja"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2 text-left w-full">
                    <label className="text-[11px] font-bold text-slate-400 ml-2">Specialty</label>
                    <select
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleInputChange}
                      className="w-full bg-blue-50/30 border border-slate-200 rounded-2xl px-6 py-5 text-sm font-semibold text-secondary-900 focus:ring-4 focus:ring-primary-50 focus:border-primary-500 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select specialty</option>
                      {['Residential', 'Commercial', 'Industrial', 'Luxury Texture'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2 text-left w-full">
                    <label className="text-[11px] font-bold text-slate-400 ml-2">Experience</label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full bg-blue-50/30 border border-slate-200 rounded-2xl px-6 py-5 text-sm font-semibold text-secondary-900 focus:ring-4 focus:ring-primary-50 focus:border-primary-500 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select experience</option>
                      {['0-2 years', '3-5 years', '5-10 years', '10+ years'].map(s => <option key={s} value={s}>{s}</option>)}
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
                    placeholder="e.g. CAP-PR-001"
                  />
                  <p className="text-[10px] text-slate-400 mt-4 font-semibold leading-relaxed ml-2 tracking-tight">If your employer provided a code, link your account automatically.</p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
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
                  <input 
                    type="checkbox" 
                    id="terms" 
                    required 
                    checked={isTermsChecked}
                    onChange={(e) => setIsTermsChecked(e.target.checked)}
                    className="h-5 w-5 rounded-lg border-slate-200 text-primary-500 mt-1 accent-primary-500 cursor-pointer transition-all" 
                  />
                  <label htmlFor="terms" className="text-xs font-semibold text-slate-500 leading-relaxed cursor-pointer">
                    I verify that I have read and agree to the <span className="text-primary-500 hover:text-black transition-all font-black underline underline-offset-8 decoration-2">Terms</span> & <span className="text-primary-500 hover:text-black transition-all font-black underline underline-offset-8 decoration-2">Privacy Standards</span>.
                  </label>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-10 animate-slide-up pb-10">
                {/* 1. Plan Selection - Clean Grid */}
                <div className="space-y-4">
                  <p className="text-[11px] font-bold text-slate-400 ml-2 uppercase tracking-widest leading-none">Choose your professional tier</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { id: 'FREE', name: 'Standard', price: 'Free', icon: <Shield size={16} /> },
                      { id: 'PRO', name: 'Pro painter', price: '₦5,000', icon: <Zap size={16} /> },
                      { id: 'ELITE', name: 'Elite master', price: '₦15,000', icon: <Gem size={16} /> }
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTier(t.id)}
                        className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-start gap-4 text-left relative group ${selectedTier === t.id ? 'border-primary-500 bg-primary-50/10 shadow-lg' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                      >
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${selectedTier === t.id ? 'bg-primary-500 text-white' : 'bg-slate-50 text-slate-400'}`}>
                          {t.icon}
                        </div>
                        <div className="space-y-0.5">
                          <p className={`text-[10px] font-bold uppercase tracking-tight ${selectedTier === t.id ? 'text-primary-600' : 'text-slate-400'}`}>{t.name}</p>
                          <p className="text-lg font-black text-secondary-900 leading-none">{t.price}</p>
                        </div>
                        {selectedTier === t.id && (
                          <div className="absolute top-4 right-4 text-primary-500">
                             <CheckCircle2 size={16} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Payment Section */}
                <div className="min-h-[400px]">
                  {selectedTier === 'FREE' ? (
                     <div className="p-12 text-center bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-[2.5rem] space-y-6 animate-slide-up">
                        <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center text-primary-500 mx-auto shadow-xl border border-slate-50">
                          <Rocket size={32} />
                        </div>
                        <div className="space-y-2">
                           <p className="text-xl font-bold text-secondary-900">Ready to go?</p>
                           <p className="text-xs font-semibold text-slate-400 leading-relaxed max-w-[280px] mx-auto">Click below to finalize your account and access the standard painter dashboard.</p>
                        </div>
                     </div>
                  ) : (
                    <div className="space-y-8 animate-slide-up">
                      {/* Method Toggle */}
                      <div className="p-2 bg-slate-100/80 rounded-2xl flex gap-1">
                         <button 
                           type="button"
                           onClick={() => setPaymentMethod('CARD')}
                           className={`flex-1 py-3.5 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-2 ${paymentMethod === 'CARD' ? 'bg-white text-secondary-900 shadow-sm' : 'text-slate-500 hover:text-secondary-900'}`}
                         >
                           <CreditCard size={14} /> Debit card
                         </button>
                         <button 
                           type="button"
                           onClick={() => setPaymentMethod('MONNIFY')}
                           className={`flex-1 py-3.5 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-2 ${paymentMethod === 'MONNIFY' ? 'bg-white text-secondary-900 shadow-sm' : 'text-slate-500 hover:text-secondary-900'}`}
                         >
                           <Zap size={14} className="text-blue-500" /> Monnify flow
                         </button>
                      </div>

                      {/* Dynamic Form Area */}
                      {paymentMethod === 'CARD' ? (
                        <div className="space-y-6 bg-white p-2 rounded-2xl animate-slide-up">
                           <InputGroup label="Account holder" name="cardHolder" value={formData.firstName + ' ' + formData.lastName} onChange={() => { }} icon={<User size={18} />} placeholder="Name on card" />
                           <InputGroup label="Card information" name="cardNum" value="" onChange={() => { }} icon={<CreditCard size={18} />} placeholder="0000 0000 0000 0000" />
                           <div className="grid grid-cols-2 gap-4">
                              <InputGroup label="Expiry" name="expiry" value="" onChange={() => { }} icon={<Calendar size={18} />} placeholder="MM/YY" />
                              <InputGroup label="Secure link (CVV)" name="cvv" value="" onChange={() => { }} icon={<Lock size={18} />} placeholder="***" />
                           </div>
                           <div className="pt-2 flex items-center justify-center gap-2 text-slate-300">
                             <Shield size={12} />
                             <span className="text-[10px] font-bold uppercase tracking-[0.2em]">SSL Encrypted / Secure Checkout</span>
                           </div>
                        </div>
                      ) : (
                        <div className="p-12 text-center bg-blue-50/20 border border-blue-100 rounded-[2.5rem] space-y-6 animate-slide-up">
                           <div className="h-20 w-20 bg-white rounded-[2rem] flex items-center justify-center text-blue-500 mx-auto shadow-xl border border-blue-50">
                              <Zap size={40} fill="currentColor" />
                           </div>
                           <div className="space-y-2">
                              <p className="text-xl font-bold text-secondary-900">Redirect to Monnify</p>
                              <p className="text-sm font-semibold text-slate-400 leading-relaxed max-w-[320px] mx-auto">
                                You will be redirected to the secure Monnify portal to complete your payment via Bank Transfer or USSD.
                              </p>
                           </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-4 pt-10">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="h-16 px-10 bg-slate-100 text-slate-500 hover:text-secondary-900 border border-slate-200 rounded-2xl transition-all flex items-center gap-3 group active:scale-95 font-bold text-[13px] shadow-sm"
            >
              <ChevronLeft size={20} /> Back
            </button>
          )}
          <button
            type="submit"
            disabled={loading || !(() => {
              if (step === 1) return formData.firstName && formData.lastName && formData.email && formData.phone;
              if (step === 2) return formData.state && formData.specialty && formData.experience;
              if (step === 3) return formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && formData.password.length >= 6 && isTermsChecked;
              return true;
            })()}
            className={`flex-1 h-16 text-white font-bold rounded-2xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-5 group text-sm tracking-tight disabled:bg-slate-400 disabled:shadow-none disabled:opacity-100 ${loading ? 'bg-secondary-900' : 'bg-secondary-900 hover:bg-black'}`}
          >
            {loading ? <Loader2 size={24} className="animate-spin" /> : step === 4 ? <> {selectedTier === 'FREE' ? 'Finalize account' : `Pay & join workshop`} <ArrowRight size={20} /></> : <>Continue flow <ArrowRight size={20} /></>}
          </button>
        </div>
      </form>

      <div className="pt-16 border-t border-slate-100 text-center">
        <p className="text-[11px] font-black text-slate-300   leading-none">
          Already a workshop member? <NavLink to="/login" className="text-primary-500 hover:text-secondary-900 transition-all ml-4 underline underline-offset-8 decoration-2 font-bold">Sign in</NavLink>
        </p>
      </div>
    </div>
  )
}

function InputGroup({ label, icon, placeholder, name, value, onChange, type = 'text', required = false, togglePassword, showPassword }: {
  label: string; icon: React.ReactNode; placeholder?: string; type?: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean;
  togglePassword?: () => void; showPassword?: boolean;
}) {
  const isPassword = name === 'password' || name === 'confirmPassword'

  return (
    <div className="space-y-2 text-left w-full">
      <label className="text-[11px] font-bold text-slate-400 ml-2 leading-none">{label}</label>
      <div className="relative group">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors pointer-events-none">
          {icon}
        </div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={`w-full bg-blue-50/30 border border-slate-200 rounded-2xl py-5 pl-16 ${isPassword && name === 'password' ? 'pr-16' : 'pr-6'} text-sm font-semibold text-secondary-900 placeholder:text-slate-300 focus:ring-4 focus:ring-primary-50 focus:border-primary-500 transition-all outline-none tracking-tight`}
        />
        {isPassword && name === 'password' && togglePassword && (
          <button
            type="button"
            onClick={togglePassword}
            className="absolute inset-y-0 right-0 pr-6 flex items-center text-slate-300 hover:text-primary-500 transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  )
}