import type { LucideProps } from 'lucide-react';
import { Wrench, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LogoIcon({ className, ...props }: LucideProps) {
  return (
    <div className={cn("relative inline-block", className)} {...props} aria-label="ToolboxAI Logo">
      <Wrench className="h-[75%] w-[75%] absolute top-[50%] left-[50%] transform -translate-x-[60%] -translate-y-[40%] opacity-80" />
      <Sparkles className="h-full w-full" />
    </div>
  );
}
