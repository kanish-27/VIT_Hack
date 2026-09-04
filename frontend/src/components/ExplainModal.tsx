import type { FC } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { HelpCircle, Volume2, VolumeX, X } from 'lucide-react';

export const ExplainModal: FC = () => {
  const { explainer, closeExplainer, speak, speakingId, t, easyAccess } = useAccessibility();

  if (!explainer) return null;

  const isSpeaking = speakingId === 'explainer';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className={`bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border-2 border-blue-500 relative ${easyAccess ? 'text-lg p-8' : ''}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center text-blue-600">
            <HelpCircle className={`mr-2 ${easyAccess ? 'h-8 w-8' : 'h-6 w-6'}`} />
            <h3 className={`font-bold text-slate-900 ${easyAccess ? 'text-2xl' : 'text-xl'}`}>
              {explainer.title}
            </h3>
          </div>
          <button
            onClick={closeExplainer}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            aria-label={t('close')}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <p className={`text-slate-700 leading-relaxed ${easyAccess ? 'text-xl font-medium text-slate-900' : 'text-base'}`}>
          {explainer.body}
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <button
            onClick={() => speak(`${explainer.title}. ${explainer.body}`, 'explainer')}
            className={`flex items-center justify-center px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm ${
              isSpeaking
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } ${easyAccess ? 'text-lg py-3 px-6' : 'text-sm'}`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="h-5 w-5 mr-2 animate-pulse" />
                {t('stop')}
              </>
            ) : (
              <>
                <Volume2 className="h-5 w-5 mr-2" />
                {t('listen')}
              </>
            )}
          </button>

          <button
            onClick={closeExplainer}
            className={`px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors ${
              easyAccess ? 'text-lg py-3 px-6' : 'text-sm'
            }`}
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
};
