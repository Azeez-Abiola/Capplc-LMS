import { Play, Search, Filter, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { courseService } from '../../services/courseService'

const videoCategories = ['Fundamental Skills', 'Luxury Residential', 'Industrial Coating', 'Color Theory', 'Safety Protocols']

export default function VideoLibrary() {
  const [activeCategory, setActiveCategory] = useState('VIEW ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.getCourses()
        setCourses(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to fetch courses:', error)
        // Fallback to mock data for demonstration
        setCourses([
          { id: 1, title: 'Mastering Surface Prep: The CAP Standard', duration: '1h 45m', type: 'Fundamental Skills', progress: 100, img: 'https://images.unsplash.com/photo-1562259946-08c513d3042c?auto=format&fit=crop&q=80&w=2070' },
          { id: 2, title: 'Luxury Finishes: Part 1 - Silk Effects', duration: '2h 10m', type: 'Luxury Residential', progress: 40, img: 'https://images.unsplash.com/photo-1589939705384-5185138a04b9?auto=format&fit=crop&q=80&w=2070' },
          { id: 3, title: 'Advanced Airless Spraying Systems', duration: '3h 15m', type: 'Industrial Coating', progress: 15, img: 'https://images.unsplash.com/photo-1595841055318-502a55099399?auto=format&fit=crop&q=80&w=2070' },
          { id: 4, title: 'The Chemistry of Epoxy Floor Coating', duration: '4h 00m', type: 'Industrial Coating', progress: 0, img: 'https://images.unsplash.com/photo-1503387762-592dee58c460?auto=format&fit=crop&q=80&w=2070' },
          { id: 5, title: 'Exterior Weatherproofing Mastery', duration: '2h 45m', type: 'Safety Protocols', progress: 0, img: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&q=80&w=2070' },
          { id: 6, title: 'Safety Gear & OSHE Standards', duration: '1h 20m', type: 'Safety Protocols', progress: 95, img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=2070' },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  const filteredVideos = (Array.isArray(courses) ? courses : []).filter(video => {
    const matchesCategory = activeCategory === 'VIEW ALL' || video.type === activeCategory
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-8 animate-slide-up pb-10">
      
      {/* ── HEADER SECTION ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-1 text-left">
          <h1 className="text-3xl font-bold tracking-tight text-secondary-500 uppercase">Workshop Archive</h1>
          <p className="text-slate-500 text-sm font-medium">On-Demand session recordings for the CAP Business Pro ecosystem.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
           <div className="bg-white border border-slate-200 rounded flex items-center px-4 py-2.5 shadow-sm group focus-within:ring-2 focus-within:ring-primary-100 transition-all flex-1 sm:flex-none">
              <Search size={16} className="text-slate-400 group-focus-within:text-primary-500" />
              <input 
                type="text" 
                placeholder="Search archive..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-[11px] font-bold ml-2 w-full sm:w-48 text-secondary-500 placeholder:text-slate-300 uppercase tracking-tight" 
              />
           </div>
           <button className="h-10 w-full sm:w-10 bg-white border border-slate-200 rounded flex items-center justify-center text-slate-400 hover:text-primary-500 transition-all shadow-sm">
             <Filter size={16} />
           </button>
        </div>
      </div>

      {/* ── CATEGORIES (GEOMETRIC) ── */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
         <button 
           onClick={() => setActiveCategory('VIEW ALL')}
           className={`px-6 py-3 rounded text-[10px] font-extrabold uppercase tracking-[0.2em] leading-none transition-all shadow-md whitespace-nowrap ${activeCategory === 'VIEW ALL' ? 'bg-secondary-500 text-white border-secondary-500' : 'bg-white text-slate-400 border border-slate-200 hover:text-primary-500'}`}
         >
           VIEW ALL
         </button>
         {videoCategories.map((cat, i) => (
           <button 
             key={i} 
             onClick={() => setActiveCategory(cat)}
             className={`px-6 py-3 rounded text-[10px] font-extrabold uppercase tracking-[0.2em] leading-none transition-all whitespace-nowrap border shadow-sm ${activeCategory === cat ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-slate-400 border-slate-200 hover:text-primary-500 hover:border-primary-500'}`}
           >
             {cat}
           </button>
         ))}
      </div>

      {/* ── VIDEOS GRID ── */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
           <Loader2 size={32} className="animate-spin text-primary-500" />
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Accessing Workshop Nodes...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
           {filteredVideos.map((video) => (
              <div 
                key={video.id} 
                className="group relative flex flex-col items-start bg-white rounded-lg p-2 border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary-100 transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/play/${video.id}`)}
              >
                 {/* Fixed Proportion Thumbnail */}
                 <div className="relative aspect-video w-full rounded-md overflow-hidden bg-slate-100 mb-4">
                    <img src={video.thumbnail_url || video.img} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-secondary-900/10 group-hover:bg-secondary-900/40 transition-colors duration-300" />
                    
                    {/* Progress Indicator */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                       <div className="h-full bg-primary-500 transition-all duration-1000" style={{ width: `${video.progress || 0}%` }} />
                    </div>
  
                    {/* Play Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                       <div className="h-14 w-14 bg-white text-primary-500 rounded-full flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                          <Play size={24} fill="currentColor" />
                       </div>
                    </div>
  
                    {/* Status Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                       <span className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded text-[8px] font-bold text-secondary-500 border border-slate-200 shadow-lg uppercase tracking-widest leading-none">
                          {video.type || 'WORKSHOP'}
                       </span>
                    </div>
                 </div>
  
                 {/* Meta Content */}
                 <div className="w-full px-2 pb-2 text-left">
                    <div className="flex items-center gap-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3 leading-none">
                       <span className="text-secondary-500">{video.duration || '01:30:00'}</span>
                       <span className="h-1 w-1 bg-slate-200 rounded-full" />
                       <span>ARCHIVED_SESSION</span>
                    </div>
                    <h3 className="text-sm font-bold text-secondary-500 leading-snug group-hover:text-primary-500 transition-colors mb-5 uppercase tracking-tight line-clamp-2">{video.title}</h3>
                    
                    <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                       <span className="flex items-center gap-2 text-[10px] font-bold text-primary-500 uppercase tracking-[0.2em] group/btn transition-all active:scale-95 leading-none">
                          INITIALIZE_PLAY <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
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
        <div className="py-20 text-center bento-card border-dashed bg-slate-50/30">
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Zero entries found in {activeCategory}</p>
        </div>
      )}
    </div>
  )
}
