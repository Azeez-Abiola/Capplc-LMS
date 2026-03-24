import { Play, Clock, ArrowLeft } from 'lucide-react'
import LogoLoader from '../../components/ui/LogoLoader'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { courseService } from '../../services/courseService'
import { toast } from 'react-hot-toast'

export default function AdminModuleDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [module, setModule] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchModule = async () => {
      try {
        if (!id) return
        const data = await courseService.getCourseById(id)
        const normalizedData = data ? {
          ...data,
          level: (data.level === 'Beginners' ? 'Beginner' : data.level) || 'Beginner'
        } : null;
        setModule(normalizedData)
      } catch (error) {
        console.error('Module detail error:', error)
        toast.error('Failed to load module details')
      } finally {
        setLoading(false)
      }
    }
    fetchModule()
  }, [id])

  if (loading) return <LogoLoader fullscreen />

  if (!module) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-secondary-900 font-bold">Module not found.</p>
        <button onClick={() => navigate('/admin/courses')} className="text-primary-500 font-bold hover:underline   text-xs flex items-center gap-2 mx-auto">
          <ArrowLeft size={14} /> Back to all modules
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-slide-up pb-10 text-left">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate('/admin/courses')} 
        className="flex items-center gap-2 text-slate-400 hover:text-primary-500 transition-all font-bold text-[11px]   group w-fit"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      {/* Hero Header */}
      <div className="relative h-auto md:h-80 bg-secondary-900 rounded-3xl overflow-hidden shadow-2xl">
        <img 
          src={module.thumbnail_url || 'https://images.unsplash.com/photo-1595841055318-502a55099399?auto=format&fit=crop&q=80&w=2070'} 
          className="w-full h-full object-cover opacity-40 absolute inset-0" 
          alt={module.title} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary-900 via-secondary-900/40 to-transparent" />
        
        <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 text-left">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 bg-primary-500 text-white text-[10px] font-bold   rounded-lg">{module.level}</span>
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-[10px] font-bold   rounded-lg border border-white/20">{module.tier_access || 'Basic'} Tier</span>
            </div>
            <h1 className="text-2xl md:text-5xl font-bold text-white tracking-tight  leading-tight text-left">{module.title}</h1>
          </div>
          
          <div className="flex items-center gap-6 text-white/60">
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-white tabular-nums">{module.modules?.length || 0}</span>
              <span className="text-[10px] font-bold  ">Courses</span>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-white">{module.level || 'Standard'}</span>
              <span className="text-[10px] font-bold   text-left">Curriculum</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-secondary-900   flex items-center gap-3">
              <Play size={16} className="text-primary-500" /> Curriculum Overview
            </h2>
            <p className="text-slate-500 leading-relaxed font-medium">
              {module.description || "Master the core principles and advanced techniques within this specialized module. This curriculum has been designed to provide Nigerian professionals with state-of-the-art training in modern coating applications."}
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-secondary-900  ">Lessons inside this module</h2>
              <span className="text-[11px] font-bold text-slate-400  ">{module.modules?.length || 0} Total Videos</span>
            </div>

            <div className="space-y-4">
              {module.modules && module.modules.length > 0 ? module.modules.map((lesson: any, i: number) => {
                const vimeoId = lesson.video_url?.includes('vimeo.com') ? lesson.video_url.split('/').pop() : '';
                return (
                  <div key={i} className="group bg-white border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-6 hover:shadow-xl hover:border-primary-100 transition-all">
                    <div className="h-40 w-full sm:h-24 sm:w-40 shrink-0 rounded-xl overflow-hidden bg-slate-100 relative group-hover:scale-[1.02] transition-transform">
                      <img 
                        src={lesson.thumbnail_url || (vimeoId ? `https://vumbnail.com/${vimeoId}.jpg` : 'https://images.unsplash.com/photo-1595841055318-502a55099399?auto=format&fit=crop&q=80&w=2070')} 
                        className="w-full h-full object-cover" 
                        alt={lesson.title} 
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-secondary-900/20 group-hover:bg-primary-500/40 transition-colors">
                        <Play size={24} fill="white" className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-2 w-full text-left">
                       <h4 className="text-base font-bold text-secondary-900 group-hover:text-primary-500 transition-colors  tracking-tight">{lesson.title}</h4>
                       <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400  ">
                            <Clock size={14} /> {lesson.duration || '0'} Mins
                          </span>
                       </div>
                    </div>
                    <button 
                      onClick={() => navigate(`/admin/play/${lesson.id}`)}
                      className="w-full sm:w-auto px-6 py-3 bg-secondary-900 text-white rounded-xl text-[11px] font-bold   hover:bg-black transition-all shadow-lg active:scale-95 text-center"
                    >
                      Watch Lesson
                    </button>
                  </div>
                )
              }) : (
                <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
                  <p className="text-xs font-bold text-slate-400  ">No lessons listed in this module yet.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6">
              <h3 className="text-xs font-bold text-slate-400  ">Quick Stats</h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Difficulty level</span>
                    <span className="text-secondary-900 font-bold">{module.level}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Total Duration</span>
                    <span className="text-secondary-900 font-bold">{module.modules?.reduce((acc: number, l: any) => acc + (parseInt(l.duration) || 0), 0) || 0} mins</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Status</span>
                    <span className="px-2 py-1 bg-green-50 text-green-500 text-[10px] font-bold   rounded">{module.status || 'Active'}</span>
                 </div>
              </div>
              <button 
                onClick={() => navigate('/admin/courses')}
                className="w-full py-4 bg-primary-500 text-white font-bold rounded-2xl text-[11px]   hover:bg-primary-600 transition-all shadow-xl active:scale-95"
              >
                Back to all modules
              </button>
           </div>
        </div>
      </div>
    </div>
  )
}
