import { ToolCard } from '@/components/ToolCard';
import { QrCode, Link2, Calculator, Scale, Coins, NotebookPen, ListChecks, KeyRound, Braces, Settings2 } from 'lucide-react';

const tools = [
  {
    title: 'QR Code Generator & Reader',
    description: 'Easily generate and read QR codes for various purposes.',
    href: '/qr-code',
    icon: QrCode,
    dataAiHint: 'qr utility',
  },
  {
    title: 'URL Shortener',
    description: 'Create short, manageable links from long URLs.',
    href: '/url-shortener',
    icon: Link2,
    dataAiHint: 'link management',
  },
  {
    title: 'Advanced Calculator',
    description: 'Perform complex calculations with an advanced interface.',
    href: '/calculator',
    icon: Calculator,
    dataAiHint: 'math computation',
  },
  {
    title: 'Unit Converter',
    description: 'Convert units for length, weight, temperature, and more.',
    href: '/unit-converter',
    icon: Scale,
    dataAiHint: 'measurement conversion',
  },
  {
    title: 'Currency Converter',
    description: 'Get real-time exchange rates and convert currencies.',
    href: '/currency-converter',
    icon: Coins,
    dataAiHint: 'finance exchange',
  },
  {
    title: 'Quick Notes',
    description: 'Jot down and save quick notes or snippets of text.',
    href: '/quick-notes',
    icon: NotebookPen,
    dataAiHint: 'text editor',
  },
  {
    title: 'To-Do List',
    description: 'Organize your tasks with a simple and effective to-do list.',
    href: '/todo-list',
    icon: ListChecks,
    dataAiHint: 'task management',
  },
  {
    title: 'Password Generator',
    description: 'Create strong, random passwords for your accounts.',
    href: '/password-generator',
    icon: KeyRound,
    dataAiHint: 'security utility',
  },
  {
    title: 'JSON Formatter',
    description: 'Format, validate, and beautify JSON data.',
    href: '/json-formatter',
    icon: Braces,
    dataAiHint: 'developer tools',
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold mb-3">Welcome to Toolbox</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your one-stop solution for a variety of utility tools. Select a tool below to get started.
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
            Toolbox provides a suite of easy-to-use utilities. Simply select a tool, input your data or use its features, and get instant results.
          </p>
          <p className="text-muted-foreground">
            We are constantly working on adding new tools and features. Stay tuned!
          </p>
        </section>
    </div>
  );
}
