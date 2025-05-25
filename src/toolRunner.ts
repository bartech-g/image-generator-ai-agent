import type OpenAI from "openai";
import { generateImage, generateImageToolDefinition } from "./tools/gen-image"



export const runTool = async (
    toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
    userMessage: string
) => {
    const input = {
        userMessage,
        toolArgs: JSON.parse(toolCall.function.arguments || "{}"),
    }

    switch (toolCall.function.name) {
        case generateImageToolDefinition.name:
            return await generateImage(input);
        // Add more cases here for additional tools
        default:
            return `Never run this tool ${toolCall.function.name}, it is not implemented yet.`;
    }
}