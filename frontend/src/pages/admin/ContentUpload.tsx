import { Upload, FilePlay, FileText, Info, CheckCircle2, X, ChevronRight } from 'lucide-react'
import { useState } from 'react'

export default function ContentUpload() {
  const [activeTab, setActiveTab] = useState('MODULE')

  return (
    <div className="space-y-10 animate-slide-up pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 text-left">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-secondary-900 leading-none group-hover:text-primary-500 transition-colors">Content Management</h1>
          <p className="text-slate-500 text-sm font-medium">Upload and manage educational modules and resources.</p>
        </div>
        <div className="flex p-1 bg-slate-100/50 rounded-xl border border-slate-100 shadow-sm">
           {['MODULE', 'RESOURCE', 'QUIZ'].map((tab) => (
             <button 
               key={tab} 
               onClick={() => setActiveTab(tab)}
               className={`px-5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-primary-500 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-secondary-900'}`}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      {/* Main Layout Area */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start text-left">
         
         {/* Information Form */}
         <div className="xl:col-span-7 space-y-10">
            <div className="bg-white border border-slate-100 rounded-3xl p-10 shadow-sm hover:shadow-xl transition-all space-y-10">
               <div className="flex items-center gap-4 border-b border-slate-50 pb-8">
                  <div className="h-12 w-12 bg-primary-500 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <FilePlay size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-secondary-900 uppercase tracking-widest leading-none">Primary Module Details</h3>
               </div>
               
               <div className="space-y-8">
                  <div className="space-y-3">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Module Title</label>
                     <input 
                        type="text" 
                        placeholder="e.g. Advanced Surface Techniques Part 1" 
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-4 px-6 text-sm font-bold text-secondary-900 outline-none focus:ring-4 focus:ring-primary-50 transition-all placeholder:text-slate-200 tracking-tight" 
                     />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Access Level</label>
                        <select className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-4 px-6 text-sm font-bold text-secondary-900 outline-none focus:ring-4 focus:ring-primary-50 transition-all uppercase appearance-none cursor-pointer tracking-tight">
                           <option>Professional Tier</option>
                           <option>Elite Tier Only</option>
                           <option>Public Resource</option>
                        </select>
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Curriculum Level</label>
                        <select className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-4 px-6 text-sm font-bold text-secondary-900 outline-none focus:ring-4 focus:ring-primary-50 transition-all uppercase appearance-none cursor-pointer tracking-tight">
                           <option>Foundational</option>
                           <option>Intermediate</option>
                           <option>Advanced Mastery</option>
                        </select>
                     </div>
                  </div>

                  <div className="space-y-3">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Detailed Description</label>
                     <textarea 
                        rows={6} 
                        placeholder="Define course objectives and technical learning outcomes..." 
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-5 px-6 text-sm font-bold text-secondary-900 outline-none focus:ring-4 focus:ring-primary-50 transition-all placeholder:text-slate-200 resize-none font-sans leading-relaxed"
                     ></textarea>
                  </div>
               </div>
            </div>
         </div>

         {/* Asset Management Sidebar */}
         <div className="xl:col-span-5 space-y-10">
            
            {/* Asset Drop Field */}
            <div className="bg-secondary-900 rounded-3xl overflow-hidden group relative shadow-xl transition-all hover:scale-[1.01]">
               <div className="p-12 text-center space-y-8 relative z-10">
                  <div className="h-16 w-16 bg-white/5 text-primary-500 rounded-2xl flex items-center justify-center mx-auto border border-white/10 shadow-2xl transition-transform group-hover:scale-110">
                     <Upload size={32} />
                  </div>
                  <div className="space-y-2">
                     <h4 className="text-xl font-bold text-white tracking-tight uppercase leading-none">Upload Media Assets</h4>
                     <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] pt-3">Video (MP4) • Portfolio (PDF) • Max: 2GB</p>
                  </div>
                  <button className="w-full py-4 bg-white text-secondary-900 font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-primary-500 hover:text-white transition-all shadow-xl active:scale-95">
                     BROWSE LOCAL FILES
                  </button>
               </div>
               <div className="absolute inset-0 bg-primary-500/5 group-hover:bg-primary-500/10 transition-colors pointer-events-none" />
               <div className="absolute bottom-0 left-0 h-1 w-full bg-primary-500/20">
                  <div className="h-full w-0 bg-primary-500 transition-all duration-500" />
               </div>
            </div>

            {/* Upload Queue Interface */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 space-y-8 shadow-sm hover:shadow-xl transition-all">
               <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">Processing Queue (02)</h3>
                  <div className="h-2 w-2 rounded-full bg-primary-500 animate-pulse shadow-sm" />
               </div>
               <div className="space-y-4">
                  <AssetQueueItem name="mastery_finishes_hq.mp4" size="1.2 GB" />
                  <AssetQueueItem name="safety_protocols_guide.pdf" size="4.8 MB" />
               </div>
               <div className="pt-6 grid grid-cols-2 gap-4">
                  <button className="py-4 bg-primary-500 text-white font-bold rounded-xl text-[10px] uppercase tracking-widest hover:bg-primary-600 shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95">
                     PUBLISH CONTENT <ChevronRight size={16} />
                  </button>
                  <button className="py-4 bg-slate-50 text-slate-400 font-bold rounded-xl border border-slate-100 text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all active:scale-95">
                     FLUSH QUEUE
                  </button>
               </div>
            </div>

            {/* Validation Info Box */}
            <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 flex items-start gap-5 shadow-sm">
               <div className="h-12 w-12 bg-white text-primary-500 rounded-2xl border border-slate-100 flex items-center justify-center shadow-sm shrink-0">
                  <Info size={22} />
               </div>
               <div className="pt-1 space-y-1">
                  <p className="text-[11px] font-bold text-secondary-900 uppercase tracking-tight">Automated Verification</p>
                  <p className="text-[10px] font-medium text-slate-400 leading-relaxed">All uploaded content undergoes technical validation before being distributed to the user network.</p>
               </div>
            </div>

         </div>

      </div>
    </div>
  )
}

function AssetQueueItem({ name, size }: { name: string; size: string }) {
  return (
    <div className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-50 group transition-all hover:bg-white hover:border-primary-100 shadow-sm">
       <div className="flex items-center gap-4 truncate">
          <div className="h-12 w-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-slate-300 shadow-inner shrink-0 group-hover:text-primary-500 transition-colors">
             {name.endsWith('.mp4') ? <FilePlay size={18} /> : <FileText size={18} />}
          </div>
          <div className="truncate space-y-1">
             <p className="text-[11px] font-bold text-secondary-900 uppercase tracking-tight truncate">{name}</p>
             <p className="text-[10px] font-bold text-slate-300 uppercase tabular-nums">{size}</p>
          </div>
       </div>
       <div className="flex items-center gap-4 shrink-0">
          <CheckCircle2 size={18} className="text-green-500" />
          <button className="text-slate-200 hover:text-red-500 transition-colors active:scale-90"><X size={18} /></button>
       </div>
    </div>
  )
}
