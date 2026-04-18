import axios from "axios";
import { appConfig } from "../Utils/AppConfig";

class AiService {
    public async getRecommendation(destination: string): Promise<string> {
        const response = await axios.get<{ recommendation: string }>(appConfig.vacationsUrl + "ai/recommendation/" + destination);
        return response.data.recommendation;
    }
}

export const aiService = new AiService();
