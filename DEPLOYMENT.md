# 🚀 Pre-Deployment Checklist

## ✅ Before Deploying to Vercel

### 1. **Test Production Build Locally**
```bash
npm run build
npm run start
```
Visit `http://localhost:3000/dashboard` and verify:
- [ ] All 4 charts render correctly (Line, Bar, Scatter, Heatmap)
- [ ] Real-time data streaming works
- [ ] FPS counter shows ~60fps with 10k points
- [ ] Filters and aggregation work smoothly
- [ ] Table virtualization scrolls smoothly
- [ ] Zoom/pan on LineChart works
- [ ] No console errors

### 2. **Run Performance Tests**
Open Chrome DevTools → Performance tab:
- [ ] Record 30 seconds of dashboard usage
- [ ] Check FPS stays above 55fps
- [ ] Monitor memory growth (should be < 1MB/hour)
- [ ] Test interaction latency (filters, zoom, pan)

### 3. **Bundle Size Analysis** (Optional)
```bash
# Windows
npm run analyze

# Linux/Mac
ANALYZE=true npm run build
```
- [ ] Check main bundle is < 500KB gzipped
- [ ] Review largest dependencies

### 4. **Code Quality Checks**
```bash
npm run typecheck
npm run lint
npm run format:check
```
- [ ] No TypeScript errors
- [ ] No ESLint warnings (or acceptable ones documented)
- [ ] Code is formatted

### 5. **Update Documentation**
- [ ] Add actual performance metrics to `PERFORMANCE.md`
- [ ] Update README with deployment URL (after deploy)
- [ ] Add screenshots/GIFs to README

---

## 🌐 Deploying to Vercel

### Option 1: Vercel CLI (Recommended)
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

### Option 2: GitHub Integration
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy automatically

---

## 📊 Post-Deployment

### 1. **Verify Production Site**
- [ ] Visit deployed URL
- [ ] Test all features work in production
- [ ] Check SSE streaming works (connection status green)
- [ ] Test on mobile device

### 2. **Monitor Performance**
- [ ] Check Vercel Analytics
- [ ] Monitor Core Web Vitals
- [ ] Test from different geographic locations

### 3. **Update README**
```markdown
## 🌐 Live Demo
**[View Live Dashboard](https://your-deployment-url.vercel.app/dashboard)**
```

---

## 🐛 Common Issues & Fixes

### Issue: "Build failed - Type errors"
**Fix**: Run `npm run typecheck` locally and fix errors

### Issue: "SSE not connecting in production"
**Fix**: Ensure Edge runtime is set in `/api/data/route.ts`

### Issue: "Canvas not rendering"
**Fix**: Check browser console, verify `'use client'` directive on chart components

### Issue: "Slow performance in production"
**Fix**: 
- Check bundle size with `npm run analyze`
- Verify production build has `NODE_ENV=production`
- Test on faster network connection

---

## 📈 Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| FPS @ 10k points | ≥ 60 fps | ⏳ Test in production |
| Interaction Latency | < 100ms | ⏳ Test in production |
| Memory Growth | < 1MB/hour | ⏳ Test in production |
| Bundle Size (gzipped) | < 500KB | ⏳ Run `npm run analyze` |
| Time to Interactive | < 3s | ⏳ Check Lighthouse |
| First Contentful Paint | < 1.5s | ⏳ Check Lighthouse |

---

## ✨ You're Ready to Deploy!

Once all checkboxes are complete, run:
```bash
vercel --prod
```

Good luck! 🚀
