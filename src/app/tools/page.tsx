
'use client'; // Ensure this is a client component if it uses hooks or event handlers directly
import { ToolCard } from '@/components/ToolCard';
import { QrCode, Link2, Calculator, Scale, Coins, NotebookPen, ListChecks, KeyRound, Braces, Settings2, TextQuote, Columns, Palette, CheckSquare } from 'lucide-react';

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
    href: '/todo-list', 
    icon: ListChecks,
    dataAiHint: 'task management shopping',
  },
  {
    title: 'Classic To-Do List',
    description: 'A simple and classic to-do list to manage your tasks.',
    href: '/classic-todo-list',
    icon: CheckSquare,
    dataAiHint: 'task organization',
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
  {
    title: 'Color Picker',
    description: 'Select colors and get HEX, RGB, HSL values.',
    href: '/color-picker',
    icon: Palette,
    dataAiHint: 'design utility',
  },
];

export default function ToolsDirectoryPage() {
  return (
    <div className="py-8">
      <section className="text-center mb-16">
        <h1 className="text-5xl font-headline font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary/70">
          Explore Your Digital Toolbox
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Discover a comprehensive suite of powerful and easy-to-use utility tools designed to streamline your digital tasks. From developers to everyday users, Toolbox provides the essentials you need in one convenient place.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
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

      <section className="mt-20 p-10 bg-card rounded-xl shadow-2xl border border-border/50">
        <div className="flex flex-col md:flex-row items-center mb-8">
          <Settings2 className="w-16 h-16 text-primary mr-6 mb-4 md:mb-0 animate-spin [animation-duration:10s]" />
          <div>
            <h2 className="text-4xl font-headline font-bold mb-3">Why Choose Toolbox?</h2>
            <p className="text-lg text-muted-foreground">
              Our mission is to provide you with a versatile and reliable set of tools that are both powerful and intuitive.
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 text-muted-foreground text-base">
          <div>
            <h3 className="font-semibold text-xl text-foreground mb-2">All-In-One Convenience</h3>
            <p>Access a diverse range of essential utilities without juggling multiple apps or websites. Everything you need, right at your fingertips.</p>
          </div>
          <div>
            <h3 className="font-semibold text-xl text-foreground mb-2">Intuitive & User-Friendly</h3>
            <p>Each tool is meticulously designed for simplicity and ease of use, ensuring a seamless and productive experience for all users, regardless of technical skill.</p>
          </div>
          <div>
            <h3 className="font-semibold text-xl text-foreground mb-2">Fast & Reliable Performance</h3>
            <p>Built with modern web technologies, Toolbox is optimized for speed and reliability, ensuring your tasks are completed efficiently without unnecessary delays.</p>
          </div>
          <div>
            <h3 className="font-semibold text-xl text-foreground mb-2">Privacy First Approach</h3>
            <p>Most tools operate entirely within your browser, ensuring your data remains private and secure. We are transparent about data handling for any tool that might require it.</p>
          </div>
           <div>
            <h3 className="font-semibold text-xl text-foreground mb-2">Modern & Adaptable Design</h3>
            <p>Enjoy a clean, modern interface with support for both light and dark themes. Our responsive design ensures a great experience across all your devices.</p>
          </div>
          <div>
            <h3 className="font-semibold text-xl text-foreground mb-2">Continuously Improving</h3>
            <p>We are dedicated to enhancing existing tools and introducing new, innovative utilities based on user feedback and emerging needs. Your perfect toolkit, always evolving.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
