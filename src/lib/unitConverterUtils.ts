export type UnitCategory = 'length' | 'weight' | 'temperature';

export interface Unit {
  id: string;
  name: string;
  pluralName?: string; // Optional for more natural display
  category: UnitCategory;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

// Base units: Length -> Meter, Weight -> Kilogram, Temperature -> Celsius
// Note: Temperature conversions are affine, not just multiplicative, handled in toBase/fromBase.

const unitsData: Unit[] = [
  // Length
  { id: 'm', name: 'Meter', pluralName: 'Meters', category: 'length', toBase: v => v, fromBase: v => v },
  { id: 'km', name: 'Kilometer', pluralName: 'Kilometers', category: 'length', toBase: v => v * 1000, fromBase: v => v / 1000 },
  { id: 'cm', name: 'Centimeter', pluralName: 'Centimeters', category: 'length', toBase: v => v / 100, fromBase: v => v * 100 },
  { id: 'mm', name: 'Millimeter', pluralName: 'Millimeters', category: 'length', toBase: v => v / 1000, fromBase: v => v * 1000 },
  { id: 'mi', name: 'Mile', pluralName: 'Miles', category: 'length', toBase: v => v * 1609.34, fromBase: v => v / 1609.34 },
  { id: 'yd', name: 'Yard', pluralName: 'Yards', category: 'length', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
  { id: 'ft', name: 'Foot', pluralName: 'Feet', category: 'length', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
  { id: 'in', name: 'Inch', pluralName: 'Inches', category: 'length', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },

  // Weight
  { id: 'kg', name: 'Kilogram', pluralName: 'Kilograms', category: 'weight', toBase: v => v, fromBase: v => v },
  { id: 'g', name: 'Gram', pluralName: 'Grams', category: 'weight', toBase: v => v / 1000, fromBase: v => v * 1000 },
  { id: 'mg', name: 'Milligram', pluralName: 'Milligrams', category: 'weight', toBase: v => v / 1000000, fromBase: v => v * 1000000 },
  { id: 'lb', name: 'Pound', pluralName: 'Pounds', category: 'weight', toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
  { id: 'oz', name: 'Ounce', pluralName: 'Ounces', category: 'weight', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
  { id: 't', name: 'Metric Ton', pluralName: 'Metric Tons', category: 'weight', toBase: v => v * 1000, fromBase: v => v / 1000 },


  // Temperature (Base: Celsius)
  { id: 'c', name: 'Celsius', category: 'temperature', toBase: v => v, fromBase: v => v },
  { id: 'f', name: 'Fahrenheit', category: 'temperature', toBase: v => (v - 32) * 5 / 9, fromBase: v => (v * 9 / 5) + 32 },
  { id: 'k', name: 'Kelvin', category: 'temperature', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
];

export const unitCategories: { id: UnitCategory; name: string }[] = [
  { id: 'length', name: 'Length' },
  { id: 'weight', name: 'Weight' },
  { id: 'temperature', name: 'Temperature' },
];

export function getUnitsByCategory(category: UnitCategory): Unit[] {
  return unitsData.filter(u => u.category === category);
}

export function convertUnits(value: number, fromUnitId: string, toUnitId: string): number | null {
  const fromUnit = unitsData.find(u => u.id === fromUnitId);
  const toUnit = unitsData.find(u => u.id === toUnitId);

  if (!fromUnit || !toUnit || fromUnit.category !== toUnit.category) {
    return null; // Invalid units or different categories
  }

  if (value === null || isNaN(value)) {
    return null;
  }

  const valueInBaseUnit = fromUnit.toBase(value);
  const result = toUnit.fromBase(valueInBaseUnit);
  
  // Round to a reasonable number of decimal places, e.g., 5
  return parseFloat(result.toFixed(5));
}
