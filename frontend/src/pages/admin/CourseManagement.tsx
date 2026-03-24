import { Edit3, Trash2, Play, LayoutGrid, List, Plus, Search, Archive, X, BarChart, Book, Star, Zap, Gem, Crown, Upload } from 'lucide-react'
import LogoLoader from '../../components/ui/LogoLoader'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import CustomDropdown from '../../components/ui/CustomDropdown'
import api from '../../lib/axios'
import { courseService } from '../../services/courseService'

type ModalType = 'none' | 'addModule' | 'addCourse' | 'editCourse' | 'deleteCourse' | 'archiveCourse'

export default function CourseManagement() {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState('GRID')
  const [searchQuery, setSearchQuery] = useState('')
  const [courses, setCourses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeModal, setActiveModal] = useState<ModalType>('none')
  const [selectedCourse, setSelectedCourse] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Form state
  const [formTitle, setFormTitle] = useState('')
  const [formLevel, setFormLevel] = useState('Beginner')
  const [formTier, setFormTier] = useState('Basic')
  const [formDescription, setFormDescription] = useState('')
  const [formDuration, setFormDuration] = useState('')
  const [formVideoUrl, setFormVideoUrl] = useState('')
  const [formThumbnailUrl, setFormThumbnailUrl] = useState('')
  const [formCategory, setFormCategory] = useState('Beginner')

  const filteredCourses = courses.filter(c => 
    !c.archived && c.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Group by level
  const groupedCourses: Record<string, typeof courses> = {}
  filteredCourses.forEach(c => {
    if (!groupedCourses[c.level]) groupedCourses[c.level] = []
    groupedCourses[c.level].push(c)
  })

  const resetForm = () => {
    setFormTitle('')
    setFormLevel('Beginner')
    setFormTier('Basic')
    setFormDescription('')
    setFormThumbnailUrl('')
    setFormVideoUrl('')
    setIsUploading(false)
    setSelectedCourse(null)
    setFormCategory('Beginner')
  }

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      setIsLoading(true)
      const data = await courseService.getAdminCourses()
      setCourses(data.map((c: any) => ({
        id: c.id,
        title: c.title,
        modules: c.modules?.length || 0,
        modulesList: c.modules || [],
        status: c.is_published ? 'Published' : 'Draft',
        img: c.thumbnail_url || 'https://images.unsplash.com/photo-1595841055318-502a55099399?auto=format&fit=crop&q=80&w=2070',
        thumbnail_url: c.thumbnail_url,
        tier: c.tier_access || 'Basic',
        level: (c.level === 'Beginners' ? 'Beginner' : c.level) || 'Beginner',
        archived: !!c.archived_at
      })))
    } catch (error) {
      toast.error('Failed to load courses')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('bucket', 'thumbnails')
      formData.append('file', file)

      // @ts-ignore
      const { data } = await api.post('uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setFormThumbnailUrl(data.url)
      toast.success('Thumbnail uploaded successfully!')
    } catch (error) {
      toast.error('Failed to upload thumbnail')
      console.error(error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleCreateTopLevel = async () => {
    if (!formTitle.trim()) { toast.error('Please enter a title'); return }
    try {
      setIsSubmitting(true)
      await courseService.createCourse({
        title: formTitle,
        description: formDescription,
        tier_access: formTier,
        thumbnail_url: formThumbnailUrl,
        level: formCategory,
        status: 'draft',
      } as any)
      toast.success(`"${formTitle}" created successfully!`)
      loadCourses()
      resetForm()
      setActiveModal('none')
    } catch (error) {
      toast.error('Failed to create module. Please try again.')
    }
  }

  const handleCreateNestedCourse = async () => {
    if (!formTitle.trim()) { toast.error('Please enter a title'); return }
    if (!selectedCourse) { toast.error('No parent module selected'); return }
    try {
      setIsSubmitting(true)
      // Create child course mapped to the DB 'modules' table
      await courseService.createModule({
        course_id: selectedCourse.id,
        title: formTitle,
        description: formDescription,
        duration: formDuration,
        video_url: formVideoUrl,
        thumbnail_url: formThumbnailUrl
      })
      toast.success(`"${formTitle}" added to module successfully!`)
      loadCourses()
      resetForm()
      setActiveModal('none')
    } catch (error) {
      toast.error('Failed to add course. Please try again.')
    }
  }

  const handleEditCourse = async () => {
    if (!selectedCourse) return
    try {
      setIsSubmitting(true)
      await courseService.updateCourse(selectedCourse.id, {
        title: formTitle || selectedCourse.title,
        tier_access: formTier,
        thumbnail_url: formThumbnailUrl,
        level: formCategory
      } as any)
      toast.success('Module updated successfully!')
      loadCourses()
      resetForm()
      setActiveModal('none')
    } catch (error) {
      toast.error('Failed to update course')
    }
  }

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return
    try {
      setIsSubmitting(true)
      await courseService.deleteCourse(selectedCourse.id)
      toast.success('Course deleted successfully!')
      loadCourses()
      resetForm()
      setActiveModal('none')
    } catch (error) {
      toast.error('Failed to delete course')
    }
  }

  const handleArchiveCourse = async () => {
    if (!selectedCourse) return
    try {
      setIsSubmitting(true)
      await courseService.archiveCourse(selectedCourse.id)
      toast.success('Course archived! Users will no longer see it.')
      loadCourses()
      resetForm()
      setActiveModal('none')
    } catch (error) {
      toast.error('Failed to archive course')
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEdit = (course: any) => {
    setSelectedCourse(course)
    setFormTitle(course.title)
    setFormLevel(course.level)
    setFormTier(course.tier)
    setFormThumbnailUrl(course.thumbnail_url || '')
    setFormVideoUrl(course.video_url || '')
    setFormCategory(course.level || 'Beginner')
    setActiveModal('editCourse')
  }

  const openDelete = (course: any) => {
    setSelectedCourse(course)
    setActiveModal('deleteCourse')
  }

  const openArchive = (course: any) => {
    setSelectedCourse(course)
    setActiveModal('archiveCourse')
  }

  if (isLoading) {
    return (
      <LogoLoader fullscreen />
    )
  }

  return (
    <>
      <div className="space-y-10 animate-slide-up pb-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 text-left">
          <div className="text-left">
            <h1 className="text-2xl font-bold text-secondary-900 tracking-tight leading-none text-left ">Course Repository</h1>
            <p className="text-slate-500 text-sm font-medium mt-1 text-left">Manage training curriculum and educational content.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex p-1 bg-slate-100/50 rounded-xl border border-slate-100 order-2 md:order-1">
               {['GRID', 'LIST'].map((mode) => (
                  <button 
                    key={mode} 
                    onClick={() => setViewMode(mode)}
                    className={`px-4 py-2 rounded-lg transition-all ${viewMode === mode ? 'bg-white text-primary-500 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-secondary-900'}`}
                  >
                    {mode === 'GRID' ? <LayoutGrid size={18} /> : <List size={18} />}
                  </button>
               ))}
            </div>
            <button onClick={() => { resetForm(); setActiveModal('addModule'); }} className="h-12 flex-1 md:flex-none px-8 bg-secondary-900 text-white font-bold rounded-xl text-xs   hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 order-1 md:order-2">
               <Plus size={18} /> Add Module
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
           <div className="w-full sm:w-96 bg-white border border-slate-200 rounded-xl flex items-center px-4 py-2.5 shadow-sm group focus-within:ring-4 focus-within:ring-primary-50 transition-all">
              <Search size={18} className="text-slate-400 group-focus-within:text-primary-500" />
              <input 
                type="text" 
                placeholder="Search courses..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm font-medium ml-2 flex-1 text-secondary-900 placeholder:text-slate-300 tracking-tight"
              />
           </div>
           <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-slate-400  ">Available Courses: {filteredCourses.length} Courses</span>
           </div>
        </div>

        {/* Content grouped by level */}
        {Object.entries(groupedCourses).map(([level, levelCourses]) => (
          <div key={level} className="space-y-6 text-left">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <h2 className="text-lg font-bold text-secondary-900 tracking-tight">{level} Level</h2>
                   <span className="bg-primary-50 text-primary-500 border border-primary-100 text-[10px] font-bold px-3 py-1 rounded-lg  ">{levelCourses.length} Courses</span>
                </div>
             </div>

              <div className={viewMode === 'GRID' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-4"}>
                {levelCourses.map((course) => (
                  viewMode === 'GRID' ? (
                  <div key={course.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-primary-100 transition-all flex flex-col group h-full">
                     <div className="relative aspect-video w-full overflow-hidden bg-slate-100 cursor-pointer" onClick={() => navigate(`/admin/courses/${course.id}`)}>
                       <img src={course.img} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                       <div className="absolute inset-0 bg-secondary-900/10 group-hover:bg-secondary-900/40 transition-colors duration-300" />
                       
                       <div className="absolute top-4 right-4">
                          <span className={`px-3 py-1.5 rounded-lg ${course.status === 'Published' ? 'bg-green-500' : 'bg-secondary-900/60 backdrop-blur-md'} text-white text-[10px] font-bold   shadow-xl`}>
                             {course.status}
                          </span>
                       </div>

                       <div className="absolute bottom-4 left-4 flex items-center gap-3">
                          <div className="h-10 w-10 bg-white text-secondary-900 rounded-xl flex items-center justify-center shadow-xl border border-white/20 group-hover:scale-110 transition-transform">
                             <Play size={18} fill="currentColor" />
                          </div>
                          <div className="px-3 py-1.5 bg-white backdrop-blur-md rounded-lg text-[10px] font-bold text-secondary-900 border border-slate-200   shadow-sm">
                             {course.tier} Access
                          </div>
                       </div>
                     </div>

                     <div className="p-8 flex-1 flex flex-col justify-between space-y-8">
                        <div className="space-y-4">
                           <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400  ">
                              <span>{course.modules} Modules</span>
                              <span className="h-1 w-1 bg-slate-200 rounded-full" />
                              <span>Standard Curriculum</span>
                           </div>
                           <h3 className="text-base font-bold text-secondary-900 leading-tight group-hover:text-primary-500 transition-colors  tracking-tight line-clamp-2 cursor-pointer" onClick={() => navigate(`/admin/courses/${course.id}`)}>{course.title}</h3>
                        </div>
                        
                        <div className="pt-6 border-t border-slate-50 flex items-center gap-2">
                           <button onClick={() => { setSelectedCourse(course); setFormTitle(''); setFormDescription(''); setFormDuration(''); setFormVideoUrl(''); setActiveModal('addCourse'); }} className="h-12 w-12 bg-green-50 hover:bg-green-100 text-green-600 font-bold rounded-xl flex items-center justify-center transition-all shadow-sm">
                              <Plus size={20} />
                           </button>
                           <button onClick={() => openEdit(course)} className="flex-1 h-12 bg-primary-500 text-white font-bold rounded-xl text-xs   hover:bg-primary-600 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95">
                              <Edit3 size={16} /> Edit
                           </button>
                           <button onClick={() => openArchive(course)} className="h-12 w-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-orange-500 hover:border-orange-500 transition-all active:scale-95 shadow-sm">
                              <Archive size={18} />
                           </button>
                           <button onClick={() => openDelete(course)} className="h-12 w-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-300 hover:text-red-500 hover:border-red-500 transition-all active:scale-95 shadow-sm">
                              <Trash2 size={18} />
                           </button>
                         </div>
                      </div>
                   </div>
                  ) : (
                    <div key={course.id} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-primary-500 transition-all flex items-center justify-between group">
                       <div className="flex items-center gap-6">
                          <div className="h-16 w-24 rounded-lg overflow-hidden bg-slate-100 border border-slate-100 cursor-pointer" onClick={() => navigate(`/admin/courses/${course.id}`)}>
                             <img src={course.img} className="w-full h-full object-cover" />
                          </div>
                          <div>
                             <h4 className="text-sm font-bold text-secondary-900 group-hover:text-primary-500 transition-colors cursor-pointer" onClick={() => navigate(`/admin/courses/${course.id}`)}>{course.title}</h4>
                             <p className="text-[11px] font-bold text-slate-400   mt-1">{course.modules} Modules · {course.tier} Access</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <span className={`px-3 py-1.5 rounded-lg ${course.status === 'Published' ? 'bg-green-50 text-green-500 border-green-100' : 'bg-primary-50 text-primary-500 border-primary-100'} text-[10px] font-bold  `}>
                             {course.status}
                          </span>
                          <div className="flex items-center gap-2">
                             <button onClick={() => { setSelectedCourse(course); setFormTitle(''); setFormDescription(''); setFormDuration(''); setFormVideoUrl(''); setActiveModal('addCourse'); }} className="h-10 w-10 bg-green-50 border border-green-100 rounded-xl flex items-center justify-center text-green-600 hover:bg-green-100 transition-all shadow-sm"><Plus size={16} /></button>
                             <button onClick={() => openEdit(course)} className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-secondary-900 hover:border-slate-300 transition-all"><Edit3 size={16} /></button>
                             <button onClick={() => openArchive(course)} className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-orange-500 hover:border-orange-500 transition-all"><Archive size={16} /></button>
                             <button onClick={() => openDelete(course)} className="h-10 w-10 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-300 hover:text-red-500 hover:border-red-500 transition-all"><Trash2 size={16} /></button>
                          </div>
                       </div>
                    </div>
                  )
                ))}

                {/* Add New Module Card */}
                <div onClick={() => { resetForm(); setActiveModal('addModule'); }} className="border-2 border-dashed border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 hover:border-primary-500 dark:hover:border-primary-500 hover:bg-white dark:hover:bg-white/10 transition-all cursor-pointer flex flex-col items-center justify-center p-12 h-full min-h-[350px] rounded-3xl group shadow-sm">
                   <div className="h-16 w-16 bg-white dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-300 dark:text-slate-600 group-hover:bg-primary-500 group-hover:text-white transition-all border border-slate-100 dark:border-white/10 shadow-sm">
                      <Plus size={32} strokeWidth={2.5} />
                   </div>
                   <p className="text-xs font-bold text-slate-400 dark:text-slate-500   mt-6 group-hover:text-secondary-900 dark:group-hover:text-white">Add New Module</p>
                </div>
             </div>
          </div>
        ))}

        {filteredCourses.length === 0 && (
          <div className="py-24 bg-slate-50/50 dark:bg-white/5 border-2 border-dashed border-slate-100 dark:border-white/10 rounded-3xl text-center space-y-4">
             <p className="text-sm font-bold text-secondary-900 dark:text-white  ">No courses found</p>
             <p className="text-xs font-medium text-slate-400 dark:text-slate-600">Try adjusting your search.</p>
          </div>
        )}
      </div>

      {/* ===== MODALS (RENDERED OUTSIDE ANIMATED DIV FOR PERFECT CENTERING) ===== */}

      {/* Add Module Modal */}
      {activeModal === 'addModule' && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-all" onClick={() => setActiveModal('none')}>
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
             <div className="flex items-center justify-between mb-6">
                <div>
                   <h3 className="text-xl font-bold text-secondary-900 tracking-tight leading-none text-left">Add New Module</h3>
                   <p className="text-sm font-medium text-slate-400 mt-2 text-left">Create a new core module container for courses.</p>
                </div>
                <button onClick={() => setActiveModal('none')} className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                   <X size={18} />
                </button>
             </div>
             <div className="space-y-4 mb-8 text-left">
                <div className="space-y-2 text-left">
                   <label className="text-[11px] font-bold text-slate-400   ml-1">Module Title *</label>
                   <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="e.g. Advanced Paint Techniques" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 h-12 text-sm font-bold text-secondary-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 outline-none transition-all placeholder:text-slate-300" />
                </div>
                <div className="space-y-2 text-left">
                   <label className="text-[11px] font-bold text-slate-400   ml-1">Description</label>
                   <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Brief description of the module content..." rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-secondary-900 focus:bg-white focus:border-primary-500 outline-none transition-all placeholder:text-slate-300 resize-none" />
                </div>
                <div className="space-y-2 text-left">
                   <label className="text-[11px] font-bold text-slate-400   ml-1">Module Thumbnail</label>
                   <div className="flex items-center gap-4">
                      {formThumbnailUrl ? (
                        <div className="h-24 w-40 rounded-xl overflow-hidden border border-slate-200 relative group">
                           <img src={formThumbnailUrl} className="w-full h-full object-cover" />
                           <button 
                             onClick={() => setFormThumbnailUrl('')}
                             className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold text-[11px]  "
                           >
                             Remove
                           </button>
                        </div>
                      ) : (
                        <label className="flex-1 h-24 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-primary-500 hover:bg-primary-50/10 transition-all cursor-pointer">
                           <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                           {isUploading ? (
                              <div className="h-5 w-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                           ) : (
                              <>
                                <Upload size={20} className="text-slate-400" />
                                <span className="text-[11px] font-bold text-slate-400  ">Upload Module Thumbnail</span>
                              </>
                           )}
                        </label>
                      )}
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-left">
                   <CustomDropdown 
                     label="Level"
                     value={formLevel}
                     onChange={setFormLevel}
                     options={[
                       { id: 'Beginner', label: 'Beginner', icon: <BarChart size={14} /> },
                       { id: 'Intermediate', label: 'Intermediate', icon: <Book size={14} /> },
                       { id: 'Advanced', label: 'Advanced', icon: <Star size={14} /> },
                     ]}
                   />
                   <CustomDropdown 
                     label="Access Tier"
                     value={formTier}
                     onChange={setFormTier}
                     options={[
                       { id: 'Basic', label: 'Basic', icon: <Zap size={14} /> },
                       { id: 'Professional', label: 'Professional', icon: <Gem size={14} /> },
                       { id: 'Elite', label: 'Elite', icon: <Crown size={14} /> },
                     ]}
                   />
                </div>
             </div>
             <div className="flex gap-4">
                <button onClick={() => setActiveModal('none')} className="flex-1 py-3.5 bg-slate-50 hover:bg-slate-100 text-secondary-900 border border-slate-200 font-bold rounded-xl text-xs   transition-all">Cancel</button>
                <button disabled={isSubmitting} onClick={handleCreateTopLevel} className="h-12 w-full bg-secondary-900 text-white font-bold rounded-xl text-xs   hover:bg-black transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
               {isSubmitting ? "Processing..." : "Create Module"}
            </button>
             </div>
          </div>
        </div>
      )}

      {/* Add Nested Course Modal */}
      {activeModal === 'addCourse' && selectedCourse && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-all" onClick={() => setActiveModal('none')}>
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
             <div className="flex items-center justify-between mb-6">
                <div>
                   <h3 className="text-xl font-bold text-secondary-900 tracking-tight leading-none text-left">Add New Course</h3>
                   <p className="text-sm font-medium text-slate-400 mt-2 text-left">Adding course to <strong className="text-primary-500">{selectedCourse.title}</strong> module.</p>
                </div>
                <button onClick={() => setActiveModal('none')} className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                   <X size={18} />
                </button>
             </div>
             <div className="space-y-4 mb-8 text-left">
                <div className="space-y-2 text-left">
                   <label className="text-[11px] font-bold text-slate-400   ml-1">Course Title *</label>
                   <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="e.g. Mixing Colors 101" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 h-12 text-sm font-bold text-secondary-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 outline-none transition-all placeholder:text-slate-300" />
                </div>
                <div className="space-y-2 text-left">
                   <label className="text-[11px] font-bold text-slate-400   ml-1">Course URL</label>
                   <input type="text" value={formVideoUrl} onChange={(e) => setFormVideoUrl(e.target.value)} placeholder="Paste Link or Full Embed Code (YouTube/Vimeo)..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 h-12 text-sm font-bold text-secondary-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 outline-none transition-all placeholder:text-slate-300" />
                </div>
                <div className="space-y-2 text-left">
                   <label className="text-[11px] font-bold text-slate-400   ml-1">Course Thumbnail</label>
                   <div className="flex items-center gap-4">
                      {formThumbnailUrl ? (
                        <div className="h-24 w-40 rounded-xl overflow-hidden border border-slate-200 relative group">
                           <img src={formThumbnailUrl} className="w-full h-full object-cover" />
                           <button 
                             onClick={() => setFormThumbnailUrl('')}
                             className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold text-[11px]  "
                           >
                             Remove
                           </button>
                        </div>
                      ) : (
                        <label className="flex-1 h-24 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-primary-500 hover:bg-primary-50/10 transition-all cursor-pointer">
                           <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                           {isUploading ? (
                              <div className="h-5 w-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                           ) : (
                              <>
                                <Upload size={20} className="text-slate-400" />
                                <span className="text-[11px] font-bold text-slate-400  ">Upload Course Thumbnail</span>
                              </>
                           )}
                        </label>
                      )}
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-left">
                   <div className="space-y-2 text-left">
                      <label className="text-[11px] font-bold text-slate-400   ml-1">Duration</label>
                      <input type="text" value={formDuration} onChange={(e) => setFormDuration(e.target.value)} placeholder="e.g. 15 mins" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 h-12 text-sm font-bold text-secondary-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 outline-none transition-all placeholder:text-slate-300" />
                   </div>
                </div>
                <div className="space-y-2 text-left">
                   <label className="text-[11px] font-bold text-slate-400   ml-1">Description</label>
                   <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Brief description..." rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-secondary-900 focus:bg-white focus:border-primary-500 outline-none transition-all placeholder:text-slate-300 resize-none" />
                </div>
             </div>
             <div className="flex gap-4">
                <button onClick={() => setActiveModal('none')} className="flex-1 py-3.5 bg-slate-50 hover:bg-slate-100 text-secondary-900 border border-slate-200 font-bold rounded-xl text-xs   transition-all">Cancel</button>
                <button disabled={isSubmitting} onClick={handleCreateNestedCourse} className="h-12 w-full bg-primary-500 text-white font-bold rounded-xl text-xs   hover:bg-primary-600 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
               {isSubmitting ? "Processing..." : "Add Nested Course"}
            </button>
             </div>
          </div>
        </div>
      )}



      {/* Edit Course Modal */}
      {activeModal === 'editCourse' && selectedCourse && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-all" onClick={() => setActiveModal('none')}>
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
             <div className="flex items-center justify-between mb-6 text-left">
                <div>
                   <h3 className="text-xl font-bold text-secondary-900 tracking-tight leading-none text-left">Edit Module</h3>
                   <p className="text-sm font-medium text-slate-400 mt-2 text-left">Update details for this training module.</p>
                </div>
                <button onClick={() => setActiveModal('none')} className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                   <X size={18} />
                </button>
             </div>
             <div className="space-y-4 mb-8 text-left">
                <div className="space-y-2">
                   <label className="text-[11px] font-bold text-slate-400   ml-1">Module Title</label>
                   <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 h-12 text-sm font-bold text-secondary-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 outline-none transition-all" />
                </div>
                <div className="space-y-2 text-left">
                   <label className="text-[11px] font-bold text-slate-400   ml-1">Module Thumbnail</label>
                   <div className="flex items-center gap-4">
                      {formThumbnailUrl ? (
                        <div className="h-24 w-40 rounded-xl overflow-hidden border border-slate-200 relative group">
                           <img src={formThumbnailUrl} className="w-full h-full object-cover" />
                           <button 
                             onClick={() => setFormThumbnailUrl('')}
                             className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold text-[11px]  "
                           >
                             Remove
                           </button>
                        </div>
                      ) : (
                        <label className="flex-1 h-24 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-primary-500 hover:bg-primary-50/10 transition-all cursor-pointer">
                           <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                           {isUploading ? (
                              <div className="h-5 w-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                           ) : (
                              <>
                                <Upload size={20} className="text-slate-400" />
                                <span className="text-[11px] font-bold text-slate-400  ">Upload Module Thumbnail</span>
                              </>
                           )}
                        </label>
                      )}
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-left">
                   <CustomDropdown 
                     label="Level"
                     value={formLevel}
                     onChange={setFormLevel}
                     options={[
                       { id: 'Beginner', label: 'Beginner', icon: <BarChart size={14} /> },
                       { id: 'Intermediate', label: 'Intermediate', icon: <Book size={14} /> },
                       { id: 'Advanced', label: 'Advanced', icon: <Star size={14} /> },
                     ]}
                   />
                   <CustomDropdown 
                     label="Access Tier"
                     value={formTier}
                     onChange={setFormTier}
                     options={[
                       { id: 'Basic', label: 'Basic', icon: <Zap size={14} /> },
                       { id: 'Professional', label: 'Professional', icon: <Gem size={14} /> },
                       { id: 'Elite', label: 'Elite', icon: <Crown size={14} /> },
                     ]}
                   />
                </div>
             </div>
             <div className="flex gap-4">
                <button onClick={() => setActiveModal('none')} className="flex-1 py-3.5 bg-slate-50 hover:bg-slate-100 text-secondary-900 border border-slate-200 font-bold rounded-xl text-xs   transition-all">Cancel</button>
                <button disabled={isSubmitting} onClick={handleEditCourse} className="h-12 w-full bg-secondary-900 text-white font-bold rounded-xl text-xs   hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
               {isSubmitting ? "Processing..." : "Save Changes"}
            </button>
             </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {activeModal === 'deleteCourse' && selectedCourse && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-all" onClick={() => setActiveModal('none')}>
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
             <div className="h-14 w-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 border border-red-100 mx-auto">
                <Trash2 size={24} />
             </div>
             <h3 className="text-xl font-bold text-secondary-900 tracking-tight leading-none mb-2">Delete Course</h3>
             <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">Are you sure you want to permanently delete <strong>"{selectedCourse.title}"</strong>? This action cannot be undone.</p>
             <div className="flex gap-4">
                <button onClick={() => setActiveModal('none')} className="flex-1 py-3.5 bg-slate-50 hover:bg-slate-100 text-secondary-900 border border-slate-200 font-bold rounded-xl text-xs   transition-all">Cancel</button>
                <button disabled={isSubmitting} onClick={handleDeleteCourse} className="h-12 w-full bg-red-500 text-white font-bold rounded-xl text-xs   hover:bg-red-600 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
               {isSubmitting ? "Processing..." : "Permanently Delete"}
            </button>
             </div>
          </div>
        </div>
      )}

      {/* Archive Confirmation Modal */}
      {activeModal === 'archiveCourse' && selectedCourse && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-all" onClick={() => setActiveModal('none')}>
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
             <div className="h-14 w-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-6 border border-orange-100 mx-auto">
                <Archive size={24} />
             </div>
             <h3 className="text-xl font-bold text-secondary-900 tracking-tight leading-none mb-2">Archive Course</h3>
             <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">Are you sure you want to archive <strong>"{selectedCourse.title}"</strong>? Users will no longer be able to see this course until it is unarchived.</p>
             <div className="flex gap-4">
                <button onClick={() => setActiveModal('none')} className="flex-1 py-3.5 bg-slate-50 hover:bg-slate-100 text-secondary-900 border border-slate-200 font-bold rounded-xl text-xs   transition-all">Cancel</button>
                <button disabled={isSubmitting} onClick={handleArchiveCourse} className="h-12 w-full bg-orange-500 text-white font-bold rounded-xl text-xs   hover:bg-orange-600 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
               {isSubmitting ? "Processing..." : "Archive Module"}
            </button>
             </div>
          </div>
        </div>
      )}

    </>
  )
}
