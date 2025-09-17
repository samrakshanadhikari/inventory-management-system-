# 🚀 Deploy to Vercel (Easiest Option)

## Step 1: Push to GitHub
```bash
# Try GitHub CLI first
brew install gh
gh auth login
git push origin main

# OR use Personal Access Token
# Go to GitHub.com → Settings → Developer settings → Personal access tokens
# Generate token with 'repo' permissions
# Use token as password when prompted
```

## Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your `inventory-app` repository
5. Configure environment variables:
   - `DATABASE_URL`: Your Neon database URL
   - `NEXTAUTH_SECRET`: `inventory-app-production-secret-key-2024`
   - `NEXTAUTH_URL`: Your Vercel app URL (auto-generated)
6. Click "Deploy"

## Step 3: Set Up Database
1. Visit: `https://your-app.vercel.app/setup`
2. Click "Setup Database"
3. Wait for success message

## Step 4: Test Login
1. Go to: `https://your-app.vercel.app/auth/signin`
2. Use credentials:
   - Admin: `admin` or `admin@example.com`
   - Staff: `staff` or `staff1@example.com`

## Environment Variables for Vercel:
```
DATABASE_URL=postgresql://neondb_owner:npg_XhqsrIz6FoB5@ep-tiny-lab-adprszk0-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
NEXTAUTH_SECRET=inventory-app-production-secret-key-2024
NEXTAUTH_URL=https://your-app-name.vercel.app
```

Your app will be live in 2-3 minutes! 🎉