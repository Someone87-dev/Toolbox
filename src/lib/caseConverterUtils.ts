
export type CaseType = 
  'uppercase' | 
  'lowercase' | 
  'titlecase' | 
  'sentencecase' |
  'pascalcase' |
  'camelcase' |
  'snakecase' |
  'kebabcase';

function toWords(text: string): string[] {
  // Handle various delimiters: space, underscore, hyphen, and camel/pascal case transitions
  return text
    .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase or PascalCase to words
    .replace(/[\s_-]+/g, ' ') // replace underscores/hyphens/multiple spaces with single space
    .trim()
    .toLowerCase()
    .split(' ');
}


export function convertCase(text: string, caseType: CaseType): string {
  if (!text.trim()) return '';
  const words = toWords(text);

  switch (caseType) {
    case 'uppercase':
      return text.toUpperCase();
    case 'lowercase':
      return text.toLowerCase();
    case 'titlecase':
      // Standard title case (capitalize first letter of each word)
      return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    case 'sentencecase':
      // Basic sentence case: capitalize first letter of the input string, rest lower.
      // More advanced would require sentence boundary detection.
      const lower = text.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    case 'pascalcase':
      return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
    case 'camelcase':
      return words.map((word, index) => 
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
      ).join('');
    case 'snakecase':
      return words.join('_');
    case 'kebabcase':
      return words.join('-');
    default:
      return text;
  }
}
