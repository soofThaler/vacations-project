import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { vacationsService } from "../../../../Services/vacationsService";
import { notify } from "../../../../Utils/Notify";
import { Spinner } from "../../../SharedArea/Spinner/Spinner";
import "./Reports.css";

export function Reports() {
    const [chartData, setChartData] = useState<{ destination: string, likes_count: number }[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        vacationsService.getReportsData()
            .then(data => setChartData(data))
            .catch(err => notify.error(err))
            .finally(() => setIsLoading(false));
    }, []);

    async function handleDownloadCsv() {
        try {
            await vacationsService.downloadCsv();
            notify.success("Download started!");
        } catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="Reports">
            <div className="reports-header">
                <h2>Vacations Likes Report</h2>
                <button onClick={handleDownloadCsv} className="csv-btn">
                    📥 Download CSV
                </button>
            </div>

            <div className="chart-container">
                {isLoading ? <Spinner /> : (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        
                        {/* X Axis: Destination */}
                        <XAxis 
                            dataKey="destination" 
                            angle={-45} 
                            textAnchor="end" 
                            interval={0} 
                            height={80} 
                        />
                        
                        {/* Y Axis: Likes */}
                        <YAxis allowDecimals={false} label={{ value: 'Likes', angle: -90, position: 'insideLeft' }} />
                        
                        <Tooltip />
                        
                        {/* The Bars */}
                        <Bar dataKey="likes_count" fill="#3498db" name="Likes" />
                    </BarChart>
                </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}