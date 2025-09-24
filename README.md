# AWS Blog - Next.js 15 Blog with Free Backend

A modern, fully-featured blog focused on AWS content with a completely free backend solution.

## 🚀 Features

- **Modern Stack**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Free Backend**: Airtable + EmailJS + Vercel serverless functions
- **Contact Form**: With validation, loading states, and email notifications
- **Newsletter**: Subscription system with duplicate detection
- **Real Content**: Comprehensive AWS tutorials and guides
- **Responsive**: Mobile-first design with dark mode support
- **SEO Optimized**: Meta tags, structured data, sitemap
- **No Cost**: Completely free hosting and backend services
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Professional Color Palette**: Carefully selected colors for readability and aesthetics
- **Component-Based**: Modular, reusable components
- **SEO Friendly**: Optimized metadata and structure for search engines

## 🎨 Color Palette

The blog uses a professional color scheme optimized for readability and visual appeal:

- **Primary**: Blue tones (#0ea5e9 to #0c4a6e) - Used for CTAs and highlights
- **Secondary**: Slate grays (#f8fafc to #0f172a) - Text and backgrounds
- **Accent**: Orange tones (#ee6f1f to #762717) - Special highlights and featured content

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Fonts**: Inter (sans-serif) and JetBrains Mono (monospace)
- **Animations**: Framer Motion (installed, ready for use)
- **Date Handling**: date-fns

## 📦 Getting Started

1. **Clone and Install**:
   ```bash
   # The project is already set up in your blog directory
   cd blog
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Open in Browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
blog/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── about/          # About page
│   │   ├── aws/            # AWS-focused content page
│   │   ├── blog/           # Blog listing page
│   │   ├── contact/        # Contact page
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Homepage
│   │   └── globals.css     # Global styles
│   └── components/         # Reusable components
│       ├── ui/            # UI components (Badge, etc.)
│       ├── BlogCard.tsx   # Blog post card component
│       ├── FeaturedPosts.tsx # Featured posts section
│       ├── Footer.tsx     # Site footer
│       ├── Header.tsx     # Site header/navigation
│       ├── HeroSection.tsx # Homepage hero
│       └── Newsletter.tsx # Newsletter signup
├── public/                # Static assets
├── tailwind.config.ts     # Tailwind configuration
└── package.json          # Dependencies and scripts
```

## 🎨 Customization Guide

### Colors
Update the color palette in `tailwind.config.ts`:
```typescript
colors: {
  primary: { /* Your primary colors */ },
  secondary: { /* Your secondary colors */ },
  accent: { /* Your accent colors */ }
}
```

### Fonts
Change fonts in `src/app/layout.tsx`:
```typescript
const yourFont = YourFont({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-your-font',
});
```

### Branding
- Update the site name in `src/components/Header.tsx` and `src/components/Footer.tsx`
- Modify metadata in `src/app/layout.tsx`
- Replace social media links in footer and contact page

### Content
- Blog posts are currently mocked in components - integrate with your CMS or markdown files
- Update the about page content in `src/app/about/page.tsx`
- Customize the contact information in `src/app/contact/page.tsx`

## 📝 Adding Blog Posts

The blog is set up to work with any content management system. Currently, blog posts are defined as mock data with this interface:

```typescript
interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  tags: string[];
  readTime: string;
  featured?: boolean;
}
```

### Integration Options:
- **Markdown**: Use `gray-matter` (already installed) to parse frontmatter
- **CMS**: Integrate with Contentful, Strapi, or similar
- **Database**: Connect to your preferred database
- **Git-based**: Use MDX with Next.js for file-based content

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Other Platforms
- **Netlify**: Connect your Git repository
- **AWS**: Use AWS Amplify or manual deployment
- **Docker**: Build container with `npm run build`

## 📈 Performance Features

- **Image Optimization**: Next.js automatic image optimization
- **Font Loading**: Optimized Google Fonts loading
- **Code Splitting**: Automatic code splitting for faster loads
- **Caching**: Built-in Next.js caching strategies
- **SEO**: Comprehensive metadata and Open Graph tags

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
