import { Outlet } from 'react-router-dom'
import TopNav from '../components/navigation/TopNav'

export default function SuperAdminLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] dark:bg-secondary-900 pt-20 transition-colors duration-300">
      <TopNav variant="super-admin" />
      
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-10 py-8 md:py-16 relative">
        <Outlet />
      </main>
      
      <footer className="py-12 border-t border-slate-200 dark:border-white/5 mt-auto bg-white dark:bg-secondary-900">
        <div className="max-w-[1440px] mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-secondary-900 dark:bg-primary-500 rounded-xl flex items-center justify-center p-2 shadow-lg">
                 <img src="/Capplc-logo.png" alt="CAP Logo" className="brightness-0 invert h-full w-auto object-contain" />
              </div>
              <div className="space-y-1 text-left">
                 <p className="text-[11px] font-bold text-secondary-900 dark:text-white tracking-widest leading-none">Super admin console</p>
                 <p className="text-[10px] font-bold text-slate-400 dark:text-white/30 tracking-widest leading-none">Cap Plc platform owner</p>
              </div>
           </div>
           <p className="text-[10px] font-bold text-slate-400 dark:text-white/20 tracking-[0.3em]">Cap Plc 2026</p>
        </div>
      </footer>
    </div>
  )
}
