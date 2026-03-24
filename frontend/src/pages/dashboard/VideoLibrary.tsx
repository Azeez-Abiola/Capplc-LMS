import { Play, Search, Filter, CheckCircle2, ChevronRight } from 'lucide-react'
import LogoLoader from '../../components/ui/LogoLoader'
import CustomDropdown from '../../components/ui/CustomDropdown'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { courseService } from '../../services/courseService'
import { subscriptionService } from '../../services/subscriptionService'

// Categories are now derived dynamically from course levels


export default function VideoLibrary() {
  const [activeCategory, setActiveCategory] = useState('All Videos')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tier, setTier] = useState<string>('Free')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const [data, sub] = await Promise.all([
          courseService.getCourses(),
          subscriptionService.getCurrentSubscription().catch(() => null)
        ])
        setCourses((Array.isArray(data) ? data : []).map((c: any) => ({
          ...c,
          level: (c.level === 'Beginners' ? 'Beginner' : c.level) || 'Beginner'
        })))
        if (sub?.tier === 'ELITE') setTier('Premium');
        else if (sub?.tier === 'PRO') setTier('Advanced');
        else setTier('Beginner');
      } catch (error) {
        console.error('Video library error:', error)
        setCourses([])
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  const videoCategories = Array.from(new Set(courses.map(c => c.level).filter(Boolean))) as string[]


  const filteredVideos = (Array.isArray(courses) ? courses : []).filter(video => {
    const matchesCategory = activeCategory === 'All Videos' || (video.level || '').toLowerCase() === activeCategory.toLowerCase()

    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase())
    
    let matchesFilter = true;
    if (activeFilter === 'Completed') matchesFilter = video.progress === 100 || video.status === 'completed';
    if (activeFilter === 'In Progress') matchesFilter = video.progress > 0 && video.progress < 100;
    if (activeFilter === 'Not Started') matchesFilter = !video.progress || video.progress === 0;

    return matchesCategory && matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-8 animate-slide-up pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="space-y-1 text-left">
          <h1 className="text-2xl font-bold tracking-tight text-secondary-900 leading-none">Available Courses</h1>
          <p className="text-slate-500 text-sm font-medium">Browse our collection of on-demand recordings.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center">
           <div className="px-4 py-2 bg-primary-50 border border-primary-100 rounded-xl text-[11px] font-bold text-primary-500 self-start sm:self-auto hidden lg:block">
              Plan: {tier}
           </div>
           <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl flex items-center px-4 py-2.5 shadow-sm group focus-within:ring-4 focus-within:ring-primary-50 dark:focus-within:ring-primary-500/10 focus-within:border-primary-500 transition-all w-full sm:w-64">
              <Search size={18} className="text-slate-400 dark:text-slate-500 group-focus-within:text-primary-500" />
              <input 
                type="text" 
                placeholder="Search videos..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm font-medium ml-2 w-full text-secondary-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 tracking-tight" 
              />
           </div>
           <div className="relative shrink-0 w-full sm:w-48">
              <CustomDropdown
                value={activeFilter}
                onChange={setActiveFilter}
                options={[
                  { id: 'All', label: 'All Statuses', icon: <Filter size={14} /> },
                  { id: 'Completed', label: 'Completed' },
                  { id: 'In Progress', label: 'In Progress' },
                  { id: 'Not Started', label: 'Not Started' },
                ]}
                className="!space-y-0"
              />
           </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
         <button 
           onClick={() => setActiveCategory('All Videos')}
           className={`px-6 py-3 rounded-xl text-xs font-bold leading-none transition-all shadow-sm whitespace-nowrap border ${activeCategory === 'All Videos' ? 'bg-secondary-900 dark:bg-white text-white dark:text-black border-secondary-900 dark:border-white' : 'bg-white dark:bg-white/5 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-white/10 hover:text-primary-500'}`}
         >
           All videos
         </button>
         {videoCategories.map((cat, i) => (
           <button 
             key={i} 
             onClick={() => setActiveCategory(cat)}
             className={`px-6 py-3 rounded-xl text-xs font-bold leading-none transition-all whitespace-nowrap border shadow-sm ${activeCategory === cat ? 'bg-primary-500 text-white border-primary-500' : 'bg-white dark:bg-white/5 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-white/10 hover:text-primary-500 hover:border-primary-500'}`}
           >
             {cat}
           </button>
         ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
           <LogoLoader />
           <p className="text-xs font-medium text-slate-400">Searching library...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVideos.map((video) => {
               const rawCount = video.module_count;
               const modCount = video.modules;
               let moduleCount = 0;
               if (typeof rawCount === 'number') moduleCount = rawCount;
               else if (Array.isArray(rawCount) && rawCount[0] && typeof rawCount[0].count === 'number') moduleCount = rawCount[0].count;
               else if (rawCount && typeof rawCount.count === 'number') moduleCount = rawCount.count;
               else if (Array.isArray(modCount)) moduleCount = modCount.length;

               return (
                  <div 
                    key={video.id} 
                    className="group relative flex flex-col items-start bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary-100 transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(`/courses/${video.id}`)}
                  >
                     <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                        <img src={video.thumbnail_url || video.img} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-secondary-900/10 group-hover:bg-secondary-900/40 transition-colors duration-300" />
                        
                        {/* Progress Bar */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                           <div className="h-full bg-primary-500 transition-all duration-1000" style={{ width: `${video.progress || 0}%` }} />
                        </div>
      
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-100 transition-opacity duration-300">
                           <div className="h-14 w-14 bg-white text-primary-500 rounded-full flex items-center justify-center shadow-2xl scale-100 transition-transform border-4 border-white/20">
                              <Play size={24} fill="currentColor" className="ml-1" />
                           </div>
                        </div>
      
                        <div className="absolute top-3 left-3">
                           <span className="bg-white/95 dark:bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[10px] font-bold text-secondary-900 dark:text-white border border-slate-200 dark:border-white/10 shadow-sm">
                              {video.level || 'Course'}
                           </span>
                        </div>
                     </div>
      
                     {/* Content */}
                     <div className="w-full p-6 text-left space-y-4">
                        <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 leading-none">
                           <span className="text-secondary-900 dark:text-white lowercase first-letter:">{video.duration || '20 hours'}</span>
                           <span className="h-1 w-1 bg-slate-200 rounded-full" />
                           <span className="text-primary-500">{moduleCount} courses</span>
                        </div>
                        <h3 className="text-sm font-bold text-secondary-900 leading-snug group-hover:text-primary-500 transition-colors tracking-tight line-clamp-2">{video.title}</h3>
                        
                        <div className="flex items-center justify-between border-t border-slate-50 pt-5">
                           <span className="flex items-center gap-2 text-xs font-bold text-primary-500 group/btn transition-all active:scale-95 leading-none">
                              Open module <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                           </span>
                           {(video.progress === 100 || video.status === 'completed') && (
                              <CheckCircle2 size={16} className="text-green-500" />
                           )}
                        </div>
                     </div>
                  </div>
               )
            })}
        </div>
      )}

      {!loading && filteredVideos.length === 0 && (
        <div className="py-20 text-center bg-slate-50/50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-slate-100 dark:border-white/10">
           <p className="text-xs font-bold text-slate-400 dark:text-slate-600">No matching videos found</p>
        </div>
      )}
    </div>
  )
}
