import { ReactNode } from "react";
import { GameSidebar } from "./GameSidebar";
import { AmbientBackground } from "@/components/ui/ambient-background";

interface GameLayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function GameLayout({ children, activeTab, onTabChange }: GameLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AmbientBackground />
      
      {/* Sidebar */}
      <GameSidebar 
        activeTab={activeTab} 
        onTabChange={onTabChange}
        className="flex-shrink-0 z-10"
      />

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden">
        {children}
      </main>
    </div>
  );
}
