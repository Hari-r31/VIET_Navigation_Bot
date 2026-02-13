
import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, Clock, Footprints, Mic, ChevronRight, RotateCcw, ArrowLeft, ArrowRight, Building, Briefcase, GraduationCap, Coffee, Home, X, Users, BookOpen, Droplets } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useLocation, useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { searchLocations } from '../services/searchService';
import { LocationData, LocationCategory } from '../types';
import { LOCATIONS } from '../data/mockData';
import toast from 'react-hot-toast';
import VoiceSearchModal from '../components/VoiceSearchModal';

// Types for navigation state
interface NavState {
  block?: string;
  mainBlockSection?: 'administrative' | 'academic' | 'amenities';
  academicProgram?: 'B.Tech' | 'M.Tech';
  department?: string;
}

const Directions: React.FC = () => {
  const routerLoc = useLocation();
  const navigate = useNavigate();
  
  // Search State
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Hierarchical Browsing State
  const [navState, setNavState] = useState<NavState>({});
  
  // Final Selection
  const [selectedRoute, setSelectedRoute] = useState<LocationData | null>(null);

  // Initial Data processing
  useEffect(() => {
    if (routerLoc.state && (routerLoc.state as any).initialQuery) {
      const initQ = (routerLoc.state as any).initialQuery;
      const matches = searchLocations(initQ);
      if (matches.length > 0) {
        setSelectedRoute(matches[0]);
      } else {
        setQuery(initQ);
        handleSearch(initQ);
        toast.error("Location not found.");
      }
    }
  }, [routerLoc.state]);

  // Click outside handler to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (text: string) => {
    setQuery(text);
    setShowDropdown(true);
    if (text.trim() === '') {
      setSearchResults([]);
      return;
    }
    const matches = searchLocations(text);
    setSearchResults(matches);
  };

  const handleVoiceResult = (text: string) => {
      setQuery(text);
      handleSearch(text);
      const matches = searchLocations(text);
      if (matches.length > 0) {
          if (matches[0].name.toLowerCase() === text.toLowerCase()) {
              handleSelectLocation(matches[0]);
              toast.success(`Navigating to ${matches[0].name}`);
          } else {
              toast.success(`Found: ${text}`);
          }
      } else {
          toast.error("Could not find that location.");
      }
  };

  const handleSelectLocation = (loc: LocationData) => {
    setSelectedRoute(loc);
    setQuery('');
    setSearchResults([]);
    setShowDropdown(false);
  };

  const clearRoute = () => {
    setSelectedRoute(null);
    setQuery('');
    setSearchResults([]);
    setShowDropdown(false);
    setNavState({});
  };

  const resetNavigation = () => {
    setNavState({});
    setQuery('');
    setSearchResults([]);
    setShowDropdown(false);
  };

  const handleBack = () => {
    // 1. If viewing a specific route, go back to the list
    if (selectedRoute) {
      setSelectedRoute(null);
      return;
    }

    // 2. Hierarchical Navigation (Go up one level)
    if (navState.department) {
      setNavState(prev => ({ ...prev, department: undefined }));
      return;
    }

    if (navState.academicProgram) {
      setNavState(prev => ({ ...prev, academicProgram: undefined }));
      return;
    }

    if (navState.mainBlockSection) {
      setNavState(prev => ({ ...prev, mainBlockSection: undefined }));
      return;
    }

    if (navState.block) {
      setNavState(prev => ({ ...prev, block: undefined }));
      return;
    }

    // 3. If at root, go back in history
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  // --- Helpers to get data based on current state ---
  
  const getBTechDepartments = () => ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE'];
  const getMTechDepartments = () => ['CSE', 'ECE', 'VLSI', 'EPS', 'SE', 'TE', 'CAD', 'AIML'];

  const getLocationsForDept = (dept: string, program: string) => {
      return LOCATIONS.filter(l => 
        l.department === dept && 
        l.program === program && 
        l.block === 'Main Block'
      );
  };

  const getAdminLocations = () => LOCATIONS.filter(l => l.category === 'administrative' && l.block === 'Main Block');

  const getMainBlockAmenities = () => LOCATIONS.filter(l => l.block === 'Main Block' && l.category === 'amenity');

  // --- Render Helpers ---

  // 1. Root: Select Block
  const renderBlockSelection = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Main Block */}
      <button onClick={() => setNavState({ ...navState, block: 'Main Block' })} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 hover:border-blue-500 hover:shadow-blue-500/20 transition-all text-left group">
          <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors"><Building size={28} /></div>
          <h3 className="text-xl font-bold text-slate-900">Main Block</h3>
          <p className="text-slate-500 text-sm mt-1">Admin, B.Tech & M.Tech</p>
      </button>

      {/* Direct Blocks */}
      <button onClick={() => handleSelectLocation(LOCATIONS.find(l => l.id === 'mba-block')!)} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 hover:border-blue-500 hover:shadow-blue-500/20 transition-all text-left group">
          <div className="bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center text-purple-600 mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors"><Briefcase size={28} /></div>
          <h3 className="text-xl font-bold text-slate-900">MBA Block</h3>
          <p className="text-slate-500 text-sm mt-1">Direct Navigation</p>
      </button>

      <button onClick={() => handleSelectLocation(LOCATIONS.find(l => l.id === 'diploma-block')!)} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 hover:border-blue-500 hover:shadow-blue-500/20 transition-all text-left group">
          <div className="bg-orange-100 w-14 h-14 rounded-full flex items-center justify-center text-orange-600 mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors"><GraduationCap size={28} /></div>
          <h3 className="text-xl font-bold text-slate-900">Diploma Block</h3>
          <p className="text-slate-500 text-sm mt-1">Direct Navigation</p>
      </button>

      {/* Campus Facilities Group (formerly Amenities + Grounds) */}
      <button onClick={() => setNavState({...navState, block: 'Campus Facilities'})} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 hover:border-blue-500 hover:shadow-blue-500/20 transition-all text-left group">
          <div className="bg-yellow-100 w-14 h-14 rounded-full flex items-center justify-center text-yellow-600 mb-4 group-hover:bg-yellow-600 group-hover:text-white transition-colors"><Coffee size={28} /></div>
          <h3 className="text-xl font-bold text-slate-900">Campus Facilities</h3>
          <p className="text-slate-500 text-sm mt-1">Grounds, Canteen, Mess</p>
      </button>
    </div>
  );

  // 2. Facilities Selection (If Campus Facilities Block selected)
  const renderFacilitiesSelection = () => (
     <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-in slide-in-from-right-4 duration-500">
        <button onClick={() => handleSelectLocation(LOCATIONS.find(l => l.id === 'grounds')!)} className="bg-white p-6 rounded-2xl shadow-lg border hover:border-blue-500 group text-left">
            <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center text-green-600 mb-3 group-hover:bg-green-600 group-hover:text-white"><Footprints size={24}/></div>
            <h3 className="text-lg font-bold">College Ground</h3>
        </button>
        <button onClick={() => handleSelectLocation(LOCATIONS.find(l => l.id === 'canteen')!)} className="bg-white p-6 rounded-2xl shadow-lg border hover:border-blue-500 group text-left">
            <div className="bg-yellow-100 w-12 h-12 rounded-xl flex items-center justify-center text-yellow-600 mb-3 group-hover:bg-yellow-600 group-hover:text-white"><Coffee size={24}/></div>
            <h3 className="text-lg font-bold">Canteen</h3>
        </button>
        <button onClick={() => handleSelectLocation(LOCATIONS.find(l => l.id === 'mess')!)} className="bg-white p-6 rounded-2xl shadow-lg border hover:border-blue-500 group text-left">
            <div className="bg-orange-100 w-12 h-12 rounded-xl flex items-center justify-center text-orange-600 mb-3 group-hover:bg-orange-600 group-hover:text-white"><Coffee size={24}/></div>
            <h3 className="text-lg font-bold">Mess</h3>
        </button>
     </div>
  );

  // 3. Main Block: Section Selection
  const renderMainBlockSectionSelection = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-right-4 duration-500 max-w-4xl mx-auto">
        {/* Admin */}
        <button onClick={() => setNavState({ ...navState, mainBlockSection: 'administrative' })} className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200 hover:border-blue-500 transition-all text-left flex flex-col items-start gap-4 group h-full">
             <div className="bg-slate-100 p-4 rounded-full text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Briefcase size={32} />
             </div>
             <div>
                <h3 className="text-xl font-bold text-slate-900">Administration</h3>
                <p className="text-slate-500 text-sm mt-1">Principal, Office, Exam Cell</p>
             </div>
        </button>
        
        {/* Academic */}
        <button onClick={() => setNavState({ ...navState, mainBlockSection: 'academic' })} className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200 hover:border-blue-500 transition-all text-left flex flex-col items-start gap-4 group h-full">
             <div className="bg-blue-100 p-4 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <GraduationCap size={32} />
             </div>
             <div>
                <h3 className="text-xl font-bold text-slate-900">Academic</h3>
                <p className="text-slate-500 text-sm mt-1">Departments, Classes, Labs</p>
             </div>
        </button>

        {/* Amenities */}
         <button onClick={() => setNavState({ ...navState, mainBlockSection: 'amenities' })} className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200 hover:border-blue-500 transition-all text-left flex flex-col items-start gap-4 group h-full">
             <div className="bg-teal-100 p-4 rounded-full text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Droplets size={32} />
             </div>
             <div>
                <h3 className="text-xl font-bold text-slate-900">Common Utilities</h3>
                <p className="text-slate-500 text-sm mt-1">Washrooms, Water, Rest Rooms</p>
             </div>
        </button>
    </div>
  );

  // 4. Academic: Program Selection
  const renderProgramSelection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
         <button onClick={() => setNavState({ ...navState, academicProgram: 'B.Tech' })} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 hover:border-blue-500 transition-all text-center group">
             <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <BookOpen size={32} />
             </div>
             <h3 className="text-2xl font-black text-slate-900">B.Tech</h3>
             <p className="text-slate-500 mt-1">Bachelor of Technology</p>
        </button>
        <button onClick={() => setNavState({ ...navState, academicProgram: 'M.Tech' })} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 hover:border-blue-500 transition-all text-center group">
             <div className="bg-violet-100 w-16 h-16 rounded-full flex items-center justify-center text-violet-600 mx-auto mb-4 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                <Users size={32} />
             </div>
             <h3 className="text-2xl font-black text-slate-900">M.Tech</h3>
             <p className="text-slate-500 mt-1">Master of Technology</p>
        </button>
    </div>
  );

  // 5. Academic: Department List (based on Program)
  const renderDepartmentList = () => {
    const depts = navState.academicProgram === 'B.Tech' ? getBTechDepartments() : getMTechDepartments();
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-in slide-in-from-right-4 duration-500">
            {depts.map(d => (
                <button key={d} onClick={() => setNavState({...navState, department: d})} className="bg-white p-6 rounded-xl shadow border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all text-left">
                    <div className="text-2xl font-black text-slate-800 mb-1">{d}</div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Department</div>
                </button>
            ))}
        </div>
    );
  };

  // 6. Generic List Render (For Admin or Specific Dept Rooms)
  const renderLocationList = (locations: LocationData[]) => (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-8 max-h-[60vh] overflow-y-auto">
      {locations.map(loc => (
        <button
          key={loc.id}
          onClick={() => handleSelectLocation(loc)}
          className="w-full text-left p-5 hover:bg-blue-50 border-b border-slate-100 last:border-0 flex items-center justify-between group transition-colors"
        >
           <div>
              <div className="font-bold text-lg text-slate-800">{loc.name}</div>
              <div className="text-sm text-slate-500 flex items-center gap-2">
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-bold">{loc.floor}</span>
                  {loc.department && <span>{loc.department}</span>}
              </div>
           </div>
           <ChevronRight size={24} className="text-slate-300 group-hover:text-blue-600" />
        </button>
      ))}
    </div>
  );

  // Breadcrumbs
  const renderBreadcrumbs = () => (
    <div className="flex items-center gap-2 mb-6 text-sm font-semibold text-slate-600 bg-white/80 backdrop-blur-sm w-fit px-4 py-2 rounded-full shadow-sm flex-wrap">
      <button onClick={resetNavigation} className="hover:text-blue-600 flex items-center gap-1"><Home size={14}/> Campus</button>
      
      {navState.block && (
        <>
          <ChevronRight size={14} />
          <button onClick={() => setNavState({block: navState.block})} className="hover:text-blue-600">{navState.block}</button>
        </>
      )}
      
      {navState.mainBlockSection && (
        <>
          <ChevronRight size={14} />
          <button onClick={() => setNavState({...navState, mainBlockSection: navState.mainBlockSection, academicProgram: undefined})} className="hover:text-blue-600 capitalize">
            {navState.mainBlockSection === 'administrative' ? 'Admin' : (navState.mainBlockSection === 'academic' ? 'Academic' : 'Utilities')}
          </button>
        </>
      )}

      {navState.academicProgram && (
        <>
          <ChevronRight size={14} />
          <button onClick={() => setNavState({...navState, department: undefined})} className="hover:text-blue-600">
            {navState.academicProgram}
          </button>
        </>
      )}

      {navState.department && (
        <>
           <ChevronRight size={14} />
           <span className="text-blue-600">{navState.department}</span>
        </>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      
      <VoiceSearchModal 
           isOpen={showVoiceModal} 
           onClose={() => setShowVoiceModal(false)} 
           onResult={handleVoiceResult} 
      />

      <div className="absolute inset-0 z-0">
          <img 
            src="https://placehold.co/1920x1080/1e293b/475569?text=VIET+Campus" 
            alt="Campus Background" 
            className="w-full h-full object-cover opacity-100"
          />
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 h-full flex flex-col gap-4 p-4">
        <div className="flex-none flex justify-between items-center">
            <button 
                onClick={handleBack} 
                className="flex items-center gap-2 bg-white/90 backdrop-blur text-slate-900 px-5 py-2.5 rounded-xl shadow-lg border-white/20 hover:bg-white font-bold transition-all group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Back
            </button>
        </div>

        {!selectedRoute && (
            <div ref={searchContainerRef} className="w-full max-w-3xl mx-auto relative z-20">
                <div className="relative flex gap-2 shadow-2xl rounded-2xl">
                    <div className="relative flex-1">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
                        <input
                            type="text"
                            value={query}
                            onFocus={() => setShowDropdown(true)}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search (e.g., Principal, CSE HOD, Canteen)"
                            className="w-full pl-16 pr-4 py-5 bg-white text-slate-900 rounded-2xl focus:ring-4 focus:ring-blue-500/50 focus:outline-none text-xl font-medium shadow-inner transition-colors"
                        />
                    </div>
                    <button
                        onClick={() => setShowVoiceModal(true)}
                        className="px-6 rounded-2xl transition-colors flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700"
                    >
                        <Mic size={28} />
                    </button>
                </div>
                
                {query.trim() !== '' && showDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[60vh] overflow-y-auto border border-slate-200">
                        {searchResults.length === 0 ? (
                            <div className="p-6 text-center text-slate-500">No matches found.</div>
                        ) : (
                            searchResults.map(loc => (
                                <button
                                    key={loc.id}
                                    onClick={() => handleSelectLocation(loc)}
                                    className="w-full text-left p-4 hover:bg-slate-50 border-b border-slate-100 last:border-0 flex justify-between items-center group"
                                >
                                    <div>
                                        <div className="font-bold text-lg text-slate-800">{loc.name}</div>
                                        <div className="text-sm text-slate-500">{loc.block} • {loc.floor}</div>
                                    </div>
                                    <ArrowRight size={20} className="text-slate-300 group-hover:text-blue-600"/>
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>
        )}

        <div className={`flex-1 min-h-0 flex justify-center ${selectedRoute ? 'items-stretch pb-2' : 'items-start pt-8 pb-20'} overflow-hidden`}>
            {selectedRoute ? (
                // --- FULL SCREEN ROUTE DETAILS ---
                <div className="w-full h-full max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                    <div className="bg-slate-50 border-b border-slate-200 p-4 md:p-5 flex justify-between items-center flex-none">
                        <div>
                            <div className="text-blue-600 font-bold uppercase tracking-wider text-xs mb-1 flex items-center gap-1">
                                <Navigation size={14}/> Route Active
                            </div>
                            <h2 className="text-3xl font-black text-slate-900">{selectedRoute.name}</h2>
                            <p className="text-slate-500 font-medium">{selectedRoute.block}, {selectedRoute.floor}</p>
                        </div>
                        <button onClick={clearRoute} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors">
                            <RotateCcw size={18} /> New Search
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col md:flex-row min-h-0 relative">
                        <div className="flex-1 flex flex-col relative min-h-0">
                             <div className="flex-1 relative bg-slate-900 overflow-hidden group">
                                {selectedRoute.mapImage ? (
                                    <img src={selectedRoute.mapImage} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" alt="Map" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                                        <MapPin size={48} className="opacity-20"/>
                                    </div>
                                )}
                            </div>
                            
                            <div className="h-auto p-4 border-t border-slate-200 bg-white grid grid-cols-2 gap-4 flex-none z-10">
                                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                                    <div className="text-blue-600 text-xs font-bold uppercase mb-1 flex items-center gap-1"><Footprints size={14}/> Distance</div>
                                    <div className="text-2xl font-black text-slate-900">{selectedRoute.distance} m</div>
                                </div>
                                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                                    <div className="text-emerald-600 text-xs font-bold uppercase mb-1 flex items-center gap-1"><Clock size={14}/> Est. Time</div>
                                    <div className="text-2xl font-black text-slate-900">{selectedRoute.estimatedTime} min</div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-96 bg-slate-50/50 border-l border-slate-200 flex flex-col h-full min-h-0">
                            <div className="flex-1 p-5 overflow-y-auto">
                                <h3 className="font-bold text-lg mb-4 text-slate-800 flex items-center gap-2">
                                    <Footprints size={18} className="text-slate-400"/> Directions
                                </h3>
                                <div className="space-y-6 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-300">
                                    {selectedRoute.steps.map((step, idx) => (
                                        <div key={idx} className="relative flex gap-4">
                                            <div className="relative z-10 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-slate-50">
                                                {idx + 1}
                                            </div>
                                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex-1">
                                                <p className="font-bold text-slate-900 text-lg leading-tight">{step.instruction}</p>
                                                {step.detail && <p className="text-sm text-slate-500 mt-2 leading-relaxed">{step.detail}</p>}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="relative flex gap-4">
                                        <div className="relative z-10 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-slate-50">
                                            <MapPin size={16} fill="currentColor"/>
                                        </div>
                                        <div className="py-1">
                                            <p className="font-bold text-green-700">You have arrived</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-none p-5 border-t border-slate-200 bg-white shadow-lg z-20">
                                <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center gap-4 shadow-lg">
                                    <div className="bg-white p-1.5 rounded-lg flex-shrink-0">
                                        <QRCodeSVG value={`${window.location.href.split('#')[0]}#/mobile/directions?id=${selectedRoute.id}`} size={80} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-base text-yellow-400">Scan to Go</p>
                                        <p className="text-xs text-slate-300 leading-tight mt-1 mb-2">Get navigation on phone</p>
                                        <div className="bg-black/30 p-2 rounded border border-white/10">
                                            <p className="text-[10px] text-slate-400 font-mono break-all leading-none">
                                                {`${window.location.href.split('#')[0]}#/mobile/directions?id=${selectedRoute.id}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // --- BROWSER NAVIGATION LOGIC ---
                <div className="w-full max-w-5xl mx-auto">
                    {(navState.block) && renderBreadcrumbs()}

                    {!navState.block && (
                        <div>
                             <h2 className="text-white text-3xl font-bold mb-6 text-center shadow-black drop-shadow-md">Select Campus Block</h2>
                             {renderBlockSelection()}
                        </div>
                    )}

                    {navState.block === 'Campus Facilities' && (
                        <div>
                            <h2 className="text-white text-3xl font-bold mb-6 text-center drop-shadow-md">Select Facility</h2>
                            {renderFacilitiesSelection()}
                        </div>
                    )}

                    {navState.block === 'Main Block' && !navState.mainBlockSection && (
                        <div>
                             <h2 className="text-white text-3xl font-bold mb-6 text-center drop-shadow-md">What are you looking for?</h2>
                             {renderMainBlockSectionSelection()}
                        </div>
                    )}

                    {navState.mainBlockSection === 'administrative' && (
                        <div>
                            <h2 className="text-white text-3xl font-bold mb-6 text-center drop-shadow-md">Administrative Offices</h2>
                            {renderLocationList(getAdminLocations())}
                        </div>
                    )}

                    {navState.mainBlockSection === 'academic' && !navState.academicProgram && (
                        <div>
                            <h2 className="text-white text-3xl font-bold mb-6 text-center drop-shadow-md">Select Program</h2>
                            {renderProgramSelection()}
                        </div>
                    )}

                    {navState.academicProgram && !navState.department && (
                        <div>
                            <h2 className="text-white text-3xl font-bold mb-6 text-center drop-shadow-md">Select {navState.academicProgram} Department</h2>
                            {renderDepartmentList()}
                        </div>
                    )}

                    {navState.department && (
                        <div>
                            <h2 className="text-white text-3xl font-bold mb-6 text-center drop-shadow-md">{navState.department} Facilities</h2>
                            {renderLocationList(getLocationsForDept(navState.department, navState.academicProgram!))}
                        </div>
                    )}

                    {navState.mainBlockSection === 'amenities' && (
                        <div>
                            <h2 className="text-white text-3xl font-bold mb-6 text-center drop-shadow-md">Common Utilities</h2>
                            {renderLocationList(getMainBlockAmenities())}
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Directions;
