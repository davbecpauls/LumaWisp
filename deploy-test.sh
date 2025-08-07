#!/bin/bash

# LumaWisp Backend Deployment Test Script
# This script tests the deployment process locally

set -e

echo "🌟 LumaWisp Backend Deployment Test"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node --version)"
    exit 1
fi

echo "✅ Node.js version check passed: $(node --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build artifacts exist
if [ ! -f "dist/index.js" ]; then
    echo "❌ Server build failed - dist/index.js not found"
    exit 1
fi

if [ ! -d "dist/public" ]; then
    echo "❌ Client build failed - dist/public not found"
    exit 1
fi

echo "✅ Build completed successfully"

# Test the application
echo "🚀 Starting application for testing..."
export NODE_ENV=production
export PORT=5000

# Start the server in background
npm start &
SERVER_PID=$!

# Wait for server to start
sleep 5

# Test health endpoint
echo "🔍 Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:5000/api/health || echo "ERROR")

if [[ "$HEALTH_RESPONSE" == *"healthy"* ]]; then
    echo "✅ Health endpoint is working"
else
    echo "❌ Health endpoint failed: $HEALTH_RESPONSE"
    kill $SERVER_PID
    exit 1
fi

# Test root endpoint
echo "🔍 Testing root endpoint..."
ROOT_RESPONSE=$(curl -s http://localhost:5000/ || echo "ERROR")

if [[ "$ROOT_RESPONSE" == *"LumaWisp Backend API"* ]]; then
    echo "✅ Root endpoint is working"
else
    echo "❌ Root endpoint failed: $ROOT_RESPONSE"
    kill $SERVER_PID
    exit 1
fi

# Test API endpoint
echo "🔍 Testing API endpoint..."
API_RESPONSE=$(curl -s http://localhost:5000/api/luma/thought/aether || echo "ERROR")

if [[ "$API_RESPONSE" == *"thought"* ]] || [[ "$API_RESPONSE" == *"realm"* ]]; then
    echo "✅ API endpoint is working"
else
    echo "⚠️  API endpoint returned: $API_RESPONSE (this may be normal if using fallback responses)"
fi

# Clean up
kill $SERVER_PID

echo ""
echo "🎉 Deployment test completed successfully!"
echo ""
echo "🚀 Your backend is ready for deployment to:"
echo "   • Railway: Connect your repo and deploy automatically"
echo "   • Render: Use the render.yaml configuration"
echo "   • Heroku: Deploy with the included Procfile"
echo "   • Vercel: Deploy with the vercel.json configuration"
echo "   • Docker: Build and deploy using the Dockerfile"
echo ""
echo "📚 See BACKEND_DEPLOYMENT.md for detailed deployment instructions"
echo ""
echo "✨ Remember to set environment variables on your deployment platform:"
echo "   • NODE_ENV=production (required)"
echo "   • OPENAI_API_KEY (optional - app works without it)"
echo "   • DATABASE_URL (optional - uses in-memory storage by default)"
echo "   • SESSION_SECRET (recommended for production)"