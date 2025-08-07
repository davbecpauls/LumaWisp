import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import LMSIntegration from "@/components/LMSIntegration";
import TwineIntegration from "@/components/TwineIntegration";
import LumaWisp from "@/components/LumaWisp";
import type { Realm } from "@/types/luma";
import { useToast } from "@/hooks/use-toast";

export default function Integrations() {
  const [activeTab, setActiveTab] = useState<"lms" | "twine">("lms");
  const [generatedCodes, setGeneratedCodes] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleCodeGenerated = (code: string, type: string) => {
    setGeneratedCodes(prev => ({ ...prev, [type]: code }));
  };

  const handleCopyCode = (code: string) => {
    toast({
      title: "Code Copied!",
      description: "Integration code copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen magical-bg">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-purple-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <motion.button
                  className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-comfortaa">Back to Academy</span>
                </motion.button>
              </Link>
              <h1 className="text-2xl font-fredoka text-purple-800">
                🔧 Integration Tools
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <LumaWisp realm="aether" size="small" animated />
              <span className="text-sm text-gray-600 font-comfortaa">
                Bring Luma to your platform
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Introduction */}
        <div className="mb-8 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-fredoka text-gray-800 mb-4"
          >
            Integrate Luma Wisp Into Your Educational Platform
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 font-comfortaa max-w-3xl mx-auto"
          >
            Choose your integration method below to bring Luma Wisp's magical learning experience 
            to your LMS, interactive stories, or custom educational applications.
          </motion.p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex justify-center space-x-1 bg-white/80 rounded-full p-1 max-w-md mx-auto">
            <motion.button
              onClick={() => setActiveTab("lms")}
              className={`flex-1 px-6 py-3 rounded-full font-comfortaa font-bold transition-all
                ${activeTab === "lms" 
                  ? "bg-purple-500 text-white shadow-lg" 
                  : "text-gray-600 hover:text-gray-800"
                }`}
              whileHover={{ scale: activeTab !== "lms" ? 1.05 : 1 }}
              whileTap={{ scale: 0.95 }}
            >
              🎓 LMS Integration
            </motion.button>
            <motion.button
              onClick={() => setActiveTab("twine")}
              className={`flex-1 px-6 py-3 rounded-full font-comfortaa font-bold transition-all
                ${activeTab === "twine" 
                  ? "bg-purple-500 text-white shadow-lg" 
                  : "text-gray-600 hover:text-gray-800"
                }`}
              whileHover={{ scale: activeTab !== "twine" ? 1.05 : 1 }}
              whileTap={{ scale: 0.95 }}
            >
              📚 Twine Stories
            </motion.button>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Integration Panel */}
          <div className="lg:col-span-2">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "lms" ? (
                <LMSIntegration onCodeGenerated={handleCodeGenerated} />
              ) : (
                <TwineIntegration onCopyCode={handleCopyCode} />
              )}
            </motion.div>
          </div>

          {/* Sidebar Information */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Features Overview */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
              <h3 className="font-fredoka text-xl text-gray-800 mb-4">
                ✨ Luma Wisp Features
              </h3>
              <div className="space-y-3">
                {[
                  { icon: "🌟", title: "5 Elemental Realms", desc: "Aether, Fire, Water, Earth, Air" },
                  { icon: "🤖", title: "AI Conversations", desc: "OpenAI-powered responses" },
                  { icon: "🎮", title: "Gamified Learning", desc: "Wispstars and Crystal Crumbs" },
                  { icon: "📱", title: "Responsive Design", desc: "Works on all devices" },
                  { icon: "🔗", title: "Easy Integration", desc: "Drop-in components" },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-3 bg-purple-50 rounded-xl"
                  >
                    <span className="text-xl">{feature.icon}</span>
                    <div>
                      <h4 className="font-comfortaa font-bold text-sm text-gray-800">
                        {feature.title}
                      </h4>
                      <p className="text-xs text-gray-600">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Realm Preview */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
              <h3 className="font-fredoka text-xl text-gray-800 mb-4">
                🔮 Realm Preview
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {(["aether", "fire", "water", "earth", "air"] as Realm[]).slice(0, 6).map((realm) => (
                  <motion.div
                    key={realm}
                    className="flex flex-col items-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl"
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <LumaWisp realm={realm} size="small" animated />
                    <p className="text-xs font-comfortaa capitalize mt-1">{realm}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Help & Support */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
              <h3 className="font-fredoka text-xl text-gray-800 mb-4">
                💡 Need Help?
              </h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 font-comfortaa">
                  Integration not working as expected? Here are some common solutions:
                </p>
                <div className="space-y-2">
                  {[
                    "Check your API endpoint URLs",
                    "Verify CORS settings",
                    "Ensure JavaScript is enabled",
                    "Test with different browsers",
                  ].map((tip, index) => (
                    <div key={tip} className="flex items-start space-x-2">
                      <span className="text-purple-500 text-xs mt-0.5">•</span>
                      <span className="text-xs text-gray-600 font-comfortaa">{tip}</span>
                    </div>
                  ))}
                </div>
                <motion.button
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg
                             font-comfortaa font-bold transition-colors text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.open('mailto:support@lumawisp.com', '_blank')}
                >
                  📧 Contact Support
                </motion.button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}