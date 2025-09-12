import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

export const metadata: Metadata = {
  title: "DevBlog - Software Engineering & AWS",
  description: "A professional blog about software engineering with a focus on AWS cloud technologies, best practices, and modern development techniques.",
  keywords: ["software engineering", "AWS", "cloud", "typescript", "react", "next.js", "serverless"],
  authors: [{ name: "DevBlog" }],
  creator: "DevBlog",
  publisher: "DevBlog",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com",
    title: "DevBlog - Software Engineering & AWS",
    description: "A professional blog about software engineering with a focus on AWS cloud technologies.",
    siteName: "DevBlog",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevBlog - Software Engineering & AWS",
    description: "A professional blog about software engineering with a focus on AWS cloud technologies.",
    creator: "@yourusername",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} ${jetBrainsMono.variable} antialiased h-full bg-white dark:bg-secondary-900 font-sans`}>
        <div className="flex flex-col min-h-full">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
