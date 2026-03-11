// speechService.ts
// Speech services for the VIET Navigation Bot kiosk.
//
//  TTS : streams audio from the FastAPI /speak endpoint (gTTS)
//  STT : records audio via MediaRecorder → POST /stt (Vosk/Whisper, fully offline)

const API_URL = (import.meta.env.VITE_TTS_API_URL as string) || 'http://localhost:5000';

// ─────────────────────────────────────────────────────────────────────────────
//  TTS
// ─────────────────────────────────────────────────────────────────────────────

let currentAudio: HTMLAudioElement | null = null;

export const isVoiceAvailable = (_langCode: string): boolean => true;

export const stopSpeaking = (): void => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
};

export const speak = (text: string, lang: 'en' | 'te' | 'hi' = 'en'): void => {
  stopSpeaking();
  if (!text) return;
  const url = `${API_URL}/speak?text=${encodeURIComponent(text)}&lang=${lang}`;
  try {
    const audio = new Audio(url);
    currentAudio = audio;
    audio.play().catch(e => console.error('TTS play error:', e));
    audio.onended = () => { if (currentAudio === audio) currentAudio = null; };
  } catch (e) {
    console.error('TTS init error:', e);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  STT internals
// ─────────────────────────────────────────────────────────────────────────────

function toLang(langCode: string): 'en' | 'te' | 'hi' {
  if (langCode.startsWith('te')) return 'te';
  if (langCode.startsWith('hi')) return 'hi';
  return 'en';
}

function getBestMimeType(): string {
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/ogg',
  ];
  return candidates.find(t => MediaRecorder.isTypeSupported(t)) ?? '';
}

export interface SttHandle {
  /** Stop recording and discard — does NOT call onResult */
  abort: () => void;
  /** Stop recording early and submit to the STT backend */
  stop: () => void;
}

function recordAndTranscribe(
  lang: 'en' | 'te' | 'hi',
  maxMs: number,
  onResult: (text: string) => void,
  onEnd: () => void,
  onError: (msg: string) => void,
): SttHandle {
  let aborted = false;
  let recorder: MediaRecorder | null = null;
  let stream: MediaStream | null = null;
  const chunks: Blob[] = [];

  const releaseStream = () => stream?.getTracks().forEach(t => t.stop());

  navigator.mediaDevices
    .getUserMedia({ audio: true, video: false })
    .then(s => {
      if (aborted) { s.getTracks().forEach(t => t.stop()); return; }
      stream = s;

      const mimeType = getBestMimeType();
      recorder = mimeType ? new MediaRecorder(s, { mimeType }) : new MediaRecorder(s);

      recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

      recorder.onstop = async () => {
        releaseStream();
        if (aborted) { onEnd(); return; }

        const blob = new Blob(chunks, { type: recorder?.mimeType || 'audio/webm' });
        const form = new FormData();
        form.append('audio', blob, 'recording.webm');
        form.append('lang', lang);

        try {
          const res = await fetch(`${API_URL}/stt`, { method: 'POST', body: form });
          if (!res.ok) {
            const detail = await res.text().catch(() => String(res.status));
            throw new Error(`STT server error ${res.status}: ${detail}`);
          }
          const data: { text: string } = await res.json();
          const text = data.text?.trim();
          if (text) {
            onResult(text);
          } else {
            onError('No speech detected. Please try again.');
          }
        } catch (err: any) {
          onError(err.message ?? 'STT request failed.');
        }
        onEnd();
      };

      recorder.start();
      setTimeout(() => {
        if (recorder?.state === 'recording') recorder.stop();
      }, maxMs);
    })
    .catch(() => {
      onError('Microphone access denied. Please allow microphone permissions.');
      onEnd();
    });

  return {
    abort: () => {
      aborted = true;
      if (recorder?.state === 'recording') recorder.stop();
      else releaseStream();
    },
    stop: () => {
      if (recorder?.state === 'recording') recorder.stop();
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
//  Public STT API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Record from the microphone and transcribe via the offline backend.
 *
 * @param onResult   Called with the final transcript.
 * @param onEnd      Called when the entire flow finishes (success or error).
 * @param onError    Called with a user-friendly error string.
 * @param onInterim  Unused (Vosk/Whisper are batch). Kept for API compatibility.
 * @param langCode   BCP-47 code e.g. 'en-US', 'te-IN', 'hi-IN'.
 */
export const startListening = (
  onResult: (text: string) => void,
  onEnd: () => void,
  onError: (error: string) => void,
  onInterim?: (text: string) => void,
  langCode: string = 'en-US',
): SttHandle | null => {
  if (!navigator.mediaDevices?.getUserMedia) {
    onError('Microphone API not available in this browser.');
    return null;
  }
  return recordAndTranscribe(toLang(langCode), 8000, onResult, onEnd, onError);
};
