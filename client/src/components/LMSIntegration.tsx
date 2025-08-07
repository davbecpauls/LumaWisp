import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Download, ExternalLink } from "lucide-react";
import LumaWisp from "./LumaWisp";
import type { Realm } from "@/types/luma";
import { useToast } from "@/hooks/use-toast";

interface LMSIntegrationProps {
  onCodeGenerated: (code: string, type: string) => void;
}

export default function LMSIntegration({ onCodeGenerated }: LMSIntegrationProps) {
  const [selectedRealm, setSelectedRealm] = useState<Realm>("aether");
  const [integrationType, setIntegrationType] = useState<"widget" | "iframe" | "api">("widget");
  const [generatedCode, setGeneratedCode] = useState("");
  const { toast } = useToast();

  const generateLMSCode = () => {
    const baseUrl = window.location.origin;
    
    let code = "";
    
    switch (integrationType) {
      case "widget":
        code = `<!-- Luma Wisp Educational Widget -->
<div id="luma-wisp-widget" data-realm="${selectedRealm}" data-user-id="{{student_id}}">
  <div class="luma-loading">Loading Luma Wisp...</div>
</div>

<script src="${baseUrl}/luma-widget.js"></script>
<script>
// Initialize Luma Wisp Widget
LumaWispWidget.init({
  container: '#luma-wisp-widget',
  realm: '${selectedRealm}',
  userId: '{{student_id}}', // Replace with your LMS user ID variable
  apiUrl: '${baseUrl}/api',
  
  // Customization options
  size: 'medium', // small, medium, large
  position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
  showDailyThought: true,
  enableChat: true,
  
  // Event callbacks
  onRealmChange: function(newRealm) {
    console.log('Luma transformed to:', newRealm);
    // Track realm changes in your LMS analytics
  },
  
  onChatMessage: function(message, response) {
    console.log('Student message:', message);
    console.log('Luma response:', response);
    // Log interactions for learning analytics
  },
  
  onChallengeComplete: function(challengeId, points) {
    console.log('Challenge completed:', challengeId, 'Points:', points);
    // Award points in your LMS gradebook
    // Example: updateGradebook(userId, challengeId, points);
  }
});
</script>

<style>
/* Luma Wisp Widget Styles */
#luma-wisp-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: 'Comfortaa', cursive;
}

.luma-loading {
  background: linear-gradient(45deg, rgba(139, 92, 246, 0.8), rgba(59, 130, 246, 0.8));
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 12px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}
</style>`;
        break;
        
      case "iframe":
        code = `<!-- Luma Wisp Embedded Learning Environment -->
<iframe 
  src="${baseUrl}?embed=true&realm=${selectedRealm}&user={{student_id}}&course={{course_id}}"
  width="100%" 
  height="600px" 
  frameborder="0"
  allow="microphone; camera; fullscreen"
  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
  title="Luma Wisp Academy of Remembrance"
  data-luma-realm="${selectedRealm}"
  data-student-id="{{student_id}}"
  data-course-id="{{course_id}}"
>
  <p>Your browser does not support iframes. 
     <a href="${baseUrl}" target="_blank" rel="noopener">
       Open Luma Wisp Academy directly
     </a>
  </p>
</iframe>

<script>
// LMS-iframe communication
window.addEventListener('message', function(event) {
  if (event.origin !== '${baseUrl}') return;
  
  const { type, data } = event.data;
  
  switch (type) {
    case 'luma.challenge.complete':
      // Award points in your LMS
      console.log('Student completed challenge:', data);
      // updateGradebook(data.userId, data.challengeId, data.points);
      break;
      
    case 'luma.realm.change':
      // Track learning progress
      console.log('Student changed realm to:', data.realm);
      // logLearningActivity(data.userId, 'realm_change', data.realm);
      break;
      
    case 'luma.conversation':
      // Log educational conversations
      console.log('Student chatted with Luma:', data);
      // logConversation(data.userId, data.messages);
      break;
  }
});
</script>`;
        break;
        
      case "api":
        code = `// Luma Wisp LMS API Integration
// Server-side integration for your LMS backend

class LumaWispAPI {
  constructor(baseUrl = '${baseUrl}', apiKey = 'your-api-key') {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }
  
  // Get student progress
  async getStudentProgress(studentId) {
    const response = await fetch(\`\${this.baseUrl}/api/user/\${studentId}/progress\`, {
      headers: {
        'Authorization': \`Bearer \${this.apiKey}\`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }
  
  // Create chat session for student
  async startChatSession(studentId, realm = '${selectedRealm}') {
    const response = await fetch(\`\${this.baseUrl}/api/luma/chat\`, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${this.apiKey}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Hello Luma!',
        realm,
        userId: studentId
      })
    });
    return response.json();
  }
  
  // Award completion points
  async completeChallenge(studentId, challengeId, realm) {
    const response = await fetch(\`\${this.baseUrl}/api/challenges/complete\`, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${this.apiKey}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: studentId,
        challengeType: challengeId,
        realm
      })
    });
    return response.json();
  }
  
  // Get daily wisdom thought
  async getDailyThought(realm = '${selectedRealm}') {
    const response = await fetch(\`\${this.baseUrl}/api/luma/thought/\${realm}\`, {
      headers: {
        'Authorization': \`Bearer \${this.apiKey}\`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }
  
  // Batch sync student data
  async syncStudents(students) {
    const response = await fetch(\`\${this.baseUrl}/api/lms/sync\`, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${this.apiKey}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ students })
    });
    return response.json();
  }
}

// Example usage:
const lumaAPI = new LumaWispAPI();

// In your LMS lesson page:
async function initializeLumaForStudent(studentId, courseRealm) {
  try {
    const progress = await lumaAPI.getStudentProgress(studentId);
    const dailyThought = await lumaAPI.getDailyThought(courseRealm);
    
    console.log('Student progress:', progress);
    console.log('Daily thought:', dailyThought);
    
    // Start chat session
    const chatSession = await lumaAPI.startChatSession(studentId, courseRealm);
    console.log('Chat session started:', chatSession);
    
  } catch (error) {
    console.error('Luma API Error:', error);
  }
}

// In your gradebook update function:
async function awardLumaPoints(studentId, challengeId, realm) {
  const result = await lumaAPI.completeChallenge(studentId, challengeId, realm);
  
  // Update your LMS gradebook
  if (result.pointsAwarded) {
    updateStudentGrade(studentId, {
      activity: 'Luma Challenge',
      points: result.pointsAwarded.wispstars,
      maxPoints: 5,
      type: 'participation'
    });
  }
}`;
        break;
    }
    
    setGeneratedCode(code);
    onCodeGenerated(code, integrationType);
  };

  useEffect(() => {
    generateLMSCode();
  }, [selectedRealm, integrationType]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    toast({
      title: "Code Copied!",
      description: `${integrationType} integration code copied to clipboard.`,
    });
  };

  const handleDownload = () => {
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `luma-${integrationType}-integration.${integrationType === 'api' ? 'js' : 'html'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
      <h3 className="font-fredoka text-xl text-gray-800 mb-4">
        🎓 LMS Integration Tools
      </h3>
      
      <p className="text-sm text-gray-600 mb-6 font-comfortaa">
        Integrate Luma Wisp into your Learning Management System with these ready-to-use code templates.
      </p>

      {/* Integration Type Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Integration Method:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { type: "widget", name: "Widget", icon: "🔧", desc: "Floating Luma companion" },
            { type: "iframe", name: "Embedded", icon: "🖼️", desc: "Full learning environment" },
            { type: "api", name: "API", icon: "⚡", desc: "Server-side integration" }
          ].map(({ type, name, icon, desc }) => (
            <motion.button
              key={type}
              onClick={() => setIntegrationType(type as any)}
              className={`p-4 rounded-lg border-2 text-left transition-all
                ${integrationType === type 
                  ? "border-purple-400 bg-purple-50" 
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
          Default Realm:
        </label>
        <div className="grid grid-cols-5 gap-2">
          {(["aether", "fire", "water", "earth", "air"] as Realm[]).map((realm) => (
            <motion.button
              key={realm}
              onClick={() => setSelectedRealm(realm)}
              className={`p-3 rounded-lg border-2 transition-all
                ${selectedRealm === realm 
                  ? "border-purple-400 bg-purple-50" 
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
          className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 
                     text-white px-4 py-2 rounded-lg font-comfortaa font-bold transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Copy className="w-4 h-4" />
          <span>Copy Code</span>
        </motion.button>
        
        <motion.button
          onClick={handleDownload}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 
                     text-white px-4 py-2 rounded-lg font-comfortaa font-bold transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </motion.button>
        
        <motion.button
          onClick={() => window.open(`${window.location.origin}?demo=true&realm=${selectedRealm}`, '_blank')}
          className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 
                     text-white px-4 py-2 rounded-lg font-comfortaa font-bold transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ExternalLink className="w-4 h-4" />
          <span>Preview</span>
        </motion.button>
      </div>

      {/* Integration Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-comfortaa font-bold text-green-800 mb-2">Widget Integration</h4>
          <ul className="text-sm text-green-700 space-y-1 font-comfortaa">
            <li>• Floating companion</li>
            <li>• Non-intrusive</li>
            <li>• Easy to implement</li>
            <li>• Works with any LMS</li>
          </ul>
        </div>
        
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-comfortaa font-bold text-blue-800 mb-2">Embedded Integration</h4>
          <ul className="text-sm text-blue-700 space-y-1 font-comfortaa">
            <li>• Full learning environment</li>
            <li>• Seamless experience</li>
            <li>• Progress tracking</li>
            <li>• LMS communication</li>
          </ul>
        </div>
        
        <div className="p-4 bg-orange-50 rounded-lg">
          <h4 className="font-comfortaa font-bold text-orange-800 mb-2">API Integration</h4>
          <ul className="text-sm text-orange-700 space-y-1 font-comfortaa">
            <li>• Server-side control</li>
            <li>• Custom implementation</li>
            <li>• Data synchronization</li>
            <li>• Advanced features</li>
          </ul>
        </div>
      </div>
    </div>
  );
}