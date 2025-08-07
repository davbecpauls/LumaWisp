import { apiRequest } from "./queryClient";
import type { Realm, ChatResponse, TransformResponse, WispThought, UserProgress } from "@/types/luma";

export const lumaApi = {
  // Chat with Luma
  async chat(message: string, realm: Realm, userId?: string, conversationId?: string): Promise<ChatResponse> {
    const response = await apiRequest("POST", "/api/luma/chat", {
      message,
      realm,
      userId,
      conversationId,
    });
    return response.json();
  },

  // Transform Luma to different realm
  async transform(realm: Realm, userId?: string): Promise<TransformResponse> {
    const response = await apiRequest("POST", "/api/luma/transform", {
      realm,
      userId,
    });
    return response.json();
  },

  // Get daily wisp thought
  async getWispThought(realm: Realm): Promise<WispThought> {
    const response = await apiRequest("GET", `/api/luma/thought/${realm}`);
    return response.json();
  },

  // Get user progress
  async getUserProgress(userId: string): Promise<UserProgress> {
    const response = await apiRequest("GET", `/api/user/${userId}/progress`);
    return response.json();
  },

  // Complete challenge
  async completeChallenge(userId: string, challengeType: string, realm?: Realm): Promise<any> {
    const response = await apiRequest("POST", "/api/challenges/complete", {
      userId,
      challengeType,
      realm,
    });
    return response.json();
  },

  // Create or get user
  async getOrCreateUser(username: string): Promise<any> {
    const response = await apiRequest("POST", "/api/user", { username });
    return response.json();
  },

  // Twine integration
  async getTwineState(realm: Realm): Promise<any> {
    const response = await apiRequest("GET", `/api/twine/luma-state/${realm}`);
    return response.json();
  },
};
