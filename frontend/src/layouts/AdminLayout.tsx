import { Outlet } from 'react-router-dom'
import TopNav from '../components/navigation/TopNav'

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
       {/* High-level system ID for TopNav */}
      <TopNav isAdmin={true} />
      
      {/* ── ADMIN CORE INFRASTRUCTURE ── */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-10 py-8 md:py-16 relative">
        <Outlet />
      </main>
      
      {/* ── INTERNAL SYSTEM FOOTER ── */}
      <footer className="py-8 md:py-16 border-t border-slate-100 mt-auto bg-white">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10">
           <div className="flex items-center gap-5 group">
              <div className="h-10 w-10 bg-secondary-900 rounded-xl flex items-center justify-center p-2 shadow-xl group-hover:scale-110 transition-transform">
                 <img src="/Capplc-logo.png" alt="CAP Logo" className="brightness-0 invert h-full w-auto object-contain" />
              </div>
              <div className="space-y-1">
                 <p className="text-xs font-bold text-secondary-900 uppercase tracking-widest leading-none">Admin Dashboard</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">CAP PLC Business Pro Platform</p>
              </div>
           </div>
           <div className="text-right space-y-2">
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.5em]">© 2026 CAP PLC</p>
              <div className="h-1 w-20 bg-primary-500/10 rounded-full overflow-hidden ml-auto">
                 <div className="h-full w-10 bg-primary-500 animate-shimmer" />
              </div>
           </div>
        </div>
      </footer>
    </div>
  )
}
