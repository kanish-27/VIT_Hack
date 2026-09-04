import { useState, useEffect, useCallback, useRef } from 'react';
import type { Language } from './translations';

const LANG_BCP_MAP: Record<Language, string[]> = {
  en: ['en-IN', 'en-US', 'en-GB'],
  hi: ['hi-IN', 'hi'],
  ta: ['ta-IN', 'ta'],
  te: ['te-IN', 'te'],
  kn: ['kn-IN', 'kn'],
};

export const useSpeech = (currentLang: Language = 'en') => {
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setSpeakingId(null);
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(
    (text: string, id: string = 'global') => {
      if (!synthRef.current) {
        console.warn('Speech synthesis not supported in this browser.');
        return;
      }

      // Stop any current speech
      synthRef.current.cancel();

      if (speakingId === id && isSpeaking) {
        stop();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Slightly slower for clarity
      utterance.pitch = 1.0;

      // Find best voice matching current language
      const voices = synthRef.current.getVoices();
      const targetBcpCodes = LANG_BCP_MAP[currentLang] || ['en-US'];

      let matchedVoice = null;
      for (const code of targetBcpCodes) {
        matchedVoice = voices.find((v) => v.lang.toLowerCase().includes(code.toLowerCase()));
        if (matchedVoice) break;
      }

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
      utterance.lang = targetBcpCodes[0];

      utterance.onstart = () => {
        setSpeakingId(id);
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setSpeakingId(null);
        setIsSpeaking(false);
      };

      utterance.onerror = (e) => {
        console.error('Speech synthesis error:', e);
        setSpeakingId(null);
        setIsSpeaking(false);
      };

      synthRef.current.speak(utterance);
    },
    [currentLang, isSpeaking, speakingId, stop]
  );

  return {
    speak,
    stop,
    speakingId,
    isSpeaking,
  };
};
