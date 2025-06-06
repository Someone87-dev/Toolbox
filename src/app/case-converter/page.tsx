
'use client';

import { useState, useEffect } from 'react';
import ToolPageLayout from '@/components/ToolPageLayout';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { convertCase, type CaseType } from '@/lib/caseConverterUtils';
import { ClipboardCopy, Check, TextQuote, Trash2 } from 'lucide-react';

const caseTypes: { id: CaseType; label: string; description: string }[] = [
  { id: 'uppercase', label: 'UPPERCASE', description: 'Converts all letters to uppercase.' },
  { id: 'lowercase', label: 'lowercase', description: 'Converts all letters to lowercase.' },
  { id: 'titlecase', label: 'Title Case', description: 'Capitalizes the first letter of each word.' },
  { id: 'sentencecase', label: 'Sentence case', description: 'Capitalizes the first letter of each sentence.' },
  { id: 'pascalcase', label: 'PascalCase', description: 'Joins words, capitalizing each word.' },
  { id: 'camelcase', label: 'camelCase', description: 'Joins words, capitalizing each word except the first.' },
  { id: 'snakecase', label: 'snake_case', description: 'Joins words with underscores, all lowercase.' },
  { id: 'kebabcase', label: 'kebab-case', description: 'Joins words with hyphens, all lowercase.' },
];

export default function CaseConverterPage() {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [activeCase, setActiveCase] = useState<CaseType | null>(null);


  const handleConvert = (caseType: CaseType) => {
    const converted = convertCase(inputText, caseType);
    setOutputText(converted);
    setActiveCase(caseType);
  };

  const handleCopyToClipboard = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText).then(() => {
      setCopied(true);
    });
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setActiveCase(null);
  }

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);
  
  useEffect(() => {
    if (inputText === '') {
      setOutputText('');
      setActiveCase(null);
    } else if (activeCase) {
      // Re-apply active conversion if input text changes
      handleConvert(activeCase);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputText]);


  return (
    <ToolPageLayout title="Advanced Case Converter" description="Convert text to various case formats including programming styles like PascalCase, camelCase, snake_case, and kebab-case.">
      <div className="space-y-6">
        <div>
          <label htmlFor="inputText" className="block text-sm font-medium text-foreground mb-1">Input Text</label>
          <Textarea
            id="inputText"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste your text here..."
            rows={6}
            className="resize-y shadow-sm"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><TextQuote className="mr-2 h-5 w-5 text-primary"/>Conversion Options</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {caseTypes.map((ct) => (
              <Button 
                key={ct.id} 
                onClick={() => handleConvert(ct.id)} 
                variant={activeCase === ct.id ? "default" : "secondary"}
                className="w-full justify-start text-left h-auto py-2 px-3"
                title={ct.description}
              >
                {ct.label}
              </Button>
            ))}
          </CardContent>
        </Card>

        {outputText && (
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-headline text-lg">Converted Text</CardTitle>
              <div className="flex gap-2">
                 <Button variant="ghost" size="sm" onClick={handleCopyToClipboard} aria-label="Copy to clipboard">
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <ClipboardCopy className="h-4 w-4" />}
                    <span className="ml-2">{copied ? 'Copied!' : 'Copy'}</span>
                  </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                id="outputText"
                value={outputText}
                readOnly
                rows={6}
                className="resize-y bg-muted/30 shadow-inner"
                aria-label="Converted text"
              />
            </CardContent>
          </Card>
        )}
         <div className="flex justify-end">
            <Button variant="outline" onClick={handleClear} disabled={!inputText && !outputText}>
              <Trash2 className="mr-2 h-4 w-4"/> Clear All
            </Button>
          </div>
      </div>
    </ToolPageLayout>
  );
}
