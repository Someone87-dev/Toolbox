'use client';

import ToolPageLayout from '@/components/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Copy, Check, FormInput, Trash2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function JsonFormatterPage() {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [formattedJson, setFormattedJson] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleFormat = () => {
    if (!jsonInput.trim()) {
      setError('Input is empty.');
      setFormattedJson('');
      return;
    }
    try {
      const parsedJson = JSON.parse(jsonInput);
      const prettyJson = JSON.stringify(parsedJson, null, 2); // 2 spaces for indentation
      setFormattedJson(prettyJson);
      setError(null);
      toast({ title: 'JSON Formatted', description: 'Your JSON has been successfully formatted.' });
    } catch (e: any) {
      setError(`Invalid JSON: ${e.message}`);
      setFormattedJson('');
      toast({ title: 'Formatting Error', description: 'Could not parse or format the JSON.', variant: 'destructive' });
    }
  };

  const handleClear = () => {
    setJsonInput('');
    setFormattedJson('');
    setError(null);
    setCopied(false);
  };

  const handleCopyToClipboard = () => {
    if (formattedJson) {
      navigator.clipboard.writeText(formattedJson).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <ToolPageLayout title="JSON Formatter & Validator" description="Paste your JSON data to format, beautify, and validate it.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[500px]">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Input JSON</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col">
            <Textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='Paste your JSON here... e.g., {"name": "Toolbox", "version": 1}'
              className="flex-grow resize-y min-h-[300px] font-mono text-sm"
              aria-label="JSON Input"
            />
             {error && <p className="mt-2 text-sm text-destructive bg-destructive/10 p-2 rounded-md">{error}</p>}
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Formatted JSON</CardTitle>
            {formattedJson && (
              <Button variant="ghost" size="sm" onClick={handleCopyToClipboard} aria-label="Copy formatted JSON">
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                <span className="ml-2 sr-only">{copied ? 'Copied!' : 'Copy'}</span>
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex-grow flex flex-col">
            <Textarea
              value={formattedJson}
              readOnly
              placeholder="Formatted JSON will appear here..."
              className="flex-grow resize-y min-h-[300px] bg-muted/30 font-mono text-sm"
              aria-label="Formatted JSON Output"
            />
          </CardContent>
        </Card>
      </div>
      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        <Button onClick={handleFormat}><FormInput className="mr-2 h-4 w-4"/>Format / Validate</Button>
        <Button variant="outline" onClick={handleClear}><Trash2 className="mr-2 h-4 w-4" />Clear</Button>
      </div>
      <Alert className="mt-8">
        <AlertTitle>Usage Note</AlertTitle>
        <AlertDescription>
          This tool uses standard JSON parsing and stringification. It helps in making JSON data more readable and verifying its structure.
        </AlertDescription>
      </Alert>
    </ToolPageLayout>
  );
}
