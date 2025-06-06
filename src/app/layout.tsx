import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { LogoIcon } from '@/components/icons/LogoIcon';

export const metadata: Metadata = {
  title: 'ToolboxAI - Your Ultimate Utility Toolkit',
  description: 'A collection of powerful AI-driven and standard utility tools including Text Diff, Text Summarizer, Case Converter, and Unit Converter.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen flex flex-col">
        <header className="py-4 px-6 border-b border-border shadow-sm sticky top-0 z-50 bg-background">
          <div className="container mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <LogoIcon className="h-8 w-8 text-primary group-hover:text-primary/90 transition-colors" />
              <span className="text-2xl font-headline font-bold text-foreground group-hover:text-foreground/90 transition-colors">
                ToolboxAI
              </span>
            </Link>
            {/* Navigation items can be added here if needed */}
          </div>
        </header>
        <div className="flex-grow container mx-auto px-4 py-8">
          {children}
        </div>
        <Toaster />
        <footer className="py-6 px-6 border-t border-border">
          <div className="container mx-auto text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} ToolboxAI. Powered by Next.js and Firebase.
          </div>
        </footer>
      </body>
    </html>
  );
}
