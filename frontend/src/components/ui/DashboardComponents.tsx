import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  noPadding?: boolean
}

export function Card({ children, className = '', noPadding = false }: CardProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-soft border border-neutral-100/50 overflow-hidden ${noPadding ? '' : 'p-6 md:p-8'} ${className}`}>
      {children}
    </div>
  )
}

export function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-2 py-1 group transition-all duration-300">
      <span className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] font-heading group-hover:scale-105 transition-transform duration-500">
        {value}
      </span>
      <span className="text-[9px] md:text-[10px] font-bold text-neutral-400 uppercase tracking-wider mt-1.5 whitespace-nowrap">
        {label}
      </span>
    </div>
  )
}

export function ProgressBar({ progress, segmented = false }: { progress: number; segmented?: boolean }) {
  if (segmented) {
    return (
      <div className="flex gap-0.5 h-[5px] w-full">
        {Array.from({ length: 20 }).map((_, i) => {
          const isActive = (i / 20) * 100 < progress
          return (
            <div 
              key={i} 
              className={`flex-1 rounded-full transition-all duration-700 ${
                isActive ? 'bg-[#f26f21] shadow-[0_0_6px_rgba(242,111,33,0.2)]' : 'bg-neutral-100'
              }`} 
            />
          )
        })}
      </div>
    )
  }

  return (
    <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
      <div 
        className="h-full bg-[#f26f21] transition-all duration-1000 ease-out relative"
        style={{ width: `${progress}%` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>
    </div>
  )
}
