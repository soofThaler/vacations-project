import OpenAI from "openai";
import { appConfig } from "../2-utils/app-config";

class AiService {
    private openai = new OpenAI({
        apiKey: appConfig.openAiKey
    });

    // Ask GPT for a short travel recommendation for a given destination
    public async getRecommendation(destination: string): Promise<string> {
        const prompt = `Please provide a short, engaging, and enthusiastic travel recommendation for a vacation in ${destination}. Limit the response to 3 sentences.`;

        const response = await this.openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }]
        });

        return response.choices[0].message.content || "No recommendation available at the moment.";
    }
}

export const aiService = new AiService();