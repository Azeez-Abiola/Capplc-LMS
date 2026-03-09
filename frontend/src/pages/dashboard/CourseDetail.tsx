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
        console.error('Failed to fetch course details:', error)
        // Fallback to mock data
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
        <Loader2 size={40} className="animate-spin text-primary-500" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Accessing Course Node...</p>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="py-20 text-center space-y-4">
         <p className="text-secondary-500 font-bold">Course node not found.</p>
         <NavLink to="/my-courses" className="text-primary-500 font-bold hover:underline uppercase tracking-widest text-[10px]">RETURN TO ARCHIVE</NavLink>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-slide-up pb-10">
      
      {/* Course Hero Banner */}
      <div className="relative min-h-[400px] md:h-[400px] bg-secondary-900 overflow-hidden shadow-2xl rounded-none">
         <img 
           src={course.thumbnail_url || 'https://images.unsplash.com/photo-1562259946-08c513d3042c?auto=format&fit=crop&q=80&w=2070'} 
           alt="Banner" 
           className="w-full h-full object-cover opacity-60 absolute inset-0"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-secondary-900 via-secondary-900/60 to-transparent" />
         
         <div className="relative p-6 sm:p-12 flex flex-col md:flex-row md:items-end justify-between gap-8 sm:gap-10 h-full pt-20">
            <div className="max-w-3xl space-y-6 text-left">
               <div className="flex gap-3">
                  <span className="bg-primary-500 text-white px-4 py-1.5 rounded text-[9px] font-bold uppercase tracking-widest shadow-lg leading-none">NEW_RELEASE</span>
                  <span className="bg-white/10 backdrop-blur-md text-white px-4 py-1.5 rounded text-[9px] font-bold uppercase tracking-widest border border-white/20 leading-none">
                     {course.tier_required || 'PRO_TIER'}
                  </span>
               </div>
               <h1 className="text-3xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight uppercase">
                 {course.title}
               </h1>
               <div className="flex flex-wrap items-center gap-6 text-white/60">
                  <div className="flex items-center gap-2">
                     <Clock size={16} className="text-primary-500" />
                     <span className="text-[11px] font-bold uppercase tracking-widest whitespace-nowrap">{course.duration || '12 HOURS'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <BookOpen size={16} className="text-slate-400" />
                     <span className="text-[11px] font-bold uppercase tracking-widest whitespace-nowrap">45_MODULES</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Star size={16} className="text-yellow-400" fill="currentColor" />
                     <span className="text-[11px] font-bold uppercase tracking-widest whitespace-nowrap">4.9_VALIDATOR_RATING</span>
                  </div>
               </div>
            </div>

            <NavLink to={`/play/${id}`} className="bg-primary-500 text-white font-extrabold px-10 py-5 rounded shadow-2xl hover:bg-primary-600 active:scale-95 transition-all text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shrink-0">
              <Play size={16} fill="currentColor" /> INITIALIZE_LEARNING_NODE
            </NavLink>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         
         {/* Main content: About & Syllabus */}
         <div className="lg:col-span-8 space-y-10 text-left">
            <div className="bento-card p-6 sm:p-10 bg-white border-slate-100 shadow-xl space-y-6">
               <h2 className="text-lg font-black text-secondary-500 uppercase tracking-widest flex items-center gap-3 leading-none">
                  <div className="h-1.5 w-6 bg-primary-500 rounded" /> 
                  Course Intelligence
               </h2>
               <p className="text-slate-500 font-medium leading-relaxed text-sm">
                 {course.description}
               </p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {[
                    'Master industrial spray equipment',
                    'Learn luxury texture creation',
                    'Advanced color mixing workflows',
                    'High-end project management',
                  ].map(item => (
                    <div key={item} className="flex items-center gap-4 p-4 bg-slate-50 rounded border border-slate-100 dark:bg-zinc-900 dark:border-white/5">
                       <div className="h-6 w-6 rounded flex items-center justify-center shrink-0 bg-green-50 text-green-500 border border-green-100 dark:bg-green-900/20 dark:border-green-500/20">
                          <CheckCircle2 size={12} strokeWidth={3} />
                       </div>
                       <span className="text-[11px] font-bold text-secondary-500 dark:text-white uppercase tracking-tight">{item}</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bento-card p-6 sm:p-10 bg-white border-slate-100 shadow-xl space-y-8">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-lg font-black text-secondary-500 uppercase tracking-widest flex items-center gap-3 leading-none">
                     <div className="h-1.5 w-6 bg-secondary-900 rounded" /> 
                     Syllabus Architecture
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded border border-slate-100">4_SECTIONS • 45_LESSONS</p>
               </div>
               
               <div className="space-y-4">
                  {[
                     { title: 'Decontamination & Priming Engine', lessons: 12, dur: '2.5h', active: true },
                     { title: 'The Art of the Sprayer System', lessons: 15, dur: '4h' },
                     { title: 'Luxury Texture Portfolio V1', lessons: 10, dur: '3.5h' },
                     { title: 'Final Finishing Excellence Node', lessons: 8, dur: '2.5h' },
                  ].map((sec, i) => (
                    <div key={i} className={`group cursor-pointer border rounded transition-all overflow-hidden bg-white shadow-sm
                      ${sec.active ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-slate-300'}
                    `}>
                       <div className="flex items-center justify-between p-6">
                          <div className="flex items-center gap-6">
                             <div className={`h-12 w-12 rounded flex items-center justify-center shrink-0 border
                                ${sec.active ? 'bg-primary-500 text-white border-primary-600' : 'bg-slate-50 text-slate-400 border-slate-100'}
                             `}>
                                <Layers size={20} />
                             </div>
                             <div>
                                <h3 className={`text-sm font-bold uppercase tracking-tight leading-snug ${sec.active ? 'text-primary-500' : 'text-secondary-500'}`}>{sec.title}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">{sec.lessons}_LESSONS • {sec.dur}_ACTIVE</p>
                             </div>
                          </div>
                          <button className={`h-10 w-10 rounded flex items-center justify-center transition-all shrink-0 ${sec.active ? 'bg-primary-500 text-white shadow-xl' : 'bg-slate-50 text-slate-300 border border-slate-100 group-hover:bg-primary-500 group-hover:text-white group-hover:border-primary-500'}`}>
                             {sec.active ? <Play size={16} fill="currentColor" /> : <ChevronRight size={16} />}
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Sidebar: Instructor & Related */}
         <div className="lg:col-span-4 space-y-10">
            <div className="bento-card p-8 bg-white border-none shadow-2xl relative overflow-hidden text-center group">
               <div className="absolute top-0 inset-x-0 h-1.5 bg-secondary-900 group-hover:bg-primary-500 transition-colors" />
               <div className="h-28 w-28 rounded-full bg-slate-50 mx-auto mb-6 border-4 border-white shadow-xl overflow-hidden shrink-0 mt-2 p-1">
                  <div className="w-full h-full rounded-full overflow-hidden">
                     <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop" alt="Instructor" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  </div>
               </div>
               <h3 className="text-xl font-bold text-secondary-500 uppercase tracking-tight mb-1">Sarah Johnson</h3>
               <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest mb-6">Master Painter • CAP PLC</p>
               <p className="text-xs font-medium text-slate-500 leading-relaxed mb-8">
                 Sarah has over 15 years of experience in luxury residential painting and is a certified trainer for CAP Pro Level 4.
               </p>
               <button className="w-full py-4 rounded border border-slate-200 text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-secondary-900 hover:text-white hover:border-secondary-900 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm">
                  INITIALIZE_COMMS <ChevronRight size={14} />
               </button>
            </div>

            <div className="bento-card p-8 bg-white shadow-xl border-slate-100 text-left">
               <h3 className="text-sm font-black text-secondary-500 uppercase tracking-widest mb-6 border-b border-slate-100 pb-4">Secure Assets</h3>
               <div className="space-y-4">
                  {[
                    { name: 'Technique_Manual.pdf', size: '2.5MB' },
                    { name: 'Color_Ratio_Chart.jpg', size: '1.2MB' },
                  ].map(mat => (
                    <div key={mat.name} className="flex items-center justify-between p-4 bg-slate-50 rounded border border-slate-100 group hover:border-primary-500 transition-all cursor-pointer">
                       <div className="flex items-center gap-4 overflow-hidden">
                          <div className="h-10 w-10 bg-white rounded flex items-center justify-center text-primary-500 shadow-sm shrink-0 border border-slate-100 group-hover:bg-primary-500 group-hover:text-white group-hover:border-primary-500 transition-all">
                             <Download size={16} />
                          </div>
                          <div className="min-w-0">
                             <p className="text-[10px] font-bold text-secondary-500 uppercase tracking-tight truncate">{mat.name}</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">{mat.size}</p>
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
