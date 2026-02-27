
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

// Keep a reference to the utterance to prevent garbage collection
let currentUtterance: SpeechSynthesisUtterance | null = null;

const getVoiceForLang = (langCode: string): SpeechSynthesisVoice | null => {
  const voices = window.speechSynthesis.getVoices();
  const shortLang = langCode.split('-')[0]; // 'te', 'hi', 'en'
  
  // Priority 1: Google voices (usually higher quality) with exact lang match
  let voice = voices.find(v => v.lang === langCode && v.name.includes('Google'));

  // Priority 2: Any voice with exact lang match
  if (!voice) {
    voice = voices.find(v => v.lang === langCode);
  }

  // Priority 3: Fuzzy match (starts with 'te', 'hi', etc.) - Handles 'te_IN' vs 'te-IN'
  if (!voice) {
    voice = voices.find(v => v.lang.toLowerCase().startsWith(shortLang));
  }

  // Priority 4: Name match (Fallback if lang tags are missing/wrong)
  if (!voice) {
      if (shortLang === 'te') voice = voices.find(v => v.name.toLowerCase().includes('telugu'));
      if (shortLang === 'hi') voice = voices.find(v => v.name.toLowerCase().includes('hindi'));
      if (shortLang === 'en') voice = voices.find(v => v.name.toLowerCase().includes('english'));
  }

  // Priority 5: Fallback for English (if en-IN not found, try en-US or any en)
  if (!voice && shortLang === 'en') {
     voice = voices.find(v => v.lang.startsWith('en'));
  }

  return voice || null;
};

export const isVoiceAvailable = (langCode: string): boolean => {
    // Map simple lang codes to BCP 47
    let targetLang = 'en-IN';
    if (langCode === 'te') targetLang = 'te-IN';
    if (langCode === 'hi') targetLang = 'hi-IN';
    
    return !!getVoiceForLang(targetLang);
};

export const stopSpeaking = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
};

export const speak = (text: string, lang: 'en' | 'te' | 'hi' = 'en') => {
  if (!('speechSynthesis' in window)) {
    console.warn('Text-to-speech not supported');
    return;
  }

  // Cancel any current speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  currentUtterance = utterance; // Store reference
  
  // Map simple lang codes to BCP 47
  let targetLang = 'en-IN';
  if (lang === 'te') targetLang = 'te-IN';
  if (lang === 'hi') targetLang = 'hi-IN';
  
  utterance.lang = targetLang;
  
  // Fix for cutting off: Pause and Resume to keep engine active
  // This is a known Chrome bug workaround
  const resumeInfinity = () => {
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
      if (window.speechSynthesis.speaking) {
          setTimeout(resumeInfinity, 10000);
      }
  };

  utterance.onstart = () => {
      resumeInfinity();
  };

  utterance.onend = () => {
      currentUtterance = null;
  };
  
  const speakWithVoice = () => {
      const voice = getVoiceForLang(targetLang);
      if (voice) {
          utterance.voice = voice;
      } else {
          console.warn(`No voice found for ${targetLang}, using default.`);
      }
      window.speechSynthesis.speak(utterance);
  };

  // Load voices if not already loaded (chrome requires this sometimes)
  if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
          speakWithVoice();
          // Remove listener to prevent memory leaks or multiple calls if we were to keep it
          window.speechSynthesis.onvoiceschanged = null; 
      };
  } else {
      speakWithVoice();
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
