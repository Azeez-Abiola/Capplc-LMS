import { Upload, FilePlay, FileText, Info, CheckCircle2, X, ChevronRight } from 'lucide-react'
import { useState } from 'react'

export default function ContentUpload() {
  const [activeTab, setActiveTab] = useState('MODULE')

  return (
    <div className="space-y-8 animate-slide-up pb-10">
      
      {/* ── HEADER SECTION ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-secondary-500 uppercase tracking-widest leading-none">Workshop Uploader</h1>
          <p className="text-slate-500 text-sm font-medium">Deployment Engine • Administrative Content Management Portal</p>
        </div>
        <div className="flex p-1 bg-slate-100/50 rounded-lg border border-slate-100">
           {['MODULE', 'RESOURCE', 'QUIZ'].map((tab) => (
             <button 
               key={tab} 
               onClick={() => setActiveTab(tab)}
               className={`px-4 py-2 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-primary-500 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-secondary-500'}`}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      {/* ── LAYOUT ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
         
         {/* Metadata Form Area */}
         <div className="xl:col-span-7 space-y-8">
            <div className="bento-card p-8 space-y-8 bg-white">
               <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
                  <div className="h-10 w-10 bg-primary-500 text-white rounded flex items-center justify-center shadow-md">
                    <FilePlay size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-secondary-500 uppercase tracking-widest leading-none">Workshop Metadata Entry</h3>
               </div>
               
               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">WORKSHOP NOMENCLATURE</label>
                     <input type="text" placeholder="e.g. ADVANCED TEXTURE DEPLOYMENT PART 1" className="w-full bg-slate-50/50 border border-slate-200 rounded-md py-4 px-6 text-sm font-bold text-secondary-500 outline-none focus:ring-2 focus:ring-primary-100 transition-all placeholder:text-slate-200" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">TIER PRIVILEGE</label>
                        <select className="w-full bg-slate-50/50 border border-slate-200 rounded-md py-4 px-6 text-sm font-bold text-secondary-500 outline-none focus:ring-2 focus:ring-primary-100 transition-all uppercase appearance-none cursor-pointer">
                           <option>PRO & ABOVE</option>
                           <option>ELITE ONLY</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">MASTERY LEVEL</label>
                        <select className="w-full bg-slate-50/50 border border-slate-200 rounded-md py-4 px-6 text-sm font-bold text-secondary-500 outline-none focus:ring-2 focus:ring-primary-100 transition-all uppercase appearance-none cursor-pointer">
                           <option>BEGINNER</option>
                           <option>INTERMEDIATE</option>
                           <option>ADVANCED (MASTERY)</option>
                        </select>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">TECHNICAL DESCRIPTION</label>
                     <textarea rows={6} placeholder="Define workshop technical objectives and learning outcomes..." className="w-full bg-slate-50/50 border border-slate-200 rounded-md py-5 px-6 text-sm font-bold text-secondary-500 outline-none focus:ring-2 focus:ring-primary-100 transition-all placeholder:text-slate-200 resize-none font-sans"></textarea>
                  </div>
               </div>
            </div>
         </div>

         {/* Asset Processing Sidebar */}
         <div className="xl:col-span-5 space-y-8">
            
            {/* Asset Drop Field */}
            <div className="bento-card p-1 bg-secondary-900 border-none group relative overflow-hidden">
               <div className="p-10 text-center space-y-6 relative z-10">
                  <div className="h-16 w-16 bg-white/10 text-primary-500 rounded flex items-center justify-center mx-auto border border-white/10 shadow-xl transition-transform group-hover:scale-105">
                     <Upload size={28} />
                  </div>
                  <div className="space-y-1">
                     <h4 className="text-xl font-bold text-white tracking-tighter uppercase leading-none">Import Media Assets</h4>
                     <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest pt-2">MP4/PDF ARCHIVES • SYSTEM THRESHOLD: 2GB</p>
                  </div>
                  <button className="w-full py-4 bg-white text-secondary-500 font-bold rounded text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all shadow-lg">
                     LOCATE LOCAL FILES
                  </button>
               </div>
               <div className="absolute inset-0 bg-primary-500/5 group-hover:bg-primary-500/10 transition-colors pointer-events-none" />
            </div>

            {/* Processing Queue */}
            <div className="bento-card p-6 space-y-6 bg-white">
               <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                  <h3 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Processing Pipeline (02)</h3>
                  <div className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse shadow-[0_0_8px_rgba(242,111,33,0.6)]" />
               </div>
               <div className="space-y-3">
                  <AssetQueueItem name="mastery_finishes_hq.mp4" size="1.2 GB" />
                  <AssetQueueItem name="safety_protocols_guide.pdf" size="4.8 MB" />
               </div>
               <div className="pt-4 grid grid-cols-2 gap-3">
                  <button className="py-3.5 bg-primary-500 text-white font-bold rounded text-[10px] uppercase tracking-widest hover:bg-primary-600 shadow-md transition-all flex items-center justify-center gap-2">
                     PUBLISH STREAM <ChevronRight size={14} />
                  </button>
                  <button className="py-3.5 bg-slate-50 text-slate-400 font-bold rounded border border-slate-200 text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all">
                     FLUSH QUEUE
                  </button>
               </div>
            </div>

            {/* Quality Standard Info */}
            <div className="bento-card p-5 bg-slate-50/50 border-slate-200 flex items-start gap-4">
               <div className="h-10 w-10 bg-white text-primary-500 rounded border border-slate-200 flex items-center justify-center shadow-sm shrink-0">
                  <Info size={18} />
               </div>
               <div className="pt-0.5">
                  <p className="text-[11px] font-bold text-secondary-500 uppercase tracking-tight">System Integrity Scanner</p>
                  <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest leading-relaxed pt-1">All modules undergo automated technical validation before node distribution.</p>
               </div>
            </div>

         </div>

      </div>
    </div>
  )
}

function AssetQueueItem({ name, size }: { name: string; size: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded border border-slate-100 group transition-all hover:bg-white hover:border-primary-100">
       <div className="flex items-center gap-3 truncate">
          <div className="h-10 w-10 bg-white rounded border border-slate-200 flex items-center justify-center text-slate-300 shadow-sm shrink-0">
             {name.endsWith('.mp4') ? <FilePlay size={16} /> : <FileText size={16} />}
          </div>
          <div className="truncate">
             <p className="text-[11px] font-bold text-secondary-500 uppercase tracking-tight truncate">{name}</p>
             <p className="text-[9px] font-bold text-slate-300 uppercase pt-0.5">{size}</p>
          </div>
       </div>
       <div className="flex items-center gap-3 shrink-0">
          <CheckCircle2 size={16} className="text-green-500" />
          <button className="text-slate-200 hover:text-red-500 transition-colors"><X size={16} /></button>
       </div>
    </div>
  )
}
