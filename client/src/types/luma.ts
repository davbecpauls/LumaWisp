export type Realm = "aether" | "fire" | "water" | "earth" | "air";

export interface Message {
  id: string;
  role: "user" | "luma";
  content: string;
  timestamp: string;
  realm?: Realm;
}

export interface LumaPersonality {
  realm: Realm;
  greeting: string;
  voiceTone: string;
  specialPhrases: string[];
  teachings: string[];
}

export interface UserProgress {
  wispstars: number;
  crystalCrumbs: number;
  currentRealm: Realm;
}

export interface Challenge {
  id: string;
  challengeType: string;
  completed?: Date;
  realm?: Realm;
}

export interface WispThought {
  thought: string;
  realm: Realm;
}

export interface ChatResponse {
  response: string;
  conversationId?: string;
  messages: Message[];
}

export interface TransformResponse {
  realm: Realm;
  personality: LumaPersonality;
  greeting: string;
}
