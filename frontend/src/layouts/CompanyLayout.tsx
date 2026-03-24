import { Outlet } from 'react-router-dom'
import TopNav from '../components/navigation/TopNav'

export default function CompanyLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] pt-20">
      <TopNav variant="admin" />
      
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-10 py-8 md:py-16 relative">
        <Outlet />
      </main>
      
      <footer className="py-12 border-t border-slate-100 mt-auto bg-white">
        <div className="max-w-[1440px] mx-auto px-10 flex justify-between items-center">
           <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-secondary-900 rounded-xl flex items-center justify-center p-2 shadow-lg">
                 <img src="/Capplc-logo.png" alt="CAP Logo" className="brightness-0 invert h-full" />
              </div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Company Portal</p>
           </div>
           <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">© 2026 CAP PLC</p>
        </div>
      </footer>
    </div>
  )
}
