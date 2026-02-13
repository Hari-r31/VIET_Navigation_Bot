
import React, { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Navigation, Clock, Footprints, Mic, ChevronRight, RotateCcw, ArrowLeft, ArrowRight, Building, Briefcase, GraduationCap, Coffee, Home, X } from 'lucide-react';
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
  const [showVoiceModal, setShowVoiceModal] = useState(false);

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

  const handleVoiceResult = (text: string) => {
      setQuery(text);
      handleSearch(text);
      const matches = searchLocations(text);
      if (matches.length > 0) {
          // Optional: Auto-select if perfect match?
          // For now, let's just show results to allow user confirmation
          toast.success(`Found: ${text}`);
      } else {
          toast.error("Could not find that location.");
      }
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
             placeholder="Search department (e.g., CSE, Mech)..."
             className="w-full pl-12 pr-12 py-4 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
           />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDepts.map(code => (
                <button 
                    key={code}
                    onClick={() => setNavState({...navState, department: code})}
                    className="p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all text-left flex items-center justify-between group"
                >
                    <div>
                        <span className="font-bold text-lg text-slate-800">{code}</span>
                        <span className="block text-xs text-slate-500">{DEPT_FULL_NAMES[code] || code} Department</span>
                    </div>
                    <ChevronRight className="text-slate-300 group-hover:text-blue-500" />
                </button>
            ))}
            {filteredDepts.length === 0 && (
                <div className="col-span-2 text-center text-slate-400 py-8">
                    No departments found matching "{deptFilter}"
                </div>
            )}
        </div>
      </div>
    );
  };

  // 4. Location List
  const renderLocationList = (locations: LocationData[]) => (
    <div className="grid grid-cols-1 gap-4 animate-in slide-in-from-bottom-8 duration-500">
      {locations.map(loc => (
        <button
          key={loc.id}
          onClick={() => handleSelectLocation(loc)}
          className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all flex justify-between items-center group text-left"
        >
          <div className="flex items-start gap-4">
             <div className="bg-slate-100 p-3 rounded-lg text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                <MapPin size={24} />
             </div>
             <div>
                <h4 className="text-lg font-bold text-slate-900 leading-tight">{loc.name}</h4>
                <div className="flex items-center gap-3 mt-1.5 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><Building size={14}/> {loc.block}</span>
                    <span className="flex items-center gap-1"><Navigation size={14}/> {loc.floor}</span>
                </div>
             </div>
          </div>
          <div className="flex flex-col items-end gap-1">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{loc.distance}m</span>
             <ChevronRight className="text-slate-300 group-hover:text-blue-500 transition-colors" />
          </div>
        </button>
      ))}
      {locations.length === 0 && (
          <div className="text-center py-12 text-slate-400">
              <Footprints size={48} className="mx-auto mb-3 opacity-30" />
              <p>No locations found in this category.</p>
          </div>
      )}
    </div>
  );

  // 5. Selected Route Details
  const renderRouteDetails = (loc: LocationData) => {
    // Generate Mobile URL
    const mobileUrl = `${window.location.origin}/#/mobile/directions?id=${loc.id}`;

    return (
      <div className="h-full flex flex-col md:flex-row gap-6 animate-in zoom-in-95 duration-300">
        
        {/* Left: Map & Instructions */}
        <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
            {/* Header */}
            <div className="bg-slate-900 text-white p-6 flex justify-between items-start shrink-0">
                <div>
                   <h2 className="text-3xl font-bold leading-tight">{loc.name}</h2>
                   <p className="text-blue-200 mt-1 flex items-center gap-2">
                      <MapPin size={16} /> {loc.block}, {loc.floor}
                   </p>
                </div>
                <button onClick={clearRoute} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                    <X size={24} />
                </button>
            </div>

            {/* Map Area */}
            <div className="aspect-video bg-slate-100 relative group overflow-hidden shrink-0 border-b border-slate-200">
                {loc.mapImage ? (
                    <img src={loc.mapImage} alt="Map" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">Map Unavailable</div>
                )}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                    {loc.estimatedTime} min walk
                </div>
            </div>

            {/* Steps List */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Navigation Steps</h3>
                <div className="space-y-6 relative pl-2">
                    {/* Line */}
                    <div className="absolute left-[19px] top-2 bottom-4 w-0.5 bg-slate-200"></div>

                    {loc.steps.map((step, idx) => (
                        <div key={idx} className="relative flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-white border-2 border-blue-500 text-blue-600 flex items-center justify-center font-bold text-sm shadow-sm relative z-10 shrink-0">
                                {idx + 1}
                            </div>
                            <div className="pt-2">
                                <p className="text-lg font-bold text-slate-800">{step.instruction}</p>
                                {step.detail && <p className="text-slate-500 text-sm mt-1">{step.detail}</p>}
                            </div>
                        </div>
                    ))}
                    
                    <div className="relative flex gap-4 pt-2">
                        <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center shadow-md relative z-10 shrink-0">
                            <MapPin size={20} fill="currentColor" />
                        </div>
                        <div className="pt-2">
                             <p className="text-lg font-bold text-green-700">You have arrived</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Right: Quick Actions (Mobile Transfer) */}
        <div className="w-full md:w-80 flex flex-col gap-4 shrink-0">
            <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <h3 className="text-xl font-bold mb-2">Take it with you</h3>
                <p className="text-blue-100 text-sm mb-6">Scan to get these directions on your phone.</p>
                
                <div className="bg-white p-4 rounded-2xl w-fit mx-auto shadow-inner">
                    <QRCodeSVG value={mobileUrl} size={140} />
                </div>
                <p className="text-center text-xs text-blue-200 mt-4 font-medium">No app required</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200 flex-1 flex flex-col justify-center gap-4">
                <div className="text-center">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Estimated Time</span>
                    <p className="text-3xl font-black text-slate-900">{loc.estimatedTime} min</p>
                </div>
                <div className="w-full h-px bg-slate-100"></div>
                <div className="text-center">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Distance</span>
                    <p className="text-3xl font-black text-slate-900">{loc.distance} m</p>
                </div>
            </div>

            <button 
                onClick={clearRoute} 
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2"
            >
                <RotateCcw size={20} /> Start New Search
            </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full relative">
       {/* Voice Modal Component */}
       <VoiceSearchModal 
           isOpen={showVoiceModal} 
           onClose={() => setShowVoiceModal(false)} 
           onResult={handleVoiceResult} 
       />

       {/* Top Search Bar - Hidden if route selected */}
       {!selectedRoute && (
         <div className="bg-white p-4 shadow-sm border-b border-slate-200 z-10 shrink-0 sticky top-0">
            <div className="relative max-w-2xl mx-auto">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
               <input 
                  type="text" 
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search for classrooms, labs, or amenities..."
                  className="w-full pl-14 pr-14 py-4 bg-slate-100 border-transparent focus:bg-white border focus:border-blue-500 rounded-2xl focus:outline-none transition-all text-xl shadow-inner placeholder:text-slate-400"
               />
               <button 
                 onClick={() => setShowVoiceModal(true)}
                 className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                 title="Voice Search"
               >
                 <Mic size={24} />
               </button>
            </div>
         </div>
       )}

       {/* Main Content Area */}
       <div className="flex-1 overflow-y-auto p-4 relative bg-slate-50/50">
          
          {selectedRoute ? (
             renderRouteDetails(selectedRoute)
          ) : query ? (
             /* Search Results Mode */
             <div className="max-w-4xl mx-auto pt-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Search Results</h2>
                    <button onClick={() => setQuery('')} className="text-blue-600 text-sm font-medium hover:underline">Clear Search</button>
                </div>
                {renderLocationList(searchResults)}
             </div>
          ) : (
             /* Browsing Mode */
             <div className="max-w-5xl mx-auto h-full flex flex-col">
                
                {/* Breadcrumb Header */}
                <div className="flex items-center gap-2 mb-6 text-slate-500 text-sm font-medium">
                    <button onClick={resetNavigation} className="hover:text-blue-600 flex items-center gap-1">
                        <Home size={16} /> Campus
                    </button>
                    {navState.block && (
                        <>
                           <ChevronRight size={14} />
                           <button onClick={() => setNavState({...navState, category: undefined, department: undefined})} className="hover:text-blue-600">
                               {navState.block}
                           </button>
                        </>
                    )}
                    {navState.category && (
                        <>
                           <ChevronRight size={14} />
                           <span className="text-slate-900 capitalize">{navState.category}</span>
                        </>
                    )}
                </div>

                {/* Content Logic */}
                {!navState.block ? (
                    <>
                       <div className="mb-8">
                          <h2 className="text-3xl font-black text-slate-900 mb-2">Where do you want to go?</h2>
                          <p className="text-slate-500 text-lg">Select a building or block to start exploring.</p>
                       </div>
                       {renderBlockSelection()}
                    </>
                ) : (
                    <>
                       {!navState.category && !navState.department ? (
                           <>
                             <div className="mb-8 flex items-end justify-between">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 mb-2">{navState.block}</h2>
                                    <p className="text-slate-500 text-lg">What are you looking for in this block?</p>
                                </div>
                                <button onClick={() => setNavState({})} className="text-blue-600 font-bold flex items-center gap-1 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                                    <ArrowLeft size={18} /> Back
                                </button>
                             </div>
                             {renderCategorySelection()}
                           </>
                       ) : (
                           <div className="h-full flex flex-col">
                               <div className="mb-6 flex items-center justify-between">
                                   <h2 className="text-2xl font-bold text-slate-900 capitalize flex items-center gap-2">
                                       {navState.department ? `${navState.department} Department` : navState.category}
                                   </h2>
                                   <button 
                                      onClick={() => navState.department ? setNavState({...navState, department: undefined}) : setNavState({...navState, category: undefined})} 
                                      className="text-slate-500 hover:text-slate-900 flex items-center gap-1"
                                   >
                                       <ArrowLeft size={18} /> Back
                                   </button>
                               </div>

                               {navState.category === 'academic' && !navState.department ? (
                                   renderDeptSelection()
                               ) : (
                                   renderLocationList(getFilteredLocations())
                               )}
                           </div>
                       )}
                    </>
                )}
             </div>
          )}
       </div>
    </div>
  );
};

export default Directions;
