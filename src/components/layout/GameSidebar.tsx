import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  MessageSquare, 
  Target, 
  BookOpen, 
  Trophy, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Scroll
} from "lucide-react";
import { XpBar } from "@/components/ui/xp-bar";

interface NavItem {
  icon: React.ElementType;
  label: string;
  id: string;
}

const navItems: NavItem[] = [
  { icon: MessageSquare, label: "AI Mentor", id: "chat" },
  // { icon: Target, label: "Daily Quests", id: "quests" },
  // { icon: BookOpen, label: "Study Realm", id: "study" },
  // { icon: Trophy, label: "Achievements", id: "achievements" },
  // { icon: Scroll, label: "UPSC Scrolls", id: "resources" },
];

interface GameSidebarProps {
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
}

export function GameSidebar({ activeTab, onTabChange, className }: GameSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.aside
      className={cn(
        "relative flex flex-col border-r border-border bg-sidebar transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              key="full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <span className="font-display text-lg font-semibold text-primary">G</span>
                </div>
                <div>
                  <h1 className="font-display text-base font-semibold text-foreground">
                    GAMIFY IAS
                  </h1>
                  <p className="text-[10px] text-muted-foreground font-body uppercase tracking-widest">UPSC Mentor</p>
                </div>
              </div>
              
              {/* <XpBar currentXp={2750} maxXp={5000} level={7} /> */}
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex justify-center"
            >
              <div className="w-9 h-9 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center">
                <span className="font-display text-lg font-semibold text-primary">G</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto scrollbar-premium">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200",
              "font-body text-sm",
              activeTab === item.id
                ? "bg-sidebar-accent text-primary border-l-2 border-primary"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-foreground border-l-2 border-transparent"
            )}
          >
            <item.icon className={cn(
              "w-4 h-4 flex-shrink-0",
              activeTab === item.id && "text-primary"
            )} />
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="truncate"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}
      </nav>

      {/* Settings */}
      <div className="p-2 border-t border-border">
        <button
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200",
            "font-body text-sm text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
          )}
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span>Settings</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary/50 transition-colors duration-200 z-10"
      >
        {isCollapsed ? (
          <ChevronRight className="w-3 h-3 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-muted-foreground" />
        )}
      </button>
    </motion.aside>
  );
}
