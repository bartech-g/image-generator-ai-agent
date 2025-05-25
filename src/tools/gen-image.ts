import type { ToolFn } from '../../types';
import { z } from 'zod';
import { openai } from '../ai';

export const generateImageToolDefinition = {
    name: 'generate_image',
    parameters: z.object({
        prompt: z.string().describe('The prompt to generate the image from'),
    }),
    description: 'Generate an image',
};

type Args = z.infer<typeof generateImageToolDefinition.parameters>;

export const generateImage: ToolFn<Args, string> = async ({ toolArgs, userMessage }) => {
    const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: toolArgs.prompt,
        n: 1,
        size: '1024x1024'
    })

    if (!response.data || !response.data[0]?.url) {
        throw new Error('Image generation failed: No data returned from OpenAI.');
    }
    return response.data[0].url!;
}