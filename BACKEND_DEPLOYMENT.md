# Backend Deployment Guide

This guide covers deploying the LumaWisp backend to various platforms. The backend is a Node.js Express application that serves both API endpoints and static files.

## Prerequisites

- Node.js 18 or higher
- The application builds successfully with `npm run build`
- Environment variables configured (see below)

## Environment Variables

The following environment variables can be configured:

### Required
- `NODE_ENV=production` - Sets the application to production mode

### Optional
- `PORT` - Port number (defaults to 5000, automatically set by most platforms)
- `OPENAI_API_KEY` - OpenAI API key for AI features (app works without this)
- `DATABASE_URL` - PostgreSQL database URL (uses in-memory storage if not provided)
- `SESSION_SECRET` - Secret for session encryption (recommended for production)

## Deployment Options

### 1. Railway (Recommended)

Railway offers the simplest deployment experience with automatic deployments.

1. **Connect Repository**
   - Visit [railway.app](https://railway.app)
   - Connect your GitHub account
   - Import the LumaWisp repository

2. **Configure Environment Variables**
   - In Railway dashboard, go to Variables
   - Add any optional environment variables you need
   - Railway automatically sets `NODE_ENV=production` and `PORT`

3. **Deploy**
   - Railway automatically detects the `railway.toml` configuration
   - Deployment starts automatically on push to main branch

### 2. Render.com

Render provides reliable hosting with automatic SSL and easy configuration.

1. **Connect Repository**
   - Visit [render.com](https://render.com)
   - Connect your GitHub account
   - Create new "Web Service" from repository

2. **Configuration**
   - Render automatically detects the `render.yaml` configuration
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

3. **Environment Variables**
   - Set in Render dashboard under Environment
   - Add any optional variables you need

### 3. Heroku

Traditional PaaS platform with extensive documentation and add-ons.

1. **Install Heroku CLI**
   ```bash
   # Install Heroku CLI
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. **Deploy**
   ```bash
   # Login to Heroku
   heroku login
   
   # Create new app
   heroku create your-app-name
   
   # Set environment variables
   heroku config:set NODE_ENV=production
   heroku config:set SESSION_SECRET=$(openssl rand -base64 32)
   
   # Optional: Add OpenAI API key
   heroku config:set OPENAI_API_KEY=your_key_here
   
   # Deploy
   git push heroku main
   ```

### 4. Vercel (Serverless)

Vercel offers serverless deployment with global edge network.

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   # Deploy from project directory
   vercel
   
   # Follow prompts to configure project
   ```

3. **Configure Environment Variables**
   - Set in Vercel dashboard under Settings > Environment Variables
   - Add required and optional variables

### 5. Docker Deployment

Deploy using Docker on any platform that supports containers.

1. **Build Image**
   ```bash
   docker build -t lumawisp .
   ```

2. **Run Container**
   ```bash
   # Basic run
   docker run -p 5000:5000 lumawisp
   
   # With environment variables
   docker run -p 5000:5000 \
     -e NODE_ENV=production \
     -e OPENAI_API_KEY=your_key_here \
     lumawisp
   ```

3. **Deploy to Container Platforms**
   - **Google Cloud Run**: Push to Google Container Registry
   - **AWS ECS**: Push to Amazon ECR
   - **Azure Container Instances**: Push to Azure Container Registry
   - **DigitalOcean App Platform**: Connect to container registry

## Post-Deployment Checklist

- [ ] Application starts successfully
- [ ] Environment variables are properly set
- [ ] Health check endpoint (`/`) responds with 200
- [ ] API endpoints are accessible (try `/api/health` if available)
- [ ] Static files are served correctly
- [ ] SSL certificate is configured (handled automatically by most platforms)

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Ensure Node.js version is 18 or higher
   - Check that all dependencies are properly installed
   - Verify TypeScript compilation succeeds

2. **Application Won't Start**
   - Check that `NODE_ENV=production` is set
   - Verify the port is correctly configured
   - Check application logs for errors

3. **API Routes Return 404**
   - Ensure the backend is properly built
   - Check that routes are registered correctly
   - Verify the deployment includes the `dist` directory

4. **Static Files Not Loading**
   - Confirm the build completed successfully
   - Check that `dist/public` directory exists
   - Verify static file serving is configured

### Getting Help

- Check the application logs on your deployment platform
- Ensure all build steps complete successfully
- Verify environment variables are set correctly
- Test the application locally with `npm run build && npm start`

## Platform-Specific Notes

### Railway
- Automatically detects Dockerfile if present
- Provides free tier for testing
- Automatic HTTPS and custom domains

### Render
- Free tier available with limitations
- Automatic deploys on git push
- Built-in monitoring and logs

### Heroku
- Requires credit card for free tier
- Extensive add-on ecosystem
- Well-documented with large community

### Vercel
- Excellent for serverless workloads
- Global edge network
- Generous free tier

Choose the platform that best fits your needs in terms of pricing, features, and deployment complexity.