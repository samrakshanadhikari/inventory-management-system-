# 🚀 Deployment Troubleshooting Guide

## Quick Fix for Login Issues

### Step 1: Check App Health
Visit: `https://your-app-url.com/api/health`

This will show you:
- Database connection status
- Environment variables
- User count

### Step 2: Set Up Database
Visit: `https://your-app-url.com/setup`

Click "Setup Database" button to create demo users.

### Step 3: Test Login
Visit: `https://your-app-url.com/auth/signin`

Use these credentials:
- **Admin**: `admin` or `admin@example.com`
- **Staff**: `staff` or `staff1@example.com`

## Common Issues & Solutions

### 1. "Invalid Credentials" Error
**Problem**: Database not seeded with demo users
**Solution**: 
1. Go to `/setup` page
2. Click "Setup Database"
3. Wait for success message
4. Try logging in again

### 2. Database Connection Error
**Problem**: Environment variables not set correctly
**Solution**: Check these environment variables in your deployment platform:

```env
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="https://your-app-url.com"
```

### 3. Build Errors
**Problem**: Missing dependencies or TypeScript errors
**Solution**: 
1. Run `npm run build` locally
2. Fix any errors
3. Push changes to GitHub
4. Redeploy

### 4. Environment Variables Not Loading
**Problem**: Variables not set in deployment platform
**Solution**: 
1. Go to your deployment platform settings
2. Add environment variables
3. Redeploy the app

## Testing Your Deployment

### 1. Health Check
```bash
curl https://your-app-url.com/api/health
```

### 2. Setup Database
```bash
curl -X POST https://your-app-url.com/api/setup
```

### 3. Test Login
Visit the login page and try the demo credentials.

## Demo Credentials

| Role | Username | Email |
|------|----------|-------|
| Admin | `admin` | `admin@example.com` |
| Staff | `staff` | `staff1@example.com` |
| Staff | `staff2` | `staff2@example.com` |

## Support

If you're still having issues:
1. Check the deployment logs
2. Verify environment variables
3. Test the health endpoint
4. Try the setup endpoint

Your app should work perfectly after following these steps! 🎉
