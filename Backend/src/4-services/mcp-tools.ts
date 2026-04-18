import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { vacationService } from "./vacation-service";
import { mcpHelper } from "../2-utils/mcp-helper";

class McpTools {
    // MCP tool: return vacation stats (active count + average price)
    public async getVacationStatsTool(): Promise<CallToolResult> {
        const stats = await vacationService.getVacationStats();
        return mcpHelper.getToolResult(stats);
    }

    // MCP tool: return all upcoming vacations
    public async getUpcomingVacationsTool(): Promise<CallToolResult> {
        const vacations = await vacationService.getUpcomingVacationsForMcp();
        return mcpHelper.getToolResult(vacations);
    }
}

export const mcpTools = new McpTools();