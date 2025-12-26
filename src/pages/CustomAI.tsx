import { ChatInterface } from "@/components/chat/ChatInterface";

const CustomAI = () => {
  return (
    <div className="h-screen bg-background">
      <ChatInterface 
        endpoint="upsc-mentor"
        mentorName="UPSC AI Coach"
      />
    </div>
  );
};

export default CustomAI;
