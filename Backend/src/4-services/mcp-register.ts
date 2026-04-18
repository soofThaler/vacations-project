import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { mcpTools } from "./mcp-tools";

class McpRegister {
    // Register the vacation-stats tool on the MCP server
    public registerGetVacationStatsTool(mcpServer: McpServer): void {
        const config = {
            description: "Get statistics about vacations including average price and current active vacations count."
        };
        mcpServer.registerTool("getVacationStats", config, mcpTools.getVacationStatsTool);
    }

    // Register the upcoming-vacations tool on the MCP server
    public registerGetUpcomingVacationsTool(mcpServer: McpServer): void {
        const config = {
            description: "Get a list of all upcoming future vacations with their destination and price. Use this to find vacations in specific regions like Europe."
        };
        mcpServer.registerTool("getUpcomingVacations", config, mcpTools.getUpcomingVacationsTool);
    }
}

export const mcpRegister = new McpRegister();