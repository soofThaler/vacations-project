import axios from "axios";
import { appConfig } from "../Utils/AppConfig";

class McpService {
    public async sendMessage(message: string): Promise<string> {
        const response = await axios.post<{ answer: string }>(
            appConfig.chatUrl,
            { message }
        );
        return response.data.answer;
    }

    public connectSSE(onMessageReceived: (message: string) => void, onError: (error: any) => void): EventSource {
        const eventSource = new EventSource(appConfig.sseUrl);

        eventSource.onmessage = (event) => {
            onMessageReceived(event.data);
        };

        eventSource.onerror = (err) => {
            console.error(err);
            onError(err);
            eventSource.close();
        };

        return eventSource;
    }
}

export const mcpService = new McpService();
