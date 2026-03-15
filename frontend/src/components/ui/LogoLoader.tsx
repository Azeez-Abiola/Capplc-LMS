

interface LogoLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fullscreen?: boolean
  logoSrc?: string
  label?: string
}

export default function LogoLoader({ size = 'md', fullscreen = false, logoSrc = '/capplc-logo1.png', label }: LogoLoaderProps) {
  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-24 w-24',
    lg: 'h-32 w-32',
    xl: 'h-96 w-96'
  }

  const content = (
    <div className="flex flex-col items-center justify-center space-y-12 animate-fade-in-out">
      <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
        {/* Soft pulse background */}
        <div className={`absolute inset-0 ${logoSrc.includes('1879') ? 'bg-red-500/20' : 'bg-primary-500/20'} rounded-full blur-3xl animate-pulse scale-[1.2]`} />
        
        {/* Bouncing Logo */}
        <img 
          src={logoSrc} 
          alt="Brand Logo" 
          className="h-full w-full object-contain relative z-10 animate-bounce-slow"
          style={{ 
            animationDuration: '2.5s',
            animationTimingFunction: 'ease-in-out'
          }}
        />
        
        {/* Shadow underneath */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-32 h-3 bg-black/10 rounded-[100%] blur-[6px] animate-shadow-pulse" />
      </div>

      {label && (
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] text-center max-w-xs leading-relaxed animate-pulse">
          {label}
        </p>
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
