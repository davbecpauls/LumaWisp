# 🔐 API Key Security Guide for LumaWisp

## Overview
LumaWisp uses OpenAI's API to power Luma's AI responses. This guide explains how to securely manage your API keys.

## 🚨 IMPORTANT SECURITY NOTES

1. **NEVER commit API keys to version control**
2. **Use environment variables for all sensitive data**
3. **Rotate keys regularly**
4. **Use different keys for development and production**

## 🛠️ Setup Instructions

### Local Development (.env file)
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your real OpenAI API key:
   ```bash
   OPENAI_API_KEY=sk-your-actual-openai-api-key-here
   ```

3. The `.env` file is automatically ignored by git (see `.gitignore`)

### Replit Environment
1. Go to your Replit project
2. Click on "Secrets" (lock icon) in the left sidebar
3. Add a new secret:
   - Key: `OPENAI_API_KEY`
   - Value: `sk-your-actual-openai-api-key-here`

### Production Deployment
For production deployments, set environment variables through your hosting platform:

#### Vercel
```bash
vercel env add OPENAI_API_KEY
```

#### Netlify
Add environment variables in your site's dashboard under "Site settings" > "Environment variables"

#### Railway/Render/Heroku
Use their respective CLI or dashboard to set environment variables

## 🔄 API Key Rotation

When rotating your OpenAI API key:

1. Generate a new key in OpenAI Dashboard
2. Update the environment variable in all environments
3. Test the application
4. Revoke the old key

## 🧪 Testing Without API Key

LumaWisp includes fallback responses when no API key is provided:
- The app will show a warning in the console
- Luma will respond with pre-written responses
- All other functionality remains available

## 📋 Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `OPENAI_API_KEY` | No* | OpenAI API key for AI responses | `sk-...` |
| `DATABASE_URL` | No | Database connection string | `postgresql://...` |
| `NODE_ENV` | No | Environment mode | `development` |
| `PORT` | No | Server port | `5000` |
| `SESSION_SECRET` | No | Session encryption secret | `random-string` |

*Required for AI features, but app works without it

## 🔍 Verification

To verify your API key is working:
1. Start the development server: `npm run dev`
2. Look for console messages about environment variables
3. Test Luma's chat functionality
4. Check browser console for any API errors

## 🆘 Troubleshooting

### "API key not found" warning
- Check your `.env` file exists and has `OPENAI_API_KEY=...`
- Restart the development server after adding the key
- Verify the key starts with `sk-`

### API quota exceeded
- Check your OpenAI usage in the OpenAI Dashboard
- Upgrade your OpenAI plan if needed
- Implement usage monitoring

### Invalid API key
- Verify the key is correct and not expired
- Check if the key has been revoked
- Generate a new key if needed

## 📱 Mobile/App Security

If extending to mobile apps:
- Never include API keys in client-side code
- Use a backend proxy for all OpenAI requests
- Implement proper authentication for your API endpoints

## 🔒 Additional Security Measures

1. **Rate Limiting**: Implement API rate limiting to prevent abuse
2. **Input Validation**: Sanitize all user inputs before sending to OpenAI
3. **Logging**: Log API usage for monitoring (but never log the actual key)
4. **Monitoring**: Set up alerts for unusual API usage patterns

## 📝 Best Practices Checklist

- [ ] API key stored in environment variables only
- [ ] `.env` file added to `.gitignore`
- [ ] Different keys for development/production
- [ ] Regular key rotation schedule
- [ ] Usage monitoring set up
- [ ] Error handling for API failures
- [ ] Fallback responses implemented

## 🚀 Quick Start

```bash
# 1. Clone and setup
git clone <your-repo>
cd LumaWisp
npm install

# 2. Create environment file
cp .env.example .env

# 3. Add your OpenAI API key to .env
echo "OPENAI_API_KEY=sk-your-key-here" >> .env

# 4. Start development server
npm run dev
```

## 📞 Support

If you need help with API key setup:
1. Check the OpenAI documentation
2. Review this security guide
3. Check the application logs for specific error messages
4. Create an issue in the repository with details (never include your actual API key)
