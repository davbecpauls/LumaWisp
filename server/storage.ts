import { type User, type InsertUser, type LumaConversation, type InsertConversation, type Challenge, type InsertChallenge, type Realm, type Message } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  // Conversation operations
  getConversation(id: string): Promise<LumaConversation | undefined>;
  getConversationsByUser(userId: string): Promise<LumaConversation[]>;
  createConversation(conversation: InsertConversation): Promise<LumaConversation>;
  updateConversation(id: string, messages: Message[]): Promise<LumaConversation | undefined>;
  
  // Challenge operations
  getUserChallenges(userId: string): Promise<Challenge[]>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  completeChallenge(id: string): Promise<Challenge | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private conversations: Map<string, LumaConversation>;
  private challenges: Map<string, Challenge>;

  constructor() {
    this.users = new Map();
    this.conversations = new Map();
    this.challenges = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      wispstars: 0,
      crystalCrumbs: 0,
      currentRealm: "aether",
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getConversation(id: string): Promise<LumaConversation | undefined> {
    return this.conversations.get(id);
  }

  async getConversationsByUser(userId: string): Promise<LumaConversation[]> {
    return Array.from(this.conversations.values()).filter(
      (conv) => conv.userId === userId,
    );
  }

  async createConversation(insertConversation: InsertConversation): Promise<LumaConversation> {
    const id = randomUUID();
    const conversation: LumaConversation = {
      ...insertConversation,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async updateConversation(id: string, messages: Message[]): Promise<LumaConversation | undefined> {
    const conversation = this.conversations.get(id);
    if (!conversation) return undefined;
    
    const updated: LumaConversation = {
      ...conversation,
      messages: messages as any,
      updatedAt: new Date(),
    };
    this.conversations.set(id, updated);
    return updated;
  }

  async getUserChallenges(userId: string): Promise<Challenge[]> {
    return Array.from(this.challenges.values()).filter(
      (challenge) => challenge.userId === userId,
    );
  }

  async createChallenge(insertChallenge: InsertChallenge): Promise<Challenge> {
    const id = randomUUID();
    const challenge: Challenge = {
      ...insertChallenge,
      id,
    };
    this.challenges.set(id, challenge);
    return challenge;
  }

  async completeChallenge(id: string): Promise<Challenge | undefined> {
    const challenge = this.challenges.get(id);
    if (!challenge) return undefined;
    
    const completed: Challenge = {
      ...challenge,
      completed: new Date(),
    };
    this.challenges.set(id, completed);
    return completed;
  }
}

export const storage = new MemStorage();
