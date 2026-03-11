import { Play, CheckCircle2, Clock, BookOpen, Layers, Star, Download, ChevronRight, Loader2 } from 'lucide-react'
import { NavLink, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { courseService } from '../../services/courseService'

export default function CourseDetail() {
  const { id } = useParams()
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (!id) return
        const data = await courseService.getCourseById(id)
        setCourse(data)
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
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 size={32} className="animate-spin text-primary-500" />
        <p className="text-xs font-medium text-slate-400">Loading course details...</p>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="py-20 text-center space-y-4">
         <p className="text-secondary-900 font-bold">Course not found.</p>
         <NavLink to="/my-courses" className="text-primary-500 font-bold hover:underline uppercase tracking-widest text-xs">Return to Courses</NavLink>
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-slide-up pb-10">
      
      {/* Hero Section */}
      <div className="relative min-h-[350px] md:h-[400px] bg-secondary-900 overflow-hidden rounded-2xl shadow-xl">
         <img 
           src={course.thumbnail_url || 'https://images.unsplash.com/photo-1562259946-08c513d3042c?auto=format&fit=crop&q=80&w=2070'} 
           alt="Banner" 
           className="w-full h-full object-cover opacity-50 absolute inset-0"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-secondary-900 via-secondary-900/40 to-transparent" />
         
         <div className="relative p-6 md:p-12 flex flex-col md:flex-row md:items-end justify-between gap-8 h-full pt-16">
            <div className="max-w-3xl space-y-6 text-left">
               <div className="flex gap-2">
                  <span className="bg-primary-500 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">Featured</span>
                  <span className="bg-white/10 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/20">
                     {course.tier_required || 'Professional'}
                  </span>
               </div>
               <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
                 {course.title}
               </h1>
               <div className="flex flex-wrap items-center gap-6 text-white/80">
                  <div className="flex items-center gap-2">
                     <Clock size={16} className="text-primary-500" />
                     <span className="text-xs font-bold uppercase tracking-widest">{course.duration || '12 HOURS'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <BookOpen size={16} className="text-slate-400" />
                     <span className="text-xs font-bold uppercase tracking-widest">45 Modules</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Star size={16} className="text-yellow-400" fill="currentColor" />
                     <span className="text-xs font-bold uppercase tracking-widest">4.9 Rating</span>
                  </div>
               </div>
            </div>

            <NavLink to={`/play/${id}`} className="bg-primary-500 text-white font-bold px-10 py-4 rounded-xl shadow-xl hover:bg-primary-600 active:scale-95 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2 shrink-0">
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
                  About this Course
               </h2>
               <p className="text-slate-600 font-medium leading-relaxed text-sm">
                 {course.description}
               </p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {[
                    'Master industrial spray equipment',
                    'Learn luxury texture creation',
                    'Advanced color mixing workflows',
                    'Professional project oversight',
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
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">4 Sections • 45 Lessons</span>
               </div>
               
               <div className="space-y-4">
                  {[
                     { title: 'Surface Preparation Essentials', lessons: 12, dur: '2.5h', active: true },
                     { title: 'Expert Sprayer Systems', lessons: 15, dur: '4h' },
                     { title: 'Luxury Texture Portfolio', lessons: 10, dur: '3.5h' },
                     { title: 'Final Finish Perfection', lessons: 8, dur: '2.5h' },
                  ].map((sec, i) => (
                    <div key={i} className={`group cursor-pointer border rounded-2xl transition-all overflow-hidden bg-white 
                      ${sec.active ? 'border-primary-500 ring-4 ring-primary-50' : 'border-slate-100 hover:border-slate-200 shadow-sm'}
                    `}>
                       <div className="flex items-center justify-between p-6">
                          <div className="flex items-center gap-6">
                             <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border
                                ${sec.active ? 'bg-primary-500 text-white border-primary-600' : 'bg-slate-50 text-slate-400 border-slate-100'}
                             `}>
                                <Layers size={20} />
                             </div>
                             <div>
                                <h3 className={`text-sm font-bold tracking-tight leading-snug ${sec.active ? 'text-primary-500' : 'text-secondary-900'}`}>{sec.title}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{sec.lessons} Lessons • {sec.dur}</p>
                             </div>
                          </div>
                          <button className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all shrink-0 ${sec.active ? 'bg-primary-500 text-white shadow-lg' : 'bg-slate-50 text-slate-300 border border-slate-100 group-hover:bg-primary-500 group-hover:text-white group-hover:border-primary-500'}`}>
                             {sec.active ? <Play size={16} fill="currentColor" /> : <ChevronRight size={16} />}
                          </button>
                       </div>
                    </div>
                  ))}
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
               <p className="text-[10px] font-bold text-primary-500 uppercase tracking-widest mb-6">Master Painter • CAP PLC</p>
               <p className="text-xs font-medium text-slate-500 leading-relaxed mb-8">
                 Sarah has over 15 years of experience in luxury residential painting and is a certified trainer for CAP Pro Level 4.
               </p>
               <button className="w-full h-12 rounded-xl border border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-secondary-900 hover:text-white hover:border-secondary-900 transition-all flex items-center justify-center gap-2 active:scale-95">
                  Contact Instructor <ChevronRight size={14} />
               </button>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-left">
               <h3 className="text-xs font-bold text-secondary-900 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Resources</h3>
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
                             <p className="text-[10px] font-bold text-secondary-900 truncate tracking-tight">{mat.name}</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{mat.size}</p>
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
