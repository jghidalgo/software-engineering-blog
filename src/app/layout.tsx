import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReadingProgress from "@/components/ReadingProgress";
import CommandPalette from "@/components/CommandPalette";
import { NO_FOUC_SCRIPT } from "@/lib/theme";
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'https://www.awsmindset.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "AWSMindset - AWS news & engineering signal",
  description:
    "A personal field journal on Amazon Web Services — fresh service launches, real-world architectures, and engineering trade-offs from the rest of the industry.",
  keywords: ["AWS", "cloud", "engineering", "serverless", "lambda", "architecture", "devops", "next.js"],
  authors: [{ name: "Joan Rodríguez" }],
  creator: "AWSMindset",
  publisher: "AWSMindset",
  robots: { index: true, follow: true },
  alternates: {
    canonical: SITE_URL,
    types: {
      'application/rss+xml': [{ url: `${SITE_URL}/feed.xml`, title: 'AWSMindset RSS feed' }],
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "AWSMindset - AWS news & engineering signal",
    description:
      "Curated AWS announcements and engineering blog coverage from across the industry, with editorial commentary.",
    siteName: "AWSMindset",
  },
  twitter: {
    card: "summary_large_image",
    title: "AWSMindset - AWS news & engineering signal",
    description:
      "Curated AWS announcements and engineering coverage from across the industry, with editorial commentary.",
    creator: "@Joan57002536",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <script
          // Runs before paint to set the dark class — prevents flash of wrong theme.
          dangerouslySetInnerHTML={{ __html: NO_FOUC_SCRIPT }}
        />
      </head>
      <body className={`${inter.variable} ${jetBrainsMono.variable} antialiased h-full font-sans text-secondary-800 dark:text-secondary-200 bg-secondary-50 dark:bg-[#060a14]`}>
        <ReadingProgress />
        <CommandPalette />
        <div className="flex flex-col min-h-full">
          <Header />
          <main className="flex-grow">
            {children}
            <Analytics />
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
