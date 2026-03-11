import React, { useEffect, useState, useRef } from 'react';
import { Mic, X, Check, Loader2, Square } from 'lucide-react';
import { startListening, SttHandle } from '../services/speechService';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResult: (text: string) => void;
  langCode?: string;
}

type Status = 'recording' | 'processing' | 'error';

const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({
  isOpen,
  onClose,
  onResult,
  langCode = 'en-US',
}) => {
  const [status, setStatus] = useState<Status>('recording');
  const [errorMessage, setErrorMessage] = useState('');
  const handleRef = useRef<SttHandle | null>(null);

  // ── Start / stop recording when modal opens / closes ──────────────────────
  useEffect(() => {
    if (!isOpen) {
      cancelRecording();
      return;
    }

    setStatus('recording');
    setErrorMessage('');

    // Small delay so the modal animation completes before mic starts
    const tid = setTimeout(() => {
      const handle = startListening(
        // onResult — transcription returned from Vosk backend
        (text) => {
          onResult(text);
          onClose();
        },
        // onEnd — recording + network round-trip finished
        () => { /* nothing extra needed here */ },
        // onError
        (msg) => {
          setStatus('error');
          setErrorMessage(msg);
        },
        // onInterim — not used with Vosk (batch mode); ignored
        undefined,
        langCode,
      );
      handleRef.current = handle;
    }, 120);

    return () => {
      clearTimeout(tid);
      cancelRecording();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const cancelRecording = () => {
    handleRef.current?.abort();
    handleRef.current = null;
  };

  /** User clicks "Done" — stop mic early and let the backend transcribe */
  const handleDone = () => {
    if (status !== 'recording') return;
    setStatus('processing');
    handleRef.current?.stop();
  };

  const handleClose = () => {
    cancelRecording();
    onClose();
  };

  if (!isOpen) return null;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300">
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-6 right-6 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
      >
        <X size={32} />
      </button>

      <div className="flex flex-col items-center justify-center w-full max-w-3xl px-6 text-center">

        {/* Status heading */}
        <h2 className="text-3xl font-bold text-white mb-12 flex items-center gap-3">
          {status === 'recording' && (
            <>
              Listening
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </span>
            </>
          )}
          {status === 'processing' && (
            <>Processing <Loader2 className="animate-spin" /></>
          )}
          {status === 'error' && "Couldn't hear you"}
        </h2>

        {/* Mic animation */}
        <div className="relative mb-12">
          {/* Glow */}
          <div className={`absolute inset-0 rounded-full blur-3xl transition-opacity duration-500
            ${status === 'recording' ? 'bg-blue-500 opacity-60 animate-pulse' : ''}
            ${status === 'processing' ? 'bg-indigo-400 opacity-30' : ''}
            ${status === 'error'      ? 'bg-red-500   opacity-20' : ''}`}
          />

          {/* Circle */}
          <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center shadow-2xl relative z-10 transition-all duration-500
            ${status === 'error' ? 'bg-gradient-to-tr from-red-500 to-red-600' : 'bg-gradient-to-tr from-blue-600 to-indigo-600'}`}
          >
            {status === 'processing'
              ? <Loader2 size={56} className="text-white animate-spin" />
              : <Mic size={56} className={`text-white transition-transform duration-300 ${status === 'recording' ? 'scale-110' : ''}`} />
            }
          </div>

          {/* Ripples while recording */}
          {status === 'recording' && (
            <>
              <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping" style={{ animationDuration: '2s' }} />
              <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
            </>
          )}
        </div>

        {/* Message area */}
        <div className="min-h-[140px] flex items-center justify-center w-full">
          {status === 'error' ? (
            <div className="flex flex-col items-center gap-2">
              <p className="text-xl text-red-200 font-medium">
                {errorMessage || 'Microphone access denied or not supported.'}
              </p>
              <button onClick={handleClose} className="mt-4 text-white underline underline-offset-4 hover:text-blue-200">
                Try Again
              </button>
            </div>
          ) : status === 'processing' ? (
            <p className="text-2xl text-white/70 font-medium animate-pulse">
              Transcribing your speech…
            </p>
          ) : (
            <p className="text-2xl md:text-3xl font-medium text-white/40">
              Speak now — tap <span className="text-white font-bold">Done</span> or wait up to 8 s
            </p>
          )}
        </div>

        {/* Control buttons */}
        <div className="mt-8 flex gap-4 animate-in slide-in-from-bottom-4 duration-500 delay-100">
          <button
            onClick={handleClose}
            className="px-8 py-4 rounded-2xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-all"
          >
            Cancel
          </button>

          {status === 'recording' && (
            <button
              onClick={handleDone}
              className="px-10 py-4 rounded-2xl bg-white text-blue-900 font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-900/20 flex items-center gap-2"
            >
              <Square size={20} className="text-blue-600 fill-blue-600" />
              Done
            </button>
          )}
        </div>

        <p className="mt-8 text-white/20 text-sm">
          Using offline Vosk speech recognition — no internet needed for STT.
        </p>
      </div>
    </div>
  );
};

export default VoiceSearchModal;
