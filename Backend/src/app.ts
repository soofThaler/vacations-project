import "dotenv/config";
import cors from "cors";
import express from "express";
import expressFileUpload from "express-fileupload";
import { sseHandlers } from "express-mcp-handler";
import { appConfig } from "./2-utils/app-config";
import { vacationsController } from "./5-controllers/vacations-controller";
import { authController } from "./5-controllers/auth-controller";
import { likesController } from "./5-controllers/likes-controller";
import { chatController } from "./5-controllers/chat-controller";
import { errorsMiddleware } from "./6-middleware/errors-middleware";
import { vacationsMcpServer } from "./4-services/mcp-server";

class App {
    public start(): void {
        try {
            const server = express();
            server.use(cors());
            server.use(express.json());
            server.use(expressFileUpload());

            const mcpServer = vacationsMcpServer.createMcpServer();
            const factory = () => mcpServer as any;
            const { getHandler, postHandler } = sseHandlers(factory, {});
            
            server.get("/sse", getHandler);
            server.post("/messages", postHandler);

            server.use(authController.router);
            server.use(vacationsController.router);
            server.use(likesController.router);
            server.use(chatController.router);
            
            server.use(errorsMiddleware.routeNotFound);
            server.use(errorsMiddleware.catchAll);
            
            server.listen(appConfig.port, () => console.log("Listening on http://localhost:" + appConfig.port));
        }
        catch (err: any) {
            console.error(err);
        }
    }
}

const app = new App();
app.start();