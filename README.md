# 🌟 LumaWisp - Academy of Remembrance

A magical educational platform featuring Luma, an AI companion that guides children through different elemental realms while teaching mindfulness, emotional intelligence, and spiritual growth.

## ✨ Features

- **Magical AI Companion**: Luma adapts her personality based on different elemental realms (Aether, Fire, Water, Earth, Air)
- **Interactive Learning**: Realm-based lessons with engaging content and challenges
- **Progress Tracking**: Wispstars and Crystal Crumbs reward system
- **Integration Tools**: LMS integration, Twine story integration, and chat interface
- **Responsive Design**: Beautiful, child-friendly interface with animations

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd LumaWisp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (Optional - for AI features)
   ```bash
   cp .env.example .env
   # Edit .env and add your OpenAI API key if desired
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Visit `http://localhost:5000` to see the application

## 🌐 Deployment

### Netlify Deployment (Frontend Only)
For static site deployment to Netlify:

```bash
# Build for Netlify
npm run build:netlify

# Deploy via Netlify CLI
netlify deploy --prod
```

See [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md) for detailed deployment instructions.

### Full-Stack Backend Deployment

The backend is configured for deployment on multiple platforms. Choose the one that best fits your needs:

#### 🚀 Railway (Recommended)
1. Connect your GitHub repository to Railway
2. Railway will automatically detect the `railway.toml` configuration
3. Set environment variables in Railway dashboard:
   - `OPENAI_API_KEY` (optional)
   - `DATABASE_URL` (optional)
   - `SESSION_SECRET` (recommended)

#### 🎨 Render.com
1. Connect your GitHub repository to Render
2. Render will automatically use the `render.yaml` configuration
3. Set environment variables in Render dashboard

#### 🟪 Heroku
```bash
# Install Heroku CLI and login
heroku login

# Create a new Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set OPENAI_API_KEY=your_key_here  # optional
heroku config:set SESSION_SECRET=your_secret_here

# Deploy
git push heroku main
```

#### ▲ Vercel (Serverless)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

#### 🐳 Docker Deployment
```bash
# Build the Docker image
docker build -t lumawisp .

# Run the container
docker run -p 5000:5000 -e NODE_ENV=production lumawisp
```

### Environment Variables for Production

Set these environment variables on your deployment platform:

- `NODE_ENV=production` (required)
- `PORT` (automatically set by most platforms)
- `OPENAI_API_KEY` (optional - app works without it)
- `DATABASE_URL` (optional - uses in-memory storage by default)
- `SESSION_SECRET` (recommended for production security)

## 🔐 Security & API Keys

**IMPORTANT**: This application works perfectly without an OpenAI API key using intelligent fallback responses. 

For AI-powered dynamic responses, see the [API Key Security Guide](./API_KEY_SECURITY.md).

## 🏗️ Project Structure

```
LumaWisp/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom hooks
│   │   └── lib/          # Utilities and API client
├── server/               # Express backend
│   ├── services/         # AI services
│   ├── routes.ts         # API routes
│   └── storage.ts        # Data storage
├── shared/               # Shared types and schemas
└── docs/                 # Documentation
```

## 🎭 Luma's Realms

Luma can transform into different personalities based on elemental realms:

- **🌟 Aether**: Mystical, ancient, speaks in cosmic riddles
- **🔥 Fire**: Energetic, warm, passionate about transformation  
- **💧 Water**: Flowing, soothing, emotionally intuitive
- **🌍 Earth**: Grounding, nurturing, connected to growth
- **🌬️ Air**: Light, breezy, focused on freedom and clarity

## 🛠️ Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build both client and server for production
- `npm run build:client` - Build only the React frontend
- `npm run build:server` - Build only the Express backend  
- `npm run build:netlify` - Build for Netlify static deployment
- `npm run start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema changes

## 🎨 Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, TypeScript
- **AI**: OpenAI GPT-4o
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: TanStack Query
- **Routing**: Wouter
- **UI Components**: Radix UI + shadcn/ui

## 🧪 Testing

The application includes comprehensive fallback responses when OpenAI API is unavailable, ensuring functionality even without an API key.

To test the application:
1. Start the development server
2. Navigate through different realms
3. Try the chat interface with Luma
4. Complete daily challenges
5. Test the integration tools

## 🔧 Integration Capabilities

LumaWisp supports integration with:

- **Learning Management Systems (LMS)**: Canvas, Moodle, Blackboard
- **Interactive Fiction**: Twine story integration with Luma state
- **Chat Platforms**: Embeddable chat widget
- **Custom Applications**: RESTful API for external integrations

## 🌱 Development Guidelines

1. **Code Style**: Follow TypeScript best practices
2. **Components**: Use functional components with hooks
3. **Styling**: Tailwind CSS with consistent design tokens
4. **State**: TanStack Query for server state, React state for UI
5. **API**: RESTful endpoints with proper error handling

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Interactive whiteboards (classroom use)

## 🔄 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- Check the [API Key Security Guide](./API_KEY_SECURITY.md) for setup help
- Review the application logs for error details
- Create an issue for bugs or feature requests
- Join our community discussions

## 🌟 Acknowledgments

- OpenAI for powering Luma's intelligence
- The React and TypeScript communities
- Educational researchers focused on mindfulness for children
- All the little starlighters who inspire this magical journey

---

✨ *"Every star remembers the moment it first began to shine."* - Luma Wisp
