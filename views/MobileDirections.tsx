import React, { useMemo, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getLocations } from '../data/mockData';
import { MapPin, Navigation, Clock, Footprints, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const MobileDirections: React.FC = () => {

const [searchParams] = useSearchParams();

const id = searchParams.get('id');
const voiceParam = searchParams.get('voice');
const langParam = searchParams.get('lang');

const { t, language, speak, stopSpeaking, isVoiceEnabled, toggleVoice, setLanguage } = useLanguage();

const [hasSyncedVoice, setHasSyncedVoice] = useState(false);


// ✅ Sync language from QR
useEffect(() => {

if (langParam === 'en' || langParam === 'te' || langParam === 'hi') {
setLanguage(langParam);
}

}, [langParam, setLanguage]);


// ✅ Get translated locations
const locations = useMemo(() => getLocations(language), [language]);


// ✅ Find correct location in current language
const location = useMemo(() => {

return locations.find(l => l.id === id);

}, [id, locations]);



// Sync voice state from URL
useEffect(() => {

if (!hasSyncedVoice && voiceParam !== null) {

const shouldBeEnabled = voiceParam === 'true';

if (isVoiceEnabled !== shouldBeEnabled) {
toggleVoice();
}

setHasSyncedVoice(true);

}

}, [voiceParam, isVoiceEnabled, toggleVoice, hasSyncedVoice]);



// Auto speak directions
useEffect(() => {

if (location && isVoiceEnabled && hasSyncedVoice) {

const timeout = setTimeout(() => {
readDirections();
}, 1000);

return () => clearTimeout(timeout);

}

}, [location, hasSyncedVoice, isVoiceEnabled]);



const readDirections = () => {

if (!location) return;

const stepsText = location.steps
.map(
(step, idx) =>
`${t?.dir_step || "Step"} ${idx + 1}: ${step.instruction}. ${
step.detail || ""
}`
)
.join(". ");


const fullText = `${t?.dir_navigation_to || "Navigation to"} ${
location.name
}. ${t?.dir_estimated_time || "Estimated time"} ${
location.estimatedTime
} ${t?.dir_minutes || "minutes"}. ${stepsText}. ${
t?.dir_arrived || "You have arrived"
}.`;

stopSpeaking();
speak(fullText);

};



if (!location) {

return (

<div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">

<div className="text-center">

<h1 className="text-xl font-bold text-slate-900 mb-2">
{t?.dir_location_not_found || "Location Not Found"}
</h1>

<p className="text-slate-500">
{t?.dir_invalid_link || "The requested location could not be found."}
</p>

</div>

</div>

);

}



return (

<div className="h-[100dvh] bg-white text-slate-900 font-sans flex flex-col overflow-hidden">

{/* Header */}
<div className="bg-blue-600 text-white p-4 shrink-0 shadow-md z-20 flex justify-between items-start">

<div className="flex items-start gap-3">

<div className="bg-white/20 p-2 rounded-lg mt-0.5">
<Navigation className="text-white" size={24} />
</div>

<div>
<h1 className="text-xl font-bold leading-tight">{location.name}</h1>
<p className="text-blue-100 text-sm mt-0.5 font-medium">
{location.block}, {location.floor}
</p>
</div>

</div>

<button
onClick={toggleVoice}
className={`p-2 rounded-full transition-colors ${
isVoiceEnabled ? "bg-white/20 text-white" : "bg-black/20 text-white/70"
}`}
>
{isVoiceEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
</button>

</div>


{/* Stats */}
<div className="grid grid-cols-2 gap-px bg-slate-200 border-b border-slate-200 shrink-0 z-10">

<div className="bg-white p-3 flex flex-col items-center justify-center text-center">

<span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
{t?.dir_time || "Time"}
</span>

<span className="text-lg font-black text-slate-800 flex items-center gap-1.5">
<Clock size={16} className="text-blue-500" />
{location.estimatedTime} min
</span>

</div>


<div className="bg-white p-3 flex flex-col items-center justify-center text-center">

<span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
{t?.dir_distance || "Distance"}
</span>

<span className="text-lg font-black text-slate-800 flex items-center gap-1.5">
<Footprints size={16} className="text-blue-500" />
{location.distance}m
</span>

</div>

</div>



{/* Map */}
<div className="aspect-video w-full bg-slate-100 relative overflow-hidden border-b border-slate-200 shrink-0">

{location.mapImage ? (

<img
src={location.mapImage}
className="w-full h-full object-cover"
alt="Location Map"
/>

) : (

<div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
{t?.dir_no_map || "No Map Available"}
</div>

)}

<div className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] px-2 py-1 rounded backdrop-blur-md">
{t?.dir_overview_map || "Overview Map"}
</div>


<button
onClick={readDirections}
className="absolute bottom-3 left-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 font-bold transition-transform active:scale-95 z-20 text-xs"
>
<Volume2 size={14} />
{t?.dir_read || "Read"}
</button>

</div>



{/* Steps */}
<div className="flex-1 overflow-y-auto bg-slate-50 relative">

<div className="p-6 pb-20">

<h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900 sticky top-0 bg-slate-50 py-2 z-10">
<span className="w-1.5 h-6 bg-blue-600 rounded-full block"></span>
{t?.dir_step_by_step || "Step-by-Step"}
</h2>


<div className="space-y-0 relative">

<div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-300"></div>


{location.steps.map((step, idx) => (

<div key={idx} className="relative flex gap-5 pb-8 last:pb-2">

<div className="relative z-10 w-10 h-10 rounded-full bg-white border-2 border-blue-600 text-blue-600 flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
{idx + 1}
</div>


<div className="pt-1 flex-1">

<p className="text-base font-bold text-slate-800 leading-snug mb-1">
{step.instruction}
</p>

{step.detail && (
<p className="text-slate-500 text-sm leading-relaxed">
{step.detail}
</p>
)}

</div>

</div>

))}



{/* Destination */}
<div className="relative flex gap-5 pt-4">

<div className="relative z-10 w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center shadow-md flex-shrink-0 ring-4 ring-white">
<MapPin size={20} fill="currentColor" />
</div>

<div className="pt-2">
<p className="text-lg font-bold text-green-700">
{t?.dir_arrived || "You have arrived"}
</p>

<p className="text-sm text-green-600/80">{location.name}</p>
</div>

</div>

</div>


{/* Footer */}
<div className="pt-12 pb-6 text-center mt-4 flex flex-col items-center">

<p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
Visakha Institute of Engineering & Technology
</p>

<p className="text-slate-300 text-[10px]">
{t?.dir_navigation_assistant || "Digital Navigation Assistant"}
</p>

</div>

</div>

</div>

</div>

);

};

export default MobileDirections;