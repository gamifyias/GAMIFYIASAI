import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, GraduationCap, BookOpen } from "lucide-react";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { AmbientBackground } from "@/components/ui/ambient-background";

type MentorType = "mentor" | "polity" | "history";

const mentorConfig: Record<MentorType, {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  endpoint: string;
}> = {
  mentor: {
    title: "AI Mentor",
    subtitle: "GAMIFY IAS",
    icon: <GraduationCap className="w-5 h-5" />,
    endpoint: "upsc-mentor",
  },
  polity: {
    title: "Indian Polity",
    subtitle: "M. Laxmikanth",
    icon: <BookOpen className="w-5 h-5" />,
    endpoint: "polity-mentor",
  },
  history: {
    title: "Modern History",
    subtitle: "Spectrum",
    icon: <BookOpen className="w-5 h-5" />,
    endpoint: "history-mentor",
  },
};

const ChatSession = () => {
  const { mentorId } = useParams<{ mentorId: string }>();
  const navigate = useNavigate();
  
  const mentor = mentorConfig[mentorId as MentorType] || mentorConfig.mentor;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AmbientBackground />
      
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                {mentor.icon}
              </div>
              <div>
                <h1 className="font-display text-lg text-foreground">
                  {mentor.title}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {mentor.subtitle}
                </p>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
        </motion.header>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden">
          <ChatInterface endpoint={mentor.endpoint} mentorName={mentor.title} />
        </div>
      </div>
    </div>
  );
};

export default ChatSession;
