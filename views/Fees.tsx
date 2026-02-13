
import React, { useState, useMemo } from 'react';
import { CircleDollarSign, GraduationCap, Users, Search, ChevronDown, ArrowLeft, BookOpen, School, Check } from 'lucide-react';
import { FEES } from '../data/mockData';
import { FeeStructure } from '../types';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Fees: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState<string>('B.Tech');
  const [selectedBranch, setSelectedBranch] = useState<string>('CSE');
  const [showResult, setShowResult] = useState<boolean>(false);

  // Memoize static list of courses
  const courses = useMemo(() => Array.from(new Set(FEES.map(f => f.course))), []);

  // Memoize branches based on selectedCourse to prevent unnecessary recalculations
  const branches = useMemo(() => 
    Array.from(new Set(FEES.filter(f => f.course === selectedCourse).map(f => f.branch))),
  [selectedCourse]);

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCourse = e.target.value;
    setSelectedCourse(newCourse);

    // Calculate valid branches for the new course immediately to update state in sync
    const nextBranches = Array.from(new Set(FEES.filter(f => f.course === newCourse).map(f => f.branch)));
    
    // Auto-select the first branch of the new course
    if (nextBranches.length > 0) {
      setSelectedBranch(nextBranches[0]);
    } else {
      setSelectedBranch('');
    }
    
    // Reset result view
    setShowResult(false);
  };

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedBranch(e.target.value);
      setShowResult(false);
  }

  const handleSearch = () => {
      setShowResult(true);
      toast.success("Details fetched!");
  }

  const feeData: FeeStructure | undefined = FEES.find(
    f => f.course === selectedCourse && f.branch === selectedBranch
  );

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-slate-900">
      
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
          <img 
            src="https://placehold.co/1920x1080/1e1b4b/312e81?text=University+Admission+Office" 
            alt="Admission Background" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-transparent to-slate-900/90"></div>
      </div>

      {/* Top Header Section - Compact */}
      <div className="relative z-10 flex-none p-4 pt-6 flex items-center justify-center">
          <div className="absolute left-4 top-6">
            <button 
                onClick={() => navigate('/')} 
                className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-xl border border-white/20 hover:bg-white/20 font-semibold transition-all group text-sm"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Home
            </button>
          </div>

          <div className="text-center">
              <div className="inline-flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-widest mb-1 opacity-80">
                 <School size={14} /> Academic Year 2025-26
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white shadow-black drop-shadow-md">Fee Structure</h1>
          </div>
      </div>

      {/* Main Content Container - Vertical Flex */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col items-center p-4 pb-20 w-full max-w-4xl mx-auto gap-4">
          
          {/* Top: Search Panel */}
          <div className="w-full bg-white rounded-3xl p-6 shadow-xl animate-in slide-in-from-top-4 duration-500 flex-none">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                  
                  {/* Course Select */}
                  <div className="flex-1 w-full">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 pl-1">Select Course</label>
                      <div className="relative">
                          <select
                              value={selectedCourse}
                              onChange={handleCourseChange}
                              className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-900 text-lg rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 font-bold transition-all"
                          >
                              {courses.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                      </div>
                  </div>

                  {/* Branch Select */}
                  <div className="flex-1 w-full">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 pl-1">Select Branch</label>
                      <div className="relative">
                          <select
                              value={selectedBranch}
                              onChange={handleBranchChange}
                              className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-900 text-lg rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 font-bold transition-all"
                          >
                              {branches.map(b => <option key={b} value={b}>{b}</option>)}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                      </div>
                  </div>

                  {/* Check Button */}
                  <button 
                      onClick={handleSearch}
                      className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold px-8 py-3 rounded-xl shadow-lg shadow-blue-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                      <Search size={20} /> Check
                  </button>
              </div>
          </div>

          {/* Bottom: Results Panel */}
          <div className="w-full flex-1 min-h-0 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-in slide-in-from-bottom-8 duration-500 relative flex flex-col">
              {showResult && feeData ? (
                  <div className="flex-1 overflow-y-auto p-6 md:p-8">
                      
                      {/* Result Header */}
                      <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg font-bold text-xs uppercase tracking-wide">{feeData.course}</span>
                                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg font-bold text-xs uppercase tracking-wide">{feeData.branch}</span>
                            </div>
                            <h2 className="text-3xl font-black text-slate-900">{feeData.description || `${feeData.course} - ${feeData.branch}`}</h2>
                        </div>
                        <div className="bg-green-100 text-green-700 p-2 rounded-full">
                            <Check size={24} />
                        </div>
                      </div>

                      {/* Result Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex flex-col items-center justify-center text-center">
                                <div className="bg-white p-3 rounded-full text-blue-600 mb-3 shadow-sm">
                                    <Users size={24} />
                                </div>
                                <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-widest">Total Seats</span>
                                <span className="text-4xl font-black text-slate-900 mt-1">{feeData.seats}</span>
                          </div>

                          <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 flex flex-col items-center justify-center text-center">
                                <div className="bg-white p-3 rounded-full text-emerald-600 mb-3 shadow-sm">
                                    <CircleDollarSign size={24} />
                                </div>
                                <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-widest">Annual Tuition Fee</span>
                                <span className="text-4xl font-black text-slate-900 mt-1">₹ {feeData.annualFee.toLocaleString('en-IN')}</span>
                          </div>
                      </div>

                      {/* Footer Note */}
                      <div className="bg-slate-50 rounded-xl p-4 text-center">
                          <p className="text-slate-500 text-sm">
                              * Fee includes tuition, library, and lab charges. Exam fees are separate.
                          </p>
                      </div>

                  </div>
              ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center opacity-50">
                      <BookOpen size={64} className="mb-4 text-slate-300" />
                      <p className="text-xl font-medium text-slate-500">Select course & branch to view fees</p>
                      <p className="text-sm mt-2">Details will appear here</p>
                  </div>
              )}
          </div>

      </div>
    </div>
  );
};

export default Fees;
