import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { lumaAI } from "./services/lumaAI";
import { realmSchema, messageSchema, type Message, type Realm } from "@shared/schema";
import { z } from "zod";

const chatRequestSchema = z.object({
  message: z.string().min(1),
  realm: realmSchema,
  userId: z.string().optional(),
  conversationId: z.string().optional(),
});

const transformRequestSchema = z.object({
  realm: realmSchema,
  userId: z.string().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Health check endpoint for deployment monitoring
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development"
    });
  });

  // Basic status endpoint for compatibility
  app.get("/", (req, res) => {
    res.json({ 
      message: "LumaWisp Backend API", 
      status: "running",
      version: "1.0.0"
    });
  });
  
  // Get Wisp thought of the day
  app.get("/api/luma/thought/:realm", async (req, res) => {
    try {
      const realm = realmSchema.parse(req.params.realm);
      const thought = await lumaAI.getWispThought(realm);
      res.json({ thought, realm });
    } catch (error) {
      res.status(400).json({ message: "Invalid realm specified" });
    }
  });

  // Chat with Luma
  app.post("/api/luma/chat", async (req, res) => {
    try {
      const { message, realm, userId, conversationId } = chatRequestSchema.parse(req.body);
      
      // Get or create conversation
      let conversation;
      let messages: Message[] = [];
      
      if (conversationId) {
        conversation = await storage.getConversation(conversationId);
        if (conversation) {
          messages = conversation.messages as Message[];
        }
      }
      
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: message,
        timestamp: new Date().toISOString(),
        realm,
      };
      messages.push(userMessage);
      
      // Get AI response
      const lumaResponse = await lumaAI.getChatResponse(message, realm, messages);
      
      // Add Luma's response
      const lumaMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "luma",
        content: lumaResponse,
        timestamp: new Date().toISOString(),
        realm,
      };
      messages.push(lumaMessage);
      
      // Save conversation
      if (conversation) {
        conversation = await storage.updateConversation(conversation.id, messages);
      } else if (userId) {
        conversation = await storage.createConversation({
          userId,
          messages: messages as any,
          realm,
        });
      }
      
      res.json({
        response: lumaResponse,
        conversationId: conversation?.id,
        messages: messages.slice(-10), // Return last 10 messages
      });
      
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Failed to chat with Luma" });
    }
  });

  // Transform Luma to different realm
  app.post("/api/luma/transform", async (req, res) => {
    try {
      const { realm, userId } = transformRequestSchema.parse(req.body);
      
      // Update user's current realm if userId provided
      if (userId) {
        await storage.updateUser(userId, { currentRealm: realm });
      }
      
      // Get personality for the realm
      const personality = lumaAI.getPersonalityForRealm(realm);
      
      res.json({
        realm,
        personality,
        greeting: personality.greeting,
      });
      
    } catch (error) {
      console.error("Transform error:", error);
      res.status(500).json({ message: "Failed to transform Luma" });
    }
  });

  // Get user progress
  app.get("/api/user/:userId/progress", async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const challenges = await storage.getUserChallenges(userId);
      const conversations = await storage.getConversationsByUser(userId);
      
      res.json({
        user: {
          wispstars: user.wispstars,
          crystalCrumbs: user.crystalCrumbs,
          currentRealm: user.currentRealm,
        },
        challengesCompleted: challenges.filter(c => c.completed).length,
        totalConversations: conversations.length,
      });
      
    } catch (error) {
      console.error("Progress error:", error);
      res.status(500).json({ message: "Failed to get user progress" });
    }
  });

  // Complete challenge
  app.post("/api/challenges/complete", async (req, res) => {
    try {
      const { userId, challengeType, realm } = req.body;
      
      // Create completed challenge
      const challenge = await storage.createChallenge({
        userId,
        challengeType,
        realm,
        completed: new Date(),
      });
      
      // Award points
      const user = await storage.getUser(userId);
      if (user) {
        await storage.updateUser(userId, {
          wispstars: (user.wispstars || 0) + 1,
          crystalCrumbs: (user.crystalCrumbs || 0) + 1,
        });
      }
      
      res.json({ challenge, pointsAwarded: { wispstars: 1, crystalCrumbs: 1 } });
      
    } catch (error) {
      console.error("Challenge completion error:", error);
      res.status(500).json({ message: "Failed to complete challenge" });
    }
  });

  // Create or get user (for demo purposes)
  app.post("/api/user", async (req, res) => {
    try {
      const { username } = req.body;
      
      let user = await storage.getUserByUsername(username);
      if (!user) {
        user = await storage.createUser({
          username,
          password: "demo", // In real app, this would be properly handled
        });
      }
      
      res.json({ user });
      
    } catch (error) {
      console.error("User creation error:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // Twine integration endpoints
  app.get("/api/twine/luma-state/:realm", async (req, res) => {
    try {
      const realm = realmSchema.parse(req.params.realm);
      const personality = lumaAI.getPersonalityForRealm(realm);
      
      res.json({
        realm,
        personality,
        macros: {
          lumaGreet: `<<set $lumaGreeting to "${personality.greeting}">>`,
          lumaSpeak: `<<widget "lumaSpeak">><<print $args[0]>><</widget>>`,
          lumaTransform: `<<set $lumaRealm to "${realm}">>`,
        }
      });
      
    } catch (error) {
      res.status(400).json({ message: "Invalid realm for Twine integration" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
