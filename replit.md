# Luma Wisp - Academy of Remembrance

## Overview

Luma Wisp is an interactive AI-powered character system designed for educational adventures across mystical realms. The application features an AI companion named Luma that transforms across five elemental realms (Aether, Fire, Water, Earth, Air), each with unique personalities, visual representations, and educational content. The system provides engaging conversations, daily wisdom thoughts, and interactive challenges to create an immersive learning experience for children.

## User Preferences

Preferred communication style: Simple, everyday language.
Visual design preference: Custom magical character design over reference images for Luma Wisp.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript running on Vite for fast development and build optimization
- **Styling**: Tailwind CSS with custom design system using CSS variables for theming
- **UI Components**: Radix UI primitives with shadcn/ui component library for accessible, customizable components
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion for smooth animations and transitions
- **Typography**: Custom font stack including Comfortaa, Inter, and Fredoka One for child-friendly design

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **AI Integration**: OpenAI GPT-4o API for conversational AI functionality
- **Session Management**: In-memory storage with interface for future database integration
- **API Design**: RESTful endpoints with Zod schema validation for type safety

### Core Features
- **Realm-Based Personalities**: Five distinct AI personalities corresponding to elemental realms, each with unique voice tones, special phrases, and educational focus areas
- **Interactive Chat System**: Real-time conversations with context preservation across sessions
- **Daily Wisdom Thoughts**: Realm-specific inspirational messages that change based on the current realm
- **Challenge System**: Interactive educational activities with progress tracking using Wispstars and Crystal Crumbs currency
- **Realm Transformation**: Dynamic character appearance and personality changes when switching between realms

### Data Storage Design
- **Users Table**: Stores user profiles with progress tracking (Wispstars, Crystal Crumbs, current realm)
- **Conversations Table**: JSON-based message storage with realm context and timestamps
- **Challenges Table**: Track completion status and realm association for educational activities
- **Schema Validation**: Drizzle-Zod integration for runtime type checking and validation

### UI/UX Architecture
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Accessibility**: ARIA compliance through Radix UI primitives
- **Visual Identity**: Custom SVG-based magical character design with realm-specific transformations and animations
- **Character Design**: Ethereal wisp with flowing shape, glowing eyes, animated sparkles, and unique magical elements per realm (stars for Aether, flames for Fire, water droplets for Water, leaves for Earth, wind swirls for Air)
- **Component Structure**: Modular design with reusable LumaWisp, ChatInterface, and RealmSelector components

## External Dependencies

### AI Services
- **OpenAI API**: GPT-4o model for natural language processing and character personality generation
- **API Key Management**: Environment-based configuration with fallback handling

### Database Services
- **Neon Database**: Serverless PostgreSQL for production data storage
- **Connection Pooling**: Built-in connection management through @neondatabase/serverless

### Development Tools
- **Replit Integration**: Development environment optimization with error overlays and cartographer plugin
- **Vite Tooling**: Hot module replacement and optimized builds
- **TypeScript**: Full-stack type safety with path mapping for clean imports

### UI Libraries
- **Radix UI**: Comprehensive set of unstyled, accessible components
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for consistent visual elements
- **Embla Carousel**: Touch-friendly carousel component for interactive elements

### Build and Deployment
- **ESBuild**: Fast bundling for production builds
- **PostCSS**: CSS processing with Tailwind integration
- **Node.js**: Server runtime with ES module support