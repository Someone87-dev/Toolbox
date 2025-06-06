'use client';

import ToolPageLayout from '@/components/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Copy, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function UrlShortenerPage() {
  const [longUrl, setLongUrl] = useState<string>('');
  const [shortUrl, setShortUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!longUrl) {
      toast({ title: 'Error', description: 'Please enter a URL to shorten.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    setShortUrl(''); // Reset previous short URL

    // Placeholder: In a real app, you'd call your URL shortening backend service here.
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Example response
    const exampleShortId = Math.random().toString(36).substring(2, 8);
    setShortUrl(`https://example.short/${exampleShortId}`); 
    
    toast({ title: 'Success', description: 'URL shortened successfully (mock).' });
    setIsLoading(false);
  };

  const handleCopyToClipboard = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <ToolPageLayout title="URL Shortener" description="Enter a long URL to create a shortened version.">
      <Card>
        <CardHeader>
          <CardTitle>Shorten Your URL</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="longUrl" className="block text-sm font-medium text-foreground mb-1">
                Long URL
              </label>
              <Input
                id="longUrl"
                type="url"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                placeholder="https://example.com/very/long/url/to/shorten"
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Shortening...' : 'Shorten URL'}
            </Button>
          </form>

          {shortUrl && (
            <div className="mt-6 p-4 border rounded-md bg-muted/50">
              <p className="text-sm font-medium text-foreground">Shortened URL:</p>
              <div className="flex items-center justify-between mt-1">
                <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                  {shortUrl}
                </a>
                <Button variant="ghost" size="sm" onClick={handleCopyToClipboard} aria-label="Copy to clipboard">
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  <span className="ml-2 sr-only">{copied ? 'Copied!' : 'Copy'}</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <Alert className="mt-8">
        <AlertTitle>Developer Note</AlertTitle>
        <AlertDescription>
          This URL Shortener is a placeholder. It simulates an API call. A real implementation would require a backend service to store and manage URLs.
        </AlertDescription>
      </Alert>
    </ToolPageLayout>
  );
}
