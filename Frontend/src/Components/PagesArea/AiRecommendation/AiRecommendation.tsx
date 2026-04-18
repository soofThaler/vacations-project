import { useState } from "react";
import { aiService } from "../../../Services/aiService";
import { notify } from "../../../Utils/Notify";
import { Spinner } from "../../SharedArea/Spinner/Spinner";
import "./AiRecommendation.css";

export function AiRecommendation() {
    const [destination, setDestination] = useState<string>("");
    const [recommendation, setRecommendation] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    async function fetchRecommendation() {
        if (!destination) {
            notify.error("Please enter a destination");
            return;
        }

        try {
            setLoading(true);
            setRecommendation("");
            const result = await aiService.getRecommendation(destination);
            setRecommendation(result);
        } catch (err: any) {
            notify.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="AiRecommendation">
            <h2>AI Vacation Recommendation</h2>
            
            <div>
                <input
                    type="text"
                    placeholder="Enter destination..."
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                />
                <button onClick={fetchRecommendation} disabled={loading}>
                    {loading ? <Spinner size="small" /> : "Get Recommendation"}
                </button>
            </div>

            {loading && <Spinner size="medium" />}

            {recommendation && !loading && (
                <div>
                    <p>{recommendation}</p>
                </div>
            )}
        </div>
    );
}