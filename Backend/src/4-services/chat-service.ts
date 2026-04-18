import { OpenAI } from "openai";
import { mcpTools } from "./mcp-tools";

class ChatService {
    private openai: OpenAI | null = null;

    // Lazy-init the OpenAI client (cleans quotes from the env key just in case)
    private getClient(): OpenAI {
        if (!this.openai) {
            const apiKey = (process.env.OPEN_AI_KEY || process.env.OPENAI_API_KEY || "").replace(/['"]+/g, '').trim();
            this.openai = new OpenAI({ apiKey });
        }
        return this.openai;
    }

    // Answer a user message about our vacations using GPT-4o with tool calls
    public async getAnswer(userMessage: string): Promise<string> {
        try {
            const client = this.getClient();

            const toolsMetadata = [
                {
                    name: "getVacationStats",
                    description: "Get statistics about vacations including average price and current active vacations count.",
                    parameters: { type: "object", properties: {} }
                },
                {
                    name: "getUpcomingVacations",
                    description: "Get a list of all upcoming future vacations with their destination and price. Use this to find vacations in specific regions like Europe.",
                    parameters: { type: "object", properties: {} }
                }
            ];

            const response = await client.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: "You are a helpful vacation assistant. You have access to a database of vacations. Always use the available tools to answer questions about vacations, prices, and destinations. Base your answers on the actual data returned by the tools." },
                    { role: "user", content: userMessage }
                ],
                tools: toolsMetadata.map(t => ({
                    type: "function",
                    function: t
                }))
            });

            const message = response.choices[0].message;

            if (message.tool_calls) {
                const toolResponses = [];
                for (const toolCall of message.tool_calls as any[]) {
                    let result;
                    if (toolCall.function.name === "getVacationStats") {
                        result = await mcpTools.getVacationStatsTool();
                    } else if (toolCall.function.name === "getUpcomingVacations") {
                        result = await mcpTools.getUpcomingVacationsTool();
                    }
                    toolResponses.push({
                        role: "tool" as const,
                        tool_call_id: toolCall.id,
                        content: JSON.stringify(result?.content)
                    });
                }

                const finalResponse = await client.chat.completions.create({
                    model: "gpt-4o",
                    messages: [
                        { role: "system", content: "You are a helpful vacation assistant. You have access to a database of vacations. Always use the available tools to answer questions about vacations, prices, and destinations. Base your answers on the actual data returned by the tools." },
                        { role: "user", content: userMessage },
                        message,
                        ...toolResponses
                    ]
                });

                return finalResponse.choices[0].message.content ?? "";
            }

            return message.content ?? "";
        } catch (error: any) {
            console.error("ChatService Error:", error.message);
            throw error;
        }
    }
}

export const chatService = new ChatService();