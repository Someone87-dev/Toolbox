'use client';

import { useState, type FormEvent } from 'react';
import ToolPageLayout from '@/components/ToolPageLayout';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface DiffLine {
  type: 'common' | 'removed' | 'added' | 'empty';
  text: string;
  lineNumberA?: number;
  lineNumberB?: number;
}

export default function TextDiffPage() {
  const [textA, setTextA] = useState<string>('');
  const [textB, setTextB] = useState<string>('');
  const [diffResult, setDiffResult] = useState<DiffLine[]>([]);

  const handleCompare = (e: FormEvent) => {
    e.preventDefault();
    const linesA = textA.split('\\n');
    const linesB = textB.split('\\n');
    const newDiff: DiffLine[] = [];
    const maxLength = Math.max(linesA.length, linesB.length);

    for (let i = 0; i < maxLength; i++) {
      const lineA = linesA[i];
      const lineB = linesB[i];

      if (lineA !== undefined && lineB !== undefined) {
        if (lineA === lineB) {
          newDiff.push({ type: 'common', text: lineA, lineNumberA: i + 1, lineNumberB: i + 1 });
        } else {
          newDiff.push({ type: 'removed', text: lineA, lineNumberA: i + 1 });
          newDiff.push({ type: 'added', text: lineB, lineNumberB: i + 1 });
        }
      } else if (lineA !== undefined) {
        newDiff.push({ type: 'removed', text: lineA, lineNumberA: i + 1 });
      } else if (lineB !== undefined) {
        newDiff.push({ type: 'added', text: lineB, lineNumberB: i + 1 });
      }
    }
    setDiffResult(newDiff);
  };

  return (
    <ToolPageLayout title="Text Difference Checker" description="Paste two texts below and see their differences highlighted.">
      <form onSubmit={handleCompare} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="textA" className="block text-sm font-medium text-foreground mb-1">Text A</label>
            <Textarea
              id="textA"
              value={textA}
              onChange={(e) => setTextA(e.target.value)}
              placeholder="Paste the first text here..."
              rows={10}
              className="resize-y"
            />
          </div>
          <div>
            <label htmlFor="textB" className="block text-sm font-medium text-foreground mb-1">Text B</label>
            <Textarea
              id="textB"
              value={textB}
              onChange={(e) => setTextB(e.target.value)}
              placeholder="Paste the second text here..."
              rows={10}
              className="resize-y"
            />
          </div>
        </div>
        <Button type="submit" className="w-full sm:w-auto">Compare Texts</Button>
      </form>

      {diffResult.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="font-headline">Comparison Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted/30 rounded-md max-h-[500px] overflow-y-auto font-mono text-sm">
              {diffResult.map((line, index) => (
                <div
                  key={index}
                  className={
                    `flex items-start py-1 px-2 my-0.5 rounded-sm
                    ${line.type === 'common' ? 'bg-transparent' : ''}
                    ${line.type === 'removed' ? 'bg-red-500/20 text-red-700 dark:text-red-400' : ''}
                    ${line.type === 'added' ? 'bg-green-500/20 text-green-700 dark:text-green-400' : ''}`
                  }
                >
                  <span className="w-10 text-right pr-2 opacity-50 select-none">
                    {line.type === 'removed' || line.type === 'common' ? line.lineNumberA : '-'}
                  </span>
                   <span className="w-10 text-right pr-2 opacity-50 select-none">
                    {line.type === 'added' || line.type === 'common' ? line.lineNumberB : '-'}
                  </span>
                  <span className="whitespace-pre-wrap flex-1">
                    {line.type === 'removed' ? '- ' : line.type === 'added' ? '+ ' : '  '}
                    {line.text || <span className="italic opacity-60">[empty line]</span>}
                  </span>
                </div>
              ))}
            </div>
             <div className="mt-4 flex space-x-4 text-sm">
              <div className="flex items-center"><span className="w-3 h-3 bg-red-500/20 rounded-sm mr-2"></span>Removed</div>
              <div className="flex items-center"><span className="w-3 h-3 bg-green-500/20 rounded-sm mr-2"></span>Added</div>
              <div className="flex items-center"><span className="w-3 h-3 bg-transparent border rounded-sm mr-2"></span>Common</div>
            </div>
          </CardContent>
        </Card>
      )}
    </ToolPageLayout>
  );
}
