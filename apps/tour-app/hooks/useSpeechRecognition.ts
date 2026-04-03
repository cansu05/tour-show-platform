'use client';

import {useCallback, useMemo} from 'react';

type SpeechErrorCode =
  | 'not-allowed'
  | 'audio-capture'
  | 'no-speech'
  | 'network'
  | 'unsupported'
  | 'unknown';

type UseSpeechRecognitionParams = {
  lang: string;
  onResult: (text: string) => void;
  onError: (code: SpeechErrorCode) => void;
};

type SpeechRecognitionWindow = Window & {
  SpeechRecognition?: new () => SpeechRecognition;
  webkitSpeechRecognition?: new () => SpeechRecognition;
};

export function useSpeechRecognition({lang, onResult, onError}: UseSpeechRecognitionParams) {
  const SpeechCtor = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const w = window as SpeechRecognitionWindow;
    return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
  }, []);

  const start = useCallback(() => {
    if (!SpeechCtor) {
      onError('unsupported');
      return;
    }

    const recognition = new SpeechCtor();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim();
      if (transcript) {
        onResult(transcript);
      } else {
        onError('no-speech');
      }
      recognition.stop();
    };

    recognition.onerror = (event) => {
      const code = (event.error as SpeechErrorCode) ?? 'unknown';
      onError(code);
      recognition.stop();
    };

    recognition.start();
  }, [SpeechCtor, lang, onError, onResult]);

  return {
    isSupported: Boolean(SpeechCtor),
    start
  };
}

