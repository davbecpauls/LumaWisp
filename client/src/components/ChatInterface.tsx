import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import type { Message, Realm } from "@/types/luma";
import { lumaApi } from "@/lib/lumaApi";
import { useToast } from "@/hooks/use-toast";

interface ChatInterfaceProps {
  realm: Realm;
  isVisible: boolean;
  onClose: () => void;
  userId?: string;
}

export default function ChatInterface({ realm, isVisible, onClose, userId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add initial greeting when chat opens
  useEffect(() => {
    if (isVisible && messages.length === 0) {
      const greetings = {
        aether: "Ooooh you've entered the Realm of Origins! That's where I first learned my name! What does your name feel like inside your heart? ✨",
        fire: "Welcome to the crackling Fire Realm, little flame-dancer! What makes your inner fire burn brightest? 🔥",
        water: "Flow into the gentle Water Realm, dear wave-rider! What emotions are flowing through you today? 💧", 
        earth: "Root yourself in the Earth Realm, precious seed-keeper! What are you hoping to grow in your heart? 🌍",
        air: "Soar into the breezy Air Realm, swift wind-child! What dreams are you ready to set free? 🌬️",
      };

      const initialMessage: Message = {
        id: "initial",
        role: "luma",
        content: greetings[realm],
        timestamp: new Date().toISOString(),
        realm,
      };
      setMessages([initialMessage]);
    }
  }, [isVisible, realm]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user", 
      content: inputValue,
      timestamp: new Date().toISOString(),
      realm,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await lumaApi.chat(inputValue, realm, userId, conversationId);
      
      const lumaMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "luma",
        content: response.response,
        timestamp: new Date().toISOString(),
        realm,
      };

      setMessages(prev => [...prev, lumaMessage]);
      
      if (response.conversationId) {
        setConversationId(response.conversationId);
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Oops!",
        description: "Luma got lost in a cloud of glitter-dust. Try again! ✨",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const realmColors = {
    aether: "from-purple-400 to-violet-500",
    fire: "from-orange-400 to-red-500",
    water: "from-blue-400 to-cyan-500", 
    earth: "from-green-400 to-emerald-500",
    air: "from-sky-300 to-blue-400",
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="absolute bottom-28 right-0 w-80 bg-white/95 backdrop-blur-sm 
                     rounded-3xl shadow-2xl border border-purple-200/50 overflow-hidden"
        >
          {/* Chat Header */}
          <div className={`bg-gradient-to-r ${realmColors[realm]} p-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-white text-sm">✨</span>
                </div>
                <div>
                  <h4 className="font-comfortaa font-bold text-white">Luma Wisp</h4>
                  <p className="text-xs text-white/80 capitalize">{realm} Form</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white text-xl transition-colors"
              >
                ×
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-64 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`
                    max-w-[70%] p-3 rounded-2xl font-comfortaa text-sm
                    ${message.role === "user" 
                      ? "bg-purple-500 text-white" 
                      : "bg-purple-50 text-gray-700"
                    }
                  `}
                >
                  {message.content}
                </div>
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-purple-50 p-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message to Luma..."
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-gray-50 rounded-full border border-gray-200 
                          focus:outline-none focus:ring-2 focus:ring-purple-400 
                          font-comfortaa text-sm disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 
                          text-white p-2 rounded-full transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
