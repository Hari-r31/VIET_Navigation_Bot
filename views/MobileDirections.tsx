
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
    <div className="min-h-screen bg-white text-slate-900 pb-12 font-sans">
       {/* Mobile Header */}
       <div className="bg-blue-600 text-white p-6 sticky top-0 z-10 shadow-md">
          <div className="flex items-start gap-3">
             <div className="bg-white/20 p-2 rounded-lg mt-0.5">
                <Navigation className="text-white" size={24} />
             </div>
             <div>
                 <h1 className="text-2xl font-bold leading-tight">{location.name}</h1>
                 <p className="text-blue-100 text-sm mt-1 font-medium">{location.block}, {location.floor}</p>
             </div>
          </div>
       </div>

       {/* Quick Stats */}
       <div className="grid grid-cols-2 gap-px bg-slate-200 border-b border-slate-200">
          <div className="bg-white p-4 flex flex-col items-center justify-center text-center">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Time</span>
              <span className="text-xl font-black text-slate-800 flex items-center gap-2">
                 <Clock size={16} className="text-blue-500" /> {location.estimatedTime} min
              </span>
          </div>
          <div className="bg-white p-4 flex flex-col items-center justify-center text-center">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Distance</span>
              <span className="text-xl font-black text-slate-800 flex items-center gap-2">
                 <Footprints size={16} className="text-blue-500" /> {location.distance}m
              </span>
          </div>
       </div>

       {/* Map Image Area */}
       <div className="aspect-video w-full bg-slate-100 relative overflow-hidden border-b border-slate-200">
          {location.mapImage ? (
             <img src={location.mapImage} className="w-full h-full object-cover" alt="Location Map" />
          ) : (
             <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">No Map Available</div>
          )}
          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-md">
            Overview Map
          </div>
       </div>

       {/* Steps Container */}
       <div className="p-6">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900">
             <span className="w-1.5 h-6 bg-blue-600 rounded-full block"></span>
             Step-by-Step
          </h2>
          
          <div className="space-y-8 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200 pb-4">
             {location.steps.map((step, idx) => (
                <div key={idx} className="relative flex gap-5">
                   {/* Step Indicator */}
                   <div className="relative z-10 w-10 h-10 rounded-full bg-white border-2 border-blue-600 text-blue-600 flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                      {idx + 1}
                   </div>
                   
                   {/* Content */}
                   <div className="pt-1 flex-1">
                      <p className="text-lg font-bold text-slate-800 leading-snug mb-1">{step.instruction}</p>
                      {step.detail && <p className="text-slate-500 text-sm leading-relaxed">{step.detail}</p>}
                   </div>
                </div>
             ))}
             
             {/* Destination Marker */}
             <div className="relative flex gap-5">
                 <div className="relative z-10 w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center shadow-md flex-shrink-0 ring-4 ring-white">
                    <MapPin size={20} fill="currentColor" />
                 </div>
                 <div className="pt-2">
                    <p className="text-lg font-bold text-green-700">You have arrived</p>
                    <p className="text-sm text-green-600/80">{location.name}</p>
                 </div>
             </div>
          </div>
       </div>

       {/* Footer */}
       <div className="p-8 text-center border-t border-slate-100 mt-4 bg-slate-50">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Visakha Institute of Engineering & Technology</p>
          <p className="text-slate-300 text-xs">Digital Navigation Assistant</p>
       </div>
    </div>
  );
};

export default MobileDirections;
