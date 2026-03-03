
import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LOCATIONS } from '../data/mockData';
import { MapPin, Navigation, Clock, Footprints } from 'lucide-react';

const MobileDirections: React.FC = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const location = useMemo(() => LOCATIONS.find(l => l.id === id), [id]);

  if (!location) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
            <h1 className="text-xl font-bold text-slate-900 mb-2">Location Not Found</h1>
            <p className="text-slate-500">The requested location could not be found. The link may be invalid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white text-slate-900 font-sans flex flex-col overflow-hidden">
       {/* Mobile Header - Fixed */}
       <div className="bg-blue-600 text-white p-4 shrink-0 shadow-md z-20">
          <div className="flex items-start gap-3">
             <div className="bg-white/20 p-2 rounded-lg mt-0.5">
                <Navigation className="text-white" size={24} />
             </div>
             <div>
                 <h1 className="text-xl font-bold leading-tight">{location.name}</h1>
                 <p className="text-blue-100 text-sm mt-0.5 font-medium">{location.block}, {location.floor}</p>
             </div>
          </div>
       </div>

       {/* Quick Stats - Fixed */}
       <div className="grid grid-cols-2 gap-px bg-slate-200 border-b border-slate-200 shrink-0 z-10">
          <div className="bg-white p-3 flex flex-col items-center justify-center text-center">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Time</span>
              <span className="text-lg font-black text-slate-800 flex items-center gap-1.5">
                 <Clock size={16} className="text-blue-500" /> {location.estimatedTime} min
              </span>
          </div>
          <div className="bg-white p-3 flex flex-col items-center justify-center text-center">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Distance</span>
              <span className="text-lg font-black text-slate-800 flex items-center gap-1.5">
                 <Footprints size={16} className="text-blue-500" /> {location.distance}m
              </span>
          </div>
       </div>

       {/* Map Image Area - Fixed */}
       <div className="aspect-video w-full bg-slate-100 relative overflow-hidden border-b border-slate-200 shrink-0">
          {location.mapImage ? (
             <img src={location.mapImage} className="w-full h-full object-cover" alt="Location Map" />
          ) : (
             <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">No Map Available</div>
          )}
          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] px-2 py-1 rounded backdrop-blur-md">
            Overview Map
          </div>
       </div>

       {/* Steps Container - Scrollable */}
       <div className="flex-1 overflow-y-auto bg-slate-50 relative">
          <div className="p-6 pb-20">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900 sticky top-0 bg-slate-50 py-2 z-10">
                 <span className="w-1.5 h-6 bg-blue-600 rounded-full block"></span>
                 Step-by-Step
              </h2>
              
              <div className="space-y-0 relative">
                 {/* Connecting line */}
                 <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-300"></div>

                 {location.steps.map((step, idx) => (
                    <div key={idx} className="relative flex gap-5 pb-8 last:pb-2">
                       {/* Step Indicator */}
                       <div className="relative z-10 w-10 h-10 rounded-full bg-white border-2 border-blue-600 text-blue-600 flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                          {idx + 1}
                       </div>
                       
                       {/* Content */}
                       <div className="pt-1 flex-1">
                          <p className="text-base font-bold text-slate-800 leading-snug mb-1">{step.instruction}</p>
                          {step.detail && <p className="text-slate-500 text-sm leading-relaxed">{step.detail}</p>}
                       </div>
                    </div>
                 ))}
                 
                 {/* Destination Marker */}
                 <div className="relative flex gap-5 pt-4">
                     <div className="relative z-10 w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center shadow-md flex-shrink-0 ring-4 ring-white">
                        <MapPin size={20} fill="currentColor" />
                     </div>
                     <div className="pt-2">
                        <p className="text-lg font-bold text-green-700">You have arrived</p>
                        <p className="text-sm text-green-600/80">{location.name}</p>
                     </div>
                 </div>
              </div>

              {/* Footer */}
              <div className="pt-12 pb-6 text-center mt-4 flex flex-col items-center">
                  <img 
                    src="https://i.imgur.com/8J5j5j5.png" 
                    alt="VIET Logo" 
                    className="w-12 h-12 object-contain mb-2 opacity-50 grayscale"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                    }}
                  />
                  <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Visakha Institute of Engineering & Technology</p>
                  <p className="text-slate-300 text-[10px]">Digital Navigation Assistant</p>
              </div>
          </div>
       </div>
    </div>
  );
};

export default MobileDirections;
