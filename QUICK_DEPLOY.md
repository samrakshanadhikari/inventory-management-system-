# 🚀 Quick Deploy to Vercel

## Your app is ready! Here's how to deploy it:

### Step 1: Go to Vercel
1. Visit [vercel.com](https://vercel.com)
2. Sign up/Login with your GitHub account

### Step 2: Import Your Project
1. Click "New Project"
2. Import from GitHub: `samrakshanadhikari/inventory-app`
3. Click "Import"

### Step 3: Configure Environment Variables
In the Vercel dashboard, add these environment variables:

```
DATABASE_URL=postgresql://username:password@host:port/database
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-secure-secret-key-32-chars-minimum
```

### Step 4: Get a Free Database
**Option A: Neon (Recommended)**
1. Go to [neon.tech](https://neon.tech)
2. Create free account
3. Create new project
4. Copy the connection string to `DATABASE_URL`

**Option B: Supabase**
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings > Database
4. Copy connection string to `DATABASE_URL`

### Step 5: Deploy!
1. Click "Deploy" in Vercel
2. Wait for build to complete
3. Your app will be live at: `https://your-app-name.vercel.app`

### Step 6: Set up Database
After deployment, run these commands in Vercel's terminal or locally:

```bash
npx prisma migrate deploy
npx prisma db seed
```

## Demo Accounts for Testing:
- **Admin**: `admin` or `admin@example.com`
- **Staff**: `staff` or `staff1@example.com`

## Your Live App Will Be:
`https://inventory-app-samrakshanadhikari.vercel.app` (or similar)

## Features to Show Recruiters:
✅ Full-stack Next.js app with TypeScript
✅ PostgreSQL database with Prisma ORM
✅ NextAuth.js authentication
✅ Role-based access control
✅ Beautiful responsive UI
✅ Complete CRUD operations
✅ Production-ready deployment

**Total Cost: $0/month** (using free tiers)

Your app is now ready for recruiters to see! 🎉
