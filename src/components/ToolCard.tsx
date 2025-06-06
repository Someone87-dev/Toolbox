import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  dataAiHint?: string;
}

export function ToolCard({ title, description, href, icon: Icon, dataAiHint }: ToolCardProps) {
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
        <Button asChild variant="default" className="w-full group">
          <Link href={href}>
            Open Tool
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
