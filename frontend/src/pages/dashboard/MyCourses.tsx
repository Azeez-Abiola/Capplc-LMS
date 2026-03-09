import { Search, Filter, Clock, TrendingUp, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { courseService } from '../../services/courseService'

export default function MyCourses() {
  const [activeTab, setActiveTab] = useState('Enrolled');
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolled = async () => {
      try {
        const data = await courseService.getEnrolledCourses()
        setCourses(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to fetch enrolled courses:', error)
        // Fallback to mock data
        setCourses([
          { id: 1, title: 'Modern Surface Prep & Decontamination', duration: '20h', level: 'Intermediate', progress: 60, status: 'Enrolled', img: 'https://images.unsplash.com/photo-1589939705384-5185138a04b9?auto=format&fit=crop&q=80&w=2070' },
          { id: 2, title: 'Luxury Texture Portfolio: Part 1', duration: '15h', level: 'Advanced', progress: 30, status: 'Enrolled', img: 'https://images.unsplash.com/photo-1595841055318-502a55099399?auto=format&fit=crop&q=80&w=2070' },
          { id: 3, title: 'Color Mixology for Interior Walls', duration: '12h', level: 'Beginner', progress: 100, status: 'Completed', img: 'https://images.unsplash.com/photo-1562259946-08c513d3042c?auto=format&fit=crop&q=80&w=2070' },
          { id: 4, title: 'Standard Spraying Techniques', duration: '18h', level: 'Intermediate', progress: 0, status: 'Enrolled', img: 'https://images.unsplash.com/photo-1503387762-592dee58c460?auto=format&fit=crop&q=80&w=2070' },
          { id: 5, title: 'Protective Coatings for Exterior Masonry', duration: '25h', level: 'Advanced', progress: 100, status: 'Completed', img: 'https://images.unsplash.com/photo-1534433394996-3693e50668b5?auto=format&fit=crop&q=80&w=2070' },
          { id: 6, title: 'Safety & Scaffolding Certification', duration: '10h', level: 'Beginner', progress: 0, status: 'Waitlisted', img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=2070' },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchEnrolled()
  }, [])

  const filteredCourses = (Array.isArray(courses) ? courses : []).filter(course => 
    course && 
    (course.status === activeTab || (activeTab === 'Enrolled' && (course.status === 'enrolled' || course.status === 'active'))) && 
    ((course.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || (course.level || '').toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-slide-up pb-10">
      
      {/* ── HEADER SECTION ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-1 text-left">
          <h1 className="text-3xl font-bold tracking-tight text-secondary-500 uppercase tracking-widest leading-none">Learning Inventory</h1>
          <p className="text-slate-500 text-sm font-medium">Professional Workshop Registry • Deployment Status</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="w-full sm:w-72 bg-white border border-slate-200 rounded flex items-center px-4 py-2.5 shadow-sm group focus-within:ring-2 focus-within:ring-primary-100 transition-all">
            <Search size={16} className="text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Filter by title or tier..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-[11px] font-bold ml-2 flex-1 text-secondary-500 placeholder:text-slate-300 uppercase tracking-tight" 
            />
          </div>
          <button className="h-10 w-full sm:w-auto px-4 bg-white border border-slate-200 rounded flex items-center justify-center text-slate-400 hover:text-primary-500 transition-all shadow-sm">
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* ── TABS NAVIGATION ── */}
      <div className="flex items-center gap-2 p-1 bg-slate-100/50 w-full sm:w-fit rounded border border-slate-100 overflow-x-auto no-scrollbar">
         {['Enrolled', 'Completed', 'Waitlisted'].map((tab) => (
           <button 
             key={tab} 
             onClick={() => setActiveTab(tab)}
             className={`flex-1 sm:flex-none px-6 sm:px-8 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all rounded whitespace-nowrap ${activeTab === tab ? 'bg-white text-primary-500 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-secondary-500'}`}
           >
             {tab}
           </button>
         ))}
      </div>

      {/* ── FILTERED RESULTS COUNTER ── */}
      <div className="flex items-center gap-4">
         <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">{filteredCourses.length} Modules Identified</span>
         <div className="flex-1 h-[1px] bg-slate-100" />
      </div>

      {/* ── COURSES GRID ── */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <Loader2 size={32} className="animate-spin text-primary-500" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Accessing Learning Node...</p>
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
           {filteredCourses.map((course) => (
             <div 
               key={course.id} 
               className="bento-card group flex flex-col overflow-hidden h-full shadow-md hover:shadow-xl transition-all duration-500 bg-white cursor-pointer"
               onClick={() => navigate(`/play/${course.id}`)}
             >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img 
                    src={course.img || course.courses?.thumbnail_url || 'https://images.unsplash.com/photo-1589939705384-5185138a04b9?auto=format&fit=crop&q=80&w=2070'} 
                    alt={course.title || course.courses?.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-secondary-900/10 group-hover:bg-secondary-900/40 transition-colors duration-500" />
                  
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded text-[9px] font-bold uppercase tracking-widest text-secondary-500 border border-white/20 shadow-lg leading-none">
                      {course.level || 'Professional'} Tier
                    </span>
                  </div>

                  {(course.progress > 0 && course.progress < 100) && (
                    <div className="absolute bottom-4 right-4 h-11 w-11 bg-primary-500 text-white rounded flex flex-col items-center justify-center shadow-2xl border-2 border-white group-hover:scale-110 transition-transform">
                      <span className="text-[10px] font-bold leading-none">{course.progress}%</span>
                      <span className="text-[6px] font-bold tracking-tighter mt-1 opacity-70">VAL.</span>
                    </div>
                  )}

                  {(course.status === 'Completed' || course.status === 'completed') && (
                     <div className="absolute bottom-4 right-4 h-11 w-11 bg-green-500 text-white rounded flex items-center justify-center shadow-2xl border-2 border-white">
                        <CheckCircle2 size={16} />
                     </div>
                  )}
                </div>
                
                <div className="p-7 flex-1 flex flex-col justify-between space-y-6 text-left">
                   <div className="space-y-3">
                      <h3 className="text-lg font-bold text-secondary-500 leading-snug group-hover:text-primary-500 transition-colors uppercase tracking-tight line-clamp-2">{course.title || course.courses?.title}</h3>
                      <div className="flex items-center gap-5 text-slate-400 text-[9px] font-bold uppercase tracking-[0.1em] leading-none">
                         <div className="flex items-center gap-1.5"><Clock size={12} className="text-primary-500" /> {course.duration || '20h'} Session</div>
                         <div className="flex items-center gap-1.5"><TrendingUp size={12} className="text-secondary-500" /> Global Cert.</div>
                      </div>
                   </div>
                   
                   <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                      <span className="flex items-center gap-2 text-primary-500 font-bold text-[10px] uppercase tracking-widest group-hover:text-secondary-500 transition-colors group/link active:scale-95 leading-none">
                         {course.status === 'Completed' ? 'REVIEW WORKSHOP' : course.progress > 0 ? 'RESUME SESSION' : 'INITIALIZE MODULE'} 
                         <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                      </span>
                      {course.status === 'Waitlisted' && (
                         <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Awaiting Deck...</span>
                      )}
                   </div>
                </div>
             </div>
           ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4 bento-card border-dashed">
           <div className="h-16 w-16 bg-slate-50 rounded mx-auto flex items-center justify-center text-slate-200 border border-slate-100">
              <Search size={24} />
           </div>
           <div className="space-y-1">
              <p className="text-sm font-bold text-secondary-500 uppercase tracking-widest">No Modules Identified</p>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">Your filter query: "{searchQuery}" did not yield results in {activeTab}.</p>
           </div>
           <button 
             onClick={() => {setSearchQuery(''); setActiveTab('Enrolled')}}
             className="text-[10px] font-bold text-primary-500 uppercase tracking-widest hover:underline pt-4"
           >
             Clear All Filters
           </button>
        </div>
      )}
    </div>
  )
}
