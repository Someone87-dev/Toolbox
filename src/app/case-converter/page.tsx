'use client';

import { useState, useEffect } from 'react';
import ToolPageLayout from '@/components/ToolPageLayout';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { convertCase, type CaseType } from '@/lib/caseConverterUtils';
import { ClipboardCopy, Check } from 'lucide-react';

const caseTypes: { id: CaseType; label: string }[] = [
  { id: 'uppercase', label: 'UPPERCASE' },
  { id: 'lowercase', label: 'lowercase' },
  { id: 'titlecase', label: 'Title Case' },
  { id: 'sentencecase', label: 'Sentence case' },
];

export default function CaseConverterPage() {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleConvert = (caseType: CaseType) => {
    const converted = convertCase(inputText, caseType);
    setOutputText(converted);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(outputText).then(() => {
      setCopied(true);
    });
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);
  
  useEffect(() => {
    // Auto-update output if a default conversion is desired or to clear output when input is empty
    if (inputText === '') {
      setOutputText('');
    }
    // Or, if you want to auto-convert to a default case as user types:
    // else { handleConvert('sentencecase'); // for example }
  }, [inputText]);


  return (
    <ToolPageLayout title="Case Converter" description="Convert your text into various case formats like UPPERCASE, lowercase, Title Case, and Sentence case.">
      <div className="space-y-6">
        <div>
          <label htmlFor="inputText" className="block text-sm font-medium text-foreground mb-1">Input Text</label>
          <Textarea
            id="inputText"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste your text here..."
            rows={8}
            className="resize-y"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {caseTypes.map((ct) => (
            <Button key={ct.id} onClick={() => handleConvert(ct.id)} variant="secondary">
              {ct.label}
            </Button>
          ))}
        </div>

        {outputText && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-headline text-lg">Converted Text</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleCopyToClipboard} aria-label="Copy to clipboard">
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <ClipboardCopy className="h-4 w-4" />}
                <span className="ml-2">{copied ? 'Copied!' : 'Copy'}</span>
              </Button>
            </CardHeader>
            <CardContent>
              <Textarea
                id="outputText"
                value={outputText}
                readOnly
                rows={8}
                className="resize-y bg-muted/30"
                aria-label="Converted text"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </ToolPageLayout>
  );
}
