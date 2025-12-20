import { motion } from "framer-motion";
import { QuestCard } from "@/components/ui/quest-card";
import { RpgButton } from "@/components/ui/rpg-button";
import { Calendar, Flame, RefreshCw } from "lucide-react";

const dailyQuests = [
  {
    title: "Complete NCERT Reading",
    description: "Read Chapter 5 of Class 11 History NCERT - Understanding Ancient Civilizations",
    xpReward: 150,
    status: "in_progress" as const,
    category: "GS Paper I",
  },
  {
    title: "Practice Answer Writing",
    description: "Write a 250-word answer on the topic: Role of Women in Indian Freedom Struggle",
    xpReward: 200,
    status: "pending" as const,
    category: "Mains Practice",
  },
  {
    title: "Current Affairs Review",
    description: "Study today's important news and make notes on relevant UPSC topics",
    xpReward: 100,
    status: "completed" as const,
    category: "Current Affairs",
  },
  {
    title: "Polity MCQ Practice",
    description: "Solve 25 MCQs from Laxmikanth - Parliament Chapter",
    xpReward: 175,
    status: "pending" as const,
    category: "Prelims",
  },
  {
    title: "Ethics Case Study",
    description: "Analyze and write on: Ethical dilemmas faced by civil servants in rural postings",
    xpReward: 225,
    status: "pending" as const,
    category: "GS Paper IV",
  },
];

export function QuestsPanel() {
  const completedQuests = dailyQuests.filter((q) => q.status === "completed").length;
  const totalXp = dailyQuests.reduce((sum, q) => sum + q.xpReward, 0);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-accent/10 border border-accent/30 flex items-center justify-center">
              <Flame className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h2 className="font-display text-xl text-foreground">Daily Quests</h2>
              <p className="text-xs text-muted-foreground font-body">
                {completedQuests}/{dailyQuests.length} completed · {totalXp} XP available
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-body">
              <Calendar className="w-3.5 h-3.5" />
              <span>Resets in 8h 23m</span>
            </div>
            <RpgButton variant="ghost" size="icon">
              <RefreshCw className="w-4 h-4" />
            </RpgButton>
          </div>
        </div>
      </div>

      {/* Quests List */}
      <div className="flex-1 overflow-y-auto scrollbar-premium p-6">
        <motion.div 
          className="grid gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {dailyQuests.map((quest, index) => (
            <motion.div
              key={quest.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <QuestCard {...quest} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Footer Stats */}
      <div className="flex-shrink-0 px-6 py-4 border-t border-border bg-card/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="font-display text-xl text-accent">{completedQuests}</p>
              <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">Completed</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="font-display text-xl text-primary">{dailyQuests.length - completedQuests}</p>
              <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">Remaining</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="font-display text-xl text-foreground">12</p>
              <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">Day Streak</p>
            </div>
          </div>
          <RpgButton variant="accent" size="sm">
            View All Quests
          </RpgButton>
        </div>
      </div>
    </div>
  );
}
