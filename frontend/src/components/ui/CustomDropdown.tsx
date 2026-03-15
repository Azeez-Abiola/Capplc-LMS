import { ChevronDown, Check } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface Option {
  id: string | number
  label: string
  icon?: React.ReactNode
}

interface CustomDropdownProps {
  options: Option[]
  value: string | number
  onChange: (value: any) => void
  label?: string
  placeholder?: string
  className?: string
  color?: 'primary' | 'red'
}

export default function CustomDropdown({ options, value, onChange, label, placeholder = 'Select an option', className = '', color = 'primary' }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(opt => opt.id === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`space-y-2 relative ${className}`} ref={dropdownRef}>
      {label && <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">{label}</label>}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-slate-50 border rounded-xl px-4 h-12 flex items-center justify-between transition-all outline-none group
          ${isOpen ? `bg-white ${color === 'red' ? 'border-red-500 ring-4 ring-red-50' : 'border-primary-500 ring-4 ring-primary-50'}` : 'border-slate-200 hover:border-slate-300'}
        `}
      >
        <div className="flex items-center gap-3">
          {selectedOption?.icon && <span className={`transition-colors ${selectedOption ? (color === 'red' ? 'group-hover:text-red-500' : 'group-hover:text-primary-500') : 'text-slate-400'}`}>{selectedOption.icon}</span>}
          <span className={`text-sm font-bold tracking-tight ${selectedOption ? 'text-secondary-900' : 'text-slate-300'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${isOpen ? `rotate-180 ${color === 'red' ? 'text-red-500' : 'text-primary-500'}` : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl z-[300] py-2 animate-slide-up overflow-hidden">
          <div className="max-h-60 overflow-y-auto no-scrollbar">
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  onChange(option.id)
                  setIsOpen(false)
                }}
                className={`w-full px-4 py-3.5 flex items-center justify-between group transition-colors hover:bg-slate-50
                  ${value === option.id ? (color === 'red' ? 'bg-red-50/50' : 'bg-primary-50/50') : ''}
                `}
              >
                <div className="flex items-center gap-3">
                  {option.icon && <span className={`transition-colors ${value === option.id ? (color === 'red' ? 'text-red-500' : 'text-primary-500') : `text-slate-400 ${color === 'red' ? 'group-hover:text-red-500' : 'group-hover:text-primary-500'}`}`}>{option.icon}</span>}
                  <span className={`text-sm font-bold tracking-tight transition-colors ${value === option.id ? (color === 'red' ? 'text-red-500' : 'text-primary-500') : `text-secondary-900 ${color === 'red' ? 'group-hover:text-red-500' : 'group-hover:text-primary-500'}`}`}>
                    {option.label}
                  </span>
                </div>
                {value === option.id && <Check size={16} className={color === 'red' ? 'text-red-500' : 'text-primary-500'} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
