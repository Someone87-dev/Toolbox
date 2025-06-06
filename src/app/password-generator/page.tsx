'use client';

import ToolPageLayout from '@/components/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Copy, Check as CheckIcon, RefreshCw } from 'lucide-react'; // Renamed Check to CheckIcon
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState<string>('');
  const [length, setLength] = useState<number>(16);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generatePassword = () => {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let charPool = '';
    if (includeUppercase) charPool += uppercaseChars;
    if (includeLowercase) charPool += lowercaseChars;
    if (includeNumbers) charPool += numberChars;
    if (includeSymbols) charPool += symbolChars;

    if (charPool === '') {
      toast({ title: 'Error', description: 'Please select at least one character type.', variant: 'destructive' });
      setPassword('');
      return;
    }
    
    if (length < 4) {
        toast({ title: 'Warning', description: 'Password length is too short for strong security.', variant: 'default' });
    }


    let newPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charPool.length);
      newPassword += charPool[randomIndex];
    }
    setPassword(newPassword);
    setCopied(false); // Reset copied state when new password is generated
  };
  
  useEffect(() => {
    generatePassword();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]); // Regenerate when options change


  const handleCopyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password).then(() => {
        setCopied(true);
        toast({ title: 'Copied!', description: 'Password copied to clipboard.'});
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <ToolPageLayout title="Password Generator" description="Create strong, random passwords tailored to your security needs.">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Generate a Secure Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <Input
              type="text"
              value={password}
              readOnly
              placeholder="Your generated password"
              className="pr-20 text-lg h-12"
              aria-label="Generated password"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <Button variant="ghost" size="icon" onClick={generatePassword} aria-label="Regenerate password" className="mr-1">
                <RefreshCw className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleCopyToClipboard} disabled={!password} aria-label="Copy password">
                {copied ? <CheckIcon className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="length" className="flex justify-between">
              <span>Password Length:</span>
              <span>{length}</span>
            </Label>
            <Slider
              id="length"
              min={4}
              max={64}
              step={1}
              value={[length]}
              onValueChange={(value) => setLength(value[0])}
              aria-label={`Password length ${length}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="uppercase" checked={includeUppercase} onCheckedChange={(checked) => setIncludeUppercase(Boolean(checked))} />
              <Label htmlFor="uppercase" className="cursor-pointer">Include Uppercase (A-Z)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="lowercase" checked={includeLowercase} onCheckedChange={(checked) => setIncludeLowercase(Boolean(checked))} />
              <Label htmlFor="lowercase" className="cursor-pointer">Include Lowercase (a-z)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="numbers" checked={includeNumbers} onCheckedChange={(checked) => setIncludeNumbers(Boolean(checked))} />
              <Label htmlFor="numbers" className="cursor-pointer">Include Numbers (0-9)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="symbols" checked={includeSymbols} onCheckedChange={(checked) => setIncludeSymbols(Boolean(checked))} />
              <Label htmlFor="symbols" className="cursor-pointer">Include Symbols (!@#...)</Label>
            </div>
          </div>
          <Button onClick={generatePassword} className="w-full">
            Generate New Password
          </Button>
        </CardContent>
      </Card>
      <Alert className="mt-8">
        <AlertTitle>Security Note</AlertTitle>
        <AlertDescription>
         This password generator runs entirely in your browser. No passwords are sent to any server. For maximum security, use a combination of character types and sufficient length.
        </AlertDescription>
      </Alert>
    </ToolPageLayout>
  );
}
