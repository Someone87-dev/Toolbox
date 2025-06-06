
'use client';

import { useState, type FormEvent, useEffect } from 'react';
import ToolPageLayout from '@/components/ToolPageLayout';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Diff, Merge, Trash2 } from 'lucide-react';
// Using a simple diff algorithm for line-by-line comparison.
// For more advanced diff, a library like 'diff' (npm install diff) would be better.

interface DiffLine {
  type: 'common' | 'removed' | 'added';
  text: string;
  lineNumberA?: number;
  lineNumberB?: number;
}

// Basic Longest Common Subsequence (LCS) based diff algorithm for lines
function diffLines(textA: string, textB: string): DiffLine[] {
  const linesA = textA.split('\\n');
  const linesB = textB.split('\\n');
  const n = linesA.length;
  const m = linesB.length;
  const dp = Array(n + 1).fill(null).map(() => Array(m + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (linesA[i - 1] === linesB[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const result: DiffLine[] = [];
  let i = n, j = m;
  let lineNumA = n, lineNumB = m;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && linesA[i - 1] === linesB[j - 1]) {
      result.unshift({ type: 'common', text: linesA[i - 1], lineNumberA: lineNumA, lineNumberB: lineNumB });
      i--; j--; lineNumA--; lineNumB--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'added', text: linesB[j - 1], lineNumberB: lineNumB });
      j--; lineNumB--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      result.unshift({ type: 'removed', text: linesA[i - 1], lineNumberA: lineNumA });
      i--; lineNumA--;
    } else {
      // Should not happen with correct LCS logic
      break;
    }
  }
  return result;
}


export default function TextDiffPage() {
  const [textA, setTextA] = useState<string>('');
  const [textB, setTextB] = useState<string>('');
  const [diffResult, setDiffResult] = useState<DiffLine[]>([]);
  const [isCompared, setIsCompared] = useState<boolean>(false);

  const handleCompare = (e?: FormEvent) => {
    e?.preventDefault();
    if (!textA.trim() && !textB.trim()) {
        setDiffResult([]);
        setIsCompared(false);
        return;
    }
    const newDiff = diffLines(textA, textB);
    setDiffResult(newDiff);
    setIsCompared(true);
  };
  
  const handleClear = () => {
    setTextA('');
    setTextB('');
    setDiffResult([]);
    setIsCompared(false);
  }

  // Optional: Auto-compare on text change after initial compare
  // useEffect(() => {
  //   if (isCompared) {
  //     handleCompare();
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [textA, textB, isCompared]);

  return (
    <ToolPageLayout title="Text Difference Checker" description="Paste two texts and see line-by-line differences. Uses a basic LCS algorithm.">
      <form onSubmit={handleCompare} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="textA" className="block text-sm font-medium text-foreground mb-1">Original Text (Text A)</label>
            <Textarea
              id="textA"
              value={textA}
              onChange={(e) => setTextA(e.target.value)}
              placeholder="Paste the first text (original)..."
              rows={10}
              className="resize-y font-mono text-sm shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="textB" className="block text-sm font-medium text-foreground mb-1">Changed Text (Text B)</label>
            <Textarea
              id="textB"
              value={textB}
              onChange={(e) => setTextB(e.target.value)}
              placeholder="Paste the second text (changed)..."
              rows={10}
              className="resize-y font-mono text-sm shadow-sm"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
            <Button type="submit" className="sm:w-auto">
                <Diff className="mr-2 h-4 w-4"/>Compare Texts
            </Button>
            <Button type="button" variant="outline" onClick={handleClear} className="sm:w-auto" disabled={!textA && !textB && diffResult.length === 0}>
                <Trash2 className="mr-2 h-4 w-4"/>Clear All
            </Button>
        </div>
      </form>

      {isCompared && (
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><Merge className="mr-2 h-5 w-5 text-primary"/>Comparison Result</CardTitle>
          </CardHeader>
          <CardContent>
            {diffResult.length === 0 && (textA.trim() || textB.trim()) ? (
                <Alert>
                    <AlertTitle>No Differences Found</AlertTitle>
                    <AlertDescription>The two texts are identical.</AlertDescription>
                </Alert>
            ) : diffResult.length === 0 && (!textA.trim() && !textB.trim()) ? (
                 <Alert variant="default">
                    <AlertTitle>No Input</AlertTitle>
                    <AlertDescription>Please enter text in one or both fields to see a comparison.</AlertDescription>
                </Alert>
            ) : (
              <>
                <div className="p-4 bg-muted/20 rounded-md max-h-[600px] overflow-y-auto font-mono text-xs border">
                  {diffResult.map((line, index) => (
                    <div
                      key={index}
                      className={
                        `flex items-start py-1 my-0.5 rounded-sm
                        ${line.type === 'common' ? '' : ''}
                        ${line.type === 'removed' ? 'bg-red-500/15 ' : ''}
                        ${line.type === 'added' ? 'bg-green-500/15 ' : ''}`
                      }
                    >
                      <span className={`w-10 text-right pr-2 opacity-60 select-none ${line.type === 'added' ? 'text-transparent' : ''}`}>
                        {line.lineNumberA ?? ''}
                      </span>
                      <span className={`w-10 text-right pr-2 opacity-60 select-none ${line.type === 'removed' ? 'text-transparent' : ''}`}>
                        {line.lineNumberB ?? ''}
                      </span>
                      <span className={`whitespace-pre-wrap flex-1 pl-2 border-l 
                        ${line.type === 'removed' ? 'border-red-500/30' : ''}
                        ${line.type === 'added' ? 'border-green-500/30' : ''}
                        ${line.type === 'common' ? 'border-transparent' : ''}
                      `}>
                        {line.type === 'removed' ? <span className="text-red-700 dark:text-red-400">- </span> : line.type === 'added' ? <span className="text-green-700 dark:text-green-400">+ </span> : '  '}
                        {line.text.trim() === '' ? <span className="italic opacity-50">[empty line]</span> : line.text}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex space-x-4 text-sm">
                  <div className="flex items-center"><span className="w-3 h-3 bg-red-500/20 rounded-sm mr-2"></span>Line in Text A only (Removed)</div>
                  <div className="flex items-center"><span className="w-3 h-3 bg-green-500/20 rounded-sm mr-2"></span>Line in Text B only (Added)</div>
                  <div className="flex items-center"><span className="w-3 h-3 bg-transparent border rounded-sm mr-2"></span>Common Line</div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
       <Alert className="mt-8">
        <AlertTitle>How it Works</AlertTitle>
        <AlertDescription>
         This tool performs a line-by-line comparison. It highlights lines present only in Text A (removed), lines present only in Text B (added), and common lines. It uses a standard Longest Common Subsequence (LCS) algorithm. For character-level diffs within lines, more advanced libraries would be needed.
        </AlertDescription>
      </Alert>
    </ToolPageLayout>
  );
}
