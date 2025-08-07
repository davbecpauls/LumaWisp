import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import LumaWisp from "./LumaWisp";
import ChatInterface from "./ChatInterface";
import type { Realm, WispThought } from "@/types/luma";
import { lumaApi } from "@/lib/lumaApi";

interface LumaWidgetProps {
  realm: Realm;
  onRealmChange: (realm: Realm) => void;
  userId?: string;
}

export default function LumaWidget({ realm, onRealmChange, userId }: LumaWidgetProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showDailyThought, setShowDailyThought] = useState(false);

  // Get daily wisp thought
  const { data: wispThought } = useQuery<WispThought>({
    queryKey: ["/api/luma/thought", realm],
    queryFn: () => lumaApi.getWispThought(realm),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Show daily thought on mount and realm change
  useEffect(() => {
    if (wispThought) {
      setShowDailyThought(true);
      const timer = setTimeout(() => {
        setShowDailyThought(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [wispThought, realm]);

  const handleLumaClick = () => {
    setIsChatOpen(!isChatOpen);
    setShowDailyThought(false);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Daily Thought Bubble */}
      <AnimatePresence>
        {showDailyThought && wispThought && !isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-28 right-0 w-64 bg-gradient-to-r from-yellow-100 to-orange-100 
                       rounded-2xl p-4 shadow-lg border border-orange-200/50"
          >
            <div className="flex items-start space-x-2">
              <span className="text-2xl">💫</span>
              <div className="flex-1">
                <h5 className="font-comfortaa font-bold text-orange-800 text-sm">Wisp Thought</h5>
                <p className="text-xs text-orange-700 mt-1">{wispThought.thought}</p>
              </div>
            </div>
            <button
              onClick={() => setShowDailyThought(false)}
              className="absolute top-2 right-2 text-orange-400 hover:text-orange-600 text-sm transition-colors"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Interface */}
      <ChatInterface
        realm={realm}
        isVisible={isChatOpen}
        onClose={handleCloseChat}
        userId={userId}
      />

      {/* Luma Character */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <LumaWisp
          realm={realm}
          size="large"
          animated={true}
          onClick={handleLumaClick}
        />
      </motion.div>

      {/* Realm Quick Selector (appears on hover) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileHover={{ opacity: 1, x: 0 }}
        className="absolute top-0 right-28 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-xl 
                   border border-gray-200 hidden lg:block"
      >
        <div className="grid grid-cols-3 gap-2">
          {(["fire", "water", "earth", "air", "aether"] as Realm[]).map((r) => {
            const colors = {
              aether: "from-purple-400 to-violet-500",
              fire: "from-orange-400 to-red-500",
              water: "from-blue-400 to-cyan-500",
              earth: "from-green-400 to-emerald-500", 
              air: "from-sky-300 to-blue-400",
            };
            
            const emojis = {
              aether: "✨",
              fire: "🔥", 
              water: "💧",
              earth: "🌍",
              air: "🌬️",
            };

            return (
              <motion.button
                key={r}
                onClick={() => onRealmChange(r)}
                className={`
                  w-10 h-10 rounded-full bg-gradient-to-br ${colors[r]}
                  flex items-center justify-center text-white text-sm
                  transition-all duration-300
                  ${realm === r ? "ring-2 ring-purple-400 scale-110" : "hover:scale-110"}
                `}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {emojis[r]}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
