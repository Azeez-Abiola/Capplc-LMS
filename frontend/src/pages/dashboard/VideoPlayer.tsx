import { Play, Pause, SkipForward, SkipBack, Volume2, Maximize, Users, FileText, ChevronRight, Share2, Award, Clock, Bookmark, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { courseService } from '../../services/courseService'

export default function VideoPlayer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeTab, setActiveTab] = useState('Overview')
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
          title: 'Advanced Texture Application Techniques (Pro)',
          description: 'This module focuses on the precision layering of CAP PLC luxury finishes. We explore the molecular bond strength of different textures and how to achieve a seamless, high-gloss mirror effect without vertical streaking.',
          thumbnail_url: 'https://images.unsplash.com/photo-1589939705384-5185138a04b9?auto=format&fit=crop&q=80&w=2070',
          tier_required: 'PRO',
          duration: 45
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
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Establishing Video Stream...</p>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="py-20 text-center space-y-4">
         <p className="text-secondary-500 font-bold">Course node not found.</p>
         <button onClick={() => navigate('/video-library')} className="text-primary-500 font-bold hover:underline">RETURN TO ARCHIVE</button>
      </div>
    )
  }

  return (
    <div className="space-y-12 animate-slide-up pb-10">
      
      {/* ── PLAYER & GRID ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
         
         {/* Main Player Area - Spans 8 */}
         <div className="xl:col-span-8 space-y-8">
            <div className="relative aspect-video rounded-md overflow-hidden shadow-2xl bg-secondary-900 group">
               <img src={course.thumbnail_url} className="w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105" alt="Video Player" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="h-24 w-24 bg-primary-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform group/btn border-[6px] border-white/10"
                  >
                    {isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-2" />}
                  </button>
               </div>

                {/* Video Controls Bar */}
                <div className="absolute bottom-4 inset-x-2 sm:inset-x-4 bg-secondary-900/90 backdrop-blur-md rounded border border-white/10 p-2 sm:p-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-500">
                   <div className="flex items-center gap-3 sm:gap-6">
                      <button className="text-white hover:text-primary-500 transition-colors"><SkipBack size={14} fill="currentColor" className="sm:w-[18px] sm:h-[18px]" /></button>
                      <button className="text-white hover:text-primary-500 transition-colors"><SkipForward size={14} fill="currentColor" className="sm:w-[18px] sm:h-[18px]" /></button>
                      <div className="h-4 w-px bg-white/20 hidden sm:block" />
                      <div className="flex items-center gap-4">
                         <Volume2 size={18} className="text-white hidden sm:block" />
                         <div className="w-12 sm:w-24 h-1 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full w-2/3 bg-primary-500 rounded-full" />
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-3 sm:gap-6">
                      <span className="text-[8px] sm:text-[10px] font-bold text-white tracking-widest uppercase tabular-nums">14:22 / {course.duration || '45'}:00</span>
                      <button className="text-white hover:text-primary-500 transition-colors"><Maximize size={14} className="sm:w-[18px] sm:h-[18px]" /></button>
                   </div>
                </div>
            </div>

            {/* Content Details */}
            <div className="space-y-8 text-left">
               <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="space-y-4 flex-1">
                     <div className="flex items-center gap-4">
                        <span className="bg-primary-500 text-white px-3 py-1 rounded text-[9px] font-bold uppercase tracking-widest leading-none shadow-sm">{course.tier_required || 'PRO'} TIER</span>
                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                           <Clock size={14} className="text-primary-500" /> {course.duration || '45'} Mins Remaining
                        </div>
                     </div>
                     <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-secondary-500 uppercase leading-snug">{course.title}</h1>
                  </div>
                  <div className="flex gap-3 shrink-0 sm:pt-0">
                     <button className="h-10 w-10 sm:h-12 sm:w-12 bg-white border border-slate-200 rounded flex items-center justify-center text-slate-400 hover:text-primary-500 transition-all shadow-sm">
                        <Share2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                     </button>
                     <button className="h-10 w-10 sm:h-12 sm:w-12 bg-white border border-slate-200 rounded flex items-center justify-center text-slate-400 hover:text-primary-500 transition-all shadow-sm">
                        <Bookmark size={16} className="sm:w-[18px] sm:h-[18px]" />
                     </button>
                  </div>
               </div>

               <div className="flex items-center gap-4 sm:gap-8 border-b border-slate-100 pb-px overflow-x-auto no-scrollbar">
                  {['Overview', 'Resources', 'Q&A', 'Transcripts'].map((tab) => (
                    <button 
                      key={tab} 
                      onClick={() => setActiveTab(tab)}
                      className={`pb-4 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-primary-500' : 'text-slate-400 hover:text-secondary-500'}`}
                    >
                      {tab}
                      {activeTab === tab && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-primary-500" />}
                    </button>
                  ))}
               </div>

               <div className="prose max-w-none text-slate-500 font-medium leading-relaxed text-sm">
                  {activeTab === 'Overview' && (
                    <p>{course.description || 'Module description unavailable.'}</p>
                  )}
                  {activeTab !== 'Overview' && (
                    <div className="py-10 text-center border-dashed border-2 border-slate-100 rounded-lg">
                       <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{activeTab} node initializing...</p>
                    </div>
                  )}
               </div>
            </div>
         </div>

         {/* Sidebar Area - Spans 4 */}
         <div className="xl:col-span-4 space-y-8">
            
            {/* Live Participants / Chat Area */}
            <div className="bento-card p-6 space-y-6 bg-white shadow-xl border-slate-100">
               <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                  <h3 className="text-sm font-bold text-secondary-500 tracking-widest uppercase flex items-center gap-2">
                     <Users size={16} className="text-primary-500" /> Live Stream Chat
                     <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse ml-1" />
                  </h3>
                  <span className="text-[9px] font-bold text-slate-300 uppercase leading-none">12_PAINTERS</span>
               </div>
               <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                  {[
                    { name: 'David Okafor', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=100&h=100', msg: 'The mirror effect looks insane.' },
                    { name: 'Sarah Biu', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=100&h=100', msg: 'Are those the CAP-PRO brushes?' },
                    { name: 'Chukuma', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=crop&w=100&h=100', msg: 'Masterpiece.' },
                  ].map((user, i) => (
                    <div key={i} className="flex gap-4 p-3 hover:bg-slate-50 rounded transition-all group text-left">
                       <img src={user.img} className="h-8 w-8 rounded object-cover shrink-0 border border-slate-100" alt={user.name} />
                       <div className="space-y-1">
                          <p className="text-[9px] font-bold text-secondary-500 uppercase tracking-widest leading-none">{user.name}</p>
                          <p className="text-xs font-medium text-slate-500 leading-snug">{user.msg}</p>
                       </div>
                    </div>
                  ))}
               </div>
               <div className="pt-4 border-t border-slate-50 relative">
                  <input type="text" placeholder="TRANSMIT MESSAGE..." className="w-full bg-slate-50 border border-slate-200 rounded py-3 pl-4 pr-12 text-[10px] font-bold text-secondary-500 uppercase tracking-widest outline-none focus:border-primary-500 focus:bg-white transition-all placeholder:text-slate-300 shadow-inner" />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 mt-2 text-primary-500 hover:text-secondary-500 transition-colors p-1">
                     <ChevronRight size={16} />
                  </button>
               </div>
            </div>

            {/* Course Resources Card */}
            <div className="bento-card p-6 bg-secondary-900 border-none group cursor-pointer relative overflow-hidden shadow-xl">
               <div className="absolute top-0 right-0 h-32 w-32 bg-primary-500/20 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
               <div className="space-y-6 relative z-10 text-left">
                  <div className="flex justify-between items-start">
                     <div className="h-10 w-10 bg-white/5 rounded flex items-center justify-center text-primary-500 border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
                        <FileText size={20} />
                     </div>
                     <span className="bg-primary-500/10 text-primary-500 border border-primary-500/20 px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest">SECURE_NODE</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-widest uppercase leading-snug mb-1">Module Supplement Deck</h4>
                    <p className="text-[10px] text-slate-400 font-medium">Technical PDF Slides for offline review.</p>
                  </div>
                  <button className="w-full py-3 text-[10px] font-bold bg-white text-secondary-500 rounded hover:bg-primary-500 hover:text-white transition-all uppercase tracking-widest shadow-lg active:scale-95">
                     INITIALIZE_DOWNLOAD / 12MB
                  </button>
               </div>
            </div>

            {/* Progress Update Card */}
            <div className="bento-card p-6 bg-white border border-primary-200 shadow-md">
               <div className="space-y-4 text-center">
                  <div className="h-12 w-12 bg-primary-50 rounded mx-auto flex items-center justify-center text-primary-500 border border-primary-100">
                    <Award size={24} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-secondary-500 uppercase tracking-widest">Validation Ready</p>
                    <p className="text-[10px] font-medium text-slate-400">Complete the module assessment.</p>
                  </div>
                  <button className="w-full py-3 mt-2 text-[10px] font-bold bg-primary-500 text-white rounded hover:bg-secondary-500 transition-all uppercase tracking-widest shadow-md active:scale-95">
                     INITIALIZE_EVALUATION
                  </button>
               </div>
            </div>

         </div>

      </div>
    </div>
  )
}
