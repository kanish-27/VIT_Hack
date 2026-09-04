import { createContext, useContext, useState } from 'react';
import type { ReactNode, FC } from 'react';
import { translations } from '../utils/translations';
import type { Language, TranslationDictionary } from '../utils/translations';
import { useSpeech } from '../utils/useSpeech';

interface ExplainerData {
  title: string;
  body: string;
}

interface AccessibilityContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  easyAccess: boolean;
  setEasyAccess: (easy: boolean) => void;
  t: (key: keyof TranslationDictionary) => string;
  speak: (text: string, id?: string) => void;
  stopSpeech: () => void;
  speakingId: string | null;
  isSpeaking: boolean;
  explainer: ExplainerData | null;
  openExplainer: (titleKey: keyof TranslationDictionary, bodyKey: keyof TranslationDictionary) => void;
  closeExplainer: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('gigshield_lang');
    return (saved as Language) || 'en';
  });

  const [easyAccess, setEasyAccessState] = useState<boolean>(() => {
    const saved = localStorage.getItem('gigshield_easy_access');
    return saved === 'true';
  });

  const [explainer, setExplainer] = useState<ExplainerData | null>(null);

  const { speak, stop: stopSpeech, speakingId, isSpeaking } = useSpeech(language);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('gigshield_lang', lang);
  };

  const setEasyAccess = (easy: boolean) => {
    setEasyAccessState(easy);
    localStorage.setItem('gigshield_easy_access', String(easy));
  };

  const t = (key: keyof TranslationDictionary): string => {
    const dict = translations[language] || translations.en;
    return dict[key] || translations.en[key] || String(key);
  };

  const openExplainer = (titleKey: keyof TranslationDictionary, bodyKey: keyof TranslationDictionary) => {
    const title = t(titleKey);
    const body = t(bodyKey);
    setExplainer({ title, body });
    speak(`${title}. ${body}`, 'explainer');
  };

  const closeExplainer = () => {
    stopSpeech();
    setExplainer(null);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        language,
        setLanguage,
        easyAccess,
        setEasyAccess,
        t,
        speak,
        stopSpeech,
        speakingId,
        isSpeaking,
        explainer,
        openExplainer,
        closeExplainer,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
