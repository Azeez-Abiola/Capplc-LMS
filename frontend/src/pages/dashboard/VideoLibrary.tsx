import { Play, Search, Filter, CheckCircle2, ChevronRight } from 'lucide-react'
import LogoLoader from '../../components/ui/LogoLoader'
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
        setCourses(Array.isArray(data) ? data : [])
        if (sub?.tier === 'ELITE') setTier('Premium');
        else if (sub?.tier === 'PRO') setTier('Advanced');
        else setTier('Beginners');
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
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center">
           <div className="px-4 py-2 bg-primary-50 border border-primary-100 rounded-xl text-[10px] font-bold text-primary-500 uppercase tracking-widest self-start sm:self-auto hidden md:block">
              Plan: {tier}
           </div>
           <div className="bg-white border border-slate-200 rounded-xl flex items-center px-4 py-2.5 shadow-sm group focus-within:ring-4 focus-within:ring-primary-50 focus-within:border-primary-500 transition-all flex-1 sm:flex-none">
              <Search size={18} className="text-slate-400 group-focus-within:text-primary-500" />
              <input 
                type="text" 
                placeholder="Search videos..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm font-medium ml-2 w-full sm:w-48 text-secondary-900 placeholder:text-slate-300 tracking-tight" 
              />
           </div>
           <div className="relative shrink-0">
              <select 
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              >
                 <option value="All">All Statuses</option>
                 <option value="Completed">Completed</option>
                 <option value="In Progress">In Progress</option>
                 <option value="Not Started">Not Started</option>
              </select>
              <button className={`h-11 w-full sm:w-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center transition-all shadow-sm ${activeFilter !== 'All' ? 'text-primary-500 border-primary-500 bg-primary-50' : 'text-slate-400 hover:text-primary-500'}`}>
                <Filter size={18} />
              </button>
           </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
         <button 
           onClick={() => setActiveCategory('All Videos')}
           className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest leading-none transition-all shadow-sm whitespace-nowrap border ${activeCategory === 'All Videos' ? 'bg-secondary-900 text-white border-secondary-900' : 'bg-white text-slate-400 border-slate-200 hover:text-primary-500'}`}
         >
           All Videos
         </button>
         {videoCategories.map((cat, i) => (
           <button 
             key={i} 
             onClick={() => setActiveCategory(cat)}
             className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest leading-none transition-all whitespace-nowrap border shadow-sm ${activeCategory === cat ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-slate-400 border-slate-200 hover:text-primary-500 hover:border-primary-500'}`}
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
           {filteredVideos.map((video) => (
              <div 
                key={video.id} 
                className="group relative flex flex-col items-start bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary-100 transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/play/${video.id}`)}
              >
                 <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    <img src={video.thumbnail_url || video.img} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-secondary-900/10 group-hover:bg-secondary-900/40 transition-colors duration-300" />
                    
                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                       <div className="h-full bg-primary-500 transition-all duration-1000" style={{ width: `${video.progress || 0}%` }} />
                    </div>
  
                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                       <div className="h-12 w-12 bg-white text-primary-500 rounded-xl flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                          <Play size={20} fill="currentColor" />
                       </div>
                    </div>
  
                    <div className="absolute top-3 left-3">
                       <span className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[9px] font-bold text-secondary-900 border border-slate-200 shadow-sm uppercase tracking-widest">
                          {video.type || 'Workshop'}
                       </span>
                    </div>
                 </div>
  
                 {/* Content */}
                 <div className="w-full p-6 text-left space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                       <span className="text-secondary-900">{video.duration || '01:30:00'}</span>
                       <span className="h-1 w-1 bg-slate-200 rounded-full" />
                       <span>Video Lesson</span>
                    </div>
                    <h3 className="text-sm font-bold text-secondary-900 leading-snug group-hover:text-primary-500 transition-colors uppercase tracking-tight line-clamp-2">{video.title}</h3>
                    
                    <div className="flex items-center justify-between border-t border-slate-50 pt-5">
                       <span className="flex items-center gap-2 text-xs font-bold text-primary-500 uppercase tracking-widest group/btn transition-all active:scale-95 leading-none">
                          Watch Lesson <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                       </span>
                       {(video.progress === 100 || video.status === 'completed') && (
                          <CheckCircle2 size={16} className="text-green-500" />
                       )}
                    </div>
                 </div>
              </div>
           ))}
        </div>
      )}

      {!loading && filteredVideos.length === 0 && (
        <div className="py-20 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No matching videos found</p>
        </div>
      )}
    </div>
  )
}
