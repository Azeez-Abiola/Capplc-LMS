import { Play, FileText, Share2, Award, Clock, Bookmark, ArrowLeft } from 'lucide-react'

import LogoLoader from '../../components/ui/LogoLoader'
import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { courseService } from '../../services/courseService'
import { progressService } from '../../services/progressService'
import { toast } from 'react-hot-toast'

export default function VideoPlayer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [activeTab, setActiveTab] = useState('Overview')
  const [course, setCourse] = useState<any>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastSyncTime, setLastSyncTime] = useState(0)
  
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (!id) return
        const data = await courseService.getCourseById(id)
        setCourse(data)
        // Auto-enroll if not already
        courseService.enroll(id).catch(() => null)
        // If there's a real video URL, use it; otherwise provide a standard placeholder video for testing
        setVideoUrl(data.video_url || 'https://www.w3schools.com/html/mov_bbb.mp4')
      } catch (error) {
        console.error('Video player error:', error)
        setCourse({
          id: id,
          title: 'Advanced Texture Application Techniques',
          description: 'This module focuses on the precision layering of CAP PLC luxury finishes. We explore the bond strength of different textures and how to achieve a seamless, high-gloss finish.',
          thumbnail_url: 'https://images.unsplash.com/photo-1589939705384-5185138a04b9?auto=format&fit=crop&q=80&w=2070',
          tier_required: 'PRO',
          duration: 45
        })
        setVideoUrl('https://www.w3schools.com/html/mov_bbb.mp4')
      } finally {
        setLoading(false)
      }
    }
    fetchCourse()
  }, [id])

  const handleTimeUpdate = async () => {
    if (!videoRef.current || !course) return
    const currentTime = videoRef.current.currentTime
    const duration = videoRef.current.duration

    // Sync every 5 seconds to reduce API load
    if (currentTime - lastSyncTime > 5) {
      setLastSyncTime(currentTime)
      try {
        // Assume ID passed is module/lesson ID. In this mock, we just use course.id
        await progressService.syncVideoProgress(course.id, currentTime, duration)
      } catch (error) {
        console.debug('Progress sync suppressed during testing', error)
      }
    }
  }

  const handleVideoEnded = async () => {
    if (!course) return
    try {
      await progressService.markComplete(course.id)
      toast.success('Lesson marked as completed!')
    } catch (error) {
      console.debug('Completion sync suppressed during testing')
    }
  }

  if (loading) {
    return (
      <LogoLoader fullscreen />
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
    <div className="space-y-6 animate-slide-up pb-10">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-400 hover:text-primary-500 transition-all font-bold text-[10px] uppercase tracking-[0.2em] group w-fit"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Return to curriculum
      </button>

      {/* Player Layout */}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
         
         {/* Main Player */}
         <div className="xl:col-span-8 space-y-8">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-secondary-900 group">
               {!isPlaying ? (
                 <>
                   <img src={course.thumbnail_url} className="w-full h-full object-cover opacity-50" alt="Video Player" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <button 
                        onClick={() => setIsPlaying(true)}
                        className="h-20 w-20 bg-primary-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform border-[6px] border-white/10"
                      >
                        <Play size={32} fill="currentColor" className="ml-1.5" />
                      </button>
                   </div>
                 </>
               ) : (
                  videoUrl && (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') || videoUrl.includes('vimeo.com')) ? (
                    <iframe 
                      src={videoUrl.includes('youtube.com/watch?v=') ? videoUrl.replace('watch?v=', 'embed/') : videoUrl.includes('youtu.be/') ? videoUrl.replace('youtu.be/', 'youtube.com/embed/') : videoUrl.includes('vimeo.com/') ? videoUrl.replace('vimeo.com/', 'player.vimeo.com/video/') : videoUrl}
                      className="w-full h-full border-none"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video 
                      ref={videoRef}
                      src={videoUrl || undefined}
                      controls
                      autoPlay
                      onTimeUpdate={handleTimeUpdate}
                      onEnded={handleVideoEnded}
                      className="w-full h-full outline-none"
                      controlsList="nodownload"
                    />
                  )
               )}
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
                     <button onClick={() => toast.success('Link copied to clipboard')} className="h-11 w-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary-500 transition-all shadow-sm">
                        <Share2 size={18} />
                     </button>
                     <button onClick={() => { setIsBookmarked(!isBookmarked); toast.success(isBookmarked ? 'Removed from bookmarks' : 'Saved to your bookmarks'); }} className={`h-11 w-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center transition-all shadow-sm ${isBookmarked ? 'text-primary-500 border-primary-100 bg-primary-50' : 'text-slate-400 hover:text-primary-500'}`}>
                        <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
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
                    <div className="space-y-4">
                      <p>{course.description || 'No description available for this lesson.'}</p>
                      <h4 className="text-secondary-900 font-bold mt-4">Key Takeaways</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Understanding surface prep requirements</li>
                        <li>Choosing the correct luxury finish</li>
                        <li>Application techniques for high-gloss</li>
                      </ul>
                    </div>
                  )}
                  {activeTab === 'Resources' && (
                     <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl hover:border-primary-500 transition-colors cursor-pointer" onClick={() => toast.success('Downloading...')}>
                           <div className="flex items-center gap-3">
                              <FileText size={18} className="text-primary-500" />
                              <span className="text-sm font-bold text-secondary-900">Module Presentation Slides</span>
                           </div>
                           <span className="text-[10px] uppercase tracking-widest text-slate-400">2.4 MB PDF</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl hover:border-primary-500 transition-colors cursor-pointer" onClick={() => toast.success('Downloading...')}>
                           <div className="flex items-center gap-3">
                              <FileText size={18} className="text-primary-500" />
                              <span className="text-sm font-bold text-secondary-900">Texture Mix Ratio Guide</span>
                           </div>
                           <span className="text-[10px] uppercase tracking-widest text-slate-400">1.1 MB PDF</span>
                        </div>
                     </div>
                  )}
                  {activeTab === 'Q&A' && (
                     <div className="space-y-6">
                        <div className="pb-4 border-b border-slate-100">
                           <p className="font-bold text-secondary-900">What is the optimal temperature for applying this finish?</p>
                           <p className="text-slate-500 mt-2">The ideal temperature is between 15°C and 25°C with less than 60% humidity.</p>
                        </div>
                        <div className="pb-4 border-b border-slate-100">
                           <p className="font-bold text-secondary-900">Can I use standard primers?</p>
                           <p className="text-slate-500 mt-2">It is recommended to use the CAP PLC high-bond primer for luxury textures to ensure durability.</p>
                        </div>
                     </div>
                  )}
                  {activeTab === 'Transcripts' && (
                     <div className="h-48 overflow-y-auto no-scrollbar space-y-4 pr-2">
                        <p className="text-slate-400"><span className="text-primary-500 font-bold w-12 inline-block">00:15</span> Welcome to the advanced application techniques module.</p>
                        <p className="text-slate-400"><span className="text-primary-500 font-bold w-12 inline-block">02:30</span> Today we will focus on ensuring a seamless bond.</p>
                        <p className="text-slate-400"><span className="text-primary-500 font-bold w-12 inline-block">05:45</span> Notice the angle of the trowel as we apply the first coat...</p>
                        <p className="text-slate-400"><span className="text-primary-500 font-bold w-12 inline-block">10:20</span> Always maintain a wet edge to avoid overlapping lines.</p>
                     </div>
                  )}
               </div>
            </div>
         </div>

          {/* Sidebar */}
          <div className="xl:col-span-4 space-y-8">

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
