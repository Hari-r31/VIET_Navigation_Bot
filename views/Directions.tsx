
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, MapPin, Navigation, Clock, Footprints, Mic, ChevronRight, RotateCcw, ArrowLeft, ArrowRight, Building, Briefcase, GraduationCap, Coffee, Home, X, Users, BookOpen, Droplets, Volume2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useLocation, useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { searchLocations } from '../services/searchService';
import { LocationData, LocationCategory } from '../types';
import { LOCATIONS, getLocations } from '../data/mockData';
import toast from 'react-hot-toast';
import VoiceSearchModal from '../components/VoiceSearchModal';
import { useLanguage } from '../contexts/LanguageContext';

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
  const { t, language, speak, stopSpeaking } = useLanguage();
  
  // Memoize the localized locations based on current language
  const currentLocations = useMemo(() => getLocations(language), [language]);

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

  // Department Search State
  const [deptSearchQuery, setDeptSearchQuery] = useState('');

  // --- Voice Announcements for State Changes ---
  useEffect(() => {
     if (selectedRoute) {
         const text = t.speak_nav_start
            .replace('{name}', selectedRoute.name)
            .replace('{distance}', selectedRoute.distance.toString())
            .replace('{instruction}', selectedRoute.steps[0].instruction);
         speak(text);
     } else if (navState.department) {
         speak(t.speak_select_dept.replace('{dept}', navState.department));
     } else if (navState.academicProgram) {
         speak(t.speak_select_program.replace('{program}', navState.academicProgram));
     } else if (navState.mainBlockSection) {
         speak(t.speak_select_section.replace('{section}', navState.mainBlockSection));
     } else if (navState.block) {
         speak(t.speak_select_block.replace('{block}', navState.block));
     } else {
         speak(t.dir_select_block);
     }
  }, [navState, selectedRoute, language]);

  const readDirections = () => {
      if (!selectedRoute) return;
      const stepsText = selectedRoute.steps.map((s, i) => `${i+1}. ${s.instruction}`).join('. ');
      const text = t.speak_directions_read
        .replace('{name}', selectedRoute.name)
        .replace('{steps}', stepsText);
      speak(text);
  };

  // Initial Data processing
  useEffect(() => {
    if (routerLoc.state && (routerLoc.state as any).initialQuery) {
      const initQ = (routerLoc.state as any).initialQuery;
      // Search in the current localized list
      const matches = searchLocations(initQ, currentLocations);
      if (matches.length > 0) {
        setSelectedRoute(matches[0]);
      } else {
        // Fallback: try searching in default English if failed
        const fallbackMatches = searchLocations(initQ, getLocations('en'));
         if (fallbackMatches.length > 0) {
             // If found in English, try to find corresponding ID in current language to show translated result
             const foundId = fallbackMatches[0].id;
             const localizedMatch = currentLocations.find(l => l.id === foundId);
             setSelectedRoute(localizedMatch || fallbackMatches[0]);
         } else {
            setQuery(initQ);
            handleSearch(initQ);
            toast.error("Location not found.");
         }
      }
    }
  }, [routerLoc.state, currentLocations]);

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
    const matches = searchLocations(text, currentLocations);
    setSearchResults(matches);
  };

  const handleVoiceResult = (text: string) => {
      setQuery(text);
      handleSearch(text);
      const matches = searchLocations(text, currentLocations);
      if (matches.length > 0) {
          // Check for exact name match logic roughly
          if (matches[0].name.toLowerCase().includes(text.toLowerCase()) || text.toLowerCase().includes(matches[0].name.toLowerCase())) {
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
    setDeptSearchQuery('');
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
      // Since we auto-select B.Tech for Academic, going back should take us to Section Selection
      setNavState(prev => ({ ...prev, academicProgram: undefined, mainBlockSection: undefined }));
      setDeptSearchQuery('');
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
      navigate('/home');
    }
  };

  // --- Helpers to get data based on current state ---
  
  const getBTechDepartments = () => ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE'];
  const getMTechDepartments = () => ['CSE', 'ECE', 'VLSI', 'EPS', 'SE', 'TE', 'CAD', 'AIML'];

  const getLocationsForDept = (dept: string, program: string) => {
      return currentLocations.filter(l => 
        l.department === dept && 
        (l.program === program || !l.program) && 
        l.block.includes(language === 'en' ? 'Main Block' : (language === 'te' ? 'మెయిన్ బ్లాక్' : 'मेन ब्लॉक'))
      );
  };

  // Helper to find location by ID in current language list
  const findLoc = (id: string) => currentLocations.find(l => l.id === id);

  const getAdminLocations = () => currentLocations.filter(l => l.category === 'administrative');

  const getMainBlockAmenities = () => currentLocations.filter(l => l.category === 'amenity' && l.block.includes(language === 'en' ? 'Main Block' : (language === 'te' ? 'మెయిన్ బ్లాక్' : 'मेन ब्लॉक')));

  // --- Render Helpers ---

  // 1. Root: Select Block
  const renderBlockSelection = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 animate-in slide-in-from-bottom-4 duration-500">
      {/* Main Block */}
      <button onClick={() => setNavState({ ...navState, block: 'Main Block' })} className="bg-white p-4 rounded-xl shadow-lg border border-slate-200 hover:border-blue-500 hover:shadow-blue-500/20 transition-all text-left group">
          <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center text-blue-600 mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors"><Building size={20} /></div>
          <h3 className="text-base font-bold text-slate-900">{t.cat_main_block}</h3>
          <p className="text-slate-500 text-xs mt-0.5">Admin, B.Tech & M.Tech</p>
      </button>

      {/* Direct Blocks */}
      <button onClick={() => handleSelectLocation(findLoc('mba-block')!)} className="bg-white p-4 rounded-xl shadow-lg border border-slate-200 hover:border-blue-500 hover:shadow-blue-500/20 transition-all text-left group">
          <div className="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center text-purple-600 mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors"><Briefcase size={20} /></div>
          <h3 className="text-base font-bold text-slate-900">{t.cat_mba_block}</h3>
          <p className="text-slate-500 text-xs mt-0.5">Direct Navigation</p>
      </button>

      <button onClick={() => handleSelectLocation(findLoc('diploma-block')!)} className="bg-white p-4 rounded-xl shadow-lg border border-slate-200 hover:border-blue-500 hover:shadow-blue-500/20 transition-all text-left group">
          <div className="bg-orange-100 w-10 h-10 rounded-full flex items-center justify-center text-orange-600 mb-3 group-hover:bg-orange-600 group-hover:text-white transition-colors"><GraduationCap size={20} /></div>
          <h3 className="text-base font-bold text-slate-900">{t.cat_diploma_block}</h3>
          <p className="text-slate-500 text-xs mt-0.5">Direct Navigation</p>
      </button>

      {/* Campus Facilities Group (formerly Amenities + Grounds) */}
      <button onClick={() => setNavState({...navState, block: 'Campus Facilities'})} className="bg-white p-4 rounded-xl shadow-lg border border-slate-200 hover:border-blue-500 hover:shadow-blue-500/20 transition-all text-left group">
          <div className="bg-yellow-100 w-10 h-10 rounded-full flex items-center justify-center text-yellow-600 mb-3 group-hover:bg-yellow-600 group-hover:text-white transition-colors"><Coffee size={20} /></div>
          <h3 className="text-base font-bold text-slate-900">{t.cat_facilities}</h3>
          <p className="text-slate-500 text-xs mt-0.5">Grounds, Canteen, Mess</p>
      </button>
    </div>
  );

  // 2. Facilities Selection (If Campus Facilities Block selected)
  const renderFacilitiesSelection = () => (
     <div className="grid grid-cols-2 md:grid-cols-3 gap-3 animate-in slide-in-from-right-4 duration-500">
        <button onClick={() => handleSelectLocation(findLoc('grounds')!)} className="bg-white p-4 rounded-xl shadow-lg border hover:border-blue-500 group text-left">
            <div className="bg-green-100 w-10 h-10 rounded-xl flex items-center justify-center text-green-600 mb-2 group-hover:bg-green-600 group-hover:text-white"><Footprints size={20}/></div>
            <h3 className="text-sm font-bold">{t.cat_grounds}</h3>
        </button>
        <button onClick={() => handleSelectLocation(findLoc('canteen')!)} className="bg-white p-4 rounded-xl shadow-lg border hover:border-blue-500 group text-left">
            <div className="bg-yellow-100 w-10 h-10 rounded-xl flex items-center justify-center text-yellow-600 mb-2 group-hover:bg-yellow-600 group-hover:text-white"><Coffee size={20}/></div>
            <h3 className="text-sm font-bold">{t.cat_canteen}</h3>
        </button>
        <button onClick={() => handleSelectLocation(findLoc('mess')!)} className="bg-white p-4 rounded-xl shadow-lg border hover:border-blue-500 group text-left">
            <div className="bg-orange-100 w-10 h-10 rounded-xl flex items-center justify-center text-orange-600 mb-2 group-hover:bg-orange-600 group-hover:text-white"><Coffee size={20}/></div>
            <h3 className="text-sm font-bold">{t.cat_mess}</h3>
        </button>
     </div>
  );

  // 3. Main Block: Section Selection
  const renderMainBlockSectionSelection = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 animate-in slide-in-from-right-4 duration-500 max-w-4xl mx-auto">
        {/* Admin */}
        <button onClick={() => setNavState({ ...navState, mainBlockSection: 'administrative' })} className="bg-white p-4 rounded-xl shadow-lg border border-slate-200 hover:border-blue-500 transition-all text-left flex flex-col items-start gap-3 group h-full">
             <div className="bg-slate-100 p-3 rounded-full text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Briefcase size={24} />
             </div>
             <div>
                <h3 className="text-base font-bold text-slate-900">{t.sec_admin}</h3>
                <p className="text-slate-500 text-xs mt-0.5">Principal, Office, Exam Cell</p>
             </div>
        </button>
        
        {/* Academic - Defaults to B.Tech */}
        <button onClick={() => setNavState({ ...navState, mainBlockSection: 'academic', academicProgram: 'B.Tech' })} className="bg-white p-4 rounded-xl shadow-lg border border-slate-200 hover:border-blue-500 transition-all text-left flex flex-col items-start gap-3 group h-full">
             <div className="bg-blue-100 p-3 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <GraduationCap size={24} />
             </div>
             <div>
                <h3 className="text-base font-bold text-slate-900">{t.sec_academic}</h3>
                <p className="text-slate-500 text-xs mt-0.5">Departments, Classes, Labs</p>
             </div>
        </button>

        {/* Amenities */}
         <button onClick={() => setNavState({ ...navState, mainBlockSection: 'amenities' })} className="bg-white p-4 rounded-xl shadow-lg border border-slate-200 hover:border-blue-500 transition-all text-left flex flex-col items-start gap-3 group h-full">
             <div className="bg-teal-100 p-3 rounded-full text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Droplets size={24} />
             </div>
             <div>
                <h3 className="text-base font-bold text-slate-900">{t.sec_utilities}</h3>
                <p className="text-slate-500 text-xs mt-0.5">Washrooms, Water, Rest Rooms</p>
             </div>
        </button>
    </div>
  );

  // 4. Academic: Program Selection - REMOVED

  // 5. Academic: Department List (based on Program)
  const renderDepartmentList = () => {
    // Default to B.Tech departments since we removed the selection
    const depts = getBTechDepartments();
    
    // Fuzzy Search Logic
    let filteredDepts = depts;
    if (deptSearchQuery.trim() !== '') {
        const fuse = new Fuse(depts.map(d => ({ name: d })), {
            keys: ['name'],
            threshold: 0.4, // Adjust for fuzziness
        });
        filteredDepts = fuse.search(deptSearchQuery).map(result => result.item.name);
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Search Input */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    value={deptSearchQuery}
                    onChange={(e) => setDeptSearchQuery(e.target.value)}
                    placeholder={t.dir_search_dept}
                    className="w-full pl-12 pr-4 py-3 bg-white text-slate-900 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 animate-in slide-in-from-right-4 duration-500">
                {filteredDepts.map(d => (
                    <button key={d} onClick={() => setNavState({...navState, department: d})} className="bg-white p-4 rounded-xl shadow border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all text-left">
                        <div className="text-xl font-black text-slate-800 mb-0.5">{d}</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{language === 'en' ? 'Department' : (language === 'te' ? 'విభాగం' : 'विभाग')}</div>
                    </button>
                ))}
            </div>
            
            {filteredDepts.length === 0 && (
                <div className="text-center text-white py-8 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                    <p>No departments found matching "{deptSearchQuery}"</p>
                </div>
            )}
        </div>
    );
  };

  // 6. Generic List Render (For Admin or Specific Dept Rooms)
  const renderLocationList = (locations: LocationData[]) => (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-8 max-h-[50vh] overflow-y-auto custom-scrollbar">
      {locations.map(loc => (
        <button
          key={loc.id}
          onClick={() => handleSelectLocation(loc)}
          className="w-full text-left p-3 hover:bg-blue-50 border-b border-slate-100 last:border-0 flex items-center justify-between group transition-colors"
        >
           <div>
              <div className="font-bold text-base text-slate-800">{loc.name}</div>
              <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-bold">{loc.floor}</span>
                  {loc.department && <span>{loc.department}</span>}
              </div>
           </div>
           <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600" />
        </button>
      ))}
    </div>
  );

  // Breadcrumbs
  const renderBreadcrumbs = () => (
    <div className="flex items-center gap-2 mb-6 text-sm font-semibold text-slate-600 bg-white/80 backdrop-blur-sm w-fit px-4 py-2 rounded-full shadow-sm flex-wrap">
      <button onClick={resetNavigation} className="hover:text-blue-600 flex items-center gap-1"><Home size={14}/> {t.dir_campus}</button>
      
      {navState.block && (
        <>
          <ChevronRight size={14} />
          <button onClick={() => setNavState({block: navState.block})} className="hover:text-blue-600">
            {navState.block === 'Main Block' ? t.cat_main_block : 
             navState.block === 'Campus Facilities' ? t.cat_facilities : 
             navState.block}
          </button>
        </>
      )}
      
      {navState.mainBlockSection && (
        <>
          <ChevronRight size={14} />
          <button onClick={() => setNavState({...navState, mainBlockSection: navState.mainBlockSection, academicProgram: undefined})} className="hover:text-blue-600 capitalize">
            {navState.mainBlockSection === 'administrative' ? t.sec_admin : (navState.mainBlockSection === 'academic' ? t.sec_academic : t.sec_utilities)}
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

      <div className="relative z-10 h-full flex flex-col gap-3 p-3">
        <div className="flex-none flex justify-between items-center">
            <button 
                onClick={handleBack} 
                className="flex items-center gap-2 bg-white/90 backdrop-blur text-slate-900 px-3 py-1.5 rounded-xl shadow-lg border-white/20 hover:bg-white font-bold transition-all group text-xs"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                {t.dir_back}
            </button>
        </div>

        {!selectedRoute && (
            <div ref={searchContainerRef} className="w-full max-w-2xl mx-auto relative z-20 flex-none">
                <div className="relative flex gap-2 shadow-xl rounded-2xl">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            value={query}
                            onFocus={() => setShowDropdown(true)}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder={t.dir_search_placeholder}
                            className="w-full pl-12 pr-4 py-3 bg-white text-slate-900 rounded-2xl focus:ring-4 focus:ring-blue-500/50 focus:outline-none text-lg font-medium shadow-inner transition-colors"
                        />
                    </div>
                    <button
                        onClick={() => setShowVoiceModal(true)}
                        className="px-4 rounded-2xl transition-colors flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700"
                    >
                        <Mic size={20} />
                    </button>
                </div>
                
                {query.trim() !== '' && showDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[50vh] overflow-y-auto border border-slate-200">
                        {searchResults.length === 0 ? (
                            <div className="p-4 text-center text-slate-500 text-sm">No matches found.</div>
                        ) : (
                            searchResults.map(loc => (
                                <button
                                    key={loc.id}
                                    onClick={() => handleSelectLocation(loc)}
                                    className="w-full text-left p-3 hover:bg-slate-50 border-b border-slate-100 last:border-0 flex justify-between items-center group"
                                >
                                    <div>
                                        <div className="font-bold text-base text-slate-800">{loc.name}</div>
                                        <div className="text-xs text-slate-500">{loc.block} • {loc.floor}</div>
                                    </div>
                                    <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-600"/>
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>
        )}

        <div className={`flex-1 min-h-0 flex justify-center ${selectedRoute ? 'items-stretch pb-0' : 'items-start pt-2 pb-0'} overflow-y-auto custom-scrollbar`}>
            {selectedRoute ? (
                // --- FULL SCREEN ROUTE DETAILS ---
                <div className="w-full h-full max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-slate-200">
                    <div className="bg-slate-50 border-b border-slate-200 p-3 flex justify-between items-center flex-none">
                        <div>
                            <div className="text-blue-600 font-bold uppercase tracking-wider text-[10px] mb-0.5 flex items-center gap-1">
                                <Navigation size={12}/> Route Active
                            </div>
                            <h2 className="text-xl font-black text-slate-900 leading-tight">{selectedRoute.name}</h2>
                            <p className="text-slate-500 font-medium text-xs">{selectedRoute.block}, {selectedRoute.floor}</p>
                        </div>
                        <button onClick={clearRoute} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-colors text-xs">
                            <RotateCcw size={14} /> New Search
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col md:flex-row min-h-0 relative overflow-hidden md:overflow-visible">
                        <div className="h-64 md:h-auto md:flex-1 flex flex-col relative min-h-0 shrink-0">
                             <div className="flex-1 relative bg-slate-900 overflow-hidden group">
                                {selectedRoute.mapImage ? (
                                    <img src={selectedRoute.mapImage} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" alt="Map" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                                        <MapPin size={32} className="opacity-20"/>
                                    </div>
                                )}
                                {/* Floating Read Button */}
                                <button 
                                    onClick={readDirections}
                                    className="absolute bottom-3 right-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 font-bold transition-transform hover:scale-105 z-20 text-xs"
                                >
                                    <Volume2 size={14} /> Read Directions
                                </button>
                            </div>
                            
                            <div className="h-auto p-3 border-t border-slate-200 bg-white grid grid-cols-2 gap-3 flex-none z-10">
                                <div className="bg-blue-50 p-2 rounded-lg border border-blue-100">
                                    <div className="text-blue-600 text-[10px] font-bold uppercase mb-0.5 flex items-center gap-1"><Footprints size={12}/> Distance</div>
                                    <div className="text-lg font-black text-slate-900">{selectedRoute.distance} m</div>
                                </div>
                                <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                                    <div className="text-emerald-600 text-[10px] font-bold uppercase mb-0.5 flex items-center gap-1"><Clock size={12}/> Est. Time</div>
                                    <div className="text-lg font-black text-slate-900">{selectedRoute.estimatedTime} min</div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-80 bg-slate-50/50 border-t md:border-t-0 md:border-l border-slate-200 flex flex-col flex-1 md:h-full min-h-0">
                            <div className="flex-1 p-3 overflow-y-auto custom-scrollbar">
                                <h3 className="font-bold text-sm mb-3 text-slate-800 flex items-center gap-2">
                                    <Footprints size={14} className="text-slate-400"/> Directions
                                </h3>
                                <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-300">
                                    {selectedRoute.steps.map((step, idx) => (
                                        <div key={idx} className="relative flex gap-3">
                                            <div className="relative z-10 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shadow-md ring-2 ring-slate-50 flex-shrink-0">
                                                {idx + 1}
                                            </div>
                                            <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 flex-1">
                                                <p className="font-bold text-slate-900 text-sm leading-tight">{step.instruction}</p>
                                                {step.detail && <p className="text-xs text-slate-500 mt-1 leading-relaxed">{step.detail}</p>}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="relative flex gap-3">
                                        <div className="relative z-10 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-[10px] shadow-md ring-2 ring-slate-50 flex-shrink-0">
                                            <MapPin size={12} fill="currentColor"/>
                                        </div>
                                        <div className="py-0.5">
                                            <p className="font-bold text-green-700 text-xs">You have arrived</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-none p-3 border-t border-slate-200 bg-white shadow-lg z-20">
                                <div className="bg-slate-900 text-white p-3 rounded-xl flex items-center gap-3 shadow-lg">
                                    <div className="bg-white p-1 rounded-lg flex-shrink-0">
                                        <QRCodeSVG value={`${window.location.href.split('#')[0]}#/mobile/directions?id=${selectedRoute.id}`} size={60} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm text-yellow-400">Scan to Go</p>
                                        <p className="text-[10px] text-slate-300 leading-tight mt-0.5 mb-1">Get navigation on phone</p>
                                        <div className="bg-black/30 p-1.5 rounded border border-white/10">
                                            <p className="text-[8px] text-slate-400 font-mono break-all leading-none truncate">
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
                <div className="w-full max-w-5xl mx-auto flex flex-col gap-4">
                    {(navState.block) && renderBreadcrumbs()}

                    {/* 1. BLOCK SELECTION */}
                    {!navState.block && (
                        <div className="animate-in fade-in zoom-in duration-300 w-full">
                             <h2 className="text-white text-2xl font-bold mb-4 text-center drop-shadow-md">{t.dir_select_block}</h2>
                             {renderBlockSelection()}
                        </div>
                    )}

                    {/* 2. CAMPUS FACILITIES (Sub-menu) */}
                    {navState.block === 'Campus Facilities' && (
                        <div className="animate-in fade-in slide-in-from-right duration-300 w-full">
                            <h2 className="text-white text-2xl font-bold mb-4 text-center drop-shadow-md">{t.dir_select_amenity}</h2>
                            {renderFacilitiesSelection()}
                        </div>
                    )}

                    {/* 3. MAIN BLOCK - SECTIONS (Admin, Academic, Amenities) */}
                    {navState.block === 'Main Block' && !navState.mainBlockSection && (
                        <div className="animate-in fade-in slide-in-from-right duration-300 w-full">
                             <h2 className="text-white text-2xl font-bold mb-4 text-center drop-shadow-md">{t.dir_what_looking}</h2>
                             {renderMainBlockSectionSelection()}
                        </div>
                    )}

                    {/* 4. MAIN BLOCK - ADMIN LIST */}
                    {navState.block === 'Main Block' && navState.mainBlockSection === 'administrative' && (
                        <div className="animate-in fade-in slide-in-from-right duration-300 w-full">
                            <h2 className="text-white text-2xl font-bold mb-4 text-center drop-shadow-md">{t.dir_admin_offices}</h2>
                            {renderLocationList(getAdminLocations())}
                        </div>
                    )}

                    {/* 5. MAIN BLOCK - ACADEMIC - DEPARTMENT SELECTION */}
                    {navState.block === 'Main Block' && navState.academicProgram && !navState.department && (
                        <div className="animate-in fade-in slide-in-from-right duration-300 w-full">
                            <h2 className="text-white text-2xl font-bold mb-4 text-center drop-shadow-md">{t.dir_select_dept}</h2>
                            {renderDepartmentList()}
                        </div>
                    )}

                    {/* 7. MAIN BLOCK - ACADEMIC - DEPARTMENT FACILITIES LIST */}
                    {navState.block === 'Main Block' && navState.department && (
                        <div className="animate-in fade-in slide-in-from-right duration-300 w-full">
                            <h2 className="text-white text-2xl font-bold mb-4 text-center drop-shadow-md">{navState.department} Facilities</h2>
                            {renderLocationList(getLocationsForDept(navState.department, navState.academicProgram!))}
                        </div>
                    )}

                    {/* 8. MAIN BLOCK - AMENITIES LIST */}
                    {navState.block === 'Main Block' && navState.mainBlockSection === 'amenities' && (
                        <div className="animate-in fade-in slide-in-from-right duration-300 w-full">
                            <h2 className="text-white text-2xl font-bold mb-4 text-center drop-shadow-md">{t.dir_common_utils}</h2>
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
