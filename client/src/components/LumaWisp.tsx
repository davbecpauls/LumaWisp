import { motion } from "framer-motion";
import type { Realm } from "@/types/luma";

interface LumaWispProps {
  realm: Realm;
  size?: "small" | "medium" | "large";
  animated?: boolean;
  onClick?: () => void;
}

const realmColors = {
  aether: {
    primary: "#8b5cf6", // purple-500
    secondary: "#a78bfa", // purple-400
    accent: "#c4b5fd", // purple-300
    glow: "rgba(139, 92, 246, 0.4)"
  },
  fire: {
    primary: "#f97316", // orange-500
    secondary: "#fb923c", // orange-400
    accent: "#fed7aa", // orange-200
    glow: "rgba(249, 115, 22, 0.4)"
  },
  water: {
    primary: "#0ea5e9", // sky-500
    secondary: "#38bdf8", // sky-400
    accent: "#7dd3fc", // sky-300
    glow: "rgba(14, 165, 233, 0.4)"
  },
  earth: {
    primary: "#059669", // emerald-600
    secondary: "#10b981", // emerald-500
    accent: "#6ee7b7", // emerald-300
    glow: "rgba(5, 150, 105, 0.4)"
  },
  air: {
    primary: "#0284c7", // sky-600
    secondary: "#0ea5e9", // sky-500
    accent: "#bae6fd", // sky-200
    glow: "rgba(2, 132, 199, 0.4)"
  }
};

const sizes = {
  small: { width: 48, height: 48 },
  medium: { width: 80, height: 80 },
  large: { width: 120, height: 120 },
};

