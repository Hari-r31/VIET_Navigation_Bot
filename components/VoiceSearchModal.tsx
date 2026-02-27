
import React, { useEffect, useState, useRef } from 'react';
import { Mic, X, Check, Loader2 } from 'lucide-react';
import { startListening } from '../services/speechService';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResult: (text: string) => void;
  langCode?: string;
}

const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({ isOpen, onClose, onResult, langCode = 'en-US' }) => {
  const [interimText, setInterimText] = useState('');
  const [status, setStatus] = useState<'listening' | 'processing' | 'error'>('listening');
  const [errorMessage, setErrorMessage] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      setStatus('listening');
      setInterimText('');
      setErrorMessage('');
      
      // Small delay to allow UI to mount before starting mic
      const timeoutId = setTimeout(() => {
        const instance = startListening(
            (finalText) => {
                handleComplete(finalText);
            },
            () => {
                // On End - usually silent end
                if (status !== 'error' && !interimText) {
                    // onClose(); // Optional: close on silence? Better to let user control or retry.
                }
            },
            (error) => {
                setStatus('error');
                setErrorMessage(error);
            },
            (interim) => {
                setInterimText(interim);
            },
            langCode
        );
        recognitionRef.current = instance;
      }, 100);

      return () => clearTimeout(timeoutId);
    } else {
       stopRecognition();
    }

    return () => {
        stopRecognition();
    };
  }, [isOpen]);

  const stopRecognition = () => {
      if (recognitionRef.current) {
          try {
              recognitionRef.current.abort();
          } catch (e) {
              // ignore
          }
          recognitionRef.current = null;
      }
  };

  const handleComplete = (text: string) => {
      if (!text) return;
      onResult(text);
      onClose();
  };

  const handleManualDone = () => {
      // Use whatever text we have
      if (interimText) {
          onResult(interimText);
          onClose();
      } else {
          // If no text, just close
          onClose();
      }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300">
      <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
        <X size={32} />
      </button>

      <div className="flex flex-col items-center justify-center w-full max-w-3xl px-6 text-center">
         
         {/* Status Text */}
         <h2 className="text-3xl font-bold text-white mb-12 flex items-center gap-3">
            {status === 'listening' && (
                <>
                   Listening <span className="flex gap-1"><span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span><span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-100"></span><span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-200"></span></span>
                </>
            )}
            {status === 'processing' && (
                <>
                   Processing <Loader2 className="animate-spin" />
                </>
            )}
            {status === 'error' && "Couldn't hear you"}
         </h2>

         {/* Animation & Icon */}
         <div className="relative mb-12 group cursor-pointer" onClick={status === 'error' ? () => onClose() : undefined}>
            {/* Glowing Backdrop */}
            <div className={`absolute inset-0 bg-blue-500 rounded-full blur-3xl opacity-40 transition-opacity duration-500 ${status === 'listening' ? 'animate-pulse opacity-60' : ''} ${status === 'error' ? 'bg-red-500 opacity-20' : ''}`}></div>
            
            {/* Main Circle */}
            <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center shadow-2xl relative z-10 transition-all duration-500 ${
                status === 'error' ? 'bg-gradient-to-tr from-red-500 to-red-600' : 'bg-gradient-to-tr from-blue-600 to-indigo-600'
            }`}>
               <Mic size={56} className={`text-white transition-transform duration-300 ${status === 'listening' ? 'scale-110' : ''}`} />
            </div>
            
            {/* Ripples */}
            {status === 'listening' && (
                <>
                 <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping" style={{ animationDuration: '2s' }}></div>
                 <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }}></div>
                </>
            )}
         </div>

         {/* Transcript Display */}
         <div className="min-h-[140px] flex items-center justify-center w-full">
            {status === 'error' ? (
                <div className="flex flex-col items-center gap-2">
                    <p className="text-xl text-red-200 font-medium">{errorMessage || "Microphone access denied or not supported."}</p>
                    <button onClick={onClose} className="mt-4 text-white underline underline-offset-4 hover:text-blue-200">Try Again</button>
                </div>
            ) : (
                <p className={`text-2xl md:text-4xl font-medium leading-relaxed break-words w-full max-w-2xl transition-all duration-300 ${interimText ? 'text-white scale-100' : 'text-white/30 scale-95'}`}>
                    {interimText || 'Speak now...'}
                </p>
            )}
         </div>

         {/* Controls */}
         <div className="mt-8 flex gap-4 animate-in slide-in-from-bottom-4 duration-500 delay-100">
             <button 
                onClick={onClose}
                className="px-8 py-4 rounded-2xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-all"
             >
                Cancel
             </button>
             {status !== 'error' && (
                <button 
                    onClick={handleManualDone}
                    disabled={!interimText}
                    className="px-10 py-4 rounded-2xl bg-white text-blue-900 font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-900/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    <Check size={24} className="text-blue-600" /> 
                    Done
                </button>
             )}
         </div>

         <p className="mt-8 text-white/20 text-sm">Tap "Done" if the search doesn't start automatically.</p>
      </div>
    </div>
  );
};

export default VoiceSearchModal;
