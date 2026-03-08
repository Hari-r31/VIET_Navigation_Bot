
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
  
  // User-requested mandatory voice keywords
  const preferredKeywords = ['female', 'woman', 'zira', 'samantha', 'google us english'];

  const isPreferred = (v: SpeechSynthesisVoice) => {
    const name = v.name.toLowerCase();
    return preferredKeywords.some(k => name.includes(k));
  };

  const isMale = (v: SpeechSynthesisVoice) => {
      const name = v.name.toLowerCase();
      return name.includes('male') && !name.includes('female');
  };

  // Priority 1: Exact Language + Preferred Voice (The "Mandatory" check)
  // e.g. en-IN + Female
  let voice = voices.find(v => v.lang === langCode && isPreferred(v));

  // Priority 2: Same Major Language + Preferred Voice
  // e.g. en-US + Zira (when requesting en-IN)
  if (!voice) {
    voice = voices.find(v => v.lang.startsWith(shortLang) && isPreferred(v));
  }

  // Priority 3: Specific check for "Google US English" if English is requested (common female voice)
  if (!voice && shortLang === 'en') {
      voice = voices.find(v => v.name.includes('Google US English'));
  }

  // Priority 4: Exact Language + NOT Male (Avoid explicit male voices)
  if (!voice) {
      voice = voices.find(v => v.lang === langCode && !isMale(v));
  }

  // Priority 5: Same Major Language + NOT Male
  if (!voice) {
      voice = voices.find(v => v.lang.startsWith(shortLang) && !isMale(v));
  }

  // Priority 6: Fallback to Google (High quality, might be male but better than robotic)
  if (!voice) {
    voice = voices.find(v => v.lang.startsWith(shortLang) && v.name.includes('Google'));
  }

  // Priority 7: Absolute Fallback (Any voice in that language)
  if (!voice) {
     voice = voices.find(v => v.lang.startsWith(shortLang));
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
