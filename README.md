# The Consult — Website Deployment Guide

## What's In This Package

```
the-consult-site/
├── index.html          ← Your website (auto-fetches from Beehiiv)
├── api/
│   └── posts.js        ← Serverless proxy (keeps your API key safe)
├── vercel.json         ← Vercel deployment config
└── README.md           ← This file
```

## How It Works

1. You publish a newsletter on Beehiiv
2. Your website automatically pulls the latest posts via the Beehiiv API
3. A serverless function (api/posts.js) sits between the website and Beehiiv to keep your API key secure
4. Posts are cached for 15 minutes so the site loads fast

## Deployment Steps (Vercel — Free Tier)

### Step 1: Install Vercel CLI

Open your terminal and run:

```bash
npm install -g vercel
```

If you don't have npm, install Node.js first: https://nodejs.org

### Step 2: Log in to Vercel

```bash
vercel login
```

Follow the prompts (you can sign up with GitHub, GitLab, or email).

### Step 3: Navigate to the project folder

```bash
cd path/to/the-consult-site
```

### Step 4: Set your environment variables

```bash
vercel env add BEEHIIV_API_KEY
```
Paste your Beehiiv API key when prompted. Select all environments (Production, Preview, Development).

```bash
vercel env add BEEHIIV_PUB_ID
```
Enter: pub_467cf173-7f0f-4fc6-9d4f-d75f8a30206d

### Step 5: Deploy

```bash
vercel --prod
```

Vercel will give you a URL like `https://the-consult-site.vercel.app`. That's your live website.

### Step 6: Custom domain (optional)

If you have a custom domain (e.g., theconsult.io):

```bash
vercel domains add theconsult.io
```

Then update your domain's DNS to point to Vercel (they'll show you exactly what to set).

---

## Alternative: GitHub + Vercel (Auto-Deploy)

For automatic deploys whenever you push changes:

1. Create a GitHub repo and push this folder to it
2. Go to vercel.com → New Project → Import your GitHub repo
3. Add environment variables in the Vercel dashboard:
   - `BEEHIIV_API_KEY` = your API key
   - `BEEHIIV_PUB_ID` = pub_467cf173-7f0f-4fc6-9d4f-d75f8a30206d
4. Deploy — Vercel auto-deploys on every push to main

---

## Testing Locally

To test before deploying:

```bash
npm install -g vercel
vercel env pull .env.local
vercel dev
```

This runs the site locally at http://localhost:3000 with your real API credentials.

---

## Updating the Website

The website content updates automatically — every time you publish on Beehiiv, the site picks it up within 15 minutes (the cache duration).

To change the website design, edit `index.html` and redeploy:

```bash
vercel --prod
```

---

## Troubleshooting

**"Couldn't load articles" on the website**
- Check that your environment variables are set: `vercel env ls`
- Verify the API key is still valid in your Beehiiv dashboard
- Check the function logs: `vercel logs`

**Articles not showing up**
- Only `confirmed` (published) posts appear. Drafts are filtered out.
- New posts appear within 15 minutes due to caching.

**CORS errors in browser console**
- The serverless function handles CORS. If you see errors, make sure you're accessing via the Vercel URL, not opening the HTML file directly.
