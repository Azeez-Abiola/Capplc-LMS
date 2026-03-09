import { Edit3, Trash2, Play, LayoutGrid, List, Plus } from 'lucide-react'
import { useState } from 'react'

export default function CourseManagement() {
  const [viewMode, setViewMode] = useState('GRID')

  return (
    <div className="space-y-8 animate-slide-up pb-10">
      
      {/* ── HEADER SECTION ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-secondary-500 uppercase tracking-widest leading-none">Curriculum Editor</h1>
          <p className="text-slate-500 text-sm font-medium">Platform Module Inventory • Configuration & Access Logic Management</p>
        </div>
        <div className="flex p-1 bg-slate-100/50 rounded-lg border border-slate-100">
           {['GRID', 'LIST'].map((mode) => (
             <button 
               key={mode} 
               onClick={() => setViewMode(mode)}
               className={`px-4 py-2 rounded-md transition-all ${viewMode === mode ? 'bg-white text-primary-500 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-secondary-500'}`}
             >
               {mode === 'GRID' ? <LayoutGrid size={16} /> : <List size={16} />}
             </button>
           ))}
        </div>
      </div>

      {/* ── COURSE GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {[
           { id: 1, title: 'Surface Preparation Mastery', modules: 12, status: 'Published', img: 'https://images.unsplash.com/photo-1595841055318-502a55099399?auto=format&fit=crop&q=80&w=2070', tier: 'PRO' },
           { id: 2, title: 'Luxury Textured Portfolios', modules: 18, status: 'Draft', img: 'https://images.unsplash.com/photo-1589939705384-5185138a04b9?auto=format&fit=crop&q=80&w=2070', tier: 'ELITE' },
           { id: 3, title: 'Color Mixology Theories', modules: 8, status: 'Published', img: 'https://images.unsplash.com/photo-1562259946-08c513d3042c?auto=format&fit=crop&q=80&w=2070', tier: 'BASIC' },
         ].map((course) => (
           <div key={course.id} className="group flex flex-col items-start h-full">
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-slate-100 mb-4 cursor-pointer">
                <img src={course.img} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-300" />
                
                {/* Absolute Overlays */}
                <div className="absolute top-3 right-3">
                   <div className={`px-2 py-1 ${course.status === 'Published' ? 'bg-green-500' : 'bg-amber-500'} text-white rounded text-[8px] font-bold uppercase tracking-widest shadow-lg`}>
                      {course.status}
                   </div>
                </div>

                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                   <div className="h-9 w-9 bg-primary-500 text-white rounded flex items-center justify-center shadow-lg border border-white/20">
                      <Play size={18} fill="currentColor" />
                   </div>
                   <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded text-[8px] font-bold text-secondary-500 uppercase tracking-widest border border-slate-200">
                      {course.tier} ACCESS
                   </div>
                </div>
              </div>

              {/* Course Meta */}
              <div className="w-full flex-1 px-1 flex flex-col justify-between">
                 <div className="space-y-2">
                    <div className="flex items-center gap-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                       <span>{course.modules} MODULES INSTALLED</span>
                       <span className="h-1 w-1 bg-slate-200 rounded-full" />
                       <span>MODIFIED MAR 2026</span>
                    </div>
                    <h3 className="text-base font-bold text-secondary-500 leading-snug tracking-tight mb-4 uppercase">{course.title}</h3>
                 </div>
                 
                 <div className="pt-4 border-t border-slate-100 flex items-center gap-2 w-full">
                    <button className="flex-1 py-3 bg-secondary-900 text-white font-bold rounded text-[9px] uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 shadow-sm">
                       EDIT CURRICULUM <Edit3 size={14} />
                    </button>
                    <button className="h-10 w-10 bg-white border border-slate-200 rounded flex items-center justify-center text-slate-300 hover:text-red-500 hover:border-red-200 transition-all">
                       <Trash2 size={16} />
                    </button>
                 </div>
              </div>
           </div>
         ))}

         {/* New Content Trigger */}
         <div className="bento-card group border-2 border-dashed border-slate-200 hover:border-primary-500 hover:bg-slate-50 transition-all cursor-pointer flex flex-col items-center justify-center p-10 h-full min-h-[300px] border-spacing-4 rounded-lg">
            <div className="h-12 w-12 bg-slate-50 rounded flex items-center justify-center text-slate-300 group-hover:bg-primary-500 group-hover:text-white transition-all border border-slate-100 shadow-sm">
               <Plus size={24} strokeWidth={3} />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] pt-4 group-hover:text-secondary-500 transition-colors">Initialize New Workshop</p>
         </div>
      </div>

    </div>
  )
}
