
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ToolPageLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function ToolPageLayout({ title, description, children }: ToolPageLayoutProps) {
  return (
    <div className="w-full max-w-4xl mx-auto py-2"> {/* Reduced top padding as global layout has padding */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-headline font-semibold text-foreground">{title}</h1>
          <Button variant="outline" asChild>
            <Link href="/tools"> {/* Updated link to point to /tools */}
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Toolbox
            </Link>
          </Button>
        </div>
        {description && <p className="text-muted-foreground text-lg">{description}</p>}
      </header>
      <main className="bg-card p-6 sm:p-8 rounded-lg shadow-lg border border-border">
        {children}
      </main>
    </div>
  );
}
