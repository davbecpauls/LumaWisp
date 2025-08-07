import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "wouter";
import LumaWidget from "@/components/LumaWidget";
import RealmSelector from "@/components/RealmSelector";
import type { Realm, UserProgress } from "@/types/luma";
import { lumaApi } from "@/lib/lumaApi";
import { useToast } from "@/hooks/use-toast";

const challenges = [
  { id: "tree-breathing", name: "Breathe like a tree", description: "5 deep breaths with roots", icon: "⭐", realm: "earth" },
  { id: "find-glow", name: "Find something glowing", description: "In nature or your home", icon: "💎", realm: "aether" },
  { id: "plant-whisper", name: "Whisper to a plant", description: "Ask what it remembers", icon: "🌱", realm: "earth" },
  { id: "fire-dance", name: "Dance with flame energy", description: "Move like flickering fire", icon: "🔥", realm: "fire" },
  { id: "water-flow", name: "Flow like water", description: "Move in gentle waves", icon: "💧", realm: "water" },
];

export default function Home() {
  const [currentRealm, setCurrentRealm] = useState<Realm>("aether");
  const [userId, setUserId] = useState<string>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Initialize user
  useEffect(() => {
    const initUser = async () => {
      try {
        const response = await lumaApi.getOrCreateUser("demo-user");
        setUserId(response.user.id);
        setCurrentRealm(response.user.currentRealm || "aether");
      } catch (error) {
        console.error("Failed to initialize user:", error);
      }
    };
    initUser();
  }, []);

  // Get user progress
  const { data: userProgress } = useQuery<UserProgress>({
    queryKey: ["/api/user/progress", userId],
    queryFn: () => userId ? lumaApi.getUserProgress(userId) : Promise.resolve({ wispstars: 0, crystalCrumbs: 0, currentRealm: "aether" }),
    enabled: !!userId,
  });

  // Transform Luma mutation
  const transformMutation = useMutation({
    mutationFn: (realm: Realm) => lumaApi.transform(realm, userId),
    onSuccess: (data) => {
      setCurrentRealm(data.realm);
      toast({
        title: "✨ Realm Changed!",
        description: data.greeting,
      });
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["/api/user/progress", userId] });
      }
    },
  });

  // Complete challenge mutation
  const challengeMutation = useMutation({
    mutationFn: (challengeId: string) => {
      const challenge = challenges.find(c => c.id === challengeId);
      return lumaApi.completeChallenge(userId!, challengeId, challenge?.realm as Realm);
    },
    onSuccess: (data) => {
      toast({
        title: "🌟 Challenge Complete!",
        description: `You earned ${data.pointsAwarded.wispstars} Wispstars and ${data.pointsAwarded.crystalCrumbs} Crystal Crumbs!`,
      });
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["/api/user/progress", userId] });
      }
    },
  });

  const handleRealmChange = (realm: Realm) => {
    transformMutation.mutate(realm);
  };

  const handleCompleteChallenge = (challengeId: string) => {
    if (!userId) return;
    challengeMutation.mutate(challengeId);
  };

  const realmContent = {
    aether: {
      title: "Welcome to the Realm of Origins! 🌟",
      description: "In this mystical realm, young starlighter, we explore the very beginning of all things. Every star, every dream, every whisper of wind carries the memory of the first moment when the universe opened its eyes.",
      bgGradient: "from-purple-900/20 to-transparent",
    },
    fire: {
      title: "Welcome to the Fire Realm! 🔥", 
      description: "Feel the warmth and energy of creation, little flame-dancer! Here we learn about passion, transformation, and the powerful force that drives all change in the universe.",
      bgGradient: "from-orange-900/20 to-transparent",
    },
    water: {
      title: "Welcome to the Water Realm! 💧",
      description: "Flow with the gentle currents of emotion and intuition, dear wave-rider! In these waters, we discover the power of adaptation and the healing nature of our feelings.",
      bgGradient: "from-blue-900/20 to-transparent", 
    },
    earth: {
      title: "Welcome to the Earth Realm! 🌍",
      description: "Root yourself in the wisdom of growing things, precious seed-keeper! Here we learn patience, grounding, and the ancient secrets that the soil remembers.",
      bgGradient: "from-green-900/20 to-transparent",
    },
    air: {
      title: "Welcome to the Air Realm! 🌬️",
      description: "Soar on winds of inspiration and communication, swift wind-child! In this realm, we explore freedom, clarity, and the invisible connections between all things.",
      bgGradient: "from-sky-900/20 to-transparent",
    },
  };

  return (
    <div className="min-h-screen magical-bg">
      {/* Header Navigation */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-purple-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-fredoka text-purple-800">
                ✨ Academy of Remembrance
              </h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              {(["aether", "fire", "water", "earth", "air"] as Realm[]).map((realm) => {
                const colors = {
                  aether: "text-purple-600 hover:text-purple-800",
                  fire: "text-orange-600 hover:text-orange-800", 
                  water: "text-blue-600 hover:text-blue-800",
                  earth: "text-green-600 hover:text-green-800",
                  air: "text-sky-600 hover:text-sky-800",
                };
                
                const names = {
                  aether: "Realm of Origins",
                  fire: "Fire Realm",
                  water: "Water Realm", 
                  earth: "Earth Realm",
                  air: "Air Realm",
                };

                return (
                  <button
                    key={realm}
                    onClick={() => handleRealmChange(realm)}
                    className={`${colors[realm]} font-comfortaa font-medium transition-colors
                      ${currentRealm === realm ? "underline" : ""}`}
                  >
                    {names[realm]}
                  </button>
                );
              })}
              
              {/* Integration Tools Link */}
              <Link href="/integrations">
                <motion.div
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-full
                             font-comfortaa font-bold transition-colors text-sm cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🔧 Integration Tools
                </motion.div>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Lesson Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
              <div className="mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  Current Realm: <span className="ml-1 capitalize">{currentRealm}</span>
                </span>
              </div>
              
              <motion.h2 
                key={currentRealm}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-fredoka text-gray-800 mb-6"
              >
                {realmContent[currentRealm].title}
              </motion.h2>
              
              {/* Lesson Content */}
              <motion.div 
                key={currentRealm + "-content"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="prose prose-lg max-w-none mb-8"
              >
                <p className="text-gray-700 leading-relaxed font-comfortaa">
                  {realmContent[currentRealm].description}
                </p>
                
                {/* Interactive Story Content */}
                <div className="my-8 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500" 
                    alt="Mystical forest clearing with ancient stone pillars" 
                    className="rounded-2xl shadow-lg w-full h-auto" 
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${realmContent[currentRealm].bgGradient} rounded-2xl`}></div>
                </div>
              </motion.div>
              
              {/* Interactive Choices */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-green-400 to-emerald-500 text-white p-6 rounded-2xl 
                             hover:from-green-500 hover:to-emerald-600 transition-all duration-300 shadow-lg"
                >
                  <span className="text-2xl mb-2 block">🌱</span>
                  <span className="font-comfortaa font-bold">Plant a Dream-Seed</span>
                  <p className="text-sm opacity-90 mt-2">Nurture something new into existence</p>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-400 to-violet-500 text-white p-6 rounded-2xl 
                             hover:from-purple-500 hover:to-violet-600 transition-all duration-300 shadow-lg"
                >
                  <span className="text-2xl mb-2 block">👻</span>
                  <span className="font-comfortaa font-bold">Chase a Memory Shadow</span>
                  <p className="text-sm opacity-90 mt-2">Follow ancient echoes through time</p>
                </motion.button>
              </div>
              
              {/* Progress Indicators */}
              <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">⭐</span>
                    <span className="font-comfortaa font-bold text-gray-700">Wispstars:</span>
                    <span className="text-xl font-bold text-purple-600">{userProgress?.wispstars || 0}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">💎</span>
                    <span className="font-comfortaa font-bold text-gray-700">Crystal Crumbs:</span>
                    <span className="text-xl font-bold text-blue-600">{userProgress?.crystalCrumbs || 0}</span>
                  </div>
                </div>
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full
                                  font-comfortaa font-bold transition-colors shadow-lg">
                  📚 Open Grimoire
                </button>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Realm Navigation */}
            <RealmSelector 
              currentRealm={currentRealm}
              onRealmChange={handleRealmChange}
            />
            
            {/* Daily Challenges */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
              <h3 className="font-fredoka text-xl text-gray-800 mb-4">Luma's Spark Challenges</h3>
              <div className="space-y-4">
                {challenges.map((challenge) => (
                  <div key={challenge.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                    <div>
                      <p className="font-comfortaa font-bold text-sm text-gray-700">{challenge.name}</p>
                      <p className="text-xs text-gray-500">{challenge.description}</p>
                    </div>
                    <button
                      onClick={() => handleCompleteChallenge(challenge.id)}
                      disabled={challengeMutation.isPending}
                      className="text-yellow-600 hover:text-yellow-700 text-xl transition-colors disabled:opacity-50"
                    >
                      {challenge.icon}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Luma Widget */}
      <LumaWidget 
        realm={currentRealm}
        onRealmChange={handleRealmChange}
        userId={userId}
      />
    </div>
  );
}
