import { openai } from './ai';
import type { AIMessage } from '../types';
import { zodFunction } from "openai/helpers/zod";
import { systemPrompt } from "./systemPrompt";

export const runLLM = async ({ messages, tools }: { messages: AIMessage[]; tools: any[] }) => {
    const foramttedTools = tools.map(zodFunction)
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.1,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        tools: foramttedTools,
        tool_choice: "auto",
        parallel_tool_calls: false,
    });

    return response.choices[0].message;
}