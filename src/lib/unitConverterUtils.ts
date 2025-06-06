
export type UnitCategory = 'length' | 'weight' | 'temperature' | 'volume' | 'area';

export interface Unit {
  id: string;
  name: string;
  pluralName?: string; 
  category: UnitCategory;
  toBase: (value: number) => number; // Converts value to the category's base unit
  fromBase: (value: number) => number; // Converts value from the category's base unit
}

// Base units:
// Length -> Meter (m)
// Weight -> Kilogram (kg)
// Temperature -> Celsius (c)
// Volume -> Liter (l)
// Area -> Square Meter (sqm)

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
  { id: 'nm', name: 'Nautical Mile', pluralName: 'Nautical Miles', category: 'length', toBase: v => v * 1852, fromBase: v => v / 1852 },

  // Weight
  { id: 'kg', name: 'Kilogram', pluralName: 'Kilograms', category: 'weight', toBase: v => v, fromBase: v => v },
  { id: 'g', name: 'Gram', pluralName: 'Grams', category: 'weight', toBase: v => v / 1000, fromBase: v => v * 1000 },
  { id: 'mg', name: 'Milligram', pluralName: 'Milligrams', category: 'weight', toBase: v => v / 1000000, fromBase: v => v * 1000000 },
  { id: 'lb', name: 'Pound', pluralName: 'Pounds', category: 'weight', toBase: v => v * 0.45359237, fromBase: v => v / 0.45359237 },
  { id: 'oz', name: 'Ounce', pluralName: 'Ounces', category: 'weight', toBase: v => v * 0.0283495231, fromBase: v => v / 0.0283495231 },
  { id: 'st', name: 'Stone', pluralName: 'Stones', category: 'weight', toBase: v => v * 6.35029, fromBase: v => v / 6.35029 },
  { id: 't', name: 'Metric Ton', pluralName: 'Metric Tons', category: 'weight', toBase: v => v * 1000, fromBase: v => v / 1000 },


  // Temperature (Base: Celsius)
  { id: 'c', name: 'Celsius', category: 'temperature', toBase: v => v, fromBase: v => v },
  { id: 'f', name: 'Fahrenheit', category: 'temperature', toBase: v => (v - 32) * 5 / 9, fromBase: v => (v * 9 / 5) + 32 },
  { id: 'k', name: 'Kelvin', category: 'temperature', toBase: v => v - 273.15, fromBase: v => v + 273.15 },

  // Volume (Base: Liter)
  { id: 'l', name: 'Liter', pluralName: 'Liters', category: 'volume', toBase: v => v, fromBase: v => v },
  { id: 'ml', name: 'Milliliter', pluralName: 'Milliliters', category: 'volume', toBase: v => v / 1000, fromBase: v => v * 1000 },
  { id: 'gal_us', name: 'US Gallon', pluralName: 'US Gallons', category: 'volume', toBase: v => v * 3.78541, fromBase: v => v / 3.78541 },
  { id: 'qt_us', name: 'US Quart', pluralName: 'US Quarts', category: 'volume', toBase: v => v * 0.946353, fromBase: v => v / 0.946353 },
  { id: 'pt_us', name: 'US Pint', pluralName: 'US Pints', category: 'volume', toBase: v => v * 0.473176, fromBase: v => v / 0.473176 },
  { id: 'cup_us', name: 'US Cup', pluralName: 'US Cups', category: 'volume', toBase: v => v * 0.236588, fromBase: v => v / 0.236588 },
  { id: 'floz_us', name: 'US Fluid Ounce', pluralName: 'US Fluid Ounces', category: 'volume', toBase: v => v * 0.0295735, fromBase: v => v / 0.0295735 },
  { id: 'm3', name: 'Cubic Meter', pluralName: 'Cubic Meters', category: 'volume', toBase: v => v * 1000, fromBase: v => v / 1000 },

  // Area (Base: Square Meter)
  { id: 'sqm', name: 'Square Meter', pluralName: 'Square Meters', category: 'area', toBase: v => v, fromBase: v => v },
  { id: 'sqkm', name: 'Square Kilometer', pluralName: 'Square Kilometers', category: 'area', toBase: v => v * 1e6, fromBase: v => v / 1e6 },
  { id: 'sqmi', name: 'Square Mile', pluralName: 'Square Miles', category: 'area', toBase: v => v * 2.59e6, fromBase: v => v / 2.59e6 },
  { id: 'acre', name: 'Acre', pluralName: 'Acres', category: 'area', toBase: v => v * 4046.86, fromBase: v => v / 4046.86 },
  { id: 'ha', name: 'Hectare', pluralName: 'Hectares', category: 'area', toBase: v => v * 10000, fromBase: v => v / 10000 },
  { id: 'sqft', name: 'Square Foot', pluralName: 'Square Feet', category: 'area', toBase: v => v * 0.092903, fromBase: v => v / 0.092903 },
  { id: 'sqyd', name: 'Square Yard', pluralName: 'Square Yards', category: 'area', toBase: v => v * 0.836127, fromBase: v => v / 0.836127 },
];

export const unitCategories: { id: UnitCategory; name: string }[] = [
  { id: 'length', name: 'Length' },
  { id: 'weight', name: 'Weight/Mass' },
  { id: 'temperature', name: 'Temperature' },
  { id: 'volume', name: 'Volume' },
  { id: 'area', name: 'Area' },
];

export function getUnitsByCategory(category: UnitCategory): Unit[] {
  return unitsData.filter(u => u.category === category);
}

export function convertUnits(value: number, fromUnitId: string, toUnitId: string): number | null {
  const fromUnit = unitsData.find(u => u.id === fromUnitId);
  const toUnit = unitsData.find(u => u.id === toUnitId);

  if (!fromUnit || !toUnit || fromUnit.category !== toUnit.category) {
    return null; 
  }

  if (value === null || isNaN(value)) {
    return null;
  }

  const valueInBaseUnit = fromUnit.toBase(value);
  const result = toUnit.fromBase(valueInBaseUnit);
  
  // Smart rounding: more precision for smaller numbers, less for larger ones.
  if (Math.abs(result) < 0.00001 && result !== 0) return parseFloat(result.toExponential(4));
  if (Math.abs(result) > 100000) return parseFloat(result.toPrecision(7));
  return parseFloat(result.toFixed(5)); // Default to 5 decimal places
}
