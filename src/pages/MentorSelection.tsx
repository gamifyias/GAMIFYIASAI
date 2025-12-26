import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, GraduationCap, Sparkles, BrainCircuit } from "lucide-react";
import { AmbientBackground } from "@/components/ui/ambient-background";

type MentorType = "mentor" | "polity" | "history" | "custom-ai";

interface MentorOption {
  id: MentorType;
  title: string;
  subtitle: string;
  author?: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  accentColor: string;
  iconBg: string;
  iconBorder: string;
  iconText: string;
  accentLine: string;
}

const mentors: MentorOption[] = [
  {
    id: "mentor",
    title: "AI Mentor",
    subtitle: "GAMIFY IAS",
    description: "Your personal UPSC guide. Ask anything about exam, strategy, or concepts.",
    icon: <GraduationCap className="w-8 h-8" />,
    gradient: "from-primary/20 via-primary/10 to-transparent",
    accentColor: "primary",
    iconBg: "bg-primary/10",
    iconBorder: "border-primary/20",
    iconText: "text-primary",
    accentLine: "via-primary/40",
  },
  {
    id: "polity",
    title: "Indian Polity",
    subtitle: "M. Laxmikanth",
    author: "6th Edition",
    description: "The bible of Indian Polity. Constitution, governance, and political system.",
    icon: <BookOpen className="w-8 h-8" />,
    gradient: "from-accent/20 via-accent/10 to-transparent",
    accentColor: "accent",
    iconBg: "bg-accent/10",
    iconBorder: "border-accent/20",
    iconText: "text-accent",
    accentLine: "via-accent/40",
  },
  {
    id: "history",
    title: "Modern History",
    subtitle: "Spectrum",
    author: "Rajiv Ahir",
    description: "From British arrival to Independence. Freedom struggle and nation building.",
    icon: <BookOpen className="w-8 h-8" />,
    gradient: "from-primary/20 via-accent/10 to-transparent",
    accentColor: "primary",
    iconBg: "bg-primary/10",
    iconBorder: "border-primary/20",
    iconText: "text-primary",
    accentLine: "via-primary/40",
  },
];

const customAiMentor: MentorOption = {
  id: "custom-ai",
  title: "UPSC AI Coach",
  subtitle: "Advanced Learning System",
  description: "Elite AI mentor with PDF analysis, mock tests, and personalized study guidance.",
  icon: <BrainCircuit className="w-8 h-8" />,
  gradient: "from-yellow-500/20 via-orange-500/10 to-transparent",
  accentColor: "yellow",
  iconBg: "bg-yellow-500/10",
  iconBorder: "border-yellow-500/20",
  iconText: "text-yellow-500",
  accentLine: "via-yellow-500/40",
};

