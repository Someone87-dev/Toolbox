
'use client';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  dataAiHint?: string;
}

export function ToolCard({ title, description, href, icon: Icon, dataAiHint }: ToolCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault(); // Prevent default link behavior
    setIsLoading(true);
    // Simulate a very short delay
    await new Promise(resolve => setTimeout(resolve, 200)); 
    router.push(href);
    // No need to setIsLoading(false) as the component will unmount or page will change
  };

  return (
    <Card className="flex flex-col hover:shadow-xl transition-shadow duration-300 ease-in-out" data-ai-hint={dataAiHint}>
      <CardHeader className="flex-grow">
        <div className="flex items-center mb-3">
          <Icon className="w-8 h-8 mr-3 text-primary" />
          <CardTitle className="font-headline text-xl">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild={!isLoading} variant="default" className="w-full group" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <Link href={href} onClick={handleClick}>
              Open Tool
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
