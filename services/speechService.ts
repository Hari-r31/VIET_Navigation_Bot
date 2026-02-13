
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

export const startListening = (
  onResult: (text: string) => void,
  onEnd: () => void,
  onError: (error: string) => void,
  onInterim?: (text: string) => void
) => {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError('Speech recognition not supported in this browser.');
    return null;
  }

  const recognition: SpeechRecognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true; // Enable interim results for real-time feedback
  recognition.lang = 'en-US';

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
