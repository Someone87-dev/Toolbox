export type CaseType = 'uppercase' | 'lowercase' | 'titlecase' | 'sentencecase';

export function convertCase(text: string, caseType: CaseType): string {
  switch (caseType) {
    case 'uppercase':
      return text.toUpperCase();
    case 'lowercase':
      return text.toLowerCase();
    case 'titlecase':
      return text.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    case 'sentencecase':
      return text.toLowerCase().replace(/(^\w|\.\s*\w)/g, char => char.toUpperCase());
    default:
      return text;
  }
}
