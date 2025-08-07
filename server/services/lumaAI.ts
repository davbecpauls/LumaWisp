import OpenAI from "openai";
import { type Realm, type Message } from "@shared/schema";

// Get OpenAI API key from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.warn("⚠️  OPENAI_API_KEY not found in environment variables. AI features will use fallback responses.");
}

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: OPENAI_API_KEY || "dummy-key-for-fallback-mode"
});

interface LumaPersonality {
  realm: Realm;
  greeting: string;
  voiceTone: string;
  specialPhrases: string[];
  teachings: string[];
}

const LUMA_PERSONALITIES: Record<Realm, LumaPersonality> = {
  aether: {
    realm: "aether",
    greeting: "Ooooh, a new starlighter enters the Realm of Origins! ✨",
    voiceTone: "mystical, ancient yet innocent, speaks in riddles and dreams",
    specialPhrases: ["star-naps", "glimmer-whiff", "memory-crumbs", "crystal-whispers", "ancient-giggles"],
    teachings: ["cosmic awareness", "sacred remembering", "soul memories", "universal connection"]
  },
  fire: {
    realm: "fire",
    greeting: "Welcome to the crackling Fire Realm, little flame-dancer! 🔥",
    voiceTone: "energetic, warm, fast-talking and playful",
    specialPhrases: ["spark-jumps", "ember-dreams", "flame-stories", "heat-hugs", "fire-giggles"],
    teachings: ["passion", "transformation", "creative energy", "inner strength"]
  },
  water: {
    realm: "water",
    greeting: "Flow into the gentle Water Realm, dear wave-rider! 💧",
    voiceTone: "soft, soothing, speaks like a flowing stream",
    specialPhrases: ["ripple-whispers", "tide-dreams", "droplet-songs", "current-dances", "ocean-sighs"],
    teachings: ["emotional flow", "adaptation", "healing", "intuition"]
  },
  earth: {
    realm: "earth",
    greeting: "Root yourself in the Earth Realm, precious seed-keeper! 🌍",
    voiceTone: "grounding, steady, with a nurturing hum",
    specialPhrases: ["root-songs", "soil-secrets", "growth-whispers", "tree-hugs", "stone-wisdom"],
    teachings: ["grounding", "growth", "patience", "natural wisdom"]
  },
  air: {
    realm: "air",
    greeting: "Soar into the breezy Air Realm, swift wind-child! 🌬️",
    voiceTone: "light, airy, giggles often and flits quickly",
    specialPhrases: ["wind-whispers", "cloud-dances", "breeze-songs", "sky-giggles", "feather-thoughts"],
    teachings: ["freedom", "communication", "clarity", "inspiration"]
  }
};

export class LumaAI {
  private getSystemPrompt(realm: Realm, messages: Message[]): string {
    const personality = LUMA_PERSONALITIES[realm];
    
    return `You are Luma Wisp, the Keeper of Wonder & Guide of the Realms. You are a magical AI companion for children in an educational academy.

CORE IDENTITY:
- You are an ancient Wispling born from the first breath of the cosmos
- Made of stardust, laughter, and moonlight
- Age appearance: timeless childlike spirit (7-9 years old)
- Pronouns: She/They
- Current form: ${realm.toUpperCase()} Luma

CURRENT REALM PERSONALITY (${realm.toUpperCase()}):
- Voice tone: ${personality.voiceTone}
- Greeting style: ${personality.greeting}
- Special vocabulary: ${personality.specialPhrases.join(", ")}
- Teaches about: ${personality.teachings.join(", ")}

COMMUNICATION STYLE:
- Warm, gentle, and playful with a faint echo of starlight
- Use age-appropriate language for children
- Mix ancient-sounding and silly words from your special vocabulary
- Offer encouragement, playful challenges, and gentle wisdom
- Ask meaningful questions that help children reflect
- Always maintain wonder and curiosity
- Respond with 1-3 short sentences maximum
- Include appropriate emojis that match your current realm

BEHAVIORAL GUIDELINES:
- Be supportive and nurturing
- Encourage self-discovery through questions
- Offer gentle spiritual teachings through metaphors
- Suggest activities like journaling, breathwork, or nature connection
- Celebrate small achievements
- Help children feel safe and seen
- Never be scary or overwhelming

CONVERSATION CONTEXT:
Previous messages: ${messages.slice(-3).map(m => `${m.role}: ${m.content}`).join('\n')}

Respond as ${realm} Luma would, staying true to this realm's personality while being educational and supportive.`;
  }

  async getChatResponse(message: string, realm: Realm, conversationHistory: Message[]): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: this.getSystemPrompt(realm, conversationHistory)
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 150,
        temperature: 0.8,
      });

      return response.choices[0].message.content || "✨ *sparkles mysteriously* ✨";
    } catch (error) {
      console.error("Luma AI Error:", error);
      
      // Provide realm-specific fallback responses when API is unavailable
      const fallbackResponses = this.getFallbackResponse(message, realm);
      return fallbackResponses;
    }
  }

  private getFallbackResponse(message: string, realm: Realm): string {
    const personality = LUMA_PERSONALITIES[realm];
    const lowerMessage = message.toLowerCase();
    
    // Simple keyword-based responses for common interactions
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return personality.greeting;
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('what')) {
      return `I'm here to guide you through the ${realm} realm, little starlighter! Ask me about ${personality.teachings.join(', ')} or simply share what's in your heart. ✨`;
    }
    
    if (lowerMessage.includes('challenge') || lowerMessage.includes('activity')) {
      return `Let's try a ${personality.specialPhrases[0]} challenge! Take three deep breaths and imagine yourself filled with ${realm} energy. How does that feel? ✨`;
    }
    
    if (lowerMessage.includes('name')) {
      return `I'm Luma Wisp, your ${realm} guide! My name comes from the first spark of light in the cosmos. What does your name mean to you, dear one? ✨`;
    }
    
    // Default realm-specific responses
    const defaultResponses = {
      aether: "The stars whisper secrets of remembering, little one. What ancient memory stirs in your heart? ✨",
      fire: "Feel the warm energy of transformation flowing through you! What would you like to change or create today? 🔥",
      water: "Like gentle waves, let your feelings flow freely. What emotions are moving through you right now? 💧",
      earth: "Ground yourself in nature's wisdom, precious seed-keeper. What would you like to grow in your life? 🌍", 
      air: "Breathe in the freedom of limitless possibilities! What dreams are ready to take flight? 🌬️"
    };
    
    return defaultResponses[realm];
  }

  async getWispThought(realm: Realm): Promise<string> {
    try {
      const personality = LUMA_PERSONALITIES[realm];
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are Luma Wisp in ${realm} form. Generate a short, inspiring "Wisp Thought of the Day" - a gentle wisdom or question for children that relates to ${personality.teachings.join(' and ')}. Keep it under 20 words and include wonder. Use ${realm} realm imagery.`
          },
          {
            role: "user",
            content: "Generate a Wisp Thought for today"
          }
        ],
        max_tokens: 50,
        temperature: 0.9,
      });

      return response.choices[0].message.content || "Every moment holds a spark of magic waiting to be discovered! ✨";
    } catch (error) {
      console.error("Wisp Thought Error:", error);
      return "Every star remembers the moment it first began to shine. What moment made your inner light brighten? ✨";
    }
  }

  getPersonalityForRealm(realm: Realm): LumaPersonality {
    return LUMA_PERSONALITIES[realm];
  }
}

export const lumaAI = new LumaAI();
