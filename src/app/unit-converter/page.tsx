'use client';

import { useState, useEffect, useMemo } from 'react';
import ToolPageLayout from '@/components/ToolPageLayout';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft } from 'lucide-react';
import { unitCategories, getUnitsByCategory, convertUnits, type UnitCategory, type Unit } from '@/lib/unitConverterUtils';

export default function UnitConverterPage() {
  const [selectedCategory, setSelectedCategory] = useState<UnitCategory>(unitCategories[0].id);
  const [availableUnits, setAvailableUnits] = useState<Unit[]>([]);
  
  const [fromUnit, setFromUnit] = useState<string>('');
  const [toUnit, setToUnit] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('1');
  const [outputValue, setOutputValue] = useState<string>('');

  useEffect(() => {
    const units = getUnitsByCategory(selectedCategory);
    setAvailableUnits(units);
    if (units.length >= 2) {
      setFromUnit(units[0].id);
      setToUnit(units[1].id);
    } else if (units.length === 1) {
      setFromUnit(units[0].id);
      setToUnit(units[0].id);
    } else {
      setFromUnit('');
      setToUnit('');
    }
  }, [selectedCategory]);

  useEffect(() => {
    const performConversion = () => {
      const value = parseFloat(inputValue);
      if (!isNaN(value) && fromUnit && toUnit) {
        const result = convertUnits(value, fromUnit, toUnit);
        setOutputValue(result !== null ? result.toString() : 'Error');
      } else if (inputValue === '') {
        setOutputValue('');
      } else {
        setOutputValue('Error');
      }
    };
    performConversion();
  }, [inputValue, fromUnit, toUnit]);

  const handleSwapUnits = () => {
    const currentFrom = fromUnit;
    const currentTo = toUnit;
    setFromUnit(currentTo);
    setToUnit(currentFrom);
    // Optionally, swap input and output values if output is a valid number
    const outputAsNumber = parseFloat(outputValue);
    if (!isNaN(outputAsNumber)) {
      setInputValue(outputValue);
      setOutputValue(inputValue); // this will trigger re-conversion, which is fine
    }
  };
  
  const fromUnitDetails = useMemo(() => availableUnits.find(u => u.id === fromUnit), [availableUnits, fromUnit]);
  const toUnitDetails = useMemo(() => availableUnits.find(u => u.id === toUnit), [availableUnits, toUnit]);

  return (
    <ToolPageLayout title="Unit Converter" description="Convert between different units for length, weight, temperature, and more.">
      <div className="space-y-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-foreground mb-1">Category</label>
          <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as UnitCategory)}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {unitCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
          <div>
            <label htmlFor="fromUnit" className="block text-sm font-medium text-foreground mb-1">From</label>
            <Select value={fromUnit} onValueChange={setFromUnit} disabled={availableUnits.length === 0}>
              <SelectTrigger id="fromUnit">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {availableUnits.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>{unit.name} ({unit.id})</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              className="mt-2"
              aria-label={`Value in ${fromUnitDetails?.pluralName || fromUnitDetails?.name || ''}`}
            />
          </div>

          <Button variant="outline" size="icon" onClick={handleSwapUnits} aria-label="Swap units" className="mb-[1px] md:mb-1 self-end md:self-center h-10 w-10">
            <ArrowRightLeft className="h-5 w-5" />
          </Button>

          <div>
            <label htmlFor="toUnit" className="block text-sm font-medium text-foreground mb-1">To</label>
            <Select value={toUnit} onValueChange={setToUnit} disabled={availableUnits.length === 0}>
              <SelectTrigger id="toUnit">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {availableUnits.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>{unit.name} ({unit.id})</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="text"
              value={outputValue}
              readOnly
              placeholder="Result"
              className="mt-2 bg-muted/30"
              aria-label={`Result in ${toUnitDetails?.pluralName || toUnitDetails?.name || ''}`}
            />
          </div>
        </div>

        {inputValue && fromUnitDetails && toUnitDetails && outputValue && outputValue !== "Error" && (
          <div className="mt-4 p-4 bg-primary/10 text-primary rounded-md text-center">
            <p className="text-lg font-semibold">
              {inputValue} {parseFloat(inputValue) === 1 ? fromUnitDetails.name : (fromUnitDetails.pluralName || fromUnitDetails.name)} = {outputValue} {parseFloat(outputValue) === 1 ? toUnitDetails.name : (toUnitDetails.pluralName || toUnitDetails.name)}
            </p>
          </div>
        )}
         {outputValue === "Error" && inputValue !== "" && (
            <div className="mt-4 p-4 bg-destructive/10 text-destructive-foreground rounded-md text-center">
                <p className="text-lg font-semibold">Invalid input or conversion not possible.</p>
            </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
