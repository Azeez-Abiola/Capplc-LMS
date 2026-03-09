import { Outlet } from 'react-router-dom'
import TopNav from '../components/navigation/TopNav'

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)]">
       {/* High-level system ID for TopNav */}
      <TopNav isAdmin={true} />
      
      {/* ── ADMIN CORE INFRASTRUCTURE ── */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-6 py-12 relative">
        {/* Subtle grid pattern for admin context */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
        <Outlet />
      </main>
      
      {/* ── INTERNAL SYSTEM FOOTER ── */}
      <footer className="py-12 border-t border-slate-200 mt-auto bg-white/50 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-4">
              <div className="h-8 w-8 bg-secondary-900 border border-white/10 rounded flex items-center justify-center p-1.5 shadow-lg group-hover:scale-110 transition-transform">
                 <img src="/Capplc-logo.png" alt="CAP Logo" className="brightness-0 invert h-full w-auto object-contain" />
              </div>
              <div className="space-y-0.5">
                 <p className="text-[10px] font-bold text-secondary-500 uppercase tracking-widest leading-none">Admin Command Portal</p>
                 <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">CAP PLC BUSINESS PRO DIGITAL ARCHITECTURE</p>
              </div>
           </div>
           <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.5em]">© 2026 INTERNAL NETWORK PROTOCOLS ONLY</p>
        </div>
      </footer>
    </div>
  )
}
