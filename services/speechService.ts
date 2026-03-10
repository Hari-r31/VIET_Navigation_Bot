
// Types for the Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: (event: Event) => void;
  onend: (event: Event) => void;
  onerror: (event: any) => void;
  onresult: (event: any) => void;
}

interface Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}

// --- Text to Speech (TTS) ---

let currentAudio: HTMLAudioElement | null = null;

// Check if voice is available (Always true for server-based TTS unless server is down)
export const isVoiceAvailable = (langCode: string): boolean => {
    return true; 
};

export const stopSpeaking = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
};

export const speak = (text: string, lang: 'en' | 'te' | 'hi' = 'en') => {
  stopSpeaking(); // Stop any currently playing audio

  if (!text) return;

  const ttsUrl = import.meta.env.VITE_TTS_API_URL || 'http://localhost:5000';
  const url = `${ttsUrl}/speak?text=${encodeURIComponent(text)}&lang=${lang}`;

  try {
    const audio = new Audio(url);
    currentAudio = audio;
    
    audio.play().catch(e => {
        console.error("Error playing TTS audio:", e);
    });
    
    audio.onended = () => {
        if (currentAudio === audio) {
            currentAudio = null;
        }
    };
  } catch (e) {
      console.error("Failed to initialize audio:", e);
  }
};

// --- Speech Recognition (STT) ---

export const startListening = (
  onResult: (text: string) => void,
  onEnd: () => void,
  onError: (error: string) => void,
  onInterim?: (text: string) => void,
  langCode: string = 'en-US'
) => {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError('Speech recognition not supported in this browser.');
    return null;
  }

  const recognition: SpeechRecognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true; // Enable interim results for real-time feedback
  recognition.lang = langCode;

  recognition.onstart = () => {
    // console.log('Listening started...');
  };

  recognition.onresult = (event: any) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    // Send interim results if available
    if (interimTranscript && onInterim) {
      onInterim(interimTranscript);
    }

    // Send final result
    if (finalTranscript) {
      onResult(finalTranscript);
    }
  };

  recognition.onerror = (event: any) => {
    // Ignore 'no-speech' error if it just means silence before end
    if (event.error === 'no-speech') {
        return; 
    }
    
    // Ignore aborted errors (usually user clicking mic button again to stop)
    if (event.error === 'aborted') {
        return;
    }

    let errorMessage = event.error;
    
    // Map common errors to user-friendly messages
    if (event.error === 'network') {
        errorMessage = 'Network error. Internet is required for voice search.';
    } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        errorMessage = 'Microphone access blocked. Check permissions.';
    }

    onError(errorMessage);
  };

  recognition.onend = () => {
    onEnd();
  };

  try {
    recognition.start();
    return recognition;
  } catch (e) {
    onError('Failed to start recognition');
    return null;
  }
};

export const startWakeWordListener = (
  onWake: () => void,
  onError: (error: string) => void,
  langCode: string = 'en-US'
) => {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError('Speech recognition not supported in this browser.');
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = langCode;

  recognition.onresult = (event: any) => {
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const transcript = event.results[i][0].transcript.toLowerCase().trim();
      
      // Check for wake words in both interim and final results for faster response
      if (transcript.includes('hey campus') || 
          transcript.includes('hello campus') || 
          transcript.includes('hello viet') ||
          transcript.includes('hey viet') ||
          transcript.includes('campus guide') ||
          transcript.includes('hey swecha') ||
          transcript.includes('hello swecha')) {
        
        recognition.stop();
        onWake();
        return;
      }
    }
  };

  recognition.onerror = (event: any) => {
      // Ignore benign errors
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      console.warn('Wake word error:', event.error);
  };

  try {
    recognition.start();
    return recognition;
  } catch (e) {
    console.error('Failed to start wake word recognition', e);
    return null;
  }
};
