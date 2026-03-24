import { Search, Filter, Clock, Award, ChevronRight, CheckCircle2, Play } from 'lucide-react'
import LogoLoader from '../../components/ui/LogoLoader'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { courseService } from '../../services/courseService'
import { useAuth } from '../../hooks/useAuth'
import CustomDropdown from '../../components/ui/CustomDropdown'

export default function MyCourses() {
  const [activeTab, setActiveTab] = useState('Active');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { profile, loading: authLoading } = useAuth()

  useEffect(() => {
    // Role-based redirection safeguard
    if (!authLoading && profile) {
      if (profile.role !== 'painter') {
        navigate(profile.role === 'admin' ? '/admin' : '/super-admin')
        return
      }
    }

    const fetchEnrolled = async () => {
      try {
        const data = await courseService.getEnrolledCourses()
        setCourses((Array.isArray(data) ? data : []).map((c: any) => ({
          ...c,
          courses: c.courses ? {
            ...c.courses,
            level: (c.courses.level === 'Beginners' ? 'Beginner' : c.courses.level) || 'Beginner'
          } : null
        })))
      } catch (error) {
        console.error('MyCourses error:', error)
        setCourses([])
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading && profile) {
      fetchEnrolled()
    }
  }, [profile, authLoading, navigate])

  const filteredCourses = (Array.isArray(courses) ? courses : []).filter(course => {
    if (!course) return false;
    
    const status = (course.status || '').toLowerCase();
    const tabMatch = 
      (activeTab === 'Active' && (status === 'enrolled' || status === 'active' || status === 'pending' || status === 'waitlisted')) ||
      (activeTab === 'Completed' && (status === 'completed' || status === 'finished'));

    const searchMatch = 
      (course.courses?.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (course.courses?.level || '').toLowerCase().includes(searchQuery.toLowerCase());

    const filterMatch = activeFilter === 'All' || (course.courses?.level || '').toLowerCase() === activeFilter.toLowerCase();

    return tabMatch && searchMatch && filterMatch;
  });

  return (
    <div className="space-y-10 animate-slide-up pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-secondary-900 tracking-tight leading-none text-left">My Courses</h1>
          <p className="text-slate-500 text-sm font-medium mt-1 text-left">Track your professional learning journey.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="w-full sm:w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center px-4 h-12 shadow-sm group focus-within:ring-4 focus-within:ring-primary-500/10 focus-within:border-primary-500 transition-all">
            <Search size={18} className="text-slate-400 dark:text-slate-500 group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm font-bold ml-3 flex-1 text-secondary-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-500 tracking-tight" 
            />
          </div>
          <div className="w-full sm:w-48 text-left">
            <CustomDropdown 
              value={activeFilter}
              onChange={setActiveFilter}
              options={[
                { id: 'All', label: 'All Levels', icon: <Filter size={14} /> },
                { id: 'Beginner', label: 'Beginner' },
                { id: 'Intermediate', label: 'Intermediate' },
                { id: 'Advanced', label: 'Advanced' },
              ]}
              className="!space-y-0"
            />
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 w-full sm:w-fit rounded-2xl border border-slate-200/50 dark:border-slate-700">
         {['Active', 'Completed'].map((tab) => (
           <button 
             key={tab} 
             onClick={() => setActiveTab(tab)}
             className={`px-8 py-2.5 text-[11px] sm:text-xs flex-1 sm:flex-none text-center font-bold transition-all rounded-xl   ${activeTab === tab ? 'bg-white dark:bg-slate-700 text-primary-500 shadow-md border border-slate-100 dark:border-slate-600' : 'text-slate-500 dark:text-slate-400 hover:text-secondary-900 dark:hover:text-white'}`}
           >
             {tab}
           </button>
         ))}
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <LogoLoader />
          <p className="text-xs font-medium text-slate-400 text-center">Loading your courses...</p>
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
           {filteredCourses.map((course) => (
              <div 
                key={course.id} 
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary-100 transition-all flex flex-col h-full group cursor-pointer"
                onClick={() => navigate(`/courses/${course.course_id || course.id}`)}
              >
                 <div className="relative aspect-video overflow-hidden bg-slate-100">
                   <img 
                     src={course.img || course.courses?.thumbnail_url || 'https://images.unsplash.com/photo-1589939705384-5185138a04b9?auto=format&fit=crop&q=80&w=2070'} 
                     alt={course.title} 
                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                   />
                   <div className="absolute inset-0 bg-secondary-900/10 group-hover:bg-secondary-900/40 transition-colors duration-300" />
                   
                   {/* Play Button Overlay */}
                   <div className="absolute inset-0 flex items-center justify-center opacity-100 transition-opacity duration-300 pointer-events-none">
                       <div className="h-14 w-14 bg-white text-primary-500 rounded-full flex items-center justify-center shadow-2xl scale-100 transition-transform border-4 border-white/20">
                          <Play size={24} fill="currentColor" className="ml-1" />
                       </div>
                   </div>

                   <div className="absolute top-4 left-4">
                     <span className="bg-white/95 dark:bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[10px] font-bold text-secondary-900 dark:text-white border border-slate-200 dark:border-white/10 shadow-sm">
                       {course.courses?.level}
                     </span>
                   </div>

                   {(course.progress > 0 && course.progress < 100) && (
                     <div className="absolute bottom-4 right-4 h-12 w-12 bg-primary-500 text-white rounded-xl flex flex-col items-center justify-center shadow-xl border border-white/20 group-hover:scale-110 transition-transform">
                       <span className="text-xs font-bold leading-none">{course.progress}%</span>
                       <span className="text-[7px] font-bold  tracking-tighter mt-1">done</span>
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
                        <h3 className="text-base font-bold text-secondary-900 leading-tight group-hover:text-primary-500 transition-colors  tracking-tight line-clamp-2">{course.courses?.title}</h3>
                        <div className="flex flex-col gap-2 text-slate-400 text-[11px] font-bold  ">
                           <div className="flex items-center gap-5">
                              <div className="flex items-center gap-2 font-black"><Clock size={14} className="text-primary-500" /> {course.courses?.duration || '20 hours'}</div>
                              <div className="flex items-center gap-2 font-black"><Award size={14} className="text-secondary-500" /> {course.courses?.tier_access === 'ELITE' ? 'Master cert' : 'Global cert'}</div>
                           </div>
                           <div className="flex items-center gap-2 font-black mt-1">
                              {(() => {
                                const rawCount = course.courses?.module_count;
                                const modCount = course.courses?.modules;
                                let mCount = 0;
                                if (typeof rawCount === 'number') mCount = rawCount;
                                else if (Array.isArray(rawCount) && rawCount[0] && typeof rawCount[0].count === 'number') mCount = rawCount[0].count;
                                else if (rawCount && typeof rawCount.count === 'number') mCount = rawCount.count;
                                else if (Array.isArray(modCount)) mCount = modCount.length;
                                return <span>{mCount} courses</span>;
                              })()}
                           </div>
                        </div>
                        {course.lastPosition && course.lastPosition !== '00:00' && (
                           <p className="text-[10px] font-bold text-primary-500  ">Stopped at {course.lastPosition}</p>
                        )}
                     </div>
                     
                     <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                        <span className="flex items-center gap-2 text-primary-500 font-bold text-[11px]   group-hover:translate-x-1 transition-all">
                           {course.progress === 100 ? 'Review module' : (course.lastPosition && course.lastPosition !== '00:00') ? 'Resume lesson' : 'Start learning'} 
                           <ChevronRight size={14} />
                        </span>
                     </div>
                 </div>
              </div>
           ))}
        </div>
      ) : (
        <div className="py-24 bg-white dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2rem] text-center space-y-8 shadow-sm">
           <div className="h-24 w-24 bg-slate-50 dark:bg-slate-700 shadow-inner rounded-3xl mx-auto flex items-center justify-center text-slate-200 dark:text-slate-600 transition-transform group-hover:scale-110">
              <Search size={40} strokeWidth={1.5} />
           </div>
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-secondary-900 dark:text-white  ">
                {activeTab === 'Completed' ? 'No courses completed yet' : 'No matching courses'}
              </h3>
              <p className="text-xs font-medium text-slate-400 max-w-sm mx-auto leading-relaxed">
                {activeTab === 'Completed' 
                  ? 'Complete a course and comeback to see your achievements.' 
                  : "We couldn't find any courses matching your current search or filters."}
              </p>
            </div>
           <button 
             onClick={() => {setSearchQuery(''); setActiveFilter('All'); setActiveTab('Active')}}
             className="px-10 py-4 bg-secondary-900 dark:bg-primary-500 text-white text-[11px] font-bold rounded-xl shadow-xl hover:bg-black dark:hover:bg-primary-600 transition-all   active:scale-95"
           >
             Reset all filters
           </button>
        </div>
      )}
    </div>
  )
}