const MentorSelection = () => {
  const navigate = useNavigate();
  const [selectedMentor, setSelectedMentor] = useState<MentorType | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSelect = (mentorId: MentorType) => {
    setSelectedMentor(mentorId);
    setIsTransitioning(true);
    
    setTimeout(() => {
      if (mentorId === "custom-ai") {
        navigate("/upsc-ai");
      } else {
        navigate(`/chat/${mentorId}`);
      }
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AmbientBackground />
      
      <AnimatePresence>
        {isTransitioning && selectedMentor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background"
          >
            <div className="text-center">
              {/* Icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary"
              >
                {mentors.find(m => m.id === selectedMentor)?.icon}
              </motion.div>
              
              {/* Mentor name */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="font-display text-2xl text-foreground mb-2"
              >
                {mentors.find(m => m.id === selectedMentor)?.title}
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-sm text-muted-foreground mb-8"
              >
                {mentors.find(m => m.id === selectedMentor)?.subtitle}
              </motion.p>
              
              {/* Divider line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="w-24 h-px mx-auto bg-gradient-to-r from-transparent via-border to-transparent mb-6"
              />
              
              {/* Academy name */}
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="font-display text-lg text-primary/80 tracking-[0.2em] uppercase"
              >
                GAMIFY IAS
              </motion.h1>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pt-12 pb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/50 border border-border mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs text-muted-foreground tracking-wider uppercase">
              UPSC Preparation Platform
            </span>
          </div>
          
          <h1 className="font-display text-4xl md:text-5xl text-foreground tracking-tight mb-3">
            GAMIFY <span className="text-gradient">IAS</span>
          </h1>
          
          <p className="text-muted-foreground font-body max-w-md mx-auto">
            Choose your guide. Each mentor holds unique knowledge to shape your journey.
          </p>
        </motion.header>

        {/* Mentor Cards */}
        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="space-y-8 w-full max-w-5xl">
            {/* Main 3 mentors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mentors.map((mentor, index) => (
                <motion.button
                  key={mentor.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                  onClick={() => handleSelect(mentor.id)}
                  disabled={isTransitioning}
                  className="group relative text-left"
                >
                  <div className="relative overflow-hidden rounded-xl border border-border bg-card/80 backdrop-blur-sm p-6 h-full transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${mentor.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-xl ${mentor.iconBg} ${mentor.iconBorder} flex items-center justify-center mb-5 ${mentor.iconText} group-hover:scale-105 transition-transform duration-300`}>
                        {mentor.icon}
                      </div>
                      
                      {/* Title */}
                      <h3 className="font-display text-xl text-foreground mb-1 tracking-wide">
                        {mentor.title}
                      </h3>
                      
                      {/* Subtitle */}
                      <p className="text-sm text-primary font-medium mb-1">
                        {mentor.subtitle}
                      </p>
                      
                      {mentor.author && (
                        <p className="text-xs text-muted-foreground mb-3">
                          {mentor.author}
                        </p>
                      )}
                      
                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {mentor.description}
                      </p>
                      
                      {/* CTA */}
                      <div className="mt-5 flex items-center gap-2 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>Enter Session</span>
                        <span>→</span>
                      </div>
                    </div>
                    
                    {/* Bottom accent line */}
                    <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent ${mentor.accentLine} to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Custom AI Featured Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="max-w-2xl mx-auto w-full"
            >
              <button
                onClick={() => handleSelect(customAiMentor.id)}
                disabled={isTransitioning}
                className="group relative text-left w-full"
              >
                <div className="relative overflow-hidden rounded-xl border-2 border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 via-orange-500/5 to-transparent backdrop-blur-sm p-8 h-full transition-all duration-300 hover:border-yellow-500/40 hover:shadow-lg hover:shadow-yellow-500/10">
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${customAiMentor.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Featured badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full uppercase tracking-wider">
                    Featured
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-xl ${customAiMentor.iconBg} ${customAiMentor.iconBorder} flex items-center justify-center mb-6 ${customAiMentor.iconText} group-hover:scale-105 transition-transform duration-300`}>
                      {customAiMentor.icon}
                    </div>
                    
                    {/* Title */}
                    <h3 className="font-display text-2xl text-foreground mb-2 tracking-wide">
                      {customAiMentor.title}
                    </h3>
                    
                    {/* Subtitle */}
                    <p className="text-lg text-yellow-500 font-medium mb-3">
                      {customAiMentor.subtitle}
                    </p>
                    
                    {/* Description */}
                    <p className="text-base text-muted-foreground leading-relaxed mb-6">
                      {customAiMentor.description}
                    </p>
                    
                    {/* CTA */}
                    <div className="flex items-center gap-2 text-base text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Launch Advanced AI</span>
                      <span>→</span>
                    </div>
                  </div>
                  
                  {/* Bottom accent line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent ${customAiMentor.accentLine} to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                </div>
              </button>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="py-6 text-center"
        >
          <p className="text-xs text-muted-foreground">
            Powered by AI • Designed for UPSC Aspirants
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default MentorSelection;
