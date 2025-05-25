import "dotenv/config";
import { runAgent } from './src/agent';
import { tools } from './src/tools';

// npm start "Generate an image of a cat sitting on a laptop"
const userMessage = process.argv[2];

if (!userMessage) {
    console.error("Please provide a message as an argument.");
    process.exit(1);
}

await runAgent({ userMessage, tools });

