
'use client';

import ToolPageLayout from '@/components/ToolPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, ChangeEvent } from 'react';
import { Palette, Copy, Check } from 'lucide-react';

// Color conversion functions
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s: number, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}


export default function ColorPickerPage() {
  const [selectedColor, setSelectedColor] = useState<string>('#B19CD9'); // Default to primary theme color
  const [rgbValue, setRgbValue] = useState<string>('');
  const [hslValue, setHslValue] = useState<string>('');
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const rgb = hexToRgb(selectedColor);
    if (rgb) {
      setRgbValue(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setHslValue(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
    }
  }, [selectedColor]);

  const handleColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(event.target.value);
  };

  const handleCopyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedValue(type);
      toast({ title: 'Copied!', description: `${type} value copied to clipboard.` });
      setTimeout(() => setCopiedValue(null), 2000);
    });
  };
  
  const ColorValueDisplay: React.FC<{ label: string; value: string; type: string }> = ({ label, value, type }) => (
    <div className="mb-3">
      <Label htmlFor={`color-${type.toLowerCase()}`} className="text-sm font-medium">{label}</Label>
      <div className="flex items-center gap-2 mt-1">
        <Input id={`color-${type.toLowerCase()}`} type="text" value={value} readOnly className="bg-muted/30 text-sm" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleCopyToClipboard(value, type)}
          aria-label={`Copy ${type} value`}
        >
          {copiedValue === type ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );


  return (
    <ToolPageLayout title="Color Picker & Converter" description="Select a color to see its HEX, RGB, and HSL representations.">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <Card className="flex flex-col items-center justify-center p-6">
          <Label htmlFor="colorPickerInput" className="mb-3 text-lg font-semibold">Choose a Color</Label>
          <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-lg border-4 border-card" style={{ backgroundColor: selectedColor }}>
            <Input
              id="colorPickerInput"
              type="color"
              value={selectedColor}
              onChange={handleColorChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Color picker input"
            />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Click the circle to change color</p>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Palette className="mr-2 h-5 w-5 text-primary" />Color Values</CardTitle>
          </CardHeader>
          <CardContent>
            <ColorValueDisplay label="HEX" value={selectedColor.toUpperCase()} type="HEX" />
            <ColorValueDisplay label="RGB" value={rgbValue} type="RGB" />
            <ColorValueDisplay label="HSL" value={hslValue} type="HSL" />
          </CardContent>
        </Card>
      </div>
    </ToolPageLayout>
  );
}

