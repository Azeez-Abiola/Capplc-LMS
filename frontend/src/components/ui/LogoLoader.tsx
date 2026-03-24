

interface LogoLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fullscreen?: boolean
  logoSrc?: string
  label?: string
}

export default function LogoLoader({ size = 'md', fullscreen = false, logoSrc = '/capplc-logo1.png', label }: LogoLoaderProps) {
  const sizeClasses = {
    sm: 'h-20 w-20',
    md: 'h-32 w-32',
    lg: 'h-48 w-48',
    xl: 'h-96 w-96'
  }

  const content = (
    <div className="flex flex-col items-center justify-center space-y-12 animate-fade-in-out">
      <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
        {/* Rich smooth beating background */}
        <div className={`absolute inset-0 ${logoSrc.includes('1879') ? 'bg-red-500/10' : 'bg-primary-500/10'} rounded-full blur-[40px] animate-pulse-rich scale-[1.5]`} />
        <div className={`absolute inset-0 ${logoSrc.includes('1879') ? 'bg-red-500/5' : 'bg-primary-500/5'} rounded-full blur-[80px] animate-pulse-rich-delayed scale-[2.0]`} />
        
        {/* Pulse Logo */}
        <img 
          src={logoSrc} 
          alt="Brand Logo" 
          className="h-full w-full object-contain relative z-10 animate-pulse-rich"
          style={{ 
            animationDuration: '3s',
            animationTimingFunction: 'ease-in-out'
          }}
        />
        
        {/* Soft radial glow underneath */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-40 h-4 bg-black/5 rounded-[100%] blur-[10px] animate-pulse-rich opacity-50" />
      </div>

      {label && (
        <div className="space-y-4">
            <p className="text-[10px] font-black text-secondary-900 uppercase tracking-[0.4em] text-center max-w-xs leading-relaxed opacity-80">
              {label}
            </p>
            <div className="h-1 w-12 bg-primary-500/20 rounded-full mx-auto overflow-hidden">
                <div className="h-full w-1/2 bg-primary-500 rounded-full animate-loading-bar" />
            </div>
        </div>
      )}
    </div>
  )

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-[1000] bg-white dark:bg-secondary-900 flex items-center justify-center overflow-hidden">
        {content}
      </div>
    )
  }

  return content
}

// Add these to your global CSS or tailwind config if not already there
// @keyframes bounce-slow {
//   0%, 100% { transform: translateY(0); }
//   50% { transform: translateY(-15%); }
// }
// @keyframes shadow-pulse {
//   0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.1; }
//   50% { transform: translateX(-50%) scale(1.5); opacity: 0.05; }
// }
// @keyframes fade-in-out {
//   0%, 100% { opacity: 0.4; }
//   50% { opacity: 1; }
// }
