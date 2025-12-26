
import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, Trophy, ChevronRight, BrainCircuit } from 'lucide-react';

interface IntroScreenProps {
  onComplete: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  // Handle initialization and mandatory API key selection as per requirements
  const handleInitialize = async () => {
    if (window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        // Trigger key selection dialog
        await window.aistudio.openSelectKey();
      }
    }
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-ias-cream dark:bg-ias-darkBg flex flex-col items-center justify-center overflow-hidden font-sans">
      {/* Soft Ambient Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ias-accent/10 blur-[100px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ias-accent/5 blur-[120px] rounded-full animate-pulse [animation-delay:2s]"></div>
      </div>

      <div className={`relative z-10 flex flex-col items-center gap-12 transition-all duration-1000 transform ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        
        <div className="relative">
          <div className="absolute inset-0 bg-ias-accent/20 blur-3xl rounded-full"></div>
          <div className="w-24 h-24 bg-ias-card dark:bg-ias-darkCard rounded-[2rem] soft-shadow flex items-center justify-center border border-white/50 dark:border-white/5 transform hover:rotate-6 transition-transform">
             <BrainCircuit className="w-10 h-10 text-ias-accent" />
          </div>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-5xl font-display font-bold tracking-tight text-ias-text dark:text-white">
            GAMIFY <span className="text-ias-accent">IAS</span>
          </h1>
          <div className="flex items-center justify-center gap-3">
             <div className="h-[1px] w-6 bg-gray-200 dark:bg-gray-800"></div>
             <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-[0.5em] font-bold">The Elite Aspirant Protocol</p>
             <div className="h-[1px] w-6 bg-gray-200 dark:bg-gray-800"></div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 w-full max-w-xl px-4">
          <Feature icon={Shield} title="Authoritative" desc="Verified UPSC Logic" />
          <Feature icon={Sparkles} title="Contextual" desc="PDF-Bound Intelligence" />
          <Feature icon={Trophy} title="Rank-Driven" desc="Progressive Mastery" />
        </div>

        <button 
          onClick={handleInitialize}
          className="group relative px-12 py-5 bg-ias-accent text-white rounded-3xl font-bold shadow-2xl shadow-ias-accent/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-4 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
          <span className="relative z-10 tracking-widest uppercase text-sm">Initialize Session</span>
          <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="absolute bottom-10 text-gray-400 dark:text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">
        Secured by Gemini 3.0 • UPSC Knowledge Engine v1.0
      </div>
    </div>
  );
};

const Feature = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="text-center space-y-2 group">
    <div className="w-12 h-12 bg-white/50 dark:bg-white/5 rounded-2xl mx-auto flex items-center justify-center text-ias-accent border border-gray-100 dark:border-white/5 group-hover:bg-ias-accent group-hover:text-white transition-soft">
      <Icon className="w-5 h-5" />
    </div>
    <h3 className="text-xs font-bold dark:text-gray-200">{title}</h3>
    <p className="text-[10px] text-gray-400 leading-tight">{desc}</p>
  </div>
);

export default IntroScreen;
