import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { VacationModel } from "../../../../Models/VacationModel";
import { vacationsService } from "../../../../Services/vacationsService";
import { notify } from "../../../../Utils/Notify";
import { AdminVacationCard } from "../AdminVacationCard/AdminVacationCard";
import { Spinner } from "../../../SharedArea/Spinner/Spinner";
import "./AdminVacations.css";

export function AdminVacations() {
    const [vacations, setVacations] = useState<VacationModel[]>([]);
    const [page, setPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        vacationsService.getAllVacations(page)
            .then(dbVacations => setVacations(dbVacations))
            .catch(err => notify.error(err))
            .finally(() => setIsLoading(false));
    }, [page]);

    // This function is passed to the card so it can update the state here in the parent
    function handleDeleteFromState(vacationId: number) {
        const newVacationsList = vacations.filter(v => v.vacation_id !== vacationId);
        setVacations(newVacationsList);
    }

    const handlePrev = () => setPage(p => Math.max(1, p - 1));
    const handleNext = () => setPage(p => p + 1);

    return (
        <div className="AdminVacations">
            <div className="admin-header">
                <h2>Manage Vacations</h2>
                <button className="add-btn" onClick={() => navigate("/admin/vacations/new")}>
                    ➕ Add New Vacation
                </button>
            </div>

            <div className="vacations-grid">
                {isLoading && vacations.length === 0
                    ? <Spinner />
                    : vacations.map(v => (
                        <AdminVacationCard
                            key={v.vacation_id}
                            vacation={v}
                            onDelete={handleDeleteFromState}
                        />
                    ))}
            </div>

            <div className="pagination-container">
                <button onClick={handlePrev} disabled={page === 1}>Previous</button>
                <span> Page {page} </span>
                <button onClick={handleNext} disabled={vacations.length < 9}>Next</button>
            </div>
        </div>
    );
}