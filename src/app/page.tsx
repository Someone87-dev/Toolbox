import { ToolCard } from '@/components/ToolCard';
import { GitCompareArrows, Newspaper, CaseSensitive, Scale, Settings2 } from 'lucide-react';

const tools = [
  {
    title: 'Text Diff Checker',
    description: 'Compare two pieces of text and highlight their differences.',
    href: '/text-diff',
    icon: GitCompareArrows,
    dataAiHint: 'text comparison',
  },
  {
    title: 'Text Summarizer (AI)',
    description: 'Summarize long texts into concise key points using AI.',
    href: '/text-summarizer',
    icon: Newspaper,
    dataAiHint: 'document summary',
  },
  {
    title: 'Case Converter',
    description: 'Convert text between uppercase, lowercase, title case, etc.',
    href: '/case-converter',
    icon: CaseSensitive,
    dataAiHint: 'typography tools',
  },
  {
    title: 'Unit Converter',
    description: 'Convert units for length, weight, temperature, and more.',
    href: '/unit-converter',
    icon: Scale,
    dataAiHint: 'measurement conversion',
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold mb-3">Welcome to ToolboxAI</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your one-stop solution for a variety of utility tools, enhanced with AI capabilities. Select a tool below to get started.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard
            key={tool.title}
            title={tool.title}
            description={tool.description}
            href={tool.href}
            icon={tool.icon}
            dataAiHint={tool.dataAiHint}
          />
        ))}
      </div>
       <section className="mt-16 p-8 bg-card rounded-lg shadow-lg border border-border">
          <div className="flex items-center mb-4">
            <Settings2 className="w-8 h-8 text-primary mr-3" />
            <h2 className="text-2xl font-headline font-semibold">How It Works</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            ToolboxAI provides a suite of easy-to-use utilities. Simply select a tool, input your data, and get instant results.
            Our AI-powered tools, like the Text Summarizer, leverage advanced models to provide intelligent assistance.
          </p>
          <p className="text-muted-foreground">
            We are constantly working on adding new tools and features. Stay tuned!
          </p>
        </section>
    </div>
  );
}
