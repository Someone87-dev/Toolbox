import { ToolCard } from '@/components/ToolCard';
import { QrCode, Link2, Calculator, Scale, Coins, NotebookPen, ListChecks, KeyRound, Braces, Settings2, TextQuote, Columns, Palette } from 'lucide-react';

const tools = [
  {
    title: 'QR Code Generator & Reader',
    description: 'Generate QR codes and read them from files or your camera.',
    href: '/qr-code',
    icon: QrCode,
    dataAiHint: 'qr utility',
  },
  {
    title: 'URL Shortener',
    description: 'Create short, manageable links from long URLs (mock service).',
    href: '/url-shortener',
    icon: Link2,
    dataAiHint: 'link management',
  },
  {
    title: 'Calculator',
    description: 'Perform calculations with this versatile calculator.',
    href: '/calculator',
    icon: Calculator,
    dataAiHint: 'math computation',
  },
  {
    title: 'Unit Converter',
    description: 'Convert units for length, weight, temperature, volume, and area.',
    href: '/unit-converter',
    icon: Scale,
    dataAiHint: 'measurement conversion',
  },
  {
    title: 'Currency Converter',
    description: 'Convert currencies with (mock) real-time exchange rates.',
    href: '/currency-converter',
    icon: Coins,
    dataAiHint: 'finance exchange',
  },
  {
    title: 'Quick Notes',
    description: 'Jot down and save quick notes or snippets of text locally.',
    href: '/quick-notes',
    icon: NotebookPen,
    dataAiHint: 'text editor',
  },
  {
    title: 'Grocery List',
    description: 'Manage your shopping list with items, quantities, and prices.',
    href: '/todo-list', // Path remains /todo-list, content will change
    icon: ListChecks,
    dataAiHint: 'task management shopping',
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
  {
    title: 'Case Converter',
    description: 'Convert text between UPPERCASE, lowercase, Title Case, etc.',
    href: '/case-converter',
    icon: TextQuote,
    dataAiHint: 'text utility',
  },
  {
    title: 'Text Difference Checker',
    description: 'Compare two texts and highlight their differences.',
    href: '/text-diff',
    icon: Columns,
    dataAiHint: 'text comparison',
  },
  // Example of a new tool - can be expanded later
  // {
  //   title: 'Color Picker',
  //   description: 'Select and preview colors, get HEX, RGB, HSL values.',
  //   href: '/color-picker', // Would need a new page
  //   icon: Palette,
  //   dataAiHint: 'design utility',
  // },
];

export default function HomePage() {
  return (
    <div>
      <section className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold mb-3">Welcome to Your Digital Toolbox</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          A comprehensive suite of utility tools designed to simplify your daily tasks. Fast, reliable, and easy to use.
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

      <section className="mt-16 p-8 bg-card rounded-lg shadow-xl border border-border">
        <div className="flex items-center mb-6">
          <Settings2 className="w-10 h-10 text-primary mr-4" />
          <h2 className="text-3xl font-headline font-semibold">Why Toolbox?</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6 text-muted-foreground">
          <div>
            <h3 className="font-semibold text-lg text-foreground mb-2">Streamlined Efficiency</h3>
            <p>Access a wide range of common utilities in one place, saving you time and effort from switching between different apps or websites.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground mb-2">User-Friendly Design</h3>
            <p>Each tool is crafted with simplicity and ease-of-use in mind, ensuring a smooth experience even for complex tasks.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground mb-2">Privacy Focused</h3>
            <p>Many tools operate entirely within your browser, meaning your data stays with you. For tools requiring interaction, we're transparent about how data is handled.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground mb-2">Constantly Evolving</h3>
            <p>We're committed to improving existing tools and adding new ones based on user needs and technological advancements.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
