import { useState } from 'react'
import { ArrowRight, CheckCircle2, Star, Target, Shield, Rocket, User, Award } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { userService } from '../../services/userService'
import { toast } from 'react-hot-toast'

interface OnboardingModalProps {
  onComplete: () => void
  userProfile: any
}

export default function OnboardingModal({ onComplete, userProfile }: OnboardingModalProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selection, setSelection] = useState<string[]>([])

  const steps = [
    {
      title: "Welcome to the Elite Circle",
      subtitle: "The CAP Business Pro ecosystem is designed for professionals who want to lead the industry.",
      icon: <Rocket className="text-primary-500" size={32} />
    },
    {
      title: "Choose Your Path",
      subtitle: "What's your primary goal this quarter?",
      icon: <Target className="text-secondary-500" size={32} />
    },
    {
       title: "Confirm Your Expertise",
       subtitle: "Does this look correct? This will be on your certificates.",
       icon: <Award className="text-amber-500" size={32} />
    }
  ]

  const goals = [
    "Master Industrial Spraying",
    "Luxury Texture Portfolio",
    "Business Management Skills",
    "Certification for Government Contracts",
    "Sales & High-Ticket Closing"
  ]

  const toggleGoal = (goal: string) => {
    setSelection(prev => prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal])
  }

  const handleFinish = async () => {
    setLoading(true)
    try {
      await userService.updateProfile({ 
        onboarding_completed: true,
        interests: selection
      })
      toast.success('Onboarding complete! Welcome aboard.')
      onComplete()
    } catch (error) {
       toast.error('Failed to save preferences')
    } finally {
       setLoading(false)
    }
  }

  const nextStep = () => {
    if (step < steps.length) setStep(step + 1)
    else handleFinish()
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-secondary-900/40 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[40px] max-w-2xl w-full overflow-hidden shadow-2xl relative border border-slate-100"
      >
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-50 rounded-full blur-3xl -ml-32 -mb-32 opacity-50" />

        <div className="relative p-12 sm:p-16">
          <div className="flex justify-between items-start mb-12">
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm">
                      {steps[step-1].icon}
                   </div>
                   <div className="flex gap-1.5">
                      {[1, 2, 3].map(s => (
                        <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${step === s ? 'w-8 bg-secondary-900' : 'w-2 bg-slate-100'}`} />
                      ))}
                   </div>
                </div>
                <h2 className="text-4xl font-bold text-secondary-900 tracking-tight leading-[1.1]">{steps[step-1].title}</h2>
                <p className="text-slate-500 font-medium text-lg leading-relaxed">{steps[step-1].subtitle}</p>
             </div>
          </div>

          <AnimatePresence mode="wait">
             <motion.div 
               key={step}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="min-h-[300px]"
             >
                {step === 1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                     <BenefitCard icon={<Shield size={20} />} title="Official Certifications" desc="Earn industry-recognized badges of honor from CAP PLC." />
                     <BenefitCard icon={<User size={20} />} title="Direct Support" desc="Exclusive access to our master painters and technical team." />
                     <BenefitCard icon={<Award size={20} />} title="Premium Tiers" desc="Unlock professional-grade textures and industrial spray tools." />
                     <BenefitCard icon={<Star size={20} />} title="Project Showcase" desc="Feature your best work in our nationwide portfolio." />
                  </div>
                )}

                {step === 2 && (
                   <div className="space-y-4 mt-8">
                      {goals.map(goal => (
                        <button 
                          key={goal}
                          onClick={() => toggleGoal(goal)}
                          className={`w-full flex items-center justify-between p-6 rounded-3xl border transition-all active:scale-[0.98] ${selection.includes(goal) ? 'bg-secondary-900 border-secondary-900 text-white shadow-xl translate-x-1' : 'bg-slate-50/50 border-slate-100 text-slate-400 hover:border-primary-500 group'}`}
                        >
                           <span className="font-bold text-sm uppercase tracking-widest">{goal}</span>
                           <CheckCircle2 size={24} className={selection.includes(goal) ? 'text-primary-500' : 'opacity-0 group-hover:opacity-100 text-slate-200 transition-opacity'} />
                        </button>
                      ))}
                   </div>
                )}

                {step === 3 && (
                   <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100 mt-8 space-y-8">
                      <div className="flex items-center gap-6">
                         <div className="h-20 w-20 rounded-[28px] bg-secondary-900 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                            {userProfile?.first_name?.[0] || 'U'}
                         </div>
                         <div>
                            <p className="text-2xl font-bold text-secondary-900 tracking-tight leading-none">{userProfile?.first_name} {userProfile?.last_name}</p>
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-3">Verified Professional Member</p>
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-200/50">
                         <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Specialty</p>
                            <p className="text-secondary-900 font-bold">{userProfile?.specialty || 'General Painting'}</p>
                         </div>
                         <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Experience</p>
                            <p className="text-secondary-900 font-bold">{userProfile?.years_of_experience || 'Qualified'} Experience</p>
                         </div>
                      </div>
                   </div>
                )}
             </motion.div>
          </AnimatePresence>

          <div className="mt-12 flex gap-4">
             {step > 1 && (
               <button 
                 onClick={() => setStep(step - 1)}
                 className="h-16 px-8 bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-secondary-900 font-bold rounded-2xl transition-all flex items-center gap-2 group border border-slate-100"
               >
                  Back
               </button>
             )}
             <button 
               onClick={nextStep}
               disabled={loading || (step === 2 && selection.length === 0)}
               className="flex-1 h-20 bg-secondary-900 hover:bg-black text-white font-bold rounded-[28px] text-lg transition-all shadow-2xl flex items-center justify-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed"
             >
                {loading ? 'Optimizing Profile...' : step === steps.length ? 'Finalize My Entry' : 'Continue Path'} 
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                   <ArrowRight size={24} />
                </div>
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function BenefitCard({ icon, title, desc }: { icon: React.ReactNode; title: string, desc: string }) {
  return (
    <div className="p-6 rounded-3xl bg-slate-50/50 border border-slate-100 hover:border-primary-500 transition-all group">
       <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-primary-500 mb-4 shadow-sm group-hover:scale-110 transition-transform">
          {icon}
       </div>
       <h4 className="font-bold text-secondary-900 tracking-tight mb-1">{title}</h4>
       <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
    </div>
  )
}
