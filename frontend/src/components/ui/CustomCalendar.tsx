import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface CustomCalendarProps {
  selectedDate: Date | null
  onSelect: (date: Date) => void
  label?: string
  className?: string
  alignRight?: boolean
  color?: 'primary' | 'red'
}

export default function CustomCalendar({ selectedDate, onSelect, label, className = '', alignRight = false, color = 'primary' }: CustomCalendarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const calendarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay()

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const renderDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const days = []
    const totalDays = daysInMonth(year, month)
    const offset = firstDayOfMonth(year, month)

    // Empty slots for offset
    for (let i = 0; i < offset; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10" />)
    }

    // Actual days
    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(year, month, d)
      const isSelected = selectedDate?.toDateString() === date.toDateString()
      const isToday = new Date().toDateString() === date.toDateString()

      days.push(
        <button
          key={d}
          type="button"
          onClick={() => {
            onSelect(date)
            setIsOpen(false)
          }}
          className={`h-10 w-10 flex items-center justify-center rounded-xl text-xs font-bold transition-all
            ${isSelected ? (color === 'red' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-primary-500 text-white shadow-lg shadow-primary-500/30') : 
              isToday ? (color === 'red' ? 'bg-red-50 text-red-500' : 'bg-primary-50 text-primary-500') : 'text-secondary-900 hover:bg-slate-50'}
          `}
        >
          {d}
        </button>
      )
    }
    return days
  }

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  return (
    <div className={`space-y-2 relative ${className}`} ref={calendarRef}>
       {label && <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">{label}</label>}
       
       <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-slate-50 border rounded-xl px-4 h-12 flex items-center justify-between transition-all outline-none group
          ${isOpen ? `bg-white ${color === 'red' ? 'border-red-500 ring-4 ring-red-50' : 'border-primary-500 ring-4 ring-primary-50'}` : 'border-slate-200 hover:border-slate-300'}
        `}
      >
        <div className="flex items-center gap-3 text-left">
          <CalendarIcon size={18} className={`text-slate-400 ${color === 'red' ? 'group-hover:text-red-500' : 'group-hover:text-primary-500'} transition-colors`} />
          <span className={`text-sm font-bold tracking-tight ${selectedDate ? 'text-secondary-900' : 'text-slate-300'}`}>
            {selectedDate ? selectedDate.toLocaleDateString('en-GB') : 'Select date'}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className={`absolute top-[calc(100%+8px)] ${alignRight ? 'right-0' : 'left-0'} w-72 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[300] p-4 animate-slide-up`}>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-secondary-900 uppercase tracking-widest">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h4>
            <div className="flex gap-1">
              <button 
                onClick={handlePrevMonth}
                className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-400 hover:text-secondary-900 transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={handleNextMonth}
                className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-400 hover:text-secondary-900 transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="h-10 w-10 flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {day}
              </div>
            ))}
            {renderDays()}
          </div>
        </div>
      )}
    </div>
  )
}
