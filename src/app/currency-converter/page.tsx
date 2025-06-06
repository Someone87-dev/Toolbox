'use client';

import ToolPageLayout from '@/components/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ArrowRightLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Mock currency data and rates
const mockCurrencies = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'CAD', name: 'Canadian Dollar' },
];

// Mock exchange rates relative to USD
const mockRates: Record<string, number> = {
  USD: 1,
  EUR: 0.92, // 1 USD = 0.92 EUR
  JPY: 157.0, // 1 USD = 157 JPY
  GBP: 0.79, // 1 USD = 0.79 GBP
  CAD: 1.37, // 1 USD = 1.37 CAD
};

export default function CurrencyConverterPage() {
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [convertedAmount, setConvertedAmount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const convert = () => {
      if (!amount || !fromCurrency || !toCurrency) {
        setConvertedAmount(null);
        return;
      }
      setIsLoading(true);
      
      // Simulate API call for rates
      // In a real app, fetch from a reliable API like exchangerate-api.com, openexchangerates.org etc.
      setTimeout(() => {
        const value = parseFloat(amount);
        if (isNaN(value)) {
          setConvertedAmount('Invalid Amount');
          setIsLoading(false);
          return;
        }

        const rateFrom = mockRates[fromCurrency];
        const rateTo = mockRates[toCurrency];

        if (rateFrom && rateTo) {
          const amountInUsd = value / rateFrom;
          const result = amountInUsd * rateTo;
          setConvertedAmount(result.toFixed(2));
        } else {
          setConvertedAmount('Rate unavailable');
          toast({ title: 'Error', description: 'Exchange rate not available for selected currencies.', variant: 'destructive' });
        }
        setIsLoading(false);
      }, 500); // Simulate network delay
    };

    convert();
  }, [amount, fromCurrency, toCurrency, toast]);

  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  return (
    <ToolPageLayout title="Currency Converter" description="Convert between different currencies with (mock) real-time rates.">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Convert Currency</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-foreground mb-1">Amount</label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
            <div>
              <label htmlFor="fromCurrency" className="block text-sm font-medium text-foreground mb-1">From</label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger id="fromCurrency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {mockCurrencies.map(c => <SelectItem key={c.code} value={c.code}>{c.name} ({c.code})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" size="icon" onClick={handleSwapCurrencies} aria-label="Swap currencies" className="mt-5 md:mt-0 self-center md:self-end">
              <ArrowRightLeft className="h-5 w-5" />
            </Button>

            <div>
              <label htmlFor="toCurrency" className="block text-sm font-medium text-foreground mb-1">To</label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger id="toCurrency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {mockCurrencies.map(c => <SelectItem key={c.code} value={c.code}>{c.name} ({c.code})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading && <p className="text-center text-muted-foreground">Converting...</p>}
          {convertedAmount !== null && !isLoading && (
            <div className="mt-4 p-4 bg-primary/10 text-primary rounded-md text-center">
              <p className="text-2xl font-semibold">
                {amount} {fromCurrency} = {convertedAmount} {toCurrency}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
       <Alert className="mt-8">
        <AlertTitle>Developer Note</AlertTitle>
        <AlertDescription>
          This Currency Converter uses MOCK data for currencies and exchange rates. A real application would integrate with a live currency data API.
        </AlertDescription>
      </Alert>
    </ToolPageLayout>
  );
}
