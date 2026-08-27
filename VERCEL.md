# Deploying AIRT-Net to Vercel

This application is configured for deployment on **Vercel** with full-stack support (Vite React frontend + Serverless API backend).

---

## Method 1: Deploy with Vercel via GitHub (Recommended)

1. **Export to GitHub**:
   - In Google AI Studio Build, click the **Settings** / **Export** menu in the top right.
   - Choose **Export to GitHub** (or download as ZIP and push to your GitHub repository).

2. **Import in Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select your GitHub repository and click **Import**.

3. **Configure Build Settings**:
   - **Framework Preset**: `Vite` (auto-detected)
   - **Build Command**: `vite build` (or `npm run build`)
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**:
   In the Vercel project configuration panel, add the following under **Environment Variables**:
   - `GEMINI_API_KEY`: Your Google Gemini API Key from Google AI Studio.

5. **Deploy**:
   - Click **Deploy**. Vercel will build the frontend assets into `dist/` and mount the API routes in `/api` as serverless functions.

---

## Method 2: Deploy with Vercel CLI

If you have the [Vercel CLI](https://vercel.com/docs/cli) installed locally:

```bash
# 1. Login to your Vercel account
vercel login

# 2. Deploy preview
vercel

# 3. Deploy to production
vercel --prod
```

When prompted, set your `GEMINI_API_KEY` secret:
```bash
vercel env add GEMINI_API_KEY
```

---

## Architecture on Vercel

- **Frontend**: Vite SPA built to `dist/`, served via Vercel's global Edge CDN.
- **Backend API**: `api/index.ts` serverless function handling all `/api/*` requests (Quantum Kernel simulation, 15-class OvR SVM, Gemini SaMD Causal Analysis, and Minimal-Intervention trajectory simulator).
- **Configuration**: Managed in `vercel.json` with rewrites for client-side routing and serverless API endpoints.
