import { Play, Pause, SkipForward, SkipBack, Volume2, Maximize, Users, FileText, Share2, Award, Clock, Bookmark, Loader2, Send } from 'lucide-react'
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
        console.error('Video player error:', error)
        setCourse({
          title: 'Advanced Texture Application Techniques',
          description: 'This module focuses on the precision layering of CAP PLC luxury finishes. We explore the bond strength of different textures and how to achieve a seamless, high-gloss finish.',
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
        <Loader2 size={32} className="animate-spin text-primary-500" />
        <p className="text-xs font-medium text-slate-400">Loading video session...</p>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="py-20 text-center space-y-4">
         <p className="text-secondary-900 font-bold">Course video not found.</p>
         <button onClick={() => navigate('/video-library')} className="text-primary-500 font-bold hover:underline text-xs uppercase tracking-widest">Back to Library</button>
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-slide-up pb-10">
      
      {/* Player Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
         
         {/* Main Player */}
         <div className="xl:col-span-8 space-y-8">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-secondary-900 group">
               <img src={course.thumbnail_url} className="w-full h-full object-cover opacity-50" alt="Video Player" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="h-20 w-20 bg-primary-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform border-[6px] border-white/10"
                  >
                    {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1.5" />}
                  </button>
               </div>

                {/* Controls */}
                <div className="absolute bottom-6 inset-x-6 bg-secondary-900/90 backdrop-blur-md rounded-xl border border-white/10 p-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-300">
                   <div className="flex items-center gap-6">
                      <button className="text-white hover:text-primary-500 transition-colors"><SkipBack size={18} fill="currentColor" /></button>
                      <button className="text-white hover:text-primary-500 transition-colors"><SkipForward size={18} fill="currentColor" /></button>
                      <div className="h-4 w-px bg-white/20" />
                      <div className="flex items-center gap-4">
                         <Volume2 size={18} className="text-white" />
                         <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full w-2/3 bg-primary-500 rounded-full" />
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-6">
                      <span className="text-[10px] font-bold text-white tracking-widest tabular-nums font-mono">14:22 / {course.duration || '45'}:00</span>
                      <button className="text-white hover:text-primary-500 transition-colors"><Maximize size={18} /></button>
                   </div>
                </div>
            </div>

            {/* Details */}
            <div className="space-y-8 text-left">
               <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="space-y-4 flex-1">
                     <div className="flex items-center gap-3">
                        <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">{course.tier_required || 'PRO'} Mode</span>
                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                           <Clock size={14} className="text-primary-500" /> {course.duration || '45'} Mins Left
                        </div>
                     </div>
                     <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-secondary-900 leading-tight">{course.title}</h1>
                  </div>
                  <div className="flex gap-2 shrink-0">
                     <button className="h-11 w-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary-500 transition-all shadow-sm">
                        <Share2 size={18} />
                     </button>
                     <button className="h-11 w-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary-500 transition-all shadow-sm">
                        <Bookmark size={18} />
                     </button>
                  </div>
               </div>

               <div className="flex items-center gap-8 border-b border-slate-100 overflow-x-auto no-scrollbar">
                  {['Overview', 'Resources', 'Q&A', 'Transcripts'].map((tab) => (
                    <button 
                      key={tab} 
                      onClick={() => setActiveTab(tab)}
                      className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-primary-500' : 'text-slate-400 hover:text-secondary-900'}`}
                    >
                      {tab}
                      {activeTab === tab && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-primary-500" />}
                    </button>
                  ))}
               </div>

               <div className="text-slate-600 font-medium leading-relaxed text-sm">
                  {activeTab === 'Overview' && (
                    <p>{course.description || 'No description available for this lesson.'}</p>
                  )}
                  {activeTab !== 'Overview' && (
                    <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                       <p className="text-xs font-bold uppercase tracking-widest text-slate-300">Content Coming Soon</p>
                    </div>
                  )}
               </div>
            </div>
         </div>

         {/* Sidebar */}
         <div className="xl:col-span-4 space-y-8">
            
            {/* Live Chat */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6 flex flex-col h-full max-h-[500px]">
               <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                  <h3 className="text-xs font-bold text-secondary-900 tracking-widest uppercase flex items-center gap-2">
                     <Users size={16} className="text-primary-500" /> Lesson Discussion
                     <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse ml-1" />
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400">12 Active</span>
               </div>
               <div className="space-y-5 overflow-y-auto no-scrollbar flex-1 pr-1">
                  {[
                    { name: 'David Okafor', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=100&h=100', msg: 'The mirror effect looks insane.' },
                    { name: 'Sarah Biu', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=100&h=100', msg: 'Are those the professional brushes?' },
                    { name: 'Chukuma', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=crop&w=100&h=100', msg: 'Masterpiece technique.' },
                  ].map((user, i) => (
                    <div key={i} className="flex gap-4 group text-left">
                       <img src={user.img} className="h-9 w-9 rounded-lg object-cover shrink-0 border border-slate-100" alt={user.name} />
                       <div className="space-y-1">
                          <p className="text-[10px] font-bold text-secondary-900 uppercase tracking-widest">{user.name}</p>
                          <p className="text-xs font-medium text-slate-500 leading-snug">{user.msg}</p>
                       </div>
                    </div>
                  ))}
               </div>
               <div className="pt-4 border-t border-slate-50 relative">
                  <input type="text" placeholder="Type a message..." className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-4 pr-12 text-xs font-medium text-secondary-900 outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 focus:bg-white transition-all placeholder:text-slate-300 shadow-inner" />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 mt-2 text-primary-500 hover:text-secondary-900 transition-colors p-2">
                     <Send size={16} />
                  </button>
               </div>
            </div>

            {/* Resources */}
            <div className="bg-secondary-900 p-8 rounded-2xl border-none group cursor-pointer relative overflow-hidden shadow-xl text-left">
               <div className="absolute top-0 right-0 h-32 w-32 bg-primary-500/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
               <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-start">
                     <div className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center text-primary-500 border border-white/10 shadow-inner group-hover:-translate-y-1 transition-transform">
                        <FileText size={20} />
                     </div>
                     <span className="bg-primary-500/20 text-primary-500 border border-primary-500/20 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">PDF Guide</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-widest uppercase mb-1">Module Resources</h4>
                    <p className="text-[10px] text-slate-400 font-medium">Download technical guides and slides.</p>
                  </div>
                  <button className="w-full h-11 text-xs font-bold bg-white text-secondary-900 rounded-xl hover:bg-primary-500 hover:text-white transition-all uppercase tracking-widest shadow-lg active:scale-95">
                     Download Assets
                  </button>
               </div>
            </div>

            {/* Progress Card */}
            <div className="bg-white p-8 rounded-2xl border border-primary-100 shadow-sm text-center">
               <div className="space-y-4">
                  <div className="h-14 w-14 bg-primary-50 rounded-full mx-auto flex items-center justify-center text-primary-500 border border-primary-100 shadow-inner">
                    <Award size={28} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-secondary-900 tracking-tight uppercase tracking-widest">Ready for Assessment</p>
                    <p className="text-xs font-medium text-slate-400">Complete the course to earn your badge.</p>
                  </div>
                  <button className="w-full h-11 text-xs font-bold bg-primary-500 text-white rounded-xl hover:bg-secondary-900 transition-all uppercase tracking-widest shadow-lg active:scale-95">
                     Start Assessment
                  </button>
               </div>
            </div>

         </div>

      </div>
    </div>
  )
}
