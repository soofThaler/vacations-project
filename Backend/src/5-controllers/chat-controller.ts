import express, { Request, Response, NextFunction } from "express";
import { chatService } from "../4-services/chat-service";

class ChatController {
    public router = express.Router();

    public constructor() {
        this.router.post("/api/chat", this.askChat);
    }

    // Forward the user's message to the chat service and send the answer back
    private async askChat(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const { message } = request.body;
            const answer = await chatService.getAnswer(message);
            response.json({ answer });
        } catch (err: any) {
            next(err);
        }
    }
}

export const chatController = new ChatController();