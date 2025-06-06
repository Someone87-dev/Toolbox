'use client';

import ToolPageLayout from '@/components/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Basic calculator logic (very simplified)
type Operator = '+' | '-' | '*' | '/';

export default function AdvancedCalculatorPage() {
  const [display, setDisplay] = useState<string>('0');
  const [currentValue, setCurrentValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clearDisplay = () => {
    setDisplay('0');
    setCurrentValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperator: Operator) => {
    const inputValue = parseFloat(display);

    if (currentValue === null) {
      setCurrentValue(display);
    } else if (operator) {
      const result = calculate(parseFloat(currentValue), inputValue, operator);
      setDisplay(String(parseFloat(result.toFixed(7)))); // Limit precision
      setCurrentValue(String(result));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (val1: number, val2: number, op: Operator): number => {
    switch (op) {
      case '+': return val1 + val2;
      case '-': return val1 - val2;
      case '*': return val1 * val2;
      case '/': return val2 === 0 ? Infinity : val1 / val2; // Handle division by zero
      default: return val2;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);
    if (currentValue !== null && operator !== null) {
      const result = calculate(parseFloat(currentValue), inputValue, operator);
      setDisplay(String(parseFloat(result.toFixed(7))));
      setCurrentValue(null); // Or set to result for chain calculations
      setOperator(null);
      setWaitingForOperand(true); // Ready for new input
    }
  };
  
  const buttonLayout = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+'],
  ];

  return (
    <ToolPageLayout title="Advanced Calculator" description="Perform calculations with this versatile calculator. (Basic functionality implemented)">
      <Card className="max-w-sm mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            value={display}
            readOnly
            className="text-right text-3xl h-16 mb-4 bg-muted"
            aria-label="Calculator display"
          />
          <div className="grid grid-cols-4 gap-2">
            <Button onClick={clearDisplay} variant="destructive" className="col-span-2">C</Button>
            {/* Placeholder for more advanced buttons like %, ± */}
            <Button onClick={() => { /* Placeholder for % */ }} variant="outline" disabled>%</Button>
            <Button onClick={() => { /* Placeholder for ± */ }} variant="outline" disabled>±</Button>

            {buttonLayout.flat().map((label) => {
              if (label === '=') {
                return <Button key={label} onClick={handleEquals} className="bg-primary hover:bg-primary/90">{label}</Button>;
              } else if (['/', '*', '-', '+'].includes(label)) {
                return <Button key={label} onClick={() => performOperation(label as Operator)} variant="secondary">{label}</Button>;
              } else if (label === '.') {
                return <Button key={label} onClick={inputDecimal} variant="outline">{label}</Button>;
              } else {
                return <Button key={label} onClick={() => inputDigit(label)} variant="outline">{label}</Button>;
              }
            })}
          </div>
        </CardContent>
      </Card>
      <Alert className="mt-8">
        <AlertTitle>Developer Note</AlertTitle>
        <AlertDescription>
          This calculator has basic arithmetic operations. "Advanced" features (scientific functions, history, memory) would require significant additional implementation. Error handling is basic.
        </AlertDescription>
      </Alert>
    </ToolPageLayout>
  );
}
