import { Outlet } from 'react-router-dom'
import TopNav from '../components/navigation/TopNav'

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <TopNav />
      
      {/* ── CORE CONTENT INFRASTRUCTURE ── */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-10 py-8 md:py-16 relative">
        <div className="absolute top-0 right-0 h-96 w-96 bg-primary-500/5 rounded-full blur-[100px] pointer-events-none" />
        <Outlet />
      </main>
      
      {/* ── SYSTEM FOOTER ── */}
      <footer className="py-8 md:py-16 border-t border-slate-100 mt-auto bg-white/50 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12 text-left">
           <div className="flex flex-col md:flex-row items-center gap-6">
              <img src="/Capplc-logo.png" alt="CAP Logo" className="h-8 w-auto opacity-70 hover:opacity-100 transition-all hover:scale-105" />
              <div className="h-6 w-px bg-slate-200 hidden md:block" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">© 2026 CAP PLC • BUSINESS PRO PLATFORM</p>
           </div>
           <div className="flex items-center gap-10">
              <a href="#" className="text-[10px] font-bold text-slate-400 hover:text-primary-500 transition-all uppercase tracking-[0.2em] relative group">
                Privacy Policy
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full" />
              </a>
              <a href="#" className="text-[10px] font-bold text-slate-400 hover:text-primary-500 transition-all uppercase tracking-[0.2em] relative group">
                Terms of Service
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full" />
              </a>
              <a href="#" className="text-[10px] font-bold text-slate-400 hover:text-primary-500 transition-all uppercase tracking-[0.2em] relative group">
                Support
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full" />
              </a>
           </div>
        </div>
      </footer>
    </div>
  )
}
