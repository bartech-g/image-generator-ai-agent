import type { AIMessage } from "../types";
import { runLLM } from "./llm";
import { addMessages, getMessages } from "./memory";
import { saveToolResponse } from "./memory";
import { runTool } from "./toolRunner";

const logMessage = (message: AIMessage) => {
    const roleColors = {
        user: '\x1b[36m', // cyan
        assistant: '\x1b[32m', // green
    }

    const reset = '\x1b[0m'
    const role = message.role
    const color = roleColors[role as keyof typeof roleColors] || '\x1b[37m' // default to white

    // Don't log tool messages
    if (role === 'tool') {
        return
    }

    // Log user messages (only have content)
    if (role === 'user') {
        console.log(`\n${color}[USER]${reset}`)
        console.log(`${message.content}\n`)
        return
    }

    // Log assistant messages
    if (role === 'assistant') {
        // If has tool_calls, log function name
        if ('tool_calls' in message && message.tool_calls) {
            message.tool_calls.forEach((tool) => {
                console.log(`\n${color}[ASSISTANT]${reset}`)
                console.log(`${tool.function.name}\n`)
            })
            return
        }

        // If has content, log it
        if (message.content) {
            console.log(`\n${color}[ASSISTANT]${reset}`)
            console.log(`${message.content}\n`)
        }
    }
}

export const runAgent = async ({ userMessage, tools }: { userMessage: string; tools: any[] }) => {
    await addMessages([{ role: 'user', content: userMessage }]);

    while (true) {
        const history = await getMessages();

        const response = await runLLM({ messages: history, tools });

        await addMessages([response]);

        if (response.content) {
            logMessage(response);
            return getMessages();
        }

        console.log("Thinking...");

        if (response.tool_calls) {
            const toolCall = response.tool_calls[0];
            logMessage(response);
            console.log(`Running tool: ${toolCall.function.name}`);

            const toolResponse = await runTool(toolCall, userMessage);
            await saveToolResponse(toolCall.id, toolResponse);

            console.log(`Executed: ${toolCall.function.name}`);
        }
    }
}