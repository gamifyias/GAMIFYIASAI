import { useState } from "react";
import { GameLayout } from "@/components/layout/GameLayout";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { QuestsPanel } from "@/components/quests/QuestsPanel";
import { motion } from "framer-motion";
import { BookOpen, Trophy, Scroll } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("chat");

  const renderContent = () => {
    switch (activeTab) {
      case "chat":
        return <ChatInterface />;
      case "quests":
        return <QuestsPanel />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-md"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-rpg-cyan/20 to-rpg-purple/20 border border-primary/30 flex items-center justify-center glow-cyan">
                {activeTab === "study" && <BookOpen className="w-10 h-10 text-primary" />}
                {activeTab === "achievements" && <Trophy className="w-10 h-10 text-rpg-gold" />}
                {activeTab === "resources" && <Scroll className="w-10 h-10 text-primary" />}
              </div>
              <h2 className="font-display text-2xl text-foreground mb-2 tracking-wide">
                {activeTab === "study" && "Study Realm"}
                {activeTab === "achievements" && "Achievements"}
                {activeTab === "resources" && "UPSC Scrolls"}
              </h2>
              <p className="text-muted-foreground font-body">
                This realm is under construction. Return to the Mentor Chamber to continue your preparation.
              </p>
            </motion.div>
          </div>
        );
    }
  };

  return (
    <GameLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="h-screen">{renderContent()}</div>
    </GameLayout>
  );
};

export default Index;
