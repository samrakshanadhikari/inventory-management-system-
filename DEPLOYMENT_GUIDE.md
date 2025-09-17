# 🚀 Complete Deployment Guide

## Option 1: Vercel (Recommended - Easiest)

### Step 1: Push to GitHub
```bash
# Install GitHub CLI if not installed
brew install gh

# Login to GitHub
gh auth login

# Push your code
git push origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your `inventory-app` repository
5. Add environment variables:
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_XhqsrIz6FoB5@ep-tiny-lab-adprszk0-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   NEXTAUTH_SECRET=inventory-app-production-secret-key-2024
   NEXTAUTH_URL=https://your-app-name.vercel.app
   ```
6. Click "Deploy"

### Step 3: Set Up Database
1. Visit: `https://your-app.vercel.app/setup`
2. Click "Setup Database"
3. Wait for success message

### Step 4: Test Login
- **Admin**: `admin` or `admin@example.com`
- **Staff**: `staff` or `staff1@example.com`

---

## Option 2: Manual GitHub Upload

### Step 1: Create Zip File
```bash
cd /Users/samrakshyan/inventory-app
zip -r inventory-app.zip . -x "node_modules/*" ".git/*" ".next/*"
```

### Step 2: Upload to GitHub
1. Go to [github.com/samrakshanadhikari/inventory-app](https://github.com/samrakshanadhikari/inventory-app)
2. Click "Upload files"
3. Drag and drop your `inventory-app.zip` file
4. Extract it in the repository
5. Commit changes

### Step 3: Deploy to Vercel
Follow the Vercel steps above.

---

## Option 3: Update Existing Render App

### Step 1: Push to GitHub
Use the GitHub CLI method above.

### Step 2: Update Render
1. Go to your Render dashboard
2. Find your app
3. Click "Manual Deploy" → "Deploy latest commit"
4. Wait for deployment

### Step 3: Set Up Database
1. Visit: `https://inventory-app-qkcg.onrender.com/setup`
2. Click "Setup Database"

---

## Demo Credentials (After Setup)

| Role | Username | Email |
|------|----------|-------|
| Admin | `admin` | `admin@example.com` |
| Staff | `staff` | `staff1@example.com` |
| Staff | `staff2` | `staff2@example.com` |

## Troubleshooting

### If login still doesn't work:
1. Check: `https://your-app-url.com/api/health`
2. Visit: `https://your-app-url.com/setup`
3. Click "Setup Database"
4. Try login again

### If database connection fails:
- Check environment variables in your deployment platform
- Ensure `DATABASE_URL` is correct
- Verify `NEXTAUTH_SECRET` is set

Your app will be fully functional after following these steps! 🎉