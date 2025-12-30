# 🚀 Vercel Deployment Guide

## Prerequisites
- Vercel account (free tier works)
- GitHub repository (optional but recommended)
- WalletConnect Project ID (already configured)

---

## Quick Deploy (Recommended)

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy from frontend directory**
```bash
cd frontend
vercel
```

4. **Follow prompts**
- Set up project? Y
- Which scope? (select your account)
- Link to existing project? N
- Project name? nft-card-game-base
- Directory? ./
- Override settings? N

5. **Deploy to production**
```bash
vercel --prod
```

---

### Option 2: Deploy via Vercel Dashboard

1. **Go to**: https://vercel.com/new

2. **Import Git Repository**
- Connect your GitHub/GitLab account
- Select the repository
- Framework: Next.js (auto-detected)
- Root Directory: `frontend`

3. **Configure Project**
- Build Command: `npm run build` (auto-detected)
- Output Directory: `.next` (auto-detected)
- Install Command: `npm install` (auto-detected)

4. **Environment Variables**
Add these in Vercel Dashboard → Settings → Environment Variables:
```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=f6bd6e2911b56f5ac3bc8b2d0e2d7ad5
```

5. **Deploy**
- Click "Deploy"
- Wait 2-3 minutes
- Your site is live! 🎉

---

## Build Locally First

Test the production build before deploying:

```bash
cd frontend
npm run build
npm start
```

Visit http://localhost:3000 to test production build.

---

## Environment Variables

### Required Variables:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=f6bd6e2911b56f5ac3bc8b2d0e2d7ad5
```

### Optional Variables:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xF4756D6855f95C07c0FC3E327F28665aeccA9F48
NEXT_PUBLIC_CHAIN_ID=84532
```

---

## Post-Deployment Checklist

### ✅ Verify Functionality:
1. [ ] Homepage loads
2. [ ] Wallet connects (MetaMask/WalletConnect)
3. [ ] Claim page works
4. [ ] Mint page works
5. [ ] Collection displays cards
6. [ ] Battle system functional
7. [ ] Leaderboard shows stats
8. [ ] Card images display correctly
9. [ ] Transaction confirmations work
10. [ ] Mobile responsive

### ✅ Performance Checks:
1. [ ] Lighthouse score >90
2. [ ] Page load <3s
3. [ ] No console errors
4. [ ] Images load instantly (SVG base64)

### ✅ SEO Optimization:
1. [ ] Meta tags present
2. [ ] Open Graph images
3. [ ] Sitemap generated
4. [ ] Robots.txt configured

---

## Custom Domain (Optional)

### Add Domain to Vercel:

1. Go to Project → Settings → Domains
2. Add your domain (e.g., `nft-card-game.com`)
3. Configure DNS:
   - **A Record**: `76.76.21.21`
   - **CNAME**: `cname.vercel-dns.com`
4. Wait for DNS propagation (5-60 minutes)

---

## Troubleshooting

### Issue: Build Fails
**Solution**: Check build logs for errors
```bash
npm run build
```

### Issue: Wallet Won't Connect
**Solution**: 
- Check WalletConnect Project ID
- Verify NEXT_PUBLIC_ prefix on env vars
- Check browser console for errors

### Issue: Images Don't Load
**Solution**: SVG generation should work automatically
- Check `utils/cardImageGenerator.ts`
- Verify no CSP blocking base64 images

### Issue: Slow Performance
**Solution**:
- Enable Next.js Image Optimization
- Check Vercel Analytics for bottlenecks
- Minimize client-side JavaScript

---

## Continuous Deployment

### Auto-Deploy on Git Push:

1. Connect repository to Vercel
2. Every push to `main` branch auto-deploys
3. Pull requests get preview URLs
4. Rollback available in dashboard

### Branch Strategy:
- `main` → Production (vercel.app)
- `develop` → Staging (staging.vercel.app)
- `feature/*` → Preview URLs

---

## Monitoring & Analytics

### Vercel Analytics:
1. Enable in Project Settings
2. Track page views, load times
3. Monitor Core Web Vitals
4. Free for hobby projects

### Vercel Speed Insights:
1. Shows real user performance
2. Identifies slow pages
3. Recommends optimizations

---

## Cost Estimation

### Vercel Free Tier:
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ DDoS protection
- ✅ Analytics included

**Estimated Cost**: $0/month (hobby project)

---

## Production URLs

After deployment, you'll get:
- **Production**: `https://nft-card-game-base.vercel.app`
- **Preview**: `https://nft-card-game-base-git-main-username.vercel.app`

---

## Security Best Practices

1. ✅ Never commit private keys
2. ✅ Use environment variables
3. ✅ Enable HTTPS only
4. ✅ Validate all user inputs
5. ✅ Rate limit API calls
6. ✅ Monitor for suspicious activity

---

## Backup & Rollback

### Create Backup:
```bash
vercel alias set nft-card-game-base.vercel.app backup.vercel.app
```

### Rollback Deployment:
1. Go to Vercel Dashboard
2. Deployments → Select previous deployment
3. Click "Promote to Production"

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Discord**: https://discord.gg/vercel

---

## 🎉 You're Ready to Deploy!

Run this command to deploy:
```bash
cd frontend && vercel --prod
```

Your NFT Card Game will be live in minutes! 🚀
