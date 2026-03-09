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
        console.error('Failed to fetch subscription:', error)
        // Set fallback state so the UI still works
        setSub({ id: '', user_id: '', tier: 'FREE', status: 'ACTIVE', current_period_end: new Date().toISOString() })
      } finally {
        setLoading(false)
      }
    }
    fetchSub()
  }, [])

  if (loading) {
     return (
       <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
         <Loader2 size={40} className="animate-spin text-primary-500" />
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Accessing Billing Ledger...</p>
       </div>
     )
  }

  const handleUpgrade = async (tier: string) => {
    try {
      await subscriptionService.subscribe(tier)
      toast.success(`Successfully initialized ${tier} upgrade. Redirecting...`)
      // Logic to sync with payment gateway would go here
    } catch (e) {
      toast.error('Failed to initialize upgrade process.')
    }
  }

  const currentTier = sub?.tier?.toUpperCase() || 'FREE'

  return (
    <div className="space-y-12 animate-slide-up pb-10">
      
      {/* ── HEADER SECTION ── */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-secondary-500 uppercase tracking-[0.2em]">Growth Tier Selection</h1>
        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest leading-relaxed">
          Select the professional track that aligns with your CAP Business Pro trajectory. 
          Enterprise billing and tiered access available.
        </p>
      </div>

      {/* ── TIER GRID (STRUCTURED) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto pb-4 px-4 sm:px-0">
         
         {/* PRO TIER */}
         <div className={`bento-card p-6 sm:p-12 flex flex-col justify-between group transition-all bg-white dark:bg-zinc-900 relative overflow-hidden shadow-xl ${currentTier === 'PRO' ? 'border-2 border-primary-500 shadow-primary-500/20' : 'hover:border-slate-300 dark:hover:border-white/10'}`}>
            {currentTier === 'PRO' && (
              <div className="absolute top-0 right-0 bg-primary-500 text-white text-[10px] font-black px-6 py-2.5 uppercase tracking-[0.3em] leading-none">
                 ACTIVE_NODE
              </div>
            )}
            <div className="space-y-10 relative z-10 text-left">
               <div className="flex justify-between items-start">
                  <div className="space-y-2">
                     <h3 className="text-2xl font-black text-secondary-500 dark:text-white uppercase tracking-[0.2em] leading-none">PRO_TIER</h3>
                     <p className="text-[10px] font-black text-slate-300 dark:text-slate-400 uppercase tracking-[0.3em]">Foundation Protocol</p>
                  </div>
                  <div className="h-12 w-12 bg-slate-50 dark:bg-white/5 rounded border border-slate-100 dark:border-white/10 flex items-center justify-center text-slate-300 dark:text-slate-500 group-hover:text-primary-500 transition-colors">
                     <Zap size={24} />
                  </div>
               </div>
               <div className="flex items-baseline gap-2 py-6 border-y border-slate-50 dark:border-white/5">
                  <span className="text-5xl font-black text-secondary-500 dark:text-white tabular-nums">₦5,000</span>
                  <span className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">/ MONTHLY_CYCLE</span>
               </div>
               <div className="space-y-5">
                  <FeatureItem label="Standard Workshop Archive" />
                  <FeatureItem label="Downloadable Module PDFs" />
                  <FeatureItem label="Basic Certification Path" />
                  <FeatureItem label="User Progress Dashboard" />
               </div>
            </div>
            {currentTier === 'PRO' ? (
                <button disabled className="w-full mt-12 py-5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-slate-400 font-extrabold rounded text-[10px] uppercase tracking-[0.3em] transition-all cursor-not-allowed">
                   CURRENT_BILLING_ACTIVE
                </button>
            ) : (
                <button onClick={() => handleUpgrade('PRO')} className="w-full mt-12 py-5 bg-white dark:bg-zinc-800 border-2 border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 font-extrabold rounded text-[11px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3">
                   INITIALIZE_PRO <ChevronRight size={16} />
                </button>
            )}
         </div>

         {/* ELITE TIER */}
         <div className={`bento-card p-6 sm:p-12 flex flex-col justify-between relative overflow-hidden bg-white dark:bg-zinc-900 shadow-2xl group transition-transform ${currentTier === 'ELITE' ? 'border-2 border-primary-500 shadow-primary-500/20' : 'border border-primary-200 dark:border-primary-900/50 hover:border-primary-500 active:scale-[0.99] '}`}>
            {currentTier === 'ELITE' ? (
               <div className="absolute top-0 right-0 bg-primary-500 text-white text-[10px] font-black px-6 py-2.5 uppercase tracking-[0.3em] leading-none">
                  ACTIVE_NODE
               </div>
            ) : (
               <div className="absolute top-0 right-0 bg-primary-500 text-white text-[10px] font-black px-6 py-2.5 uppercase tracking-[0.3em] leading-none">
                  OPTIMAL_VAL
               </div>
            )}
            <div className="space-y-10 relative z-10 text-left">
               <div className="flex justify-between items-start">
                  <div className="space-y-2">
                     <h3 className="text-2xl font-black text-secondary-500 dark:text-white uppercase tracking-[0.2em] leading-none">ELITE_TIER</h3>
                     <p className="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em]">Mastery Environment</p>
                  </div>
                  <div className="h-12 w-12 bg-primary-50 dark:bg-primary-900/20 rounded border border-primary-100 dark:border-primary-500/20 flex items-center justify-center text-primary-500 shadow-sm">
                     <ShieldCheck size={24} />
                  </div>
               </div>
               <div className="flex items-baseline gap-2 py-6 border-y border-slate-50 dark:border-white/5">
                  <span className="text-5xl font-black text-secondary-500 dark:text-white tabular-nums">₦15,000</span>
                  <span className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">/ MONTHLY_CYCLE</span>
               </div>
               <div className="space-y-5">
                  <FeatureItem label="Premium Masterclass Records" active />
                  <FeatureItem label="Advanced Global Standards" active />
                  <FeatureItem label="Priority Credentialing" active />
                  <FeatureItem label="Direct HQ Support Node" active />
                  <FeatureItem label="Exclusive Color Matrices" active />
               </div>
            </div>
            {currentTier === 'ELITE' ? (
                <button disabled className="w-full mt-12 py-5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-slate-400 font-extrabold rounded text-[10px] uppercase tracking-[0.3em] transition-all cursor-not-allowed">
                   CURRENT_BILLING_ACTIVE
                </button>
            ) : (
                <button onClick={() => handleUpgrade('ELITE')} className="w-full mt-12 py-5 bg-primary-500 text-white font-black rounded text-[11px] uppercase tracking-[0.3em] hover:bg-primary-600 shadow-xl shadow-primary-500/20 transition-all flex items-center justify-center gap-3">
                   UPGRADE_ENVIRONMENT <ChevronRight size={16} />
                </button>
            )}
         </div>

      </div>

      {/* ── BILLING DATA BANNER ── */}
      <div className="max-w-5xl mx-auto bento-card p-6 sm:p-8 bg-secondary-900 border-none relative overflow-hidden group shadow-2xl mx-0 sm:mx-4">
         <div className="absolute top-0 right-0 h-64 w-64 bg-primary-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
         <div className="flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-10 relative z-10">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-center sm:text-left">
               <div className="h-14 w-14 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center text-primary-500 shadow-inner group-hover:scale-110 transition-transform">
                  <CreditCard size={28} />
               </div>
               <div className="space-y-2">
                  <p className="text-white font-black text-lg sm:text-xl uppercase tracking-[0.2em]">Billing Profile: <span className="text-primary-500">{currentTier}_STANDARD</span></p>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
                    RECURRENCE_SYNC: {sub?.current_period_end ? new Date(sub.current_period_end).toLocaleDateString() : 'N/A'}
                  </p>
               </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
               <button className="flex-1 sm:flex-none border-2 border-white/5 text-white font-black text-[10px] px-8 py-4 rounded hover:bg-white/5 hover:border-white/10 transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-3">
                  <RefreshCcw size={14} className="group-hover:rotate-180 transition-transform duration-1000" /> SYNC_LEDGER
               </button>
               <NavLink to="/my-courses" className="flex-1 sm:flex-none bg-white text-secondary-500 font-black text-[10px] px-8 py-4 rounded hover:bg-primary-500 hover:text-white transition-all uppercase tracking-[0.2em] text-center">
                  VIEW_ARCHIVE
               </NavLink>
            </div>
         </div>
      </div>

    </div>
  )
}

function FeatureItem({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <div className="flex items-center gap-4 group text-left">
       <div className={`h-6 w-6 rounded flex items-center justify-center border transition-all shadow-sm shrink-0 ${active ? 'bg-primary-500 text-white border-primary-100 dark:border-primary-500' : 'bg-green-50 dark:bg-green-900/20 text-green-500 border-green-100 dark:border-green-500/20'}`}>
          <CheckCircle2 size={14} strokeWidth={3} />
       </div>
       <span className="text-[11px] font-black text-secondary-500 dark:text-white uppercase tracking-tight group-hover:text-primary-500 transition-colors opacity-70 group-hover:opacity-100">{label}</span>
    </div>
  )
}
