import { Outlet, NavLink } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      
      {/* ── LEFT PANEL: BRAND HERO SECTION ── */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden items-center justify-center p-20 lg:p-32">
         {/* Painter Background Image */}
         <img 
           src="/auth-bg.png" 
           alt="Painting Background" 
           className="absolute inset-0 w-full h-full object-cover"
         />
         
         {/* Premium Dark Overlay for contrast */}
         <div className="absolute inset-0 bg-gradient-to-br from-secondary-900/95 via-secondary-900/80 to-secondary-900/40" />
         
         <div className="relative z-10 space-y-12 max-w-lg">
            <NavLink to="/" className="flex items-center gap-5 group text-left">
               <div className="h-14 w-14 bg-white rounded border border-white/20 flex items-center justify-center p-2.5 shadow-2xl transition-all group-hover:scale-110">
                  <img src="/Capplc-logo.png" alt="Logo" className="h-full w-auto object-contain" />
               </div>
               <div className="space-y-0.5">
                  <span className="block text-2xl font-bold tracking-[0.2em] text-white leading-none">Business <span className="text-primary-500">Pro</span></span>
                  <span className="block text-[10px] font-bold text-slate-400 tracking-widest leading-none mt-1">Cap Plc digital ecosystem</span>
               </div>
            </NavLink>
            
            <div className="space-y-6 text-left">
               <h1 className="text-6xl font-extrabold text-white leading-[1.05] tracking-tight capitalize">
                  Professional <br />
                  <span className="text-primary-500">Mastery.</span>
               </h1>
               <div className="h-1 w-20 bg-primary-500 rounded" />
            </div>
         </div>
      </div>

      {/* ── RIGHT PANEL: AUTH CONTEXT CONTAINER ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 md:p-20 relative bg-white">
        <div className="w-full max-w-[420px] animate-slide-up relative z-10">
           
           {/* Mobile Branding */}
           <div className="md:hidden flex flex-col items-center mb-16 gap-5">
              <div className="h-16 w-16 bg-white shadow-xl rounded flex items-center justify-center p-3 border border-slate-100 dark:border-white/5">
                 <img src="/Capplc-logo.png" alt="Logo" className="h-full w-auto object-contain" />
              </div>
              <div className="text-center">
                 <span className="block text-xl font-bold tracking-tight text-secondary-500 dark:text-white leading-none">Business <span className="text-primary-500">Pro</span></span>
                 <span className="block text-[8px] font-bold text-slate-400 tracking-[0.3em] mt-2">Cap Plc digital</span>
              </div>
           </div>

           <div className="p-0 bg-transparent border-none">
              <Outlet />
           </div>
        </div>

        {/* Minimal Footer */}
        <div className="absolute bottom-10 inset-x-0 text-center">
           <p className="text-[10px] font-bold text-slate-300 tracking-[0.5em] leading-none">
              © 2026 Cap Plc
           </p>
        </div>
      </div>
    </div>
  )
}
