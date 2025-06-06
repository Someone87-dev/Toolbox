'use server';

import { summarizeText, type SummarizeTextInput } from '@/ai/flows/summarize-text';
import { z } from 'zod';

const SummarizeSchema = z.object({
  text: z.string().min(10, { message: 'Text must be at least 10 characters long.' })
                 .max(10000, { message: 'Text must not exceed 10,000 characters.' }),
});

export interface SummarizeFormState {
  summary?: string;
  error?: string;
  fieldErrors?: {
    text?: string[];
  };
}

export async function handleSummarizeText(
  prevState: SummarizeFormState,
  formData: FormData,
): Promise<SummarizeFormState> {
  const text = formData.get('text') as string;

  const validatedFields = SummarizeSchema.safeParse({ text });

  if (!validatedFields.success) {
    return {
      error: "Invalid input.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const input: SummarizeTextInput = { text: validatedFields.data.text };
    const result = await summarizeText(input);
    if (result.summary) {
      return { summary: result.summary };
    } else {
      return { error: 'Failed to generate summary. The AI model did not return a summary.' };
    }
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred while summarizing the text.';
    return { error: `AI Error: ${errorMessage}` };
  }
}
