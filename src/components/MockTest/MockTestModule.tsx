import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  ShieldAlert, 
  BrainCircuit, 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  Trophy, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  Zap,
  Target
} from 'lucide-react';
import { MockTestQuestion, MockTestConfig, MockTestResult } from '../../types';

interface MockTestModuleProps {
  pdfText: string | null;
  xp: number;
  setXp: (val: number | ((prev: number) => number)) => void;
  setLevel: (val: number | ((prev: number) => number)) => void;
}

export const MockTestModule: React.FC<MockTestModuleProps> = ({ pdfText, xp, setXp, setLevel }) => {
  const [phase, setPhase] = useState<'setup' | 'loading' | 'test' | 'results'>('setup');
  const [config, setConfig] = useState<MockTestConfig>({
    difficulty: 'MEDIUM',
    weakTopics: [],
    totalQuestions: 10
  });
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  const [questions, setQuestions] = useState<MockTestQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number | number[]>>({});
  const [startTime, setStartTime] = useState<number>(0);
  const [violations, setViolations] = useState(0);
  const [cheatingTriggered, setCheatingTriggered] = useState(false);
  const [result, setResult] = useState<MockTestResult | null>(null);

  // Anti-Cheat: Tab Switched / Window Blur
  useEffect(() => {
    if (phase !== 'test') return;

    const handleCheating = () => {
      if (violations >= 2) {
        setCheatingTriggered(true);
        setPhase('results');
        evaluateTest();
      } else {
        setViolations(v => v + 1);
        alert(`ANTI-CHEAT WARNING (${violations + 1}/3): Window focus lost. Any further switching will terminate the test immediately.`);
      }
    };

    window.addEventListener('blur', handleCheating);
    window.addEventListener('visibilitychange', () => {
      if (document.hidden) handleCheating();
    });

    // Disable Right Click & Copy
    const disableRightClick = (e: MouseEvent) => e.preventDefault();
    const disableCopy = (e: ClipboardEvent) => e.preventDefault();
    document.addEventListener('contextmenu', disableRightClick);
    document.addEventListener('copy', disableCopy);

    return () => {
      window.removeEventListener('blur', handleCheating);
      document.removeEventListener('contextmenu', disableRightClick);
      document.removeEventListener('copy', disableCopy);
    };
  }, [phase, violations]);

  // Extract topics once PDF is ready
  useEffect(() => {
    if (pdfText && availableTopics.length === 0) {
      extractTopics();
    }
  }, [pdfText]);

  const extractTopics = async () => {
    if (!pdfText) return;
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Based on the following PDF text, list 5-8 distinct study topic titles. Return ONLY a JSON array of strings: ["Topic 1", "Topic 2", ...]\n\nPDF: ${pdfText.substring(0, 10000)}`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      const parsed = JSON.parse(response.text || "[]");
      setAvailableTopics(parsed);
    } catch (e) {
      console.error("Topic extraction failed", e);
    }
  };

  const startGeneration = async () => {
    if (!pdfText) return;
    setPhase('loading');
    setViolations(0);
    setCheatingTriggered(false);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Generate ${config.totalQuestions} UPSC-style MCQs based on the PDF.
        Difficulty: ${config.difficulty}.
        Weak Topics to prioritize: ${config.weakTopics.join(', ')}.
        Include a mix of types: SINGLE_CORRECT, MULTIPLE_CORRECT (return index array), TRUE_FALSE.
        Output ONLY a JSON array of objects:
        [{"id": "1", "type": "...", "question": "...", "options": ["...", "..."], "correctAnswer": 0 or [0,1], "explanation": "...", "topic": "...", "marks": 2}]
        
        PDF CONTENT: ${pdfText.substring(0, 15000)}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const generated = JSON.parse(response.text || "[]");
      setQuestions(generated);
      setStartTime(Date.now());
      setPhase('test');
    } catch (err) {
      setPhase('setup');
      alert("Core generation failed. Please try again.");
    }
  };

  const handleAnswer = (val: number | number[]) => {
    setUserAnswers(prev => ({ ...prev, [questions[currentIdx].id]: val }));
  };

  const evaluateTest = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    let score = 0;
    let totalMarks = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    const review = questions.map(q => {
      totalMarks += q.marks;
      const ans = userAnswers[q.id];
      if (ans === undefined) {
        unansweredCount++;
        return { question: q, userAnswer: null, isCorrect: false };
      }

      const isCorrect = Array.isArray(q.correctAnswer) 
        ? Array.isArray(ans) && ans.length === q.correctAnswer.length && ans.every(v => (q.correctAnswer as number[]).includes(v))
        : ans === q.correctAnswer;

      if (isCorrect) {
        score += q.marks;
        correctCount++;
      } else {
        incorrectCount++;
      }

      return { question: q, userAnswer: ans, isCorrect };
    });

    const res = {
      score, totalMarks, correctCount, incorrectCount, unansweredCount, timeSpent, violations, questionReview: review
    };
    setResult(res);
    setPhase('results');
    
    // Awards XP based on score percentage
    const perc = (score / totalMarks) * 100;
    setXp(prev => (prev + Math.floor(perc / 2)) % 100);
    if (perc > 80) setLevel(l => l + 1);
  };

  if (!pdfText) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-entrance">
        <ShieldAlert className="w-12 h-12 text-[#EAB308] mb-4 opacity-50" />
        <h2 className="text-xl font-display font-black">Context Required</h2>
        <p className="text-xs text-gray-400 mt-2 max-w-xs leading-relaxed">The Elite Assessment Engine requires a PDF study source to map questions specifically to your syllabus.</p>
      </div>
    );
  }

  if (phase === 'setup') {
    return (
      <div className="h-full overflow-y-auto p-6 animate-entrance bg-white dark:bg-[#0A0A0A]">
        <div className="max-w-2xl mx-auto space-y-8 pb-12">
          <div className="space-y-2">
            <h2 className="text-2xl font-display font-black tracking-tight text-[#EAB308]">Assessment Setup</h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Calibration Phase 01</p>
          </div>

          {/* Difficulty */}
          <section className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <Zap className="w-3 h-3" /> Cognitive Rigor
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['EASY', 'MEDIUM', 'HARD'] as const).map(d => (
                <button 
                  key={d} 
                  onClick={() => setConfig(c => ({...c, difficulty: d}))}
                  className={`py-3 px-4 rounded-xl text-[10px] font-black uppercase transition-all border ${config.difficulty === d ? 'bg-[#EAB308] text-white border-[#EAB308] shadow-lg shadow-yellow-500/20' : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 text-gray-400'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </section>

          {/* Weak Topics */}
          <section className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <Target className="w-3 h-3" /> Vulnerability Mapping (Select Topics)
            </label>
            {availableTopics.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {availableTopics.map(t => (
                  <button 
                    key={t}
                    onClick={() => {
                      setConfig(c => ({
                        ...c, 
                        weakTopics: c.weakTopics.includes(t) ? c.weakTopics.filter(x => x !== t) : [...c.weakTopics, t]
                      }));
                    }}
                    className={`px-4 py-2 rounded-full text-[10px] font-bold transition-all border ${config.weakTopics.includes(t) ? 'bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]' : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 text-gray-400'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-white/10 text-center">
                <p className="text-[9px] font-bold text-gray-400 animate-pulse">EXTRACTING TOPICS FROM SOURCE...</p>
              </div>
            )}
          </section>

          {/* Question Count */}
          <section className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <RefreshCcw className="w-3 h-3" /> Assessment Volume
            </label>
            <div className="flex items-center gap-4">
              <input 
                type="range" min="5" max="30" step="5"
                value={config.totalQuestions}
                onChange={(e) => setConfig(c => ({...c, totalQuestions: parseInt(e.target.value)}))}
                className="flex-1 accent-[#EAB308]"
              />
              <span className="text-sm font-black text-[#EAB308] w-12 text-center">{config.totalQuestions} Qs</span>
            </div>
          </section>

          <button 
            onClick={startGeneration}
            className="w-full py-4 bg-[#EAB308] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-yellow-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Launch Assessment Engine
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'loading') {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-ias-cream dark:bg-[#0A0A0A] overflow-hidden">
        <div className="relative">
          <div className="w-32 h-32 border-4 border-[#EAB308]/10 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <BrainCircuit className="w-12 h-12 text-[#EAB308] animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <div className="absolute -inset-8 border-2 border-dashed border-[#EAB308]/20 rounded-full animate-spin" style={{ animationDuration: '10s' }}></div>
        </div>
        <div className="mt-12 text-center space-y-3">
          <h2 className="text-xl font-display font-black text-[#EAB308]">Elite Assessment Engine</h2>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] animate-pulse">Synthesizing {config.totalQuestions} Psychometric MCQ Modules...</p>
        </div>
      </div>
    );
  }

  if (phase === 'test') {
    const q = questions[currentIdx];
    const isMulti = q.type === 'MULTIPLE_CORRECT';

    return (
      <div className="h-full flex flex-col bg-gray-50 dark:bg-[#0D0D0D]">
        {/* Test Header */}
        <div className="px-6 py-4 bg-white dark:bg-[#141414] border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-[#EAB308]/10 rounded-lg">
              <span className="text-[10px] font-black text-[#EAB308]">QUESTION {currentIdx + 1}/{questions.length}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
               <ShieldAlert className="w-4 h-4 text-red-400" />
               <span className="text-[10px] font-bold">ANTI-CHEAT ACTIVE</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[#EAB308]">
            <Clock className="w-4 h-4" />
            <span className="text-[11px] font-black">TEST MODE</span>
          </div>
        </div>

        {/* Question Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-8 animate-entrance">
            <div className="space-y-4">
               <div className="flex items-center gap-2">
                 <span className="px-2 py-0.5 bg-gray-100 dark:bg-white/5 rounded text-[8px] font-black text-gray-400 uppercase tracking-widest">{q.type.replace('_', ' ')}</span>
                 <span className="text-[8px] font-black text-[#EAB308] uppercase tracking-widest">{q.topic}</span>
               </div>
               <h3 className="text-base sm:text-lg font-bold leading-relaxed">{q.question}</h3>
            </div>

            <div className="grid gap-3">
              {q.options.map((opt, i) => {
                const isSelected = isMulti 
                  ? ((userAnswers[q.id] as number[]) || []).includes(i)
                  : userAnswers[q.id] === i;

                return (
                  <button 
                    key={i}
                    onClick={() => {
                      if (isMulti) {
                        const current = (userAnswers[q.id] as number[]) || [];
                        const next = current.includes(i) ? current.filter(x => x !== i) : [...current, i];
                        handleAnswer(next);
                      } else {
                        handleAnswer(i);
                      }
                    }}
                    className={`p-4 rounded-xl border text-left text-sm font-semibold transition-all flex items-center gap-4 group ${isSelected ? 'bg-[#EAB308] border-[#EAB308] text-white' : 'bg-white dark:bg-[#141414] border-gray-100 dark:border-white/5 text-gray-600 dark:text-gray-300 hover:border-[#EAB308]/30'}`}
                  >
                    <span className={`w-6 h-6 rounded-lg border flex items-center justify-center text-[10px] font-black ${isSelected ? 'border-white text-white' : 'border-gray-100 dark:border-white/10 text-[#EAB308]'}`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4 bg-white dark:bg-[#141414] border-t border-gray-100 dark:border-white/5">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <button 
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx(c => c - 1)}
              className="p-3 text-gray-400 disabled:opacity-20 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button 
              onClick={() => {
                if (currentIdx === questions.length - 1) {
                  evaluateTest();
                } else {
                  setCurrentIdx(c => c + 1);
                }
              }}
              className="px-8 py-3 bg-[#EAB308] text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-yellow-500/20"
            >
              {currentIdx === questions.length - 1 ? 'Terminate & Evaluate' : 'Next Strategic Question'}
            </button>

            <button 
              disabled={currentIdx === questions.length - 1}
              onClick={() => setCurrentIdx(c => c + 1)}
              className="p-3 text-gray-400 disabled:opacity-20 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'results' && result) {
    const scorePerc = (result.score / result.totalMarks) * 100;

    return (
      <div className="h-full overflow-y-auto bg-white dark:bg-[#0A0A0A] p-6 animate-entrance">
        <div className="max-w-3xl mx-auto space-y-12 pb-20">
          
          {/* Summary */}
          <div className="text-center space-y-6">
            <div className="inline-block p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-3xl relative">
              <Trophy className="w-16 h-16 text-[#EAB308]" />
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] font-black px-2 py-1 rounded-full">{result.violations} ALERTS</div>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-display font-black tracking-tight">{cheatingTriggered ? 'Protocol Termination' : 'Operational Success'}</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Elite Assessment Metrics</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox label="SCORE" value={`${result.score}/${result.totalMarks}`} sub={`${scorePerc.toFixed(1)}%`} color="#EAB308" />
            <StatBox label="ACCURACY" value={result.correctCount} sub="Correct" color="#10B981" />
            <StatBox label="TIME" value={`${Math.floor(result.timeSpent / 60)}m`} sub={`${result.timeSpent % 60}s`} color="#3B82F6" />
            <StatBox label="VIOLATIONS" value={result.violations} sub="Integrity" color="#EF4444" />
          </div>

          {/* Review List */}
          <div className="space-y-6">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-500 border-b border-gray-50 dark:border-white/5 pb-2">Debriefing & Logic Review</h3>
            {result.questionReview.map((rev, i) => (
              <div key={i} className={`p-5 rounded-2xl border transition-all ${rev.isCorrect ? 'bg-emerald-50/20 border-emerald-500/10' : 'bg-red-50/20 border-red-500/10'}`}>
                <div className="flex items-center justify-between mb-3">
                   <span className="text-[9px] font-black text-gray-400 uppercase">ITEM {i + 1} • {rev.question.topic}</span>
                   {rev.isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                </div>
                <p className="text-xs font-bold leading-relaxed mb-4">{rev.question.question}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="text-[10px] text-gray-500">Correct Answer: <span className="font-black text-[#EAB308]">{Array.isArray(rev.question.correctAnswer) ? rev.question.correctAnswer.map(v => String.fromCharCode(65+v)).join(', ') : String.fromCharCode(65 + (rev.question.correctAnswer as number))}</span></div>
                  {!rev.isCorrect && (
                    <div className="text-[10px] text-gray-500">Your Answer: <span className="font-black text-red-500">{rev.userAnswer === null ? 'UNANSWERED' : Array.isArray(rev.userAnswer) ? rev.userAnswer.map(v => String.fromCharCode(65+v)).join(', ') : String.fromCharCode(65 + (rev.userAnswer as number))}</span></div>
                  )}
                </div>

                {!rev.isCorrect && (
                  <div className="p-3 bg-white dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/5">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Mentor Logic</p>
                    <p className="text-[11px] font-serif italic text-gray-600 dark:text-gray-400 leading-relaxed">{rev.question.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button 
            onClick={() => setPhase('setup')}
            className="w-full py-4 bg-gray-100 dark:bg-white/5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#EAB308] hover:text-white transition-all"
          >
            Re-Calibrate Protocol
          </button>
        </div>
      </div>
    );
  }

  return null;
};

const StatBox = ({ label, value, sub, color }: any) => (
  <div className="p-4 bg-white dark:bg-[#141414] border border-gray-100 dark:border-white/5 rounded-2xl text-center space-y-1">
    <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">{label}</p>
    <p className="text-xl font-display font-black" style={{ color }}>{value}</p>
    <p className="text-[10px] font-bold text-gray-500">{sub}</p>
  </div>
);
