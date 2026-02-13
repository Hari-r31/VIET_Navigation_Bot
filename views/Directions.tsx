
import React, { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Navigation, Clock, Footprints, Mic, ChevronRight, RotateCcw, ArrowLeft, ArrowRight, Building, Users, Briefcase, GraduationCap, Coffee, Home, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useLocation, useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { searchLocations } from '../services/searchService';
import { startListening } from '../services/speechService';
import { LocationData, LocationCategory } from '../types';
import { LOCATIONS } from '../data/mockData';
import toast from 'react-hot-toast';

// Types for navigation state
interface NavState {
  block?: string;
  category?: LocationCategory;
  department?: string;
}

// Full Name Mapping for Fuzzy Search
const DEPT_FULL_NAMES: Record<string, string> = {
  'CSE': 'Computer Science & Engineering',
  'ECE': 'Electronics & Communication',
  'EEE': 'Electrical & Electronics',
  'MECH': 'Mechanical Engineering',
  'CIVIL': 'Civil Engineering',
  'Common': 'General & Common Facilities'
};

const Directions: React.FC = () => {
  const routerLoc = useLocation();
  const navigate = useNavigate();
  
  // Search State
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [isListening, setIsListening] = useState(false);

  // Hierarchical Browsing State
  const [navState, setNavState] = useState<NavState>({});
  const [deptFilter, setDeptFilter] = useState('');
  
  // Final Selection
  const [selectedRoute, setSelectedRoute] = useState<LocationData | null>(null);

  // Constants derived from data
  const BLOCKS = Array.from(new Set(LOCATIONS.map(l => l.block)));

  // Handle intent passing from Assistant
  useEffect(() => {
    if (routerLoc.state && (routerLoc.state as any).initialQuery) {
      const initQ = (routerLoc.state as any).initialQuery;
      // Do not setQuery(initQ) here to prevent dropdown from opening over result
      const matches = searchLocations(initQ);
      if (matches.length > 0) {
        setSelectedRoute(matches[0]);
      } else {
        setQuery(initQ); // Populate so user can correct it
        handleSearch(initQ);
        toast.error("Location not found.");
      }
    }
  }, [routerLoc.state]);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.trim() === '') {
      setSearchResults([]);
      return;
    }
    const matches = searchLocations(text);
    setSearchResults(matches);
  };

  const startVoiceSearch = () => {
    if (isListening) return;
    setIsListening(true);
    setQuery(''); // Clear previous query
    
    startListening(
      (text) => {
        // On Final Result
        handleSearch(text);
        const matches = searchLocations(text);
        if (matches.length > 0) {
          setSelectedRoute(matches[0]);
          setQuery(''); // Clear query to hide dropdown
          setSearchResults([]);
          toast.success(`Found ${matches[0].name}`);
        } else {
          toast.error("Could not find that location.");
        }
      },
      () => setIsListening(false), // On End
      (error) => {
        setIsListening(false);
        toast.error(error); // Display cleaned error from service
      },
      (interimText) => {
        // On Interim Result (Real-time updates)
        setQuery(interimText);
      }
    );
  };

  const handleSelectLocation = (loc: LocationData) => {
    setSelectedRoute(loc);
    setQuery(''); // Clear query to hide dropdown
    setSearchResults([]);
  };

  const clearRoute = () => {
    setSelectedRoute(null);
    setQuery('');
    setSearchResults([]);
    setNavState({});
    setDeptFilter('');
  };

  const resetNavigation = () => {
    setNavState({});
    setQuery('');
    setSearchResults([]);
    setDeptFilter('');
  };

  // --- Filtering Logic for Browsing ---
  const getFilteredLocations = () => {
    return LOCATIONS.filter(loc => {
      if (navState.block && loc.block !== navState.block) return false;
      if (navState.category && loc.category !== navState.category) return false;
      if (navState.department && loc.department !== navState.department) return false;
      return true;
    });
  };

  // --- Render Helpers ---

  // 1. Block Selection
  const renderBlockSelection = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
      {BLOCKS.map(block => (
        <button
          key={block}
          onClick={() => setNavState({ ...navState, block })}
          className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-slate-200 hover:border-blue-500 hover:shadow-blue-500/20 transition-all group text-left"
        >
          <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            {block.includes('MBA') ? <Briefcase size={28} /> : 
             block.includes('Grounds') ? <Coffee size={28} /> : 
             <Building size={28} />}
          </div>
          <h3 className="text-xl font-bold text-slate-900">{block}</h3>
          <p className="text-slate-500 text-sm mt-1">Tap to browse</p>
        </button>
      ))}
    </div>
  );

  // 2. Category Selection
  const renderCategorySelection = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-in slide-in-from-right-4 duration-500">
      {navState.block === 'Main Campus' ? (
        <>
          <button onClick={() => setNavState({ ...navState, category: 'administrative' })} className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-lg border hover:border-blue-500 group text-left">
            <div className="bg-purple-100 p-3 w-fit rounded-xl text-purple-600 mb-3 group-hover:bg-purple-600 group-hover:text-white"><Briefcase size={24}/></div>
            <h3 className="text-lg font-bold">Administrative</h3>
            <p className="text-xs text-slate-500">Principal, Office, NCC</p>
          </button>
          <button onClick={() => setNavState({ ...navState, category: 'academic' })} className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-lg border hover:border-blue-500 group text-left">
            <div className="bg-blue-100 p-3 w-fit rounded-xl text-blue-600 mb-3 group-hover:bg-blue-600 group-hover:text-white"><GraduationCap size={24}/></div>
            <h3 className="text-lg font-bold">Departments (Academic)</h3>
            <p className="text-xs text-slate-500">CSE, ECE, EEE, Labs</p>
          </button>
          <button onClick={() => setNavState({ ...navState, category: 'amenity' })} className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-lg border hover:border-blue-500 group text-left">
            <div className="bg-emerald-100 p-3 w-fit rounded-xl text-emerald-600 mb-3 group-hover:bg-emerald-600 group-hover:text-white"><Coffee size={24}/></div>
            <h3 className="text-lg font-bold">Amenities</h3>
            <p className="text-xs text-slate-500">Restrooms, Library, Seminar Halls</p>
          </button>
        </>
      ) : (
        <div className="col-span-3">
             {renderLocationList(getFilteredLocations())}
        </div>
      )}
    </div>
  );

  // 3. Department Selection with Fuzzy Search
  const renderDeptSelection = () => {
    const availableDepts = Array.from(new Set(
      LOCATIONS
        .filter(l => l.block === navState.block && l.category === 'academic' && l.department)
        .map(l => l.department!)
    ));

    // Prepare data for Fuse
    const fuseData = availableDepts.map(code => ({
      code,
      fullName: DEPT_FULL_NAMES[code] || code
    }));

    const fuse = new Fuse(fuseData, {
      keys: ['code', 'fullName'],
      threshold: 0.3
    });

    const filteredDepts = deptFilter 
      ? fuse.search(deptFilter).map(res => res.item.code) 
      : availableDepts;

    return (
      <div className="space-y-6">
        {/* Department Filter Input */}
        <div className="relative max-w-lg mx-auto animate-in fade-in duration-300">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
           <input 
             type="text"
             value={deptFilter}
             onChange={(e) => setDeptFilter(e.target.value)}
             placeholder="Find department (e.g. Computer Science)..."
             className="w-full pl-12 pr-10 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-slate-400 font-medium"
             autoFocus
           />
           {deptFilter && (
             <button 
                onClick={() => setDeptFilter('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
             >
               <X size={18} />
             </button>
           )}
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in slide-in-from-right-4 duration-500">
           {filteredDepts.length > 0 ? filteredDepts.map(dept => (
             <button 
               key={dept} 
               onClick={() => setNavState({...navState, department: dept})}
               className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-lg border hover:border-blue-500 text-center flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
             >
               <div className="bg-blue-50 p-3 rounded-full text-blue-600 font-bold">{dept[0]}</div>
               <span className="font-bold text-slate-900">{dept} Dept</span>
               {DEPT_FULL_NAMES[dept] && (
                 <span className="text-xs text-slate-500 line-clamp-1">{DEPT_FULL_NAMES[dept]}</span>
               )}
             </button>
           )) : (
             <div className="col-span-full text-center py-8 text-slate-500">
               <div className="inline-block p-4 bg-slate-100 rounded-full mb-2">
                 <Search size={24} className="opacity-50"/>
               </div>
               <p>No departments match "{deptFilter}"</p>
             </div>
           )}
        </div>
      </div>
    );
  };

  // 4. Final Location List
  const renderLocationList = (locations: LocationData[]) => (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-8">
      {locations.length === 0 ? (
        <div className="p-8 text-center text-slate-500">No locations found in this category.</div>
      ) : (
        <div className="divide-y divide-slate-100 max-h-[50vh] overflow-y-auto">
          {locations.map(loc => (
            <button
              key={loc.id}
              onClick={() => handleSelectLocation(loc)}
              className="w-full text-left p-4 hover:bg-blue-50 flex items-center justify-between group transition-colors"
            >
               <div>
                  <div className="font-bold text-slate-800">{loc.name}</div>
                  <div className="text-xs text-slate-500">{loc.floor}</div>
               </div>
               <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-600" />
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Breadcrumbs
  const renderBreadcrumbs = () => (
    <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-slate-600 bg-white/80 backdrop-blur-sm w-fit px-4 py-2 rounded-full shadow-sm">
      <button onClick={resetNavigation} className="hover:text-blue-600 flex items-center gap-1"><Home size={14}/> Campus</button>
      {navState.block && (
        <>
          <ChevronRight size={14} />
          <button onClick={() => setNavState({block: navState.block})} className="hover:text-blue-600">{navState.block}</button>
        </>
      )}
      {navState.category && (
        <>
          <ChevronRight size={14} />
          <button onClick={() => setNavState({block: navState.block, category: navState.category})} className="hover:text-blue-600 capitalize">{navState.category}</button>
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
      
      {/* Background Image - Aerial View Placeholder */}
      <div className="absolute inset-0 z-0">
          <img 
            src="https://placehold.co/1920x1080/1e293b/475569?text=VIET+Campus+Aerial+View" 
            alt="Campus Background" 
            className="w-full h-full object-cover opacity-100"
          />
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 h-full flex flex-col gap-4 p-4">
        {/* Header Navigation - Keep standard back button */}
        <div className="flex-none flex justify-between items-center">
            <button 
                onClick={() => navigate('/')} 
                className="flex items-center gap-2 bg-white/90 backdrop-blur text-slate-900 px-5 py-2.5 rounded-xl shadow-lg border-white/20 hover:bg-white font-bold transition-all group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Back to Home
            </button>
        </div>

        {/* Search Bar - Show ONLY if !selectedRoute */}
        {!selectedRoute && (
            <div className="w-full max-w-3xl mx-auto relative z-20">
                <div className="relative flex gap-2 shadow-2xl rounded-2xl">
                    <div className="relative flex-1">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder={isListening ? "Listening..." : "Search for anything (e.g., Principal, CSE HOD, Library)"}
                            className={`w-full pl-16 pr-4 py-5 bg-white text-slate-900 rounded-2xl focus:ring-4 focus:ring-blue-500/50 focus:outline-none text-xl font-medium shadow-inner transition-colors ${isListening ? 'bg-blue-50' : ''}`}
                        />
                    </div>
                    <button
                        onClick={startVoiceSearch}
                        className={`px-6 rounded-2xl transition-colors flex items-center justify-center ${
                        isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                        <Mic size={28} />
                    </button>
                </div>
                
                {/* Live Search Results Dropdown */}
                {query.trim() !== '' && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[60vh] overflow-y-auto border border-slate-200">
                        {searchResults.length === 0 ? (
                            <div className="p-6 text-center text-slate-500 flex flex-col items-center">
                                <MapPin size={32} className="mb-2 opacity-50"/>
                                No matches found.
                            </div>
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

        {/* Content Area - Adjusted Flex Behavior for Full Fit */}
        <div className={`flex-1 min-h-0 flex justify-center ${selectedRoute ? 'items-stretch pb-2' : 'items-start pt-8 pb-20'} overflow-hidden`}>
            {selectedRoute ? (
                // --- SHOW FULL SCREEN ROUTE DETAILS ---
                <div className="w-full h-full max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                    {/* Header: Title + New Search */}
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
                        {/* LEFT: Map (Flexible) + Stats (Fixed height at bottom) */}
                        <div className="flex-1 flex flex-col relative min-h-0">
                            {/* Map fills available space */}
                             <div className="flex-1 relative bg-slate-900 overflow-hidden group">
                                {selectedRoute.mapImage ? (
                                    <img src={selectedRoute.mapImage} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" alt="Map" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                                        <MapPin size={48} className="opacity-20"/>
                                    </div>
                                )}
                                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg font-bold text-slate-900 shadow-lg flex items-center gap-2">
                                    <MapPin size={18} className="text-red-500"/> Location Map
                                </div>
                            </div>
                            
                            {/* Stats Bar */}
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

                        {/* RIGHT: Steps + QR */}
                        <div className="w-full md:w-96 bg-slate-50/50 border-l border-slate-200 flex flex-col h-full min-h-0">
                            {/* Steps List - Scrollable */}
                            <div className="flex-1 p-5 overflow-y-auto">
                                <h3 className="font-bold text-lg mb-4 text-slate-800">Turn-by-Turn Directions</h3>
                                <div className="space-y-6 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-300">
                                    {selectedRoute.steps.map((step, idx) => (
                                        <div key={idx} className="relative flex gap-4">
                                            <div className="relative z-10 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-slate-50">
                                                {idx + 1}
                                            </div>
                                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex-1">
                                                <p className="font-bold text-slate-900">{step.instruction}</p>
                                                {step.detail && <p className="text-sm text-slate-500 mt-1">{step.detail}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* QR Code - Fixed at bottom */}
                            <div className="flex-none p-5 border-t border-slate-200 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
                                <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center gap-4 shadow-lg">
                                    <div className="bg-white p-1.5 rounded-lg flex-shrink-0">
                                        <QRCodeSVG 
                                            value={`${window.location.href.split('#')[0]}#/mobile/directions?id=${selectedRoute.id}`} 
                                            size={80} 
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-base text-yellow-400">Scan to Go</p>
                                        <p className="text-xs text-slate-300 leading-tight mt-1">Get these directions on your phone instantly.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // --- SHOW HIERARCHY BROWSER ---
                <div className="w-full max-w-5xl mx-auto">
                    {/* Breadcrumbs */}
                    {(navState.block || navState.category) && renderBreadcrumbs()}

                    {!navState.block ? (
                        // View 1: Block Select
                        <div>
                             <h2 className="text-white text-3xl font-bold mb-6 text-center shadow-black drop-shadow-md">Select a Block</h2>
                             {renderBlockSelection()}
                        </div>
                    ) : !navState.category && navState.block === 'Main Campus' ? (
                        // View 2: Category Select (Main Campus)
                        <div>
                            <h2 className="text-white text-3xl font-bold mb-6 text-center drop-shadow-md">What are you looking for?</h2>
                            {renderCategorySelection()}
                        </div>
                    ) : navState.category === 'academic' && !navState.department ? (
                         // View 3: Dept Select
                         <div>
                            <h2 className="text-white text-3xl font-bold mb-6 text-center drop-shadow-md">Select Department</h2>
                            {renderDeptSelection()}
                        </div>
                    ) : (
                         // View 4: Final List
                         <div>
                            <h2 className="text-white text-3xl font-bold mb-6 text-center drop-shadow-md">Select Destination</h2>
                            {renderLocationList(getFilteredLocations())}
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
