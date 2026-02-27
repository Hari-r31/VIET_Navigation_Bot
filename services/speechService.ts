
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

let synthesisVoice: SpeechSynthesisVoice | null = null;

const getVoiceForLang = (langCode: string): SpeechSynthesisVoice | null => {
  const voices = window.speechSynthesis.getVoices();
  // Preference: Female voice, then matching language
  // Lang codes: 'en-IN', 'te-IN', 'hi-IN'
  
  // 1. Try to find exact match with 'female' or 'Google' (often better quality)
  let voice = voices.find(v => v.lang === langCode && (v.name.includes('Female') || v.name.includes('Google')));
  
  // 2. Try any voice for that language
  if (!voice) {
    voice = voices.find(v => v.lang === langCode);
  }

  // 3. Fallback to similar language (e.g. en-US for en-IN)
  if (!voice && langCode.startsWith('en')) {
     voice = voices.find(v => v.lang.startsWith('en'));
  }

  return voice || null;
};

export const stopSpeaking = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
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
  
  // Map simple lang codes to BCP 47
  let targetLang = 'en-IN';
  if (lang === 'te') targetLang = 'te-IN';
  if (lang === 'hi') targetLang = 'hi-IN';
  
  utterance.lang = targetLang;
  
  // Load voices if not already loaded (chrome requires this sometimes)
  if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
          const voice = getVoiceForLang(targetLang);
          if (voice) utterance.voice = voice;
          window.speechSynthesis.speak(utterance);
      };
  } else {
      const voice = getVoiceForLang(targetLang);
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
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
