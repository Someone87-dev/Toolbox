
'use client';

import ToolPageLayout from '@/components/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Basic calculator logic (very simplified)
type Operator = '+' | '-' | '*' | '/';

export default function CalculatorPage() {
  const [display, setDisplay] = useState<string>('0');
  const [currentValue, setCurrentValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);
  const [errorState, setErrorState] = useState<string | null>(null);


  const inputDigit = (digit: string) => {
    setErrorState(null);
    if (display.length > 15 && !waitingForOperand) return; // Limit input length
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    setErrorState(null);
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
    setErrorState(null);
  };

  const performOperation = (nextOperator: Operator) => {
    setErrorState(null);
    const inputValue = parseFloat(display);

    if (currentValue === null) {
      setCurrentValue(display);
    } else if (operator) {
      const current = parseFloat(currentValue);
      if (operator === '/' && inputValue === 0) {
        setErrorState("Error: Division by zero");
        setDisplay('Error');
        setCurrentValue(null);
        setOperator(null);
        setWaitingForOperand(true);
        return;
      }
      const result = calculate(current, inputValue, operator);
      const resultStr = String(parseFloat(result.toPrecision(10))); // Limit precision and remove trailing zeros
      setDisplay(resultStr);
      setCurrentValue(resultStr);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (val1: number, val2: number, op: Operator): number => {
    switch (op) {
      case '+': return val1 + val2;
      case '-': return val1 - val2;
      case '*': return val1 * val2;
      case '/': return val2 === 0 ? Infinity : val1 / val2; 
      default: return val2;
    }
  };

  const handleEquals = () => {
    setErrorState(null);
    const inputValue = parseFloat(display);
    if (currentValue !== null && operator !== null) {
      const current = parseFloat(currentValue);
       if (operator === '/' && inputValue === 0) {
        setErrorState("Error: Division by zero");
        setDisplay('Error');
        setCurrentValue(null);
        setOperator(null);
        setWaitingForOperand(true);
        return;
      }
      const result = calculate(current, inputValue, operator);
      const resultStr = String(parseFloat(result.toPrecision(10)));
      setDisplay(resultStr);
      setCurrentValue(null); 
      setOperator(null);
      setWaitingForOperand(true); 
    }
  };
  
  const buttonLayout = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+'],
  ];

  return (
    <ToolPageLayout title="Calculator" description="Perform calculations with this versatile calculator.">
      <Card className="max-w-xs mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-4">
          <Input
            type="text"
            value={errorState || display}
            readOnly
            className={`text-right text-4xl h-20 mb-3 font-mono ${errorState ? 'text-destructive' : 'text-foreground'} bg-muted/50`}
            aria-label="Calculator display"
            data-testid="calculator-display"
          />
          <div className="grid grid-cols-4 gap-2">
            <Button onClick={clearDisplay} variant="destructive" className="col-span-2 text-lg py-6">C</Button>
            <Button onClick={() => { /* Placeholder for % */ }} variant="outline" className="text-lg py-6" disabled>%</Button>
            <Button onClick={() => { /* Placeholder for ± */ }} variant="outline" className="text-lg py-6" disabled>±</Button>

            {buttonLayout.flat().map((label) => {
              if (label === '=') {
                return <Button key={label} onClick={handleEquals} className="bg-primary hover:bg-primary/90 text-lg py-6">{label}</Button>;
              } else if (['/', '*', '-', '+'].includes(label)) {
                return <Button key={label} onClick={() => performOperation(label as Operator)} variant="secondary" className="text-lg py-6">{label}</Button>;
              } else if (label === '.') {
                return <Button key={label} onClick={inputDecimal} variant="outline" className="text-lg py-6">{label}</Button>;
              } else {
                return <Button key={label} onClick={() => inputDigit(label)} variant="outline" className="text-lg py-6">{label}</Button>;
              }
            })}
          </div>
        </CardContent>
      </Card>
      <Alert className="mt-8">
        <AlertTitle>Developer Note</AlertTitle>
        <AlertDescription>
          This calculator has basic arithmetic operations. "Advanced" features (scientific functions, history, memory) would require significant additional implementation. Error handling for division by zero and input length has been added.
        </AlertDescription>
      </Alert>
    </ToolPageLayout>
  );
}