// Custom SVG character for each realm
const LumaSVG = ({ realm, size, animated }: { realm: Realm; size: { width: number; height: number }; animated: boolean }) => {
  const colors = realmColors[realm];
  const { width, height } = size;
  
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 120 120" 
      className="drop-shadow-lg"
    >
      <defs>
        {/* Glow filter */}
        <filter id={`glow-${realm}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Gradient for body */}
        <radialGradient id={`body-gradient-${realm}`} cx="0.3" cy="0.3" r="0.8">
          <stop offset="0%" stopColor={colors.accent} />
          <stop offset="70%" stopColor={colors.secondary} />
          <stop offset="100%" stopColor={colors.primary} />
        </radialGradient>
        
        {/* Sparkle gradient */}
        <radialGradient id={`sparkle-${realm}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor={colors.accent} stopOpacity="0.3" />
        </radialGradient>
      </defs>
      
      {/* Outer glow/aura */}
      <circle 
        cx="60" 
        cy="60" 
        r="50" 
        fill={colors.glow} 
        opacity={animated ? "0.4" : "0.2"}
      >
        {animated && (
          <animate 
            attributeName="opacity" 
            values="0.2;0.6;0.2" 
            dur="3s" 
            repeatCount="indefinite" 
          />
        )}
      </circle>
      
      {/* Main wisp body - ethereal, flowing shape */}
      <path 
        d="M60 20 C75 25, 85 40, 80 55 C90 65, 85 80, 70 85 C60 95, 50 90, 45 80 C30 75, 25 60, 35 45 C25 35, 35 25, 50 25 C55 20, 60 20, 60 20 Z" 
        fill={`url(#body-gradient-${realm})`}
        filter={`url(#glow-${realm})`}
      >
        {animated && (
          <animateTransform 
            attributeName="transform" 
            type="rotate" 
            values="0 60 60;5 60 60;-5 60 60;0 60 60" 
            dur="4s" 
            repeatCount="indefinite" 
          />
        )}
      </path>
      
      {/* Wisp tail/trail */}
      <path 
        d="M30 70 Q20 75, 15 85 Q10 90, 8 95 Q6 98, 4 100" 
        stroke={colors.secondary} 
        strokeWidth="2" 
        fill="none" 
        opacity="0.7"
      >
        {animated && (
          <animate 
            attributeName="opacity" 
            values="0.3;0.8;0.3" 
            dur="2s" 
            repeatCount="indefinite" 
          />
        )}
      </path>
      
      {/* Eyes - magical, glowing */}
      <circle cx="52" cy="45" r="4" fill="#ffffff" />
      <circle cx="68" cy="45" r="4" fill="#ffffff" />
      <circle cx="52" cy="45" r="2" fill={colors.primary} />
      <circle cx="68" cy="45" r="2" fill={colors.primary} />
      
      {/* Eye sparkles */}
      <circle cx="53" cy="44" r="0.8" fill="#ffffff" opacity="0.8" />
      <circle cx="69" cy="44" r="0.8" fill="#ffffff" opacity="0.8" />
      
      {/* Magical elements based on realm */}
      {realm === "aether" && (
        <>
          {/* Stars */}
          <polygon points="30,30 32,35 37,35 33,38 35,43 30,40 25,43 27,38 23,35 28,35" fill="#ffd700" opacity="0.8">
            {animated && <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />}
          </polygon>
          <polygon points="85,25 87,30 92,30 88,33 90,38 85,35 80,38 82,33 78,30 83,30" fill="#ffd700" opacity="0.6" transform="scale(0.7)">
            {animated && <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite" />}
          </polygon>
        </>
      )}
      
      {realm === "fire" && (
        <>
          {/* Flame wisps */}
          <path d="M70 25 Q75 20, 80 25 Q85 30, 80 35 Q75 30, 70 25" fill="#ff6b35" opacity="0.8">
            {animated && <animateTransform attributeName="transform" type="scale" values="1;1.1;1" dur="1.5s" repeatCount="indefinite" />}
          </path>
          <path d="M35 80 Q40 85, 45 80 Q50 75, 45 70 Q40 75, 35 80" fill="#ff8c42" opacity="0.7">
            {animated && <animateTransform attributeName="transform" type="scale" values="1;0.9;1" dur="1.8s" repeatCount="indefinite" />}
          </path>
        </>
      )}
      
      {realm === "water" && (
        <>
          {/* Water droplets */}
          <ellipse cx="25" cy="35" rx="3" ry="5" fill="#4fc3f7" opacity="0.7">
            {animated && <animateTransform attributeName="transform" type="translate" values="0,0;0,5;0,0" dur="2s" repeatCount="indefinite" />}
          </ellipse>
          <ellipse cx="90" cy="70" rx="2" ry="4" fill="#29b6f6" opacity="0.6">
            {animated && <animateTransform attributeName="transform" type="translate" values="0,0;0,3;0,0" dur="2.3s" repeatCount="indefinite" />}
          </ellipse>
        </>
      )}
      
      {realm === "earth" && (
        <>
          {/* Leaves/nature elements */}
          <ellipse cx="30" cy="25" rx="6" ry="3" fill="#66bb6a" opacity="0.8" transform="rotate(45 30 25)">
            {animated && <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />}
          </ellipse>
          <ellipse cx="85" cy="85" rx="4" ry="2" fill="#81c784" opacity="0.7" transform="rotate(-30 85 85)">
            {animated && <animate attributeName="opacity" values="0.7;1;0.7" dur="2.7s" repeatCount="indefinite" />}
          </ellipse>
        </>
      )}
      
      {realm === "air" && (
        <>
          {/* Wind swirls */}
          <path d="M20 40 Q30 35, 25 45 Q35 40, 30 50" stroke="#81d4fa" strokeWidth="2" fill="none" opacity="0.7">
            {animated && <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />}
          </path>
          <path d="M85 75 Q95 70, 90 80 Q100 75, 95 85" stroke="#4fc3f7" strokeWidth="1.5" fill="none" opacity="0.6">
            {animated && <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.5s" repeatCount="indefinite" />}
          </path>
        </>
      )}
      
      {/* Floating sparkles */}
      {animated && (
        <>
          <circle r="1.5" fill={`url(#sparkle-${realm})`}>
            <animateMotion dur="4s" repeatCount="indefinite" path="M25,25 Q60,10 95,35 Q60,50 25,25" />
          </circle>
          <circle r="1" fill={`url(#sparkle-${realm})`}>
            <animateMotion dur="5s" repeatCount="indefinite" path="M80,80 Q20,60 40,20 Q90,40 80,80" />
          </circle>
          <circle r="0.8" fill={`url(#sparkle-${realm})`}>
            <animateMotion dur="3.5s" repeatCount="indefinite" path="M50,95 Q30,50 70,30 Q90,70 50,95" />
          </circle>
        </>
      )}
    </svg>
  );
};

export default function LumaWisp({ realm, size = "medium", animated = true, onClick }: LumaWispProps) {
  const colors = realmColors[realm];
  const dimensions = sizes[size];
  
  const MotionDiv = animated ? motion.div : "div";
  
  const animationProps = animated ? {
    animate: { 
      y: [0, -8, 0],
    },
    transition: { 
      duration: 4, 
      repeat: Infinity, 
      ease: "easeInOut",
    },
  } : {};

  return (
    <MotionDiv
      {...animationProps}
      className="relative cursor-pointer select-none"
      onClick={onClick}
      style={{
        filter: `drop-shadow(0 0 15px ${colors.glow})`,
      }}
    >
      <LumaSVG realm={realm} size={dimensions} animated={animated} />
      
      {/* Floating accessories for large size */}
      {size === "large" && (
        <>
          <motion.div 
            className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-300 to-yellow-500 
                       rounded-full flex items-center justify-center text-xs shadow-lg"
            animate={animated ? { y: [0, -5, 0] } : {}}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          >
            📚
          </motion.div>
          
          <motion.div 
            className="absolute -bottom-1 -left-2 w-5 h-5 bg-gradient-to-br from-blue-300 to-blue-500 
                       rounded-full flex items-center justify-center text-xs shadow-lg"
            animate={animated ? { y: [0, -5, 0] } : {}}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          >
            🔍
          </motion.div>
        </>
      )}
    </MotionDiv>
  );
}
