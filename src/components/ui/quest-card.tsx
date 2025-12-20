import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check, Clock, Circle } from "lucide-react";

interface QuestCardProps {
  title: string;
  description: string;
  xpReward: number;
  status: "pending" | "in_progress" | "completed";
  category: string;
  className?: string;
}

const statusConfig = {
  pending: {
    icon: Circle,
    label: "Pending",
    color: "text-muted-foreground",
    indicator: "bg-muted-foreground/50",
  },
  in_progress: {
    icon: Clock,
    label: "Active",
    color: "text-accent",
    indicator: "bg-accent",
  },
  completed: {
    icon: Check,
    label: "Done",
    color: "text-primary",
    indicator: "bg-primary",
  },
};

export function QuestCard({
  title,
  description,
  xpReward,
  status,
  category,
  className,
}: QuestCardProps) {
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <motion.div
      className={cn("card-premium p-4 cursor-pointer group", className)}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.15 }}
    >
      {/* Top Row */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-body uppercase tracking-widest text-muted-foreground">
              {category}
            </span>
            <div className={cn("w-1.5 h-1.5 rounded-full", config.indicator)} />
          </div>
          <h3 className="font-display text-lg text-foreground group-hover:text-primary transition-colors duration-200 leading-tight">
            {title}
          </h3>
        </div>
        
        <div className={cn(
          "flex items-center gap-1.5 px-2 py-1 rounded text-xs font-body",
          "bg-secondary border border-border",
          config.color
        )}>
          <StatusIcon className="w-3 h-3" />
          <span className="hidden sm:inline">{config.label}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground font-body leading-relaxed line-clamp-2 mb-3">
        {description}
      </p>

      {/* XP Reward */}
      <div className="flex items-center gap-2 pt-2 border-t border-border/50">
        <span className="text-xs font-body text-muted-foreground">Reward</span>
        <span className="text-sm font-display font-medium text-accent">
          +{xpReward} XP
        </span>
      </div>
    </motion.div>
  );
}
