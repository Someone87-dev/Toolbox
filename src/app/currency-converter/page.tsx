
'use client';

import ToolPageLayout from '@/components/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ArrowRightLeft, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const mockCurrencies = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'GBP', name: 'British Pound Sterling' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', name: 'Chinese Yuan Renminbi' },
  { code: 'HKD', name: 'Hong Kong Dollar' },
  { code: 'NZD', name: 'New Zealand Dollar' },
  { code: 'SEK', name: 'Swedish Krona' },
  { code: 'KRW', name: 'South Korean Won' },
  { code: 'SGD', name: 'Singapore Dollar' },
  { code: 'NOK', name: 'Norwegian Krone' },
  { code: 'MXN', name: 'Mexican Peso' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'RUB', name: 'Russian Ruble' },
  { code: 'ZAR', name: 'South African Rand' },
  { code: 'BRL', name: 'Brazilian Real' },
  { code: 'TRY', name: 'Turkish Lira' },
];

// Mock exchange rates relative to USD (Updated with more currencies)
const mockRates: Record<string, number> = {
  USD: 1,
  EUR: 0.92,    // 1 USD = 0.92 EUR
  JPY: 157.50,  // 1 USD = 157.50 JPY
  GBP: 0.79,    // 1 USD = 0.79 GBP
  AUD: 1.50,    // 1 USD = 1.50 AUD
  CAD: 1.37,    // 1 USD = 1.37 CAD
  CHF: 0.90,    // 1 USD = 0.90 CHF
  CNY: 7.25,    // 1 USD = 7.25 CNY
  HKD: 7.81,    // 1 USD = 7.81 HKD
  NZD: 1.63,    // 1 USD = 1.63 NZD
  SEK: 10.45,   // 1 USD = 10.45 SEK
  KRW: 1370.00, // 1 USD = 1370.00 KRW
  SGD: 1.35,    // 1 USD = 1.35 SGD
  NOK: 10.55,   // 1 USD = 10.55 NOK
  MXN: 18.20,   // 1 USD = 18.20 MXN
  INR: 83.50,   // 1 USD = 83.50 INR
  RUB: 90.00,   // 1 USD = 90.00 RUB (highly volatile)
  ZAR: 18.80,   // 1 USD = 18.80 ZAR
  BRL: 5.35,    // 1 USD = 5.35 BRL
  TRY: 32.50,   // 1 USD = 32.50 TRY (highly volatile)
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
      
      setTimeout(() => {
        const value = parseFloat(amount);
        if (isNaN(value) || value < 0) {
          setConvertedAmount(null);
          toast({ title: 'Invalid Input', description: 'Please enter a valid positive amount.', variant: 'destructive'});
          setIsLoading(false);
          return;
        }

        const rateFrom = mockRates[fromCurrency];
        const rateTo = mockRates[toCurrency];

        if (rateFrom && rateTo) {
          const amountInUsd = value / rateFrom;
          const result = amountInUsd * rateTo;
          setConvertedAmount(result.toFixed(2)); // Display with 2 decimal places
        } else {
          setConvertedAmount(null);
          toast({ title: 'Error', description: 'Exchange rate not available for selected currencies.', variant: 'destructive' });
        }
        setIsLoading(false);
      }, 700); // Simulate network delay
    };

    // Debounce conversion on amount change
    const debounceTimeout = setTimeout(convert, 300);
    return () => clearTimeout(debounceTimeout);

  }, [amount, fromCurrency, toCurrency, toast]);

  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    // The useEffect will automatically trigger re-conversion
  };

  return (
    <ToolPageLayout title="Currency Converter" description="Convert between various currencies with (mock) real-time rates.">
      <Card className="max-w-lg mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Convert Currency</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-foreground mb-1">Amount</label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="0"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
            <div>
              <label htmlFor="fromCurrency" className="block text-sm font-medium text-foreground mb-1">From</label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger id="fromCurrency" aria-label="Select currency to convert from">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {mockCurrencies.map(c => <SelectItem key={c.code} value={c.code}>{c.name} ({c.code})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" size="icon" onClick={handleSwapCurrencies} aria-label="Swap currencies" className="mt-5 md:mt-0 self-center md:self-end h-10 w-10">
              <ArrowRightLeft className="h-5 w-5" />
            </Button>

            <div>
              <label htmlFor="toCurrency" className="block text-sm font-medium text-foreground mb-1">To</label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger id="toCurrency" aria-label="Select currency to convert to">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {mockCurrencies.map(c => <SelectItem key={c.code} value={c.code}>{c.name} ({c.code})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading && (
            <div className="text-center text-muted-foreground flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> Converting...
            </div>
          )}
          {!isLoading && convertedAmount !== null && (
            <div className="mt-4 p-6 bg-primary/10 text-primary rounded-md text-center">
              <p className="text-sm text-primary/80 mb-1">{amount} {fromCurrency} equals</p>
              <p className="text-3xl font-semibold">
                {convertedAmount} <span className="text-2xl">{toCurrency}</span>
              </p>
            </div>
          )}
          {!isLoading && convertedAmount === null && amount && parseFloat(amount) >= 0 && (
             <div className="mt-4 p-6 bg-muted/20 text-muted-foreground rounded-md text-center">
              <p className="text-lg">Enter a valid amount to see conversion.</p>
            </div>
          )}
        </CardContent>
      </Card>
       <Alert className="mt-8">
        <AlertTitle>Developer Note</AlertTitle>
        <AlertDescription>
          This Currency Converter uses MOCK data for currencies and exchange rates. A real application would integrate with a live currency data API (e.g., from exchangerate-api.com, Fixer.io, etc.) for up-to-date rates.
        </AlertDescription>
      </Alert>
    </ToolPageLayout>
  );
}
