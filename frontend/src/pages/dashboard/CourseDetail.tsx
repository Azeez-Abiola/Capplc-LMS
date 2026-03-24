import { Play, CheckCircle2, Clock, BookOpen, Star, Download, ChevronRight, ArrowLeft } from 'lucide-react'

import LogoLoader from '../../components/ui/LogoLoader'
import { NavLink, useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { courseService } from '../../services/courseService'

export default function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (!id) return
        const data = await courseService.getCourseById(id)
        const normalizedData = data ? {
          ...data,
          level: (data.level === 'Beginners' ? 'Beginner' : data.level) || 'Beginner'
        } : null;
        setCourse(normalizedData)
      } catch (error) {
        console.error('Course detail error:', error)
        setCourse({
          title: 'Advanced Spraying & Luxury Finishes',
          description: 'Master the techniques required for high-end residential painting projects. This comprehensive course covers everything from surface decontamination to the application of premium CAP PLC luxury finishes.',
          thumbnail_url: 'https://images.unsplash.com/photo-1562259946-08c513d3042c?auto=format&fit=crop&q=80&w=2070',
          tier_required: 'Intermediate',
          duration: '12 hrs',
          status: 'Enrolled'
        })
      } finally {
        setLoading(false)
      }
    }
    fetchCourse()
  }, [id])

  if (loading) {
    return (
      <LogoLoader fullscreen />
    )
  }

  if (!course) {
    return (
      <div className="py-20 text-center space-y-4">
         <p className="text-secondary-900 font-bold">Course not found.</p>
         <NavLink to="/my-courses" className="text-primary-500 font-bold hover:underline   text-xs">Return to Courses</NavLink>
      </div>
    )
  }

   const rawCount = course.module_count;
   const modCount = course.modules;
   let moduleCount = 0;
   if (typeof rawCount === 'number') moduleCount = rawCount;
   else if (Array.isArray(rawCount) && rawCount[0] && typeof rawCount[0].count === 'number') moduleCount = rawCount[0].count;
   else if (rawCount && typeof rawCount.count === 'number') moduleCount = rawCount.count;
   else if (Array.isArray(modCount)) moduleCount = modCount.length;

  return (
    <div className="space-y-6 animate-slide-up pb-10">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-primary-500 transition-all font-bold text-[11px]   group w-fit bg-transparent border-none p-0 outline-none"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      
      {/* Hero Section */}
      <div className="relative min-h-[350px] md:h-[400px] bg-secondary-900 overflow-hidden rounded-2xl shadow-xl">
         <img 
           src={course.thumbnail_url || 'https://images.unsplash.com/photo-1562259946-08c513d3042c?auto=format&fit=crop&q=80&w=2070'} 
           alt="Banner" 
           className="w-full h-full object-cover opacity-50 absolute inset-0"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-secondary-900 via-secondary-900/40 to-transparent" />
         
          <div className="relative p-6 md:p-12 flex flex-col md:flex-row md:items-end justify-between gap-8 h-full pt-16 md:pt-12">
            <div className="max-w-3xl space-y-6 text-left">
               <div className="flex flex-wrap gap-2">
                  <span className="bg-primary-500 text-white px-4 py-1.5 rounded-full text-[11px] font-bold   shadow-lg">Featured</span>
                  <span className="bg-white/10 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[11px] font-bold   border border-white/20">
                     {course.tier_required || course.level || 'Professional'}
                  </span>
               </div>
               <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight text-left">
                 {course.title}
               </h1>
               <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/80">
                  <div className="flex items-center gap-2">
                     <Clock size={16} className="text-primary-500" />
                     <span className="text-[11px] md:text-xs font-bold  ">{course.duration || '12 HOURS'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <BookOpen size={16} className="text-slate-400" />
                     <span className="text-[11px] md:text-xs font-bold  ">{moduleCount} Courses</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Star size={16} className="text-yellow-400" fill="currentColor" />
                     <span className="text-[11px] md:text-xs font-bold  ">4.9 Rating</span>
                  </div>
               </div>
            </div>

            <NavLink to={`/play/${id}`} className="w-full sm:w-auto bg-primary-500 text-white font-bold px-10 py-4 rounded-xl shadow-xl hover:bg-primary-600 active:scale-95 transition-all text-xs   flex items-center justify-center gap-2 shrink-0">
              <Play size={16} fill="currentColor" /> Start Lessons
            </NavLink>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         
         {/* Main Content */}
         <div className="lg:col-span-8 space-y-10 text-left">
            <div className="bg-white p-6 md:p-10 rounded-2xl border border-slate-100 shadow-sm space-y-6">
               <h2 className="text-lg font-bold text-secondary-900 tracking-tight flex items-center gap-3">
                  <div className="h-1.5 w-6 bg-primary-500 rounded-full" /> 
                  About this Module
               </h2>
               <p className="text-slate-600 font-medium leading-relaxed text-sm">
                 {course.description || "Master the core principles and advanced techniques within this specialized module. This curriculum has been designed to provide Nigerian professionals with state-of-the-art training in modern coating applications."}
               </p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {[
                    'Professional-grade techniques',
                    'Industry-standard workflows',
                    'Global certification eligibility',
                    'Practical hands-on projects',
                  ].map(item => (
                    <div key={item} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                       <div className="h-6 w-6 rounded-md flex items-center justify-center shrink-0 bg-green-50 text-green-500 border border-green-100">
                          <CheckCircle2 size={12} strokeWidth={3} />
                       </div>
                       <span className="text-xs font-medium text-slate-700">{item}</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-white p-6 md:p-10 rounded-2xl border border-slate-100 shadow-sm space-y-8">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-lg font-bold text-secondary-900 tracking-tight flex items-center gap-3">
                     <div className="h-1.5 w-6 bg-secondary-900 rounded-full" /> 
                     Course Syllabus
                  </h2>
                  <span className="text-[11px] font-bold text-slate-400   bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">{moduleCount} Courses</span>
               </div>
               
                <div className="space-y-4">
                    {course.modules && course.modules.length > 0 ? course.modules.map((lesson: any, i: number) => (
                      <div key={i} onClick={() => navigate(`/play/${lesson.id}`)} className="group cursor-pointer border rounded-2xl transition-all overflow-hidden bg-white border-slate-100 hover:border-primary-500 hover:ring-4 hover:ring-primary-50 shadow-sm">
                         <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-6">
                            <div className="flex items-center gap-4 md:gap-6">
                               <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border bg-primary-50 text-primary-500 border-primary-100 dark:bg-primary-500/10 dark:border-primary-500/30 group-hover:bg-primary-500 group-hover:text-white transition-all">
                                  <Play size={20} fill="currentColor" className="ml-0.5" />
                               </div>
                               <div className="text-left">
                                  <h3 className="text-sm font-bold tracking-tight leading-snug text-secondary-900 group-hover:text-primary-500 transition-colors ">{lesson.title}</h3>
                                  <p className="text-[11px] font-bold text-slate-400   mt-1.5">{lesson.duration || '15'} MINS • VIDEO LESSON</p>
                               </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                               <span className="sm:hidden text-[11px] font-bold text-primary-500  ">Start Now</span>
                               <button className="h-10 w-10 rounded-xl flex items-center justify-center transition-all shrink-0 bg-slate-50 text-slate-300 border border-slate-100 group-hover:bg-primary-500 group-hover:text-white group-hover:border-primary-500">
                                  <ChevronRight size={16} />
                               </button>
                            </div>
                         </div>
                      </div>
                    )) : (
                     <div className="py-20 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <p className="text-xs font-bold text-slate-400  ">No lessons assigned to this module yet.</p>
                     </div>
                   )}
                </div>
            </div>
         </div>

         {/* Sidebar */}
         <div className="lg:col-span-4 space-y-10">
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden text-center group">
               <div className="absolute top-0 inset-x-0 h-1 bg-secondary-900 group-hover:bg-primary-500 transition-colors" />
               <div className="h-28 w-28 rounded-full bg-slate-50 mx-auto mb-6 border-4 border-white shadow-xl overflow-hidden mt-4">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop" alt="Instructor" className="w-full h-full object-cover transition-all duration-500" />
               </div>
               <h3 className="text-xl font-bold text-secondary-900 tracking-tight">Sarah Johnson</h3>
               <p className="text-[11px] font-bold text-primary-500   mb-6">Master Painter • CAP PLC</p>
               <p className="text-xs font-medium text-slate-500 leading-relaxed mb-8">
                 Sarah has over 15 years of experience in luxury residential painting and is a certified trainer for CAP Pro Level 4.
               </p>
               <button className="w-full h-12 rounded-xl border border-slate-200 text-slate-500 font-bold text-xs   hover:bg-secondary-900 hover:text-white hover:border-secondary-900 transition-all flex items-center justify-center gap-2 active:scale-95">
                  Contact Instructor <ChevronRight size={14} />
               </button>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-left">
               <h3 className="text-xs font-bold text-secondary-900   mb-6 border-b border-slate-50 pb-4">Resources</h3>
               <div className="space-y-4">
                  {[
                    { name: 'Technique_Manual.pdf', size: '2.5MB' },
                    { name: 'Color_Ratio_Chart.jpg', size: '1.2MB' },
                  ].map(mat => (
                    <div key={mat.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:border-primary-500 transition-all cursor-pointer">
                       <div className="flex items-center gap-4 overflow-hidden">
                          <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center text-primary-500 shadow-sm shrink-0 border border-slate-100 group-hover:bg-primary-500 group-hover:text-white transition-all">
                             <Download size={16} />
                          </div>
                          <div className="min-w-0">
                             <p className="text-[11px] font-bold text-secondary-900 truncate tracking-tight">{mat.name}</p>
                             <p className="text-[10px] font-bold text-slate-400   mt-1">{mat.size}</p>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
         
      </div>
    </div>
  )
}
