# Free Backend Setup Guide for AWS Blog

This guide will help you set up a completely free backend for your AWS blog hosted on Vercel.

## 🎯 Overview

Your blog uses:
- **Vercel** (Free tier) - Hosting
- **Airtable** (Free tier) - Database for contact forms & newsletter
- **EmailJS** (Free tier) - Email sending service
- **Next.js API Routes** - Backend endpoints

## 📊 Free Tier Limits

- **Vercel**: 100 deployments/month, 100GB bandwidth, serverless functions
- **Airtable**: 1,200 records, 2GB storage, unlimited bases
- **EmailJS**: 200 emails/month

## 🚀 Setup Instructions

### 1. Airtable Setup (Database)

1. **Create Account**: Go to [airtable.com](https://airtable.com) and sign up
2. **Create Base**: Click "Create a base" → "Start from scratch"
3. **Name**: "AWS Blog Backend"

4. **Create Tables**:

   **Table 1: Contact Messages**
   - Rename "Table 1" to "Contact Messages"
   - Fields:
     - `Name` (Single line text)
     - `Email` (Email)
     - `Subject` (Single line text)
     - `Message` (Long text)
     - `Submitted` (Date and time)
     - `IP Address` (Single line text)
     - `Status` (Single select: New, Read, Replied)

   **Table 2: Newsletter Subscribers**
   - Click "+" to add new table
   - Name: "Newsletter Subscribers"
   - Fields:
     - `Email` (Email) - Primary field
     - `Name` (Single line text)
     - `Subscribed At` (Date and time)
     - `Status` (Single select: active, unsubscribed)
     - `Source` (Single line text)

5. **Get API Credentials**:
   - Click your avatar → "Developer hub"
   - Go to "Personal access tokens"
   - Click "Create new token"
   - Name: "AWS Blog"
   - Scopes: `data.records:read`, `data.records:write`
   - Copy the token

6. **Get Base ID**:
   - Go to your base
   - Click "Help" → "API documentation"
   - Your Base ID is shown at the top

### 2. EmailJS Setup (Email Service)

1. **Create Account**: Go to [emailjs.com](https://emailjs.com) and sign up
2. **Email Services**:
   - Go to "Email Services"
   - Click "Add New Service"
   - Choose your email provider (Gmail recommended)
   - Follow setup instructions
   - Note the **Service ID**

3. **Email Templates**:
   - Go to "Email Templates"
   - Click "Create New Template"
   - **Template Name**: "Contact Form"
   - **Template Content**:
     ```
     Subject: New Contact Form Message from {{name}}
     
     You have received a new message from your blog:
     
     Name: {{name}}
     Email: {{email}}
     Subject: {{subject}}
     
     Message:
     {{message}}
     
     Sent from: AWS Blog Contact Form
     ```
   - Note the **Template ID**

4. **Get Public Key**:
   - Go to "Account" → "General"
   - Copy your **Public Key**

### 3. Environment Variables

Create `.env.local` in your project root:

```env
# Airtable Configuration
AIRTABLE_PERSONAL_ACCESS_TOKEN=your_token_here
AIRTABLE_BASE_ID=your_base_id_here

# EmailJS Configuration (Public - can be exposed)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

### 4. Vercel Deployment

1. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository

2. **Environment Variables**:
   - In Vercel dashboard → Project → Settings → Environment Variables
   - Add all variables from `.env.local`

3. **Deploy**:
   - Vercel will automatically deploy
   - Your site will be available at `your-project.vercel.app`

## 🧪 Testing

### Contact Form Test:
1. Go to `/contact`
2. Fill out the form
3. Check Airtable "Contact Messages" table
4. Check your email for notification

### Newsletter Test:
1. Go to any blog page
2. Use the newsletter signup form
3. Check Airtable "Newsletter Subscribers" table

## 🔧 Customization

### Email Templates:
- Modify EmailJS templates for different email formats
- Add auto-reply templates for users

### Database Schema:
- Add more fields to Airtable tables as needed
- Create additional tables for comments, analytics, etc.

### Monitoring:
- Check Vercel function logs for errors
- Monitor Airtable record usage
- Track EmailJS email quota

## 🚨 Important Notes

1. **Environment Variables**: Never commit `.env.local` to git
2. **API Limits**: Monitor your usage to stay within free tiers
3. **Security**: Airtable tokens have limited scope for security
4. **Scaling**: Upgrade to paid tiers if you exceed limits

## 🆘 Troubleshooting

### Common Issues:

1. **"Airtable not configured"**: Check environment variables
2. **Email not sending**: Verify EmailJS service setup
3. **CORS errors**: EmailJS handles CORS automatically
4. **Database errors**: Check Airtable field names match exactly

### Debug Steps:
1. Check Vercel function logs
2. Verify environment variables in Vercel dashboard
3. Test API endpoints directly: `/api/contact` and `/api/newsletter/subscribe`

## 📈 Monitoring Usage

### Airtable:
- Dashboard shows record count toward 1,200 limit

### EmailJS:
- Dashboard shows email count toward 200/month limit

### Vercel:
- Analytics tab shows function executions and bandwidth

---

Your free backend is now ready! 🎉

Total cost: **$0/month** for reasonable traffic volumes.

---

## 🤖 AWS News Pipeline (auto-draft articles)

Once a day, a Vercel Cron job fetches the AWS "What's New" RSS feed, asks
**Google Gemini** to write an editorial summary with commentary, and inserts
the result as a **draft** into a new Airtable table. You review the draft in
Airtable and flip its `status` to `published` to make it live on the site.

> Why Gemini: the free tier on `gemini-1.5-flash` allows 1,500 requests/day
> and 1M tokens/day — orders of magnitude beyond what a daily cron needs.
> No credit card required.

### 1. Add a `Posts` table to your Airtable base

In the same base used for contact/newsletter, create one more table:

- **Table name**: `Posts`
- **Fields** (exact names matter — used by the API):
  - `slug` — Single line text
  - `title` — Single line text
  - `excerpt` — Long text
  - `body` — Long text
  - `tags` — Long text (comma-separated)
  - `readTime` — Single line text
  - `status` — Single select with options `draft`, `published` (default `draft`)
  - `source` — Single select. Add **all** of these options so cron writes don't 422:
    - **AWS (high priority, /aws and /blog):** `whats-new`, `aws-blogs`
    - **Engineering at Scale (/engineering?category=at-scale):** `netflix-tech`, `pragmatic-eng`, `uber-eng`, `meta-eng`
    - **Web Platform (/engineering?category=web-platform):** `react-blog`, `web-dev`
    - **Industry (/engineering?category=industry):** `github-blog`, `hn-100`
  - `sourceUrl` — URL
  - `sourceTitle` — Single line text
  - `sourceGuid` — Single line text (primary dedup key)
  - `sourceLinkNorm` — Single line text (fallback dedup key)
  - `publishedAt` — Date
  - `createdAt` — Created time (Airtable built-in)

Reuse the same Personal Access Token — it already has `data.records:read` and
`data.records:write` scope.

### 2. Get a free Gemini API key

1. Go to **[aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)**
2. Sign in with any Google account (no credit card required)
3. Click **Create API key** → pick or create a Google Cloud project
4. Copy the key (starts with `AIza...`)

The free tier on `gemini-2.5-flash-lite` gives you 15 requests/minute and
1,000/day — plenty of headroom for a daily cron pulling at most 6 items
across both feeds. (Default model. Swappable in `ai-rewrite.ts`.)

### 3. Add the new environment variables

Append to your `.env.local` and to the Vercel project Environment Variables:

```env
# Google Gemini — used to rewrite AWS announcements as editorial drafts
GEMINI_API_KEY=AIza...

# Vercel Cron — random string the cron route checks via Bearer token
CRON_SECRET=replace-with-a-long-random-string
```

Generate `CRON_SECRET` with `openssl rand -hex 32` or any random string of
at least 32 characters. Vercel automatically sends it as
`Authorization: Bearer ${CRON_SECRET}` to scheduled routes.

### 4. Deploy — Vercel registers the cron automatically

The cron schedule lives in `vercel.json` at the project root:

```json
{ "crons": [{ "path": "/api/cron/aws-news", "schedule": "0 13 * * *" }] }
```

After your next deploy, open **Vercel dashboard → Project → Settings → Cron
Jobs** and confirm `aws-news` is listed with schedule `0 13 * * *` (13:00 UTC
daily). The Hobby tier allows one cron per day; that's all we need.

You can also click **Trigger** there to fire a run immediately.

### 5. Local dry-run

```bash
# from a separate terminal while `npm run dev` is running
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/aws-news
```

Expected JSON response:

```json
{ "ok": true, "processed": N, "skipped": M, "errors": [] }
```

New rows should appear in the Airtable `Posts` table with `status='draft'`.
Wrong/missing token returns 401.

### 6. Reviewing & publishing

1. Open the `Posts` table in Airtable.
2. Read the AI-generated `title`, `excerpt`, `body`. Edit anything that
   feels off — the AI is a starting draft, not the final word.
3. Change `status` from `draft` to `published`.
4. Optionally fill in `publishedAt` with today's date (sets the displayed
   article date).
5. Within ~60 seconds, the article appears on `/blog` and at
   `/blog/news/<slug>`. The article page automatically attributes AWS as
   the source and emits `<link rel="canonical">` to the original AWS URL.

### Tuning

- **Frequency**: Edit the cron expression in `vercel.json`. Daily is the
  only option on Vercel Hobby; sub-daily requires Pro.
- **Per-run cap**: `MAX_ITEMS_PER_RUN` in
  `src/app/api/cron/aws-news/route.ts` (default 5). Higher values risk the
  60s timeout on Hobby.
- **Editorial voice**: Tweak the system prompt in
  `src/lib/ai-rewrite.ts` — the structure (`## What's new` + `## Why it
  matters`) and word count window are defined there.
- **Model**: Default is `gemini-2.5-flash` (fastest free option). Swap to
  `gemini-2.5-pro` in `ai-rewrite.ts` for higher quality at the cost of
  tighter free-tier limits.