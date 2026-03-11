import { Search, Filter, Clock, TrendingUp, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { courseService } from '../../services/courseService'

export default function MyCourses() {
  const [activeTab, setActiveTab] = useState('Active');
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
        console.error('MyCourses error:', error)
        setCourses([])
      } finally {
        setLoading(false)
      }
    }
    fetchEnrolled()
  }, [])

  const filteredCourses = (Array.isArray(courses) ? courses : []).filter(course => {
    if (!course) return false;
    
    const status = (course.status || '').toLowerCase();
    const tabMatch = 
      (activeTab === 'Active' && (status === 'enrolled' || status === 'active')) ||
      (activeTab === 'Finished' && (status === 'completed' || status === 'finished')) ||
      (activeTab === 'Pending' && (status === 'waitlisted' || status === 'pending'));

    const searchMatch = 
      (course.title || course.courses?.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (course.level || '').toLowerCase().includes(searchQuery.toLowerCase());

    return tabMatch && searchMatch;
  });

  return (
    <div className="space-y-10 animate-slide-up pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-secondary-900 tracking-tight leading-none">My Courses</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Track your professional learning journey.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="w-full sm:w-72 bg-white border border-slate-200 rounded-xl flex items-center px-4 py-2.5 shadow-sm group focus-within:ring-4 focus-within:ring-primary-50 focus-within:border-primary-500 transition-all">
            <Search size={18} className="text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm font-medium ml-2 flex-1 text-secondary-900 placeholder:text-slate-300 tracking-tight" 
            />
          </div>
          <button className="h-11 w-full sm:w-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary-500 transition-all shadow-sm">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex items-center gap-2 p-1 bg-slate-100/50 w-full sm:w-fit rounded-2xl border border-slate-100/50">
         {['Active', 'Finished', 'Pending'].map((tab) => (
           <button 
             key={tab} 
             onClick={() => setActiveTab(tab)}
             className={`px-4 sm:px-8 py-2.5 text-[10px] sm:text-xs flex-1 sm:flex-none text-center font-bold transition-all rounded-xl uppercase tracking-widest ${activeTab === tab ? 'bg-white text-primary-500 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-secondary-900'}`}
           >
             {tab}
           </button>
         ))}
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <Loader2 size={32} className="animate-spin text-primary-500" />
          <p className="text-xs font-medium text-slate-400 text-center">Loading your courses...</p>
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
           {filteredCourses.map((course) => (
              <div 
                key={course.id} 
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary-100 transition-all flex flex-col h-full group cursor-pointer"
                onClick={() => navigate(`/play/${course.id}`)}
              >
                 <div className="relative aspect-video overflow-hidden bg-slate-100">
                   <img 
                     src={course.img || course.courses?.thumbnail_url || 'https://images.unsplash.com/photo-1589939705384-5185138a04b9?auto=format&fit=crop&q=80&w=2070'} 
                     alt={course.title} 
                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                   />
                   <div className="absolute inset-0 bg-secondary-900/10 group-hover:bg-secondary-900/40 transition-colors duration-300" />
                   
                   <div className="absolute top-4 left-4">
                     <span className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[9px] font-bold text-secondary-900 border border-slate-200 shadow-sm uppercase tracking-widest">
                       {course.level || 'Intermediate'}
                     </span>
                   </div>

                   {(course.progress > 0 && course.progress < 100) && (
                     <div className="absolute bottom-4 right-4 h-12 w-12 bg-primary-500 text-white rounded-xl flex flex-col items-center justify-center shadow-xl border border-white/20 group-hover:scale-110 transition-transform">
                       <span className="text-xs font-bold leading-none">{course.progress}%</span>
                       <span className="text-[7px] font-bold uppercase tracking-tighter mt-1">DONE</span>
                     </div>
                   )}

                   {(course.status?.toLowerCase() === 'completed' || course.status?.toLowerCase() === 'finished') && (
                      <div className="absolute bottom-4 right-4 h-12 w-12 bg-green-500 text-white rounded-xl flex items-center justify-center shadow-xl border border-white/20">
                         <CheckCircle2 size={20} />
                      </div>
                   )}
                 </div>
                 
                 <div className="p-8 flex-1 flex flex-col justify-between text-left space-y-6">
                    <div className="space-y-4">
                       <h3 className="text-base font-bold text-secondary-900 leading-tight group-hover:text-primary-500 transition-colors uppercase tracking-tight line-clamp-2">{course.title || course.courses?.title}</h3>
                       <div className="flex items-center gap-5 text-slate-400 text-[10px] font-bold uppercase tracking-[0.1em]">
                          <div className="flex items-center gap-2 font-black"><Clock size={14} className="text-primary-500" /> {course.duration || '20 HOURS'}</div>
                          <div className="flex items-center gap-2 font-black"><TrendingUp size={14} className="text-secondary-500" /> GLOBAL CERT</div>
                       </div>
                    </div>
                    
                    <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                       <span className="flex items-center gap-2 text-primary-500 font-bold text-[11px] uppercase tracking-widest group-hover:translate-x-1 transition-all">
                          {course.progress === 100 ? 'Review Module' : course.progress > 0 ? 'Resume Lesson' : 'Start Learning'} 
                          <ChevronRight size={14} />
                       </span>
                    </div>
                 </div>
              </div>
           ))}
        </div>
      ) : (
        <div className="py-24 bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-3xl text-center space-y-6">
           <div className="h-20 w-20 bg-white shadow-sm rounded-2xl mx-auto flex items-center justify-center text-slate-200">
              <Search size={32} />
           </div>
           <div className="space-y-2">
              <p className="text-sm font-bold text-secondary-900 uppercase tracking-widest">No matching courses found</p>
              <p className="text-xs font-medium text-slate-400 mt-1">Try clarifying your search or changing categories.</p>
           </div>
           <button 
             onClick={() => {setSearchQuery(''); setActiveTab('Active')}}
             className="px-8 py-3 bg-white border border-slate-200 text-secondary-900 text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all uppercase tracking-widest"
           >
             Clear Filters
           </button>
        </div>
      )}
    </div>
  )
}
