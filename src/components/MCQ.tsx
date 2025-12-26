import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, ChevronRight, Info, AlertTriangle } from 'lucide-react';

interface MCQProps {
  mcq: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  };
  onAnswer?: () => void;
}

export const MCQCard: React.FC<MCQProps> = ({ mcq, onAnswer }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowExplanation(true);
    if (idx === mcq.correct && onAnswer) onAnswer();
  };

  return (
    <div className="w-full bg-white dark:bg-[#141414] rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm animate-entrance border-l-4 border-l-[#EAB308]">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-50 dark:border-white/5 pb-2">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-3.5 h-3.5 text-[#EAB308]" />
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#EAB308]">PRELIMS RIGOR MODULE</p>
          </div>
          {selected !== null && (
            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${selected === mcq.correct ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              {selected === mcq.correct ? 'RANK SECURED' : 'INTEGRITY FAIL'}
            </span>
          )}
        </div>

        <h3 className="text-[12px] font-bold tracking-tight text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">
          {mcq.question}
        </h3>

        <div className="grid gap-2">
          {mcq.options.map((opt, idx) => {
            const isCorrect = idx === mcq.correct;
            const isSelected = selected === idx;
            const hasAnswered = selected !== null;

            let styles = "bg-gray-50 dark:bg-black/20 border-transparent hover:bg-yellow-50 dark:hover:bg-yellow-900/10 hover:border-[#EAB308]/30";
            if (hasAnswered) {
              if (isCorrect) styles = "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20";
              else if (isSelected) styles = "bg-red-500 text-white border-red-500";
              else styles = "bg-gray-50 dark:bg-gray-800 border-transparent opacity-40";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`p-3 rounded-lg text-[11px] font-semibold text-left transition-all flex items-center justify-between group border ${styles}`}
              >
                <div className="flex items-start gap-3">
                  <span className={`w-4 h-4 rounded-full border border-current flex items-center justify-center text-[8px] font-black mt-0.5 flex-shrink-0 ${hasAnswered ? 'text-white' : 'text-[#EAB308]'}`}>
                      {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 whitespace-pre-wrap">{opt}</span>
                </div>
                {hasAnswered && isCorrect && <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />}
                {hasAnswered && isSelected && !isCorrect && <XCircle className="w-3.5 h-3.5 flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="mt-3 p-3 bg-yellow-50/50 dark:bg-yellow-900/5 rounded-lg border border-yellow-100 dark:border-yellow-900/10 animate-entrance">
            <div className="flex items-center gap-1.5 mb-1.5">
              <AlertTriangle className="w-3 h-3 text-[#EAB308]" />
              <p className="text-[8px] font-black uppercase tracking-widest text-[#EAB308]">WHY-NOT ELIMINATION DEBRIEF</p>
            </div>
            <p className="text-[11px] leading-relaxed text-gray-600 dark:text-gray-400 font-serif italic whitespace-pre-wrap border-l-2 border-yellow-200 dark:border-yellow-900/30 pl-3">
              {mcq.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};