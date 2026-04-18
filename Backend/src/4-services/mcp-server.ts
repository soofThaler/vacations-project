import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { mcpRegister } from "./mcp-register";

class VacationsMcpServer {
    // Build the MCP server and register all our tools on it
    public createMcpServer(): McpServer {
        const mcpServer = new McpServer({
            name: "vacations-mcp",
            version: "1.0.0"
        });

        mcpRegister.registerGetVacationStatsTool(mcpServer);
        mcpRegister.registerGetUpcomingVacationsTool(mcpServer);

        return mcpServer;
    }
}

export const vacationsMcpServer = new VacationsMcpServer();