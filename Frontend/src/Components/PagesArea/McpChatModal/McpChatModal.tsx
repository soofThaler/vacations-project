import { useState, useEffect, useRef } from "react";
import { mcpService } from "../../../Services/mcpService";
import { Spinner } from "../../SharedArea/Spinner/Spinner";
import "./McpChatModal.css";

interface Message {
    sender: "User" | "AI";
    text: string;
}

interface McpChatModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function McpChatModal({ isOpen, onClose }: McpChatModalProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const eventSource = mcpService.connectSSE(
            (data) => {
                setMessages((prev) => [...prev, { sender: "AI", text: data }]);
                setIsLoading(false);
            },
            () => {
                setIsLoading(false);
            }
        );

        return () => {
            eventSource.close();
        };
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function handleSend() {
        if (!input.trim()) return;

        const userMessage = input;
        setMessages((prev) => [...prev, { sender: "User", text: userMessage }]);
        setInput("");
        setIsLoading(true);

        try {
            const answer = await mcpService.sendMessage(userMessage);
            setMessages((prev) => [...prev, { sender: "AI", text: answer }]);
            setIsLoading(false);
        } catch (err: any) {
            setMessages((prev) => [...prev, { sender: "AI", text: "Error: " + (err.response?.data?.message || err.message) }]);
            setIsLoading(false);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="McpChatModal-overlay">
            <div className="McpChatModal">
                <div className="McpChatModal-header">
                    <h3>AI Assistant</h3>
                    <button onClick={onClose} className="close-btn">X</button>
                </div>
                
                <div className="McpChatModal-body">
                    {messages.map((m, index) => (
                        <div key={index} className={`message ${m.sender}`}>
                            <strong>{m.sender}: </strong> {m.text}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="message AI">
                            <Spinner size="small" />
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="McpChatModal-footer">
                    <input 
                        type="text" 
                        value={input} 
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Ask something..."
                    />
                    <button onClick={handleSend} disabled={isLoading}>Send</button>
                </div>
            </div>
        </div>
    );
}