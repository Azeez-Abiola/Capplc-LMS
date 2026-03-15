import re

with open('frontend/src/pages/admin/CourseManagement.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update ModalType
content = content.replace(
    "type ModalType = 'none' | 'addModule' | 'addCourse' | 'editCourse' | 'deleteCourse' | 'archiveCourse'",
    "type ModalType = 'none' | 'addModule' | 'addCourse' | 'editCourse' | 'deleteCourse' | 'archiveCourse' | 'viewCourses'"
)

# 2. Add isSubmitting state
content = content.replace(
    "const [selectedCourse, setSelectedCourse] = useState<any>(null)",
    "const [selectedCourse, setSelectedCourse] = useState<any>(null)\n  const [isSubmitting, setIsSubmitting] = useState(false)"
)

# 3. Add modulesList mapping
content = content.replace(
    "modules: c.modules?.length || 0,",
    "modules: c.modules?.length || 0,\n        modulesList: c.modules || [],"
)

# 4. wrap async handlers with setIsSubmitting
funcs = [
    "handleCreateTopLevel", "handleCreateNestedCourse", "handleEditCourse", 
    "handleDeleteCourse", "handleArchiveCourse"
]

for func in funcs:
    pattern = r'(const ' + func + r' = async \(\) => \{[^{}]*(?:\{[^{}]*\}[^{}]*)*try \{)'
    replacement = r'\1\n      setIsSubmitting(true)'
    content = re.sub(pattern, replacement, content)
    
content = re.sub(r'(} catch \(error\) \{\n\s+toast\.error\(\'[^\']+\'\)\n\s+)\}(\n\s+const (?:handle|open))', r'\1} finally {\n      setIsSubmitting(false)\n    }\2', content)

content = content.replace("""    } catch (error) {
      toast.error('Failed to archive course')
    }
  }

  const openEdit =""", """    } catch (error) {
      toast.error('Failed to archive course')
    } py_placeholder_archive_finally
  }

  const openEdit =""".replace("py_placeholder_archive_finally", "} finally {\n      setIsSubmitting(false)\n    }"))

# 5. Disable buttons and update text with Loader2
content = re.sub(r'<button onClick=\{handleCreateTopLevel\}.*?>(.*?)</button>', r'<button disabled={isSubmitting} onClick={handleCreateTopLevel} className="h-12 w-full bg-secondary-900 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">\n               {isSubmitting ? "Processing..." : "Create Module"}\n            </button>', content)

content = re.sub(r'<button onClick=\{handleCreateNestedCourse\}.*?>(.*?)</button>', r'<button disabled={isSubmitting} onClick={handleCreateNestedCourse} className="h-12 w-full bg-primary-500 text-white font-bold rounded-xl text-xs uppercase tracking-[0.2em] hover:bg-primary-600 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">\n               {isSubmitting ? "Processing..." : "Add Nested Course"}\n            </button>', content)

content = re.sub(r'<button onClick=\{handleEditCourse\}.*?>(.*?)</button>', r'<button disabled={isSubmitting} onClick={handleEditCourse} className="h-12 w-full bg-secondary-900 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">\n               {isSubmitting ? "Processing..." : "Save Changes"}\n            </button>', content)

content = re.sub(r'<button onClick=\{handleDeleteCourse\}.*?>(.*?)</button>', r'<button disabled={isSubmitting} onClick={handleDeleteCourse} className="h-12 w-full bg-red-500 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">\n               {isSubmitting ? "Processing..." : "Permanently Delete"}\n            </button>', content)

content = re.sub(r'<button onClick=\{handleArchiveCourse\}.*?>(.*?)</button>', r'<button disabled={isSubmitting} onClick={handleArchiveCourse} className="h-12 w-full bg-orange-500 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">\n               {isSubmitting ? "Processing..." : "Archive Module"}\n            </button>', content)

# 6. Add onClick to image/title in grid to open viewCourses modal

content = content.replace("""<div className="relative aspect-video w-full overflow-hidden bg-slate-100">""", """<div className="relative aspect-video w-full overflow-hidden bg-slate-100 cursor-pointer" onClick={() => { setSelectedCourse(course); setActiveModal('viewCourses'); }}>""")

content = content.replace("""<h3 className="text-base font-bold text-secondary-900 leading-tight group-hover:text-primary-500 transition-colors uppercase tracking-tight line-clamp-2">{course.title}</h3>""", """<h3 className="text-base font-bold text-secondary-900 leading-tight group-hover:text-primary-500 transition-colors uppercase tracking-tight line-clamp-2 cursor-pointer" onClick={() => { setSelectedCourse(course); setActiveModal('viewCourses'); }}>{course.title}</h3>""")

# List view
content = content.replace("""<h4 className="text-sm font-bold text-secondary-900 group-hover:text-primary-500 transition-colors">{course.title}</h4>""", """<h4 className="text-sm font-bold text-secondary-900 group-hover:text-primary-500 transition-colors cursor-pointer" onClick={() => { setSelectedCourse(course); setActiveModal('viewCourses'); }}>{course.title}</h4>""")

content = content.replace("""<div className="h-16 w-24 rounded-lg overflow-hidden bg-slate-100 border border-slate-100">""", """<div className="h-16 w-24 rounded-lg overflow-hidden bg-slate-100 border border-slate-100 cursor-pointer" onClick={() => { setSelectedCourse(course); setActiveModal('viewCourses'); }}>""")

# 7. Add viewCourses Modal
modal_code = """
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
"""

# inject modal right before the final <> closure
content = content.replace("    </>\n  )\n}", modal_code + "    </>\n  )\n}")


with open('frontend/src/pages/admin/CourseManagement.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
