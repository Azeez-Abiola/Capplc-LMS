import { ProgressBar } from '../ui/DashboardComponents'
import { ArrowUpRight } from 'lucide-react'

interface CourseCardProps {
  title: string
  instructor: string
  hours: number
  lessons: number
  progress: number
  tags: string[]
  className?: string
}

export default function CourseCard({
  title,
  instructor,
  hours,
  lessons,
  progress,
  tags,
  className = '',
}: CourseCardProps) {
  return (
    <div className={`bg-white rounded-2xl p-5 shadow-soft border border-neutral-100 flex flex-col group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="h-9 w-9 bg-neutral-50 rounded-lg flex items-center justify-center text-neutral-400 text-sm font-bold">
          ···
        </div>
        <button className="h-9 w-9 bg-neutral-50 rounded-lg flex items-center justify-center text-neutral-400 group-hover:bg-primary-50 group-hover:text-[#f26f21] transition-colors">
          <ArrowUpRight size={18} />
        </button>
      </div>

      <h3 className="text-base font-bold text-neutral-800 font-heading mb-0.5 leading-snug">{title}</h3>
      <p className="text-xs text-neutral-400 font-medium mb-4">with {instructor}</p>

      <div className="flex gap-3 mb-5">
        <div className="flex items-center gap-1">
          <span className="text-base font-bold text-neutral-800 leading-none">{hours}</span>
          <span className="text-[10px] font-bold text-neutral-400">Hours</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-base font-bold text-neutral-800 leading-none">{lessons}</span>
          <span className="text-[10px] font-bold text-neutral-400">Lessons</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {tags.map((tag) => (
          <span 
            key={tag} 
            className="px-3 py-1 bg-neutral-50 text-neutral-500 text-[10px] font-bold rounded-full uppercase tracking-wider"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto">
        <div className="flex justify-between items-end mb-1.5">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Progress</span>
          <span className="text-sm font-bold text-neutral-800">{progress}%</span>
        </div>
        <ProgressBar progress={progress} />
      </div>
    </div>
  )
}
