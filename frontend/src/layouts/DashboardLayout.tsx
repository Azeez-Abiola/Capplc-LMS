import { Outlet } from 'react-router-dom'
import TopNav from '../components/navigation/TopNav'

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)]">
      <TopNav />
      
      {/* ── CORE CONTENT INFRASTRUCTURE ── */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-6 py-10 relative">
        <div className="absolute top-0 right-0 h-96 w-96 bg-primary-500/5 rounded-full blur-[100px] pointer-events-none" />
        <Outlet />
      </main>
      
      {/* ── SYSTEM FOOTER ── */}
      <footer className="py-12 border-t border-slate-200 mt-auto bg-white/50 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex flex-col md:flex-row items-center gap-4">
              <img src="/Capplc-logo.png" alt="CAP Logo" className="h-6 w-auto opacity-60 hover:opacity-100 transition-opacity" />
              <div className="h-4 w-px bg-slate-200 hidden md:block" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">© 2026 CAP PLC • BUSINESS PRO NODE • INFRASTRUCTURE V2.1.0_LATEST</p>
           </div>
           <div className="flex items-center gap-10">
              <a href="#" className="text-[9px] font-bold text-slate-400 hover:text-primary-500 transition-colors uppercase tracking-[0.2em]">Data Privacy Protocol</a>
              <a href="#" className="text-[9px] font-bold text-slate-400 hover:text-primary-500 transition-colors uppercase tracking-[0.2em]">Service SLAs</a>
              <a href="#" className="text-[9px] font-bold text-slate-400 hover:text-primary-500 transition-colors uppercase tracking-[0.2em]">System Support</a>
           </div>
        </div>
      </footer>
    </div>
  )
}
