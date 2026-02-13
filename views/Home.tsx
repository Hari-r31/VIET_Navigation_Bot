
import React from 'react';
import { Map, GraduationCap, ArrowRight, Info, Users, Award, Globe, Sparkles, Code, School, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 h-full animate-in fade-in duration-500">
      
      {/* 1. Hero / Welcome Message */}
      <div className="flex-shrink-0 text-center py-2 md:py-6">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
          Interactive <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Campus Guide</span>
        </h1>
        <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto flex items-center justify-center gap-2">
           <Sparkles size={20} className="text-yellow-500 fill-yellow-500" />
           Touch or speak to navigate
        </p>
      </div>

      {/* 2. Primary Actions (Directions & Fees) */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
        
        {/* Directions Card - Primary Action */}
        <button 
          onClick={() => navigate('/directions')}
          className="relative overflow-hidden rounded-3xl bg-blue-600 text-white p-10 text-left group shadow-xl hover:shadow-2xl hover:bg-blue-700 transition-all flex flex-col justify-between"
        >
          {/* Decor */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="absolute right-8 bottom-8 opacity-20 group-hover:scale-110 transition-transform duration-500">
             <Map size={180} />
          </div>
          
          <div className="relative z-10">
            <div className="bg-white/20 w-20 h-20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner mb-6">
               <Map size={40} className="text-white" />
            </div>
            <h2 className="text-5xl font-bold mb-4 tracking-tight">Directions</h2>
            <p className="text-blue-100 text-xl font-medium max-w-sm leading-relaxed">
              Find classrooms, labs, HOD cabins, and amenities in the Main Campus.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 font-bold uppercase tracking-wider text-base mt-8 bg-black/20 w-fit px-6 py-3 rounded-full hover:bg-black/30 transition-colors">
             Start Navigation <ChevronRight size={20} />
          </div>
        </button>

        {/* Fees Card - Secondary Action */}
        <button 
          onClick={() => navigate('/fees')}
          className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 text-slate-900 p-10 text-left group shadow-xl hover:shadow-2xl hover:border-emerald-400 transition-all flex flex-col justify-between"
        >
          {/* Decor */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="absolute right-8 bottom-8 opacity-5 group-hover:scale-110 transition-transform duration-500 text-emerald-900">
             <GraduationCap size={180} />
          </div>

          <div className="relative z-10">
            <div className="bg-emerald-100 w-20 h-20 rounded-2xl flex items-center justify-center text-emerald-700 shadow-sm mb-6">
               <GraduationCap size={40} />
            </div>
            <h2 className="text-5xl font-bold mb-4 tracking-tight">Fee Info</h2>
            <p className="text-slate-500 text-xl font-medium max-w-sm leading-relaxed">
              Check tuition and development fees for B.Tech, MBA, and Diploma.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 font-bold uppercase tracking-wider text-base mt-8 text-emerald-700 bg-emerald-50 w-fit px-6 py-3 rounded-full group-hover:bg-emerald-100 transition-colors">
             Check Structure <ChevronRight size={20} />
          </div>
        </button>
      </div>

      {/* 3. Info Section (College, Project, Team) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-shrink-0 mt-2">
        
        {/* College Profile */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col gap-3 group hover:border-indigo-300 transition-colors">
          <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase text-xs tracking-wider mb-1">
             <School size={16} /> Institute Profile
          </div>
          <h3 className="text-xl font-bold text-slate-900 leading-tight">Visakha Institute of Engineering & Technology</h3>
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
             NAAC 'A' Grade • Autonomous • AICTE Approved • Affiliated to JNTUK.
             Empowering students with quality technical education since 2008 in Visakhapatnam.
          </p>
        </div>

        {/* About Project */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col gap-3 group hover:border-orange-300 transition-colors">
           <div className="flex items-center gap-2 text-orange-600 font-bold uppercase text-xs tracking-wider mb-1">
             <Info size={16} /> System Info
          </div>
          <h3 className="text-xl font-bold text-slate-900">Offline Smart Kiosk</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            v1.0 • Built with React & Speech API.
            Designed to work completely offline for reliable campus guidance without internet dependency.
          </p>
        </div>

        {/* Development Team */}
        <div className="bg-slate-900 rounded-2xl p-6 shadow-sm flex flex-col gap-3 text-white relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Code size={64} />
           </div>
           <div className="flex items-center gap-2 text-blue-400 font-bold uppercase text-xs tracking-wider mb-1 relative z-10">
             <Users size={16} /> Credits
          </div>
          <h3 className="text-xl font-bold relative z-10">Project Team</h3>
          <p className="text-slate-400 text-sm leading-relaxed relative z-10">
            Developed by Final Year <strong>ECE</strong> Students.
            <br/>
            <span className="text-xs opacity-70 mt-1 block">Batch of 2025</span>
          </p>
        </div>

      </div>

    </div>
  );
};

export default Home;
