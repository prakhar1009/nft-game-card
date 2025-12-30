# 🚀 Vercel Deployment Guide

## 📋 Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- Contract deployed on Base Sepolia: `0xF4756D6855f95C07c0FC3E327F28665aeccA9F48`

---

## 🔗 Quick Deploy

### Option 1: Deploy via Vercel Dashboard

1. **Connect Repository**
   - Go to https://vercel.com/new
   - Import your GitHub repository: `prakhar1009/nft-game-card`
   - Select the repository

2. **Configure Project**
   - Framework Preset: **Next.js**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Environment Variables**
   Add these in Vercel dashboard:
   ```
   NEXT_PUBLIC_CHAIN_ID=84532
   NEXT_PUBLIC_CARD_NFT_ADDRESS=0xF4756D6855f95C07c0FC3E327F28665aeccA9F48
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=f6bd6e2911b56f5ac3bc8b2d0e2d7ad5
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at: `https://your-project.vercel.app`

---

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend
cd frontend

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow prompts and set environment variables when asked
```

---

## 🔧 Environment Variables Setup

### Required Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_CHAIN_ID` | `84532` | Base Sepolia Chain ID |
| `NEXT_PUBLIC_CARD_NFT_ADDRESS` | `0xF4756D6855f95C07c0FC3E327F28665aeccA9F48` | Deployed Contract Address |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | `f6bd6e2911b56f5ac3bc8b2d0e2d7ad5` | WalletConnect Project ID |

### How to Add in Vercel Dashboard

1. Go to your project in Vercel
2. Click "Settings" → "Environment Variables"
3. Add each variable with its value
4. Select "Production", "Preview", and "Development"
5. Click "Save"
6. Redeploy if already deployed

---

## 📁 Project Structure

```
nft-card-game-base/
├── frontend/                    # Next.js app (deploy this)
│   ├── app/                    # Pages
│   ├── components/             # React components
│   ├── hooks/                  # Custom hooks
│   ├── utils/                  # Utilities
│   ├── vercel.json            # Vercel config
│   ├── next.config.mjs        # Next.js config
│   └── package.json           # Dependencies
├── contracts/                  # Smart contracts (not deployed)
├── scripts/                    # Deployment scripts (not deployed)
└── README.md                   # Documentation
```

---

## ✅ Deployment Checklist

- [ ] Repository pushed to GitHub
- [ ] Contract deployed on Base Sepolia
- [ ] Environment variables configured
- [ ] Frontend builds successfully locally (`npm run build`)
- [ ] Vercel project created
- [ ] Domain configured (optional)
- [ ] SSL certificate active (automatic)

---

## 🌐 Custom Domain (Optional)

### Add Custom Domain

1. Go to Vercel Dashboard → Your Project
2. Click "Settings" → "Domains"
3. Add your domain (e.g., `nft-card-game.com`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-30 minutes)

### DNS Configuration

For domain providers, add these records:

**A Record:**
```
Type: A
Name: @
Value: 76.76.21.21
```

**CNAME Record:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 🔍 Verify Deployment

### 1. Check Build Logs
- Go to Vercel Dashboard → Deployments
- Click on latest deployment
- Review build logs for errors

### 2. Test Application
- [ ] Homepage loads
- [ ] Wallet connection works
- [ ] Contract address is correct
- [ ] Network is Base Sepolia (84532)
- [ ] Claim starter pack functions
- [ ] Mint card works
- [ ] Collection displays cards
- [ ] Battle system works

### 3. Check Console
- Open browser DevTools
- Check for errors in console
- Verify Web3 connection

---

## 🐛 Troubleshooting

### Build Fails

**Issue**: Build fails with dependency errors
```bash
# Solution: Clear cache and rebuild
cd frontend
rm -rf node_modules .next
npm install
npm run build
```

### Environment Variables Not Working

**Issue**: Variables undefined in production
- Ensure variables start with `NEXT_PUBLIC_`
- Redeploy after adding variables
- Check variable names match exactly

### Wallet Connection Issues

**Issue**: MetaMask not connecting
- Check WalletConnect Project ID is valid
- Verify Base Sepolia is added to MetaMask
- Clear browser cache

### Contract Not Found

**Issue**: Contract address not recognized
- Verify contract address in environment variables
- Check contract is deployed on Base Sepolia
- Confirm ABI is up to date in `frontend/contracts/`

---

## 📊 Performance Optimization

### Vercel Settings

1. **Enable Edge Functions** (if needed)
2. **Configure Caching**
   - Static assets: 1 year
   - API routes: Custom
3. **Enable Image Optimization**
4. **Use CDN for assets**

### Next.js Optimization

Already configured in `next.config.mjs`:
- ✅ Image optimization for IPFS
- ✅ Webpack externals for Web3
- ✅ React strict mode

---

## 🔄 Continuous Deployment

### Automatic Deployments

Vercel automatically deploys when you push to GitHub:

- **Production**: Push to `main` branch
- **Preview**: Push to any other branch
- **Pull Requests**: Automatic preview deployments

### Manual Deployment

```bash
# Deploy specific branch
vercel --prod

# Deploy with specific environment
vercel --prod --env NEXT_PUBLIC_CHAIN_ID=84532
```

---

## 📈 Monitoring

### Vercel Analytics

1. Enable in Vercel Dashboard
2. View real-time metrics:
   - Page views
   - Unique visitors
   - Performance scores
   - Error rates

### Custom Monitoring

Add error tracking (optional):
- Sentry
- LogRocket
- Datadog

---

## 🔐 Security

### Best Practices

- ✅ Never commit `.env` files
- ✅ Use environment variables for sensitive data
- ✅ Enable HTTPS (automatic on Vercel)
- ✅ Implement rate limiting for API routes
- ✅ Validate user inputs
- ✅ Use Content Security Policy headers

### Vercel Security Headers

Already configured in `vercel.json` for optimal security.

---

## 📞 Support

### Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Base Docs**: https://docs.base.org
- **Contract**: https://sepolia.basescan.org/address/0xF4756D6855f95C07c0FC3E327F28665aeccA9F48

### Common Issues

- Build errors → Check logs
- Deployment fails → Verify environment variables
- App not loading → Check DNS settings
- Wallet issues → Verify network configuration

---

## 🎉 Success!

Your NFT Card Battle Game is now live on Vercel!

**Live URL**: `https://your-project.vercel.app`

**Contract**: `0xF4756D6855f95C07c0FC3E327F28665aeccA9F48`

**Network**: Base Sepolia (Chain ID: 84532)

---

## 📝 Post-Deployment

1. **Test all features**
2. **Share with users**
3. **Monitor analytics**
4. **Collect feedback**
5. **Plan updates**

---

**Need help?** Check the main README.md or create an issue on GitHub.
