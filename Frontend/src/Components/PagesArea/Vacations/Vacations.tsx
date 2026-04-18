import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import { vacationsService } from "../../../Services/vacationsService";
import { store } from "../../../Redux/store";
import { notify } from "../../../Utils/Notify";
import "./Vacations.css";
import { VacationCard } from "../VacationCard/VacationCard";
import { McpChatModal } from "../McpChatModal/McpChatModal";
import { Spinner } from "../../SharedArea/Spinner/Spinner";

export function Vacations() {
    const vacations = useSelector((state: RootState) => state.vacations.vacations);
    const navigate = useNavigate();
    
    const [page, setPage] = useState<number>(1);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isUpcoming, setIsUpcoming] = useState<boolean>(false);
    const [isMcpOpen, setIsMcpOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!store.getState().auth.token) {
            notify.error("You must be logged in to view vacations.");
            navigate("/login");
            return;
        }

        setIsLoading(true);
        vacationsService.getAllVacations(page, isLiked, isActive, isUpcoming)
            .catch(err => {
                notify.error(err);
            })
            .finally(() => setIsLoading(false));

    }, [page, isLiked, isActive, isUpcoming]);

    const handlePrev = () => setPage(p => Math.max(1, p - 1));
    const handleNext = () => setPage(p => p + 1);

    return (
        <div className="Vacations">
            <h2>Our Vacations</h2>

            <button onClick={() => setIsMcpOpen(true)} className="mcp-open-btn">
                Ask AI Assistant
            </button>
            
            <div className="filters-container">
                <label>
                    <input type="checkbox" checked={isLiked} onChange={e => { setIsLiked(e.target.checked); setPage(1); }} />
                    Liked Vacations
                </label>
                <label>
                    <input type="checkbox" checked={isActive} onChange={e => { setIsActive(e.target.checked); setPage(1); }} />
                    Active Vacations
                </label>
                <label>
                    <input type="checkbox" checked={isUpcoming} onChange={e => { setIsUpcoming(e.target.checked); setPage(1); }} />
                    Upcoming Vacations
                </label>
            </div>
            
            <div className="vacation-container">
                {isLoading && vacations.length === 0
                    ? <Spinner />
                    : vacations.map(v => (
                        <VacationCard key={v.vacation_id} vacation={v} />
                    ))}
            </div>

            <div className="pagination-container">
                <button onClick={handlePrev} disabled={page === 1}>Previous</button>
                <span> Page {page} </span>
                <button onClick={handleNext} disabled={vacations.length < 9}>Next</button>
            </div>

            <McpChatModal isOpen={isMcpOpen} onClose={() => setIsMcpOpen(false)} />
        </div>
    );
}