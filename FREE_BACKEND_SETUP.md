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