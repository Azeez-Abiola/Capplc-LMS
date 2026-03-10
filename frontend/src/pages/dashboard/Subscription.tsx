import { CheckCircle2, ShieldCheck, Zap, CreditCard, RefreshCcw, ChevronRight, Loader2 } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { subscriptionService } from '../../services/subscriptionService'
import type { SubscriptionInfo } from '../../services/subscriptionService'
import { toast } from 'react-hot-toast'

export default function Subscription() {
  const [sub, setSub] = useState<SubscriptionInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSub = async () => {
      try {
        const data = await subscriptionService.getCurrentSubscription()
        setSub(data || { id: '', user_id: '', tier: 'FREE', status: 'ACTIVE', current_period_end: new Date().toISOString() })
      } catch (error) {
        console.error('Subscription error:', error)
        setSub({ id: '', user_id: '', tier: 'FREE', status: 'ACTIVE', current_period_end: new Date().toISOString() })
      } finally {
        setLoading(false)
      }
    }
    fetchSub()
  }, [])

  if (loading) {
     return (
       <div className="h-[60vh] flex flex-col items-center justify-center space-y-6 text-left">
          <div className="h-16 w-16 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center shadow-inner">
            <Loader2 size={32} className="animate-spin text-primary-500" />
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.25em]">Accessing records...</p>
       </div>
     )
  }

  const handleUpgrade = async (tier: string) => {
    try {
      await subscriptionService.subscribe(tier)
      toast.success(`Switching to ${tier} plan. Redirecting...`)
    } catch (e) {
      toast.error('Failed to update subscription.')
    }
  }

  const currentTier = sub?.tier?.toUpperCase() || 'FREE'

  return (
    <div className="space-y-12 animate-slide-up pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4 text-left border-b border-slate-50">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-secondary-900 leading-none">Subscription Plans</h1>
          <p className="text-slate-500 text-sm font-medium">Choose the professional plan that fits your career goals.</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-50/50 p-3 rounded-2xl border border-slate-100 shadow-inner">
           <ShieldCheck size={20} className="text-primary-500" />
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Secure Checkout Verified</span>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto items-stretch text-left">
         
         {/* PROFESSIONAL TIER */}
         <div className={`p-10 rounded-3xl flex flex-col justify-between group transition-all relative ${currentTier === 'PRO' ? 'bg-white border-2 border-primary-500 shadow-2xl ring-8 ring-primary-50/50' : 'bg-white border border-slate-100 hover:border-primary-100 hover:shadow-xl'}`}>
            {currentTier === 'PRO' && (
              <div className="absolute top-0 right-10 -translate-y-1/2">
                <span className="bg-primary-500 text-white text-[10px] font-bold px-6 py-2 rounded-xl uppercase tracking-[0.2em] shadow-lg">Current Active Plan</span>
              </div>
            )}
            <div className="space-y-10">
               <div className="flex justify-between items-start">
                  <div className="space-y-2">
                     <h3 className="text-2xl font-bold text-secondary-900 tracking-tight">Professional</h3>
                     <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Standard Academy Track</p>
                  </div>
                  <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-primary-500 transition-all shadow-inner">
                     <Zap size={28} />
                  </div>
               </div>
               <div className="flex items-baseline gap-3 py-10 border-y border-slate-50">
                  <span className="text-4xl font-bold text-secondary-900 tracking-tight tabular-nums">₦5,000</span>
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.25em]">/ Monthly</span>
               </div>
               <div className="space-y-5">
                  <FeatureItem label="Full Academy Access" />
                  <FeatureItem label="Downloadable Resources" />
                  <FeatureItem label="Course Certifications" />
                  <FeatureItem label="Performance Analytics" />
               </div>
            </div>
            {currentTier === 'PRO' ? (
                <button disabled className="w-full mt-12 py-4 bg-slate-50 text-slate-300 font-bold rounded-2xl text-[10px] uppercase tracking-widest cursor-not-allowed border border-slate-100">
                   Plan Currently Active
                </button>
            ) : (
                <button onClick={() => handleUpgrade('PRO')} className="w-full mt-12 py-4 border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white font-bold rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-sm">
                   Select Professional <ChevronRight size={18} />
                </button>
            )}
         </div>

         {/* ELITE TIER */}
         <div className={`p-10 rounded-3xl flex flex-col justify-between group transition-all relative ${currentTier === 'ELITE' ? 'bg-white border-2 border-primary-500 shadow-2xl ring-8 ring-primary-50/50' : 'bg-secondary-900 border-none shadow-2xl hover:scale-[1.02]'}`}>
            <div className="absolute top-0 right-10 -translate-y-1/2">
               <span className="bg-primary-500 text-white text-[10px] font-bold px-6 py-2 rounded-xl uppercase tracking-[0.2em] shadow-lg">Enterprise Mastery</span>
            </div>
            <div className="space-y-10">
               <div className="flex justify-between items-start">
                  <div className="space-y-2">
                     <h3 className={`text-2xl font-bold tracking-tight ${currentTier === 'ELITE' ? 'text-secondary-900' : 'text-white'}`}>Elite Master</h3>
                     <p className="text-[11px] font-bold text-primary-500 uppercase tracking-[0.2em]">Industry Leadership Program</p>
                  </div>
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 ${currentTier === 'ELITE' ? 'bg-primary-50 text-primary-500' : 'bg-white/5 text-primary-500 border border-white/10'}`}>
                     <ShieldCheck size={28} />
                  </div>
               </div>
               <div className={`flex items-baseline gap-3 py-10 border-y ${currentTier === 'ELITE' ? 'border-slate-50' : 'border-white/5'}`}>
                  <span className={`text-4xl font-bold tracking-tight tabular-nums ${currentTier === 'ELITE' ? 'text-secondary-900' : 'text-white'}`}>₦15,000</span>
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.25em]">/ Monthly</span>
               </div>
               <div className="space-y-5">
                  <FeatureItem label="Priority Masterclass Enrollment" contrast={currentTier !== 'ELITE'} />
                  <FeatureItem label="Global Certification Roadmap" contrast={currentTier !== 'ELITE'} />
                  <FeatureItem label="Instant Credential Verification" contrast={currentTier !== 'ELITE'} />
                  <FeatureItem label="Direct Technical Support" contrast={currentTier !== 'ELITE'} />
                  <FeatureItem label="Exclusive Resource Library" contrast={currentTier !== 'ELITE'} />
               </div>
            </div>
            {currentTier === 'ELITE' ? (
                <button disabled className="w-full mt-12 py-4 bg-slate-50 text-slate-300 font-bold rounded-2xl text-[10px] uppercase tracking-widest cursor-not-allowed border border-slate-100">
                   Plan Currently Active
                </button>
            ) : (
                <button onClick={() => handleUpgrade('ELITE')} className="w-full mt-12 py-4 bg-primary-500 text-white font-bold rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-secondary-900 shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95">
                   Enlist for Elite <ChevronRight size={18} />
                </button>
            )}
         </div>
      </div>

      {/* Account Status Summary */}
      <div className="bg-secondary-900 p-10 sm:p-14 rounded-3xl relative overflow-hidden group shadow-2xl transition-all hover:shadow-primary-500/10 text-left">
         <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
            <div className="flex flex-col sm:flex-row items-center gap-8">
               <div className="h-20 w-20 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-primary-500 shadow-inner group-hover:scale-110 transition-transform">
                  <CreditCard size={36} />
               </div>
               <div className="space-y-3">
                  <p className="text-white font-bold text-2xl tracking-tight">Active Plan: <span className="text-primary-500 capitalize">{currentTier}</span></p>
                  <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.3em]">
                    Renewal Cycle: {sub?.current_period_end ? new Date(sub.current_period_end).toLocaleDateString() : 'Active'}
                  </p>
               </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-5 w-full lg:w-auto">
               <button className="h-14 border border-white/10 text-white font-bold text-[10px] px-10 rounded-2xl hover:bg-white/5 transition-all uppercase tracking-widest flex items-center justify-center gap-4 active:scale-95">
                  <RefreshCcw size={16} className="group-hover:rotate-180 transition-transform duration-1000" /> System Update
               </button>
               <NavLink to="/my-courses" className="h-14 bg-white text-secondary-900 font-bold text-[10px] px-10 rounded-2xl hover:bg-primary-500 hover:text-white transition-all uppercase tracking-widest flex items-center justify-center shadow-xl active:scale-95">
                  Access Academy
               </NavLink>
            </div>
         </div>
         <div className="absolute top-0 right-0 h-[350px] w-[350px] bg-primary-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      </div>

    </div>
  )
}

function FeatureItem({ label, contrast = false }: { label: string; contrast?: boolean }) {
  return (
    <div className="flex items-center gap-5 group">
       <div className={`h-7 w-7 rounded-xl flex items-center justify-center border shadow-sm shrink-0 group-hover:scale-110 transition-transform ${contrast ? 'bg-primary-500/10 text-primary-500 border-primary-500/20' : 'bg-green-50 text-green-500 border-green-100'}`}>
          <CheckCircle2 size={16} strokeWidth={3} />
       </div>
       <span className={`text-sm font-bold tracking-tight transition-colors ${contrast ? 'text-slate-400 group-hover:text-white' : 'text-slate-600 group-hover:text-secondary-900'}`}>{label}</span>
    </div>
  )
}
