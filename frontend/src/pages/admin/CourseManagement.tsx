import { Edit3, Trash2, Play, LayoutGrid, List, Plus, Search, Archive, X, BarChart, Book, Star, Zap, Gem, Crown } from 'lucide-react'
import LogoLoader from '../../components/ui/LogoLoader'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import CustomDropdown from '../../components/ui/CustomDropdown'
import { courseService } from '../../services/courseService'

type ModalType = 'none' | 'addModule' | 'addCourse' | 'editCourse' | 'deleteCourse' | 'archiveCourse' | 'viewCourses'

export default function CourseManagement() {
  const [viewMode, setViewMode] = useState('GRID')
  const [searchQuery, setSearchQuery] = useState('')
  const [courses, setCourses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeModal, setActiveModal] = useState<ModalType>('none')
  const [selectedCourse, setSelectedCourse] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formTitle, setFormTitle] = useState('')
  const [formLevel, setFormLevel] = useState('Beginners')
  const [formTier, setFormTier] = useState('Basic')
  const [formDescription, setFormDescription] = useState('')
  const [formDuration, setFormDuration] = useState('')
  const [formVideoUrl, setFormVideoUrl] = useState('')

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
    setFormLevel('Beginners')
    setFormTier('Basic')
    setFormDescription('')
    setSelectedCourse(null)
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
        status: c.status === 'published' ? 'Published' : 'Draft',
        img: c.thumbnail_url || 'https://images.unsplash.com/photo-1595841055318-502a55099399?auto=format&fit=crop&q=80&w=2070',
        tier: c.tier_access || 'Basic',
        level: c.level || 'Beginners',
        archived: !!c.archived_at
      })))
    } catch (error) {
      toast.error('Failed to load courses')
    } finally {
      setIsLoading(false)
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
        // @ts-ignore
        level: formLevel,
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
        video_url: formVideoUrl
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
        // @ts-ignore
        level: formLevel
      } as any)
      toast.success('Course updated successfully!')
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
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 tracking-tight leading-none">Course Repository</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Manage training curriculum and educational content.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex p-1 bg-slate-100/50 rounded-xl border border-slate-100">
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
            <button onClick={() => { resetForm(); setActiveModal('addModule'); }} className="h-12 px-8 bg-primary-500 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-primary-600 transition-all flex items-center gap-3 shadow-xl active:scale-95">
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
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Platform Inventory: {filteredCourses.length} Courses</span>
           </div>
        </div>

        {/* Content grouped by level */}
        {Object.entries(groupedCourses).map(([level, levelCourses]) => (
          <div key={level} className="space-y-6 text-left">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <h2 className="text-lg font-bold text-secondary-900 tracking-tight">{level} Level</h2>
                   <span className="bg-primary-50 text-primary-500 border border-primary-100 text-[9px] font-bold px-3 py-1 rounded-lg uppercase tracking-widest">{levelCourses.length} Courses</span>
                </div>
             </div>

              <div className={viewMode === 'GRID' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-4"}>
                {levelCourses.map((course) => (
                  viewMode === 'GRID' ? (
                  <div key={course.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-primary-100 transition-all flex flex-col group h-full">
                     <div className="relative aspect-video w-full overflow-hidden bg-slate-100 cursor-pointer" onClick={() => { setSelectedCourse(course); setActiveModal('viewCourses'); }}>
                       <img src={course.img} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                       <div className="absolute inset-0 bg-secondary-900/10 group-hover:bg-secondary-900/40 transition-colors duration-300" />
                       
                       <div className="absolute top-4 right-4">
                          <span className={`px-3 py-1.5 rounded-lg ${course.status === 'Published' ? 'bg-green-500' : 'bg-primary-500'} text-white text-[9px] font-bold uppercase tracking-widest shadow-xl`}>
                             {course.status}
                          </span>
                       </div>

                       <div className="absolute bottom-4 left-4 flex items-center gap-3">
                          <div className="h-10 w-10 bg-white text-secondary-900 rounded-xl flex items-center justify-center shadow-xl border border-white/20 group-hover:scale-110 transition-transform">
                             <Play size={18} fill="currentColor" />
                          </div>
                          <div className="px-3 py-1.5 bg-white backdrop-blur-md rounded-lg text-[9px] font-bold text-secondary-900 border border-slate-200 uppercase tracking-widest shadow-sm">
                             {course.tier} Access
                          </div>
                       </div>
                     </div>

                     <div className="p-8 flex-1 flex flex-col justify-between space-y-8">
                        <div className="space-y-4">
                           <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              <span>{course.modules} Modules</span>
                              <span className="h-1 w-1 bg-slate-200 rounded-full" />
                              <span>Standard Curriculum</span>
                           </div>
                           <h3 className="text-base font-bold text-secondary-900 leading-tight group-hover:text-primary-500 transition-colors uppercase tracking-tight line-clamp-2 cursor-pointer" onClick={() => { setSelectedCourse(course); setActiveModal('viewCourses'); }}>{course.title}</h3>
                        </div>
                        
                        <div className="pt-6 border-t border-slate-50 flex items-center gap-2">
                           <button onClick={() => { setSelectedCourse(course); setFormTitle(''); setFormDescription(''); setFormDuration(''); setFormVideoUrl(''); setActiveModal('addCourse'); }} className="h-12 w-12 bg-green-50 hover:bg-green-100 text-green-600 font-bold rounded-xl flex items-center justify-center transition-all shadow-sm">
                              <Plus size={20} />
                           </button>
                           <button onClick={() => openEdit(course)} className="flex-1 h-12 bg-secondary-900 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95">
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
                          <div className="h-16 w-24 rounded-lg overflow-hidden bg-slate-100 border border-slate-100 cursor-pointer" onClick={() => { setSelectedCourse(course); setActiveModal('viewCourses'); }}>
                             <img src={course.img} className="w-full h-full object-cover" />
                          </div>
                          <div>
                             <h4 className="text-sm font-bold text-secondary-900 group-hover:text-primary-500 transition-colors cursor-pointer" onClick={() => { setSelectedCourse(course); setActiveModal('viewCourses'); }}>{course.title}</h4>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{course.modules} Modules · {course.tier} Access</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <span className={`px-3 py-1.5 rounded-lg ${course.status === 'Published' ? 'bg-green-50 text-green-500 border-green-100' : 'bg-primary-50 text-primary-500 border-primary-100'} text-[9px] font-bold uppercase tracking-widest`}>
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
                <div onClick={() => { resetForm(); setActiveModal('addModule'); }} className="border-2 border-dashed border-slate-100 bg-slate-50/50 hover:border-primary-500 hover:bg-white transition-all cursor-pointer flex flex-col items-center justify-center p-12 h-full min-h-[350px] rounded-3xl group shadow-sm">
                   <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-primary-500 group-hover:text-white transition-all border border-slate-100 shadow-sm">
                      <Plus size={32} strokeWidth={2.5} />
                   </div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-6 group-hover:text-secondary-900">Add New Module</p>
                </div>
             </div>
          </div>
        ))}

        {filteredCourses.length === 0 && (
          <div className="py-24 bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-3xl text-center space-y-4">
             <p className="text-sm font-bold text-secondary-900 uppercase tracking-widest">No courses found</p>
             <p className="text-xs font-medium text-slate-400">Try adjusting your search.</p>
          </div>
        )}
      </div>

      {/* ===== MODALS (RENDERED OUTSIDE ANIMATED DIV FOR PERFECT CENTERING) ===== */}

      {/* Add Module Modal */}
      {activeModal === 'addModule' && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setActiveModal('none')}>
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
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Module Title *</label>
                   <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="e.g. Advanced Paint Techniques" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 h-12 text-sm font-bold text-secondary-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 outline-none transition-all placeholder:text-slate-300" />
                </div>
                <div className="space-y-2 text-left">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Description</label>
                   <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Brief description of the module content..." rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-secondary-900 focus:bg-white focus:border-primary-500 outline-none transition-all placeholder:text-slate-300 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-left">
                   <CustomDropdown 
                     label="Level"
                     value={formLevel}
                     onChange={setFormLevel}
                     options={[
                       { id: 'Beginners', label: 'Beginners', icon: <BarChart size={14} /> },
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
                <button onClick={() => setActiveModal('none')} className="flex-1 py-3.5 bg-slate-50 hover:bg-slate-100 text-secondary-900 border border-slate-200 font-bold rounded-xl text-xs uppercase tracking-widest transition-all">Cancel</button>
                <button disabled={isSubmitting} onClick={handleCreateTopLevel} className="h-12 w-full bg-secondary-900 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
               {isSubmitting ? "Processing..." : "Create Module"}
            </button>
             </div>
          </div>
        </div>
      )}

      {/* Add Nested Course Modal */}
      {activeModal === 'addCourse' && selectedCourse && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setActiveModal('none')}>
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
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Course Title *</label>
                   <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="e.g. Mixing Colors 101" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 h-12 text-sm font-bold text-secondary-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 outline-none transition-all placeholder:text-slate-300" />
                </div>
                <div className="space-y-2 text-left">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Vimeo Embed URL</label>
                   <input type="text" value={formVideoUrl} onChange={(e) => setFormVideoUrl(e.target.value)} placeholder="https://player.vimeo.com/video/..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 h-12 text-sm font-bold text-secondary-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 outline-none transition-all placeholder:text-slate-300" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-left">
                   <div className="space-y-2 text-left">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Duration</label>
                      <input type="text" value={formDuration} onChange={(e) => setFormDuration(e.target.value)} placeholder="e.g. 15 mins" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 h-12 text-sm font-bold text-secondary-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 outline-none transition-all placeholder:text-slate-300" />
                   </div>
                </div>
                <div className="space-y-2 text-left">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Description</label>
                   <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Brief description..." rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-secondary-900 focus:bg-white focus:border-primary-500 outline-none transition-all placeholder:text-slate-300 resize-none" />
                </div>
             </div>
             <div className="flex gap-4">
                <button onClick={() => setActiveModal('none')} className="flex-1 py-3.5 bg-slate-50 hover:bg-slate-100 text-secondary-900 border border-slate-200 font-bold rounded-xl text-xs uppercase tracking-widest transition-all">Cancel</button>
                <button disabled={isSubmitting} onClick={handleCreateNestedCourse} className="h-12 w-full bg-primary-500 text-white font-bold rounded-xl text-xs uppercase tracking-[0.2em] hover:bg-primary-600 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
               {isSubmitting ? "Processing..." : "Add Nested Course"}
            </button>
             </div>
          </div>
        </div>
      )}



      {/* Edit Course Modal */}
      {activeModal === 'editCourse' && selectedCourse && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setActiveModal('none')}>
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
             <div className="flex items-center justify-between mb-6 text-left">
                <div>
                   <h3 className="text-xl font-bold text-secondary-900 tracking-tight leading-none text-left">Edit Course</h3>
                   <p className="text-sm font-medium text-slate-400 mt-2 text-left">Update details for this course.</p>
                </div>
                <button onClick={() => setActiveModal('none')} className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                   <X size={18} />
                </button>
             </div>
             <div className="space-y-4 mb-8 text-left">
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Course Title</label>
                   <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 h-12 text-sm font-bold text-secondary-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 outline-none transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-left">
                   <CustomDropdown 
                     label="Level"
                     value={formLevel}
                     onChange={setFormLevel}
                     options={[
                       { id: 'Beginners', label: 'Beginners', icon: <BarChart size={14} /> },
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
                <button onClick={() => setActiveModal('none')} className="flex-1 py-3.5 bg-slate-50 hover:bg-slate-100 text-secondary-900 border border-slate-200 font-bold rounded-xl text-xs uppercase tracking-widest transition-all">Cancel</button>
                <button disabled={isSubmitting} onClick={handleEditCourse} className="h-12 w-full bg-secondary-900 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
               {isSubmitting ? "Processing..." : "Save Changes"}
            </button>
             </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {activeModal === 'deleteCourse' && selectedCourse && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setActiveModal('none')}>
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
             <div className="h-14 w-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 border border-red-100 mx-auto">
                <Trash2 size={24} />
             </div>
             <h3 className="text-xl font-bold text-secondary-900 tracking-tight leading-none mb-2">Delete Course</h3>
             <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">Are you sure you want to permanently delete <strong>"{selectedCourse.title}"</strong>? This action cannot be undone.</p>
             <div className="flex gap-4">
                <button onClick={() => setActiveModal('none')} className="flex-1 py-3.5 bg-slate-50 hover:bg-slate-100 text-secondary-900 border border-slate-200 font-bold rounded-xl text-xs uppercase tracking-widest transition-all">Cancel</button>
                <button disabled={isSubmitting} onClick={handleDeleteCourse} className="h-12 w-full bg-red-500 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
               {isSubmitting ? "Processing..." : "Permanently Delete"}
            </button>
             </div>
          </div>
        </div>
      )}

      {/* Archive Confirmation Modal */}
      {activeModal === 'archiveCourse' && selectedCourse && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setActiveModal('none')}>
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
             <div className="h-14 w-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-6 border border-orange-100 mx-auto">
                <Archive size={24} />
             </div>
             <h3 className="text-xl font-bold text-secondary-900 tracking-tight leading-none mb-2">Archive Course</h3>
             <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">Are you sure you want to archive <strong>"{selectedCourse.title}"</strong>? Users will no longer be able to see this course until it is unarchived.</p>
             <div className="flex gap-4">
                <button onClick={() => setActiveModal('none')} className="flex-1 py-3.5 bg-slate-50 hover:bg-slate-100 text-secondary-900 border border-slate-200 font-bold rounded-xl text-xs uppercase tracking-widest transition-all">Cancel</button>
                <button disabled={isSubmitting} onClick={handleArchiveCourse} className="h-12 w-full bg-orange-500 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
               {isSubmitting ? "Processing..." : "Archive Module"}
            </button>
             </div>
          </div>
        </div>
      )}

      {/* View Nested Courses Modal */}
      {activeModal === 'viewCourses' && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-900/40 backdrop-blur-sm p-4 animate-fade-in text-left">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up border border-slate-100">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white z-10">
               <div>
                  <h3 className="text-xl font-bold text-secondary-900 tracking-tight leading-none uppercase">{selectedCourse.title}</h3>
                  <p className="text-xs font-medium text-slate-500 mt-2 uppercase tracking-widest">Nested Curriculum</p>
               </div>
               <button onClick={() => setActiveModal('none')} className="h-10 w-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 transition-all shadow-sm shrink-0">
                 <X size={18} />
               </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-4 bg-slate-50/50">
               {selectedCourse.modulesList && selectedCourse.modulesList.length > 0 ? selectedCourse.modulesList.map((lesson: any, i: number) => {
                  let vimeoId = '';
                  if (lesson.video_url && lesson.video_url.includes('vimeo.com')) {
                      const parts = lesson.video_url.split('/');
                      vimeoId = parts[parts.length - 1];
                  }
                  
                  return (
                  <div key={i} className="flex gap-5 p-4 border border-slate-100 rounded-2xl bg-white shadow-sm items-center hover:border-primary-100 transition-colors group">
                     <div className="h-20 w-32 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 relative group-hover:shadow-md transition-all">
                        <img src={vimeoId ? `https://vumbnail.com/${vimeoId}.jpg` : 'https://images.unsplash.com/photo-1595841055318-502a55099399?auto=format&fit=crop&q=80&w=2070'} alt={lesson.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-secondary-900/20">
                           <Play size={16} fill="white" className="text-white drop-shadow-md" />
                        </div>
                     </div>
                     <div className="flex-1 space-y-2">
                        <h4 className="text-sm font-bold text-secondary-900 uppercase tracking-tight leading-snug">{lesson.title}</h4>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-50 px-2 py-1 rounded text-[9px] font-bold text-slate-500 uppercase tracking-widest border border-slate-100">{lesson.duration || '0'} Mins</span>
                        </div>
                     </div>
                  </div>
               )}) : (
                  <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No courses added yet</p>
                  </div>
               )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
