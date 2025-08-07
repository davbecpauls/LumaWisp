import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Download, ExternalLink, BookOpen } from "lucide-react";
import LumaWisp from "./LumaWisp";
import type { Realm } from "@/types/luma";
import { useToast } from "@/hooks/use-toast";

interface TwineIntegrationProps {
  onCopyCode: (code: string) => void;
}

export default function TwineIntegration({ onCopyCode }: TwineIntegrationProps) {
  const [selectedRealm, setSelectedRealm] = useState<Realm>("aether");
  const [integrationType, setIntegrationType] = useState<"macros" | "widget" | "story">("macros");
  const [generatedCode, setGeneratedCode] = useState("");
  const { toast } = useToast();

  const generateTwineCode = () => {
    const baseUrl = window.location.origin;
    
    let code = "";
    
    switch (integrationType) {
      case "macros":
        code = `:: Luma Wisp Macros [script]
/*
Luma Wisp Integration Macros for Twine Stories
Add these macros to your Twine story's JavaScript section
*/

window.LumaWisp = {
  currentRealm: '${selectedRealm}',
  apiUrl: '${baseUrl}/api',
  
  // Initialize Luma in your story
  init: function(containerId = 'luma-container') {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error('Luma container not found:', containerId);
      return;
    }
    
    // Create Luma Wisp element
    container.innerHTML = \`
      <div class="luma-wisp-story">
        <div class="luma-character" data-realm="\${this.currentRealm}">
          <div class="luma-visual">✨</div>
          <div class="luma-name">Luma Wisp</div>
        </div>
        <div class="luma-dialogue" id="luma-dialogue">
          <p class="luma-thought">\${this.getRealmGreeting()}</p>
        </div>
      </div>
      <style>
        .luma-wisp-story { 
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1));
          border: 2px solid #8b5cf6;
          border-radius: 20px;
          padding: 15px;
          margin: 10px 0;
          font-family: 'Comfortaa', cursive;
        }
        .luma-character {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }
        .luma-visual {
          font-size: 2rem;
          margin-right: 10px;
          animation: sparkle 2s infinite;
        }
        .luma-name {
          font-weight: bold;
          color: #7c3aed;
        }
        .luma-dialogue {
          color: #4c1d95;
          font-style: italic;
        }
        @keyframes sparkle {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      </style>
    \`;
  },
  
  // Change realm with visual transformation
  transformTo: function(realm) {
    this.currentRealm = realm;
    const visual = document.querySelector('.luma-visual');
    const dialogue = document.querySelector('.luma-dialogue');
    
    if (visual && dialogue) {
      const realmVisuals = {
        aether: '⭐',
        fire: '🔥', 
        water: '💧',
        earth: '🌱',
        air: '🌪️'
      };
      
      visual.textContent = realmVisuals[realm];
      dialogue.innerHTML = \`<p class="luma-thought">\${this.getRealmGreeting()}</p>\`;
      
      // Add transformation effect
      visual.style.animation = 'none';
      setTimeout(() => {
        visual.style.animation = 'sparkle 2s infinite';
      }, 100);
    }
  },
  
  // Get AI response for story integration
  speak: async function(message, playerName = 'little one') {
    try {
      const response = await fetch(\`\${this.apiUrl}/luma/chat\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          realm: this.currentRealm,
          userId: 'twine-player'
        })
      });
      
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Luma speak error:', error);
      return this.getFallbackResponse(message);
    }
  },
  
  // Get realm-specific greeting
  getRealmGreeting: function() {
    const greetings = {
      aether: "Welcome to the Realm of Origins, where all memories begin! ⭐",
      fire: "Feel the warmth of transformation in the Fire Realm! 🔥",
      water: "Let emotions flow freely in the Water Realm! 💧", 
      earth: "Ground yourself in nature's wisdom in the Earth Realm! 🌱",
      air: "Breathe in freedom in the Air Realm! 🌪️"
    };
    return greetings[this.currentRealm];
  },
  
  // Fallback responses when API is unavailable
  getFallbackResponse: function(message) {
    const responses = {
      aether: "The stars whisper ancient wisdom to guide your path! ⭐",
      fire: "Let your inner fire light the way forward! 🔥",
      water: "Flow like water, adapting to every challenge! 💧",
      earth: "Stay rooted in your strength and grow! 🌱", 
      air: "Let your dreams soar on the wind! 🌪️"
    };
    return responses[this.currentRealm];
  }
};

// Twine Story Macros
Macro.add('luma', {
  handler: function() {
    // <<luma>> - Initialize Luma
    LumaWisp.init('luma-container-' + Math.random().toString(36).substr(2, 9));
  }
});

Macro.add('lumatransform', {
  handler: function() {
    // <<lumatransform "realm">> - Change realm
    if (this.args.length > 0) {
      LumaWisp.transformTo(this.args[0]);
    }
  }
});

Macro.add('lumaspeak', {
  handler: function() {
    // <<lumaspeak "message">> - Get AI response
    if (this.args.length > 0) {
      const message = this.args[0];
      LumaWisp.speak(message).then(response => {
        const dialogue = document.querySelector('.luma-dialogue');
        if (dialogue) {
          dialogue.innerHTML = \`<p class="luma-response">\${response}</p>\`;
        }
      });
    }
  }
});

:: Example Twine Passages

:: Start
Welcome to the Academy of Remembrance! 

<div id="luma-container-main"></div>
<<luma>>

[[Enter the Fire Realm->FireRealm]]
[[Enter the Water Realm->WaterRealm]]
[[Continue with Aether Luma->AetherStory]]

:: FireRealm
You step into the warm, glowing Fire Realm.

<<lumatransform "fire">>
<<lumaspeak "Welcome to the Fire Realm! What brings you here?">>

The air shimmers with creative energy.

[[Ask Luma about transformation->FireQuestion]]
[[Move to another realm->RealmChoice]]

:: FireQuestion
You ask Luma about the power of transformation.

<<lumaspeak "How can fire help me change and grow?">>

[[Thank Luma->FireEnd]]
[[Ask another question->FireRealm]]

:: WaterRealm
You enter the flowing, peaceful Water Realm.

<<lumatransform "water">>
<<lumaspeak "Welcome to the Water Realm! Let your emotions flow freely here.">>

Gentle waves of energy surround you.

[[Ask about emotions->WaterQuestion]]
[[Visit another realm->RealmChoice]]

:: AetherStory
You remain in the starlit Aether Realm with Luma.

<<lumaspeak "Tell me about the ancient memories that guide us.">>

Ancient starlight dances around you both.

[[Continue the conversation->AetherDeep]]
[[Explore other realms->RealmChoice]]`;
        break;
        
      case "widget":
        code = `<!-- Embedded Luma Wisp Widget for Twine Stories -->
<script src="${baseUrl}/luma-twine-widget.js"></script>

<div class="luma-story-widget" data-realm="${selectedRealm}" data-story-id="{{STORY_ID}}">
  <div class="luma-companion">
    <div class="luma-avatar" id="luma-avatar">✨</div>
    <div class="luma-speech-bubble" id="luma-speech">
      <p>Hello, brave storyteller! I'm here to guide you through this magical tale.</p>
    </div>
  </div>
</div>

<script>
// Initialize Luma Twine Widget
document.addEventListener('DOMContentLoaded', function() {
  const lumaWidget = new LumaTwineWidget({
    container: '.luma-story-widget',
    realm: '${selectedRealm}',
    apiUrl: '${baseUrl}/api',
    
    // Widget configuration
    position: 'companion', // companion, floating, inline
    size: 'medium',
    interactive: true,
    followPlayer: true,
    
    // Story integration
    respondToChoices: true,
    rememberChoices: true,
    adaptToStory: true,
    
    // Event handlers
    onPassageChange: function(passageName) {
      // Luma responds to story progression
      this.reactToPassage(passageName);
    },
    
    onPlayerChoice: function(choice, passage) {
      // Luma comments on player choices
      this.commentOnChoice(choice);
    },
    
    onStoryEnd: function(ending) {
      // Luma provides ending reflection
      this.reflectOnStory(ending);
    }
  });
  
  // Connect to Twine story events
  $(document).on('tm-navigate', function(event) {
    lumaWidget.onPassageChange(event.passage);
  });
  
  $(document).on('click', 'tw-link', function() {
    const choice = $(this).text();
    lumaWidget.onPlayerChoice(choice, State.passage);
  });
});
</script>

<style>
.luma-story-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  max-width: 300px;
  font-family: 'Comfortaa', cursive;
}

.luma-companion {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.95), rgba(59, 130, 246, 0.95));
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.luma-avatar {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 10px;
  animation: gentle-float 3s ease-in-out infinite;
}

.luma-speech-bubble {
  background: rgba(255, 255, 255, 0.9);
  padding: 10px;
  border-radius: 15px;
  color: #4c1d95;
  font-size: 0.9rem;
  line-height: 1.4;
  position: relative;
}

.luma-speech-bubble:before {
  content: '';
  position: absolute;
  top: -8px;
  left: 20px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid rgba(255, 255, 255, 0.9);
}

@keyframes gentle-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

@media (max-width: 768px) {
  .luma-story-widget {
    position: relative;
    bottom: auto;
    right: auto;
    margin: 20px auto;
    max-width: 100%;
  }
}
</style>`;
        break;
        
      case "story":
        code = `Twee Notation (.tw) Story with Luma Wisp Integration

:: Start [startup]
<div id="luma-main-container"></div>
<<set $lumaRealm to "${selectedRealm}">>
<<set $lumaRelationship to 0>>
<<set $playerChoices to []>>

<<luma>>

# 🌟 The Academy of Remembrance

Welcome, young seeker, to a place where memories become magic and learning transforms into adventure.

*A shimmering figure materializes before you - Luma Wisp, your mystical guide.*

<<lumaspeak "Greetings, brave soul! I sense great potential within you. Which realm calls to your heart first?">>

[[The Realm of Origins (Aether)->AetherIntro]]
[[The Fire Realm->FireIntro]]  
[[The Water Realm->WaterIntro]]
[[The Earth Realm->EarthIntro]]
[[The Air Realm->AirIntro]]

:: AetherIntro
<<set $lumaRealm to "aether">>
<<lumatransform "aether">>
<<set $lumaRelationship to $lumaRelationship + 1>>

*The world around you shifts into a cosmic tapestry of stars and swirling galaxies.*

You find yourself floating in the Aether Realm, where every star holds an ancient memory and wisdom flows like stardust through the void.

<<lumaspeak "Welcome to where all stories begin, little starlighter. Here in the Aether Realm, we explore the deepest mysteries of memory and origin. What ancient wisdom seeks you today?">>

The cosmic winds whisper secrets that only you can hear...

[[Ask about the origin of memories->MemoryOrigin]]
[[Request a memory meditation->AetherMeditation]]
[[Explore another realm->RealmSelector]]

:: FireIntro
<<set $lumaRealm to "fire">>
<<lumatransform "fire">>
<<set $lumaRelationship to $lumaRelationship + 1>>

*Warm light dances around you as the world ignites with creative energy.*

The Fire Realm pulses with transformation and passion. Flickering flames tell stories of change, growth, and the courage to become something new.

<<lumaspeak "Feel the warmth of possibility, spark-keeper! In this realm, we learn about transformation, creativity, and the brave heart that burns within. What would you like to transform today?">>

[[Learn about inner fire->InnerFire]]
[[Practice a creativity challenge->FireChallenge]]
[[Transform to another realm->RealmSelector]]

:: WaterIntro  
<<set $lumaRealm to "water">>
<<lumatransform "water">>
<<set $lumaRelationship to $lumaRelationship + 1>>

*Cool, flowing energy surrounds you as gentle waves of emotion wash over your spirit.*

In the Water Realm, feelings flow freely like streams and rivers. Here, Luma teaches the art of emotional wisdom and the strength found in gentleness.

<<lumaspeak "Let your heart flow like water, tide-walker. In this peaceful realm, we explore emotions, empathy, and the healing power of understanding. What feelings are moving through you?">>

[[Explore emotional wisdom->EmotionalWisdom]]
[[Try a feelings meditation->WaterMeditation]]
[[Flow to another realm->RealmSelector]]

:: MemoryOrigin
<<set $playerChoices to $playerChoices.concat(["memory_origin"])>>

You ask Luma about the mysterious origin of memories.

<<lumaspeak "Ah, what a beautiful question! Memories are like stars, dear one - each one a point of light in the vast cosmos of our experience. They begin the moment we truly *notice* something, when our heart says 'this matters.' Would you like to create a special memory right now?">>

The stars around you pulse brighter, as if responding to your curiosity.

[[Create a star-memory->StarMemory]]
[[Ask about forgetting->AboutForgetting]]
[[Return to realm selection->RealmSelector]]

:: StarMemory
<<set $lumaRelationship to $lumaRelationship + 2>>

*Luma's form sparkles with extra brightness*

<<lumaspeak "Close your eyes and think of something beautiful you experienced today - perhaps a moment of kindness, a pretty sight, or a warm feeling. Now, imagine placing that memory into a star. Watch as it glows with your unique light!">>

A new star appears in the cosmic vista around you, glowing with your personal memory.

*Achievement: Memory Keeper - You've learned to treasure meaningful moments*
<<set $wispstars to $wispstars + 1>>

[[Create another memory star->StarMemory]]
[[Explore other realms->RealmSelector]]
[[Continue Aether journey->AetherMeditation]]

:: RealmSelector
<<lumaspeak "Which realm calls to your spirit now, wonderful wanderer?">>

[[Return to Aether (Origins)->AetherIntro]]
[[Visit Fire (Transformation)->FireIntro]]  
[[Experience Water (Emotions)->WaterIntro]]
[[Discover Earth (Growth)->EarthIntro]]
[[Explore Air (Freedom)->AirIntro]]

[[End your Academy visit->Ending]]

:: Ending
<<lumaspeak "What a magnificent journey we've shared! Remember, brave one - you carry all these realms within your heart. The Academy of Remembrance lives wherever you are, ready to guide you toward wisdom and wonder.">>

*Luma's form begins to fade into stardust, but her warmth remains*

**Your Academy Adventure Stats:**
- Relationship with Luma: $lumaRelationship  
- Wispstars Earned: $wispstars
- Realms Explored: <<print $playerChoices.length>>

*The magical academy fades around you, but its lessons remain forever in your heart.*

**THE END**

[[Begin a new adventure->Start]]`;
        break;
    }
    
    setGeneratedCode(code);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    onCopyCode(generatedCode);
    toast({
      title: "Twine Code Copied!",
      description: "Ready to paste into your Twine story project.",
    });
  };

  const handleDownload = () => {
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `luma-twine-${integrationType}.${integrationType === 'story' ? 'tw' : 'js'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useState(() => {
    generateTwineCode();
  }, [selectedRealm, integrationType]);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
      <h3 className="font-fredoka text-xl text-gray-800 mb-4">
        📚 Twine Story Integration
      </h3>
      
      <p className="text-sm text-gray-600 mb-6 font-comfortaa">
        Bring Luma Wisp into your interactive Twine stories with these ready-to-use templates and macros.
      </p>

      {/* Integration Type Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Integration Type:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { type: "macros", name: "Story Macros", icon: "⚙️", desc: "Custom Twine commands" },
            { type: "widget", name: "Companion Widget", icon: "👥", desc: "Floating story guide" },
            { type: "story", name: "Complete Story", icon: "📖", desc: "Full Academy adventure" }
          ].map(({ type, name, icon, desc }) => (
            <motion.button
              key={type}
              onClick={() => setIntegrationType(type as any)}
              className={`p-4 rounded-lg border-2 text-left transition-all
                ${integrationType === type 
                  ? "border-blue-400 bg-blue-50" 
                  : "border-gray-200 hover:border-gray-300"
                }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-2xl mb-2">{icon}</div>
              <div className="font-comfortaa font-bold text-gray-800">{name}</div>
              <div className="text-xs text-gray-600">{desc}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Realm Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Starting Realm:
        </label>
        <div className="grid grid-cols-5 gap-2">
          {(["aether", "fire", "water", "earth", "air"] as Realm[]).map((realm) => (
            <motion.button
              key={realm}
              onClick={() => setSelectedRealm(realm)}
              className={`p-3 rounded-lg border-2 transition-all
                ${selectedRealm === realm 
                  ? "border-blue-400 bg-blue-50" 
                  : "border-gray-200 hover:border-gray-300"
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LumaWisp 
                realm={realm} 
                size="small" 
                animated={selectedRealm === realm}
              />
              <p className="text-xs mt-1 capitalize font-comfortaa">{realm}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Generated Code */}
      <div className="bg-gray-900 rounded-lg p-4 mb-4 max-h-96 overflow-y-auto">
        <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">
          {generatedCode}
        </pre>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <motion.button
          onClick={handleCopyCode}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 
                     text-white px-4 py-2 rounded-lg font-comfortaa font-bold transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Copy className="w-4 h-4" />
          <span>Copy Code</span>
        </motion.button>
        
        <motion.button
          onClick={handleDownload}
          className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 
                     text-white px-4 py-2 rounded-lg font-comfortaa font-bold transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </motion.button>
        
        <motion.button
          onClick={() => window.open('https://twinery.org/', '_blank')}
          className="flex items-center space-x-2 bg-indigo-500 hover:bg-indigo-600 
                     text-white px-4 py-2 rounded-lg font-comfortaa font-bold transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ExternalLink className="w-4 h-4" />
          <span>Open Twine</span>
        </motion.button>
        
        <motion.button
          onClick={() => window.open('https://twinery.org/cookbook/', '_blank')}
          className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 
                     text-white px-4 py-2 rounded-lg font-comfortaa font-bold transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <BookOpen className="w-4 h-4" />
          <span>Twine Guide</span>
        </motion.button>
      </div>

      {/* Integration Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-comfortaa font-bold text-blue-800 mb-2">Story Macros</h4>
          <ul className="text-sm text-blue-700 space-y-1 font-comfortaa">
            <li>• Add to Twine JavaScript</li>
            <li>• Use `&lt;&lt;luma&gt;&gt;` to summon</li>
            <li>• `&lt;&lt;lumatransform&gt;&gt;` to change</li>
            <li>• `&lt;&lt;lumaspeak&gt;&gt;` for AI chat</li>
          </ul>
        </div>
        
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-comfortaa font-bold text-green-800 mb-2">Companion Widget</h4>
          <ul className="text-sm text-green-700 space-y-1 font-comfortaa">
            <li>• Floating story guide</li>
            <li>• Reacts to choices</li>
            <li>• Remembers progress</li>
            <li>• Mobile responsive</li>
          </ul>
        </div>
        
        <div className="p-4 bg-orange-50 rounded-lg">
          <h4 className="font-comfortaa font-bold text-orange-800 mb-2">Complete Story</h4>
          <ul className="text-sm text-orange-700 space-y-1 font-comfortaa">
            <li>• Full Academy adventure</li>
            <li>• Multiple realm paths</li>
            <li>• Character progression</li>
            <li>• Educational content</li>
          </ul>
        </div>
      </div>
    </div>
  );
}