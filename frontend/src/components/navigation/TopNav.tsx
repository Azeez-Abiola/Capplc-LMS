import { NavLink, useNavigate } from 'react-router-dom'
import { Bell, User, LogOut, Settings, Menu, X, ChevronDown, CheckCircle2, AlertCircle, Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'
import { authService } from '../../services/authService'
import { toast } from 'react-hot-toast'

interface NavItem {
  to: string;
  label: string;
}

const userNavItems: NavItem[] = [
  { to: '/', label: 'Overview' },
  { to: '/my-courses', label: 'My Courses' },
  { to: '/video-library', label: 'Video Library' },
  { to: '/certificates', label: 'Certificates' },
  { to: '/subscription', label: 'Subscription' },
]

interface TopNavProps {
  isAdmin?: boolean;
}

export default function TopNav({ isAdmin = false }: TopNavProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [user, setUser] = useState<any>(null)
  const navigate = useNavigate()
  
  const navItems = isAdmin ? [
    { to: '/admin', label: 'Overview' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/courses', label: 'Courses' },
    { to: '/admin/payments', label: 'Payments' },
    { to: '/admin/analytics', label: 'Analytics' },
    { to: '/admin/certificates', label: 'Certificates' },
  ] : userNavItems;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authService.getCurrentUser()
        setUser(userData)
      } catch (error) {
        console.error('Failed to fetch user:', error)
      }
    }
    fetchUser()
  }, [])

  const handleLogout = async () => {
    try {
      await authService.logout()
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  const notifications = [
    { id: 1, type: 'SUCCESS', title: 'Course Completed', msg: 'You have mastered "Surface Prep 101"', time: '2m ago' },
    { id: 2, type: 'INFO', title: 'New Workshop', msg: 'Advanced Glossing is now live', time: '1h ago' },
    { id: 3, type: 'ALERT', title: 'Payment Due', msg: 'Your PRO subscription renews in 3 days', time: '4h ago' },
  ];

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const firstName = user?.user_metadata?.first_name || 'Professional'

  return (
    <nav className="h-20 bg-white border-b-2 border-primary-500 flex items-center sticky top-0 z-[100] transition-all shadow-sm">
      
      <div className="max-w-[1440px] mx-auto w-full px-6 flex items-center justify-between">
        
        {/* Logo Section */}
        <NavLink to={isAdmin ? "/admin" : "/"} className="flex items-center gap-4 shrink-0">
          <div className="h-10 w-10 bg-primary-500 rounded flex items-center justify-center p-1.5 shadow-sm transition-transform hover:scale-105 active:scale-95 shrink-0 overflow-hidden">
             <img src="/Capplc-logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div className="hidden md:block leading-none text-left">
            <p className="text-lg font-bold tracking-tight text-secondary-900 leading-none">
              Business <span className="text-primary-500">Pro</span>
            </p>
            <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-tight leading-none">CAP PLC</p>
          </div>
        </NavLink>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/' || item.to === '/admin'}
              className={({ isActive }) =>
                `px-6 py-2 rounded-full text-xs font-bold transition-all uppercase tracking-widest ${
                  isActive
                    ? 'bg-secondary-900 text-white shadow-lg'
                    : 'text-slate-500 hover:text-secondary-900 hover:bg-slate-50'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleDarkMode}
            className="h-10 w-10 flex items-center justify-center text-slate-400 hover:text-primary-500 hover:bg-slate-50 rounded-md transition-all border border-transparent hover:border-slate-100"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className={`h-10 w-10 flex items-center justify-center rounded-md relative transition-all border ${showNotifications ? 'border-primary-100 bg-primary-50 text-primary-500' : 'text-slate-400 hover:text-secondary-500 hover:bg-slate-50 hover:border-slate-100 border-transparent'}`}
            >
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 bg-primary-500 rounded-full border border-white" />
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-[110]" onClick={() => setShowNotifications(false)} />
                <div className="absolute top-[calc(100%+12px)] right-0 w-80 bg-white dark:bg-white rounded-lg shadow-xl border border-slate-200 dark:border-primary-100 overflow-hidden z-[120] animate-slide-up">
                  <div className="p-4 bg-slate-50 dark:bg-slate-50 border-b border-slate-200 dark:border-slate-200 flex justify-between items-center">
                    <h4 className="text-xs font-bold text-secondary-900">Notifications</h4>
                    <span className="bg-primary-500 text-white text-[8px] px-2 py-0.5 rounded font-bold uppercase">3 New</span>
                  </div>
                  <div className="max-h-[360px] overflow-y-auto no-scrollbar bg-white">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-4 border-b border-slate-50 dark:border-slate-50 hover:bg-slate-50 dark:hover:bg-slate-50 transition-colors cursor-pointer group text-left">
                        <div className="flex gap-4">
                          <div className={`h-8 w-8 rounded flex items-center justify-center shrink-0 border ${n.type === 'SUCCESS' ? 'bg-green-50 text-green-500 border-green-100' : n.type === 'ALERT' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-blue-50 text-blue-500 border-blue-100'}`}>
                            {n.type === 'SUCCESS' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-secondary-500 group-hover:text-primary-500 transition-colors uppercase">{n.title}</p>
                            <p className="text-[10px] text-slate-400 leading-relaxed font-medium">{n.msg}</p>
                            <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-white/10 mx-1 hidden md:block" />

          {/* Profile Control */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className={`flex items-center gap-3 pl-1 pr-3 py-1 rounded-md border transition-all group ${showProfileMenu ? 'bg-white dark:bg-secondary-800 border-primary-500 shadow-sm' : 'bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-white/5 hover:bg-white dark:hover:bg-secondary-800 hover:border-slate-300 dark:hover:border-white/10'}`}
            >
              <div className="h-8 w-8 rounded bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-500 font-bold text-[10px]">
                {firstName.charAt(0)}
              </div>
              <ChevronDown size={14} className={`text-slate-400 group-hover:text-secondary-500 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Menu */}
            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-[110]" onClick={() => setShowProfileMenu(false)} />
                <div className="absolute top-[calc(100%+12px)] right-0 w-60 bg-white dark:bg-white rounded-lg shadow-2xl border border-slate-200 dark:border-primary-100 p-2 z-[120] animate-slide-up">
                  <div className="p-3 bg-slate-50 dark:bg-slate-50 rounded mb-2 border border-slate-100 dark:border-slate-100 text-left">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">Account</p>
                     <p className="text-sm font-bold text-secondary-900 truncate">{firstName} Ali</p>
                  </div>
                  <NavAction icon={<User size={14} />} label="Professional Profile" to="/profile" onClick={() => setShowProfileMenu(false)} />
                  <NavAction icon={<Settings size={14} />} label="System Identity" to="/profile" onClick={() => setShowProfileMenu(false)} />
                  <div className="h-px bg-slate-50 dark:bg-slate-50 my-1 mx-1" />
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-medium hover:bg-red-50 rounded text-xs transition-all"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden h-10 w-10 flex items-center justify-center bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 bg-white dark:bg-white border-b border-primary-500 shadow-2xl p-6 z-[90] animate-slide-up h-[calc(100vh-80px)] overflow-y-auto">
           <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <NavLink 
                  key={item.to} 
                  to={item.to} 
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => `p-4 rounded border text-sm font-bold tracking-tight transition-all text-left ${isActive ? 'bg-primary-50 dark:bg-primary-50 border-primary-100 dark:border-primary-100 text-primary-500' : 'bg-slate-50 dark:bg-slate-50 border-slate-100 dark:border-slate-100 text-secondary-500'}`}
                >
                  {item.label}
                </NavLink>
              ))}
           </div>
        </div>
      )}
    </nav>
  )
}

function NavAction({ icon, label, to, onClick }: { icon: React.ReactNode; label: string; to: string; onClick?: () => void }) {
  return (
    <NavLink 
      to={to} 
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 text-slate-500 font-medium hover:bg-slate-50 hover:text-primary-500 rounded text-xs transition-all text-left"
    >
      {icon} {label}
    </NavLink>
  )
}
