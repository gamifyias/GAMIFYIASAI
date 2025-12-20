import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface XpBarProps {
  currentXp: number;
  maxXp: number;
  level: number;
  className?: string;
}

export function XpBar({ currentXp, maxXp, level, className }: XpBarProps) {
  const percentage = (currentXp / maxXp) * 100;

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {/* Level Badge */}
      <div className="relative flex items-center justify-center">
        <div className="w-11 h-11 rounded-full border border-primary/30 bg-secondary flex items-center justify-center">
          <span className="font-display text-xl font-semibold text-primary">
            {level}
          </span>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="flex-1 space-y-1.5">
        <div className="flex justify-between text-xs font-body">
          <span className="text-muted-foreground uppercase tracking-widest text-[10px]">Experience</span>
          <span className="text-foreground/70 tabular-nums">
            {currentXp.toLocaleString()} / {maxXp.toLocaleString()}
          </span>
        </div>
        <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-xp-gradient rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
