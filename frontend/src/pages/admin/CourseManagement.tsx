import { Edit3, Trash2, Play, LayoutGrid, List, Plus, Search } from 'lucide-react'
import { useState } from 'react'

export default function CourseManagement() {
  const [viewMode, setViewMode] = useState('GRID')
  const [searchQuery, setSearchQuery] = useState('')

  return (
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
          <button className="h-12 px-8 bg-primary-500 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-primary-600 transition-all flex items-center gap-3 shadow-xl active:scale-95">
             <Plus size={18} /> Add Course
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
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Platform Inventory: 12 Modules</span>
         </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
         {[
           { id: 1, title: 'Surface Preparation Mastery', modules: 12, status: 'Published', img: 'https://images.unsplash.com/photo-1595841055318-502a55099399?auto=format&fit=crop&q=80&w=2070', tier: 'Professional' },
           { id: 2, title: 'Luxury Textured Portfolios', modules: 18, status: 'Draft', img: 'https://images.unsplash.com/photo-1589939705384-5185138a04b9?auto=format&fit=crop&q=80&w=2070', tier: 'Elite' },
           { id: 3, title: 'Color Mixology Theories', modules: 8, status: 'Published', img: 'https://images.unsplash.com/photo-1562259946-08c513d3042c?auto=format&fit=crop&q=80&w=2070', tier: 'Basic' },
         ].map((course) => (
           <div key={course.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-primary-100 transition-all flex flex-col group h-full">
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
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
                    <h3 className="text-base font-bold text-secondary-900 leading-tight group-hover:text-primary-500 transition-colors uppercase tracking-tight line-clamp-2">{course.title}</h3>
                 </div>
                 
                 <div className="pt-6 border-t border-slate-50 flex items-center gap-4">
                    <button className="flex-1 h-12 bg-secondary-900 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95">
                       Edit Course <Edit3 size={16} />
                    </button>
                    <button className="h-12 w-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-300 hover:text-red-500 hover:border-red-500 transition-all active:scale-95 shadow-sm">
                       <Trash2 size={18} />
                    </button>
                 </div>
              </div>
           </div>
          ))}

          {/* Add New Module Control */}
          <div className="border-2 border-dashed border-slate-100 bg-slate-50/50 hover:border-primary-500 hover:bg-white transition-all cursor-pointer flex flex-col items-center justify-center p-12 h-full min-h-[350px] rounded-3xl group shadow-sm">
             <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-primary-500 group-hover:text-white transition-all border border-slate-100 shadow-sm">
                <Plus size={32} strokeWidth={2.5} />
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-6 group-hover:text-secondary-900">Create New Module</p>
          </div>
      </div>

    </div>
  )
}
