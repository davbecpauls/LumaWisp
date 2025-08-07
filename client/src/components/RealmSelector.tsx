import { motion } from "framer-motion";
import type { Realm } from "@/types/luma";

interface RealmSelectorProps {
  currentRealm: Realm;
  onRealmChange: (realm: Realm) => void;
  className?: string;
}

const realms: { realm: Realm; name: string; emoji: string; colors: string }[] = [
  { 
    realm: "aether", 
    name: "Aether Realm", 
    emoji: "✨", 
    colors: "from-purple-100 to-violet-100 border-purple-300 text-purple-800" 
  },
  { 
    realm: "fire", 
    name: "Fire Realm", 
    emoji: "🔥", 
    colors: "from-orange-100 to-red-100 border-orange-300 text-orange-800" 
  },
  { 
    realm: "water", 
    name: "Water Realm", 
    emoji: "💧", 
    colors: "from-blue-100 to-cyan-100 border-blue-300 text-blue-800" 
  },
  { 
    realm: "earth", 
    name: "Earth Realm", 
    emoji: "🌍", 
    colors: "from-green-100 to-emerald-100 border-green-300 text-green-800" 
  },
  { 
    realm: "air", 
    name: "Air Realm", 
    emoji: "🌬️", 
    colors: "from-sky-100 to-blue-100 border-sky-300 text-sky-800" 
  },
];

export default function RealmSelector({ currentRealm, onRealmChange, className = "" }: RealmSelectorProps) {
  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl ${className}`}>
      <h3 className="font-fredoka text-xl text-gray-800 mb-4">Choose Your Path</h3>
      <div className="space-y-3">
        {realms.map(({ realm, name, emoji, colors }) => (
          <motion.button
            key={realm}
            onClick={() => onRealmChange(realm)}
            className={`
              w-full p-4 rounded-2xl bg-gradient-to-r ${colors}
              transition-all duration-300 text-left relative overflow-hidden
              ${currentRealm === realm ? "ring-2 ring-purple-400 scale-105" : "hover:scale-102"}
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-2xl block mb-1">{emoji}</span>
            <span className="font-comfortaa font-bold">{name}</span>
            
            {currentRealm === realm && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
