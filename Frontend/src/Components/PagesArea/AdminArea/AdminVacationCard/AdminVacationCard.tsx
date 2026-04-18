import { useNavigate } from "react-router-dom";
import { VacationModel } from "../../../../Models/VacationModel";
import { appConfig } from "../../../../Utils/AppConfig";
import { vacationsService } from "../../../../Services/vacationsService";
import { notify } from "../../../../Utils/Notify";
import "./AdminVacationCard.css";

interface AdminVacationCardProps {
    vacation: VacationModel;
    onDelete: (vacationId: number) => void;
}

export function AdminVacationCard(props: AdminVacationCardProps) {
    const navigate = useNavigate();
    const imageUrl = `${appConfig.imagesUrl}${props.vacation.image_name}`;

    function handleEdit() {
        navigate(`/admin/vacations/edit/${props.vacation.vacation_id}`);
    }

    async function handleDelete() {
        const isSure = window.confirm(`Are you sure you want to delete the vacation to ${props.vacation.destination}?`);
        if (!isSure) return;

        try {
            await vacationsService.deleteVacation(props.vacation.vacation_id);
            notify.success(`Vacation to ${props.vacation.destination} deleted successfully`);
            props.onDelete(props.vacation.vacation_id); // Notify parent to update the UI
        } catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="AdminVacationCard">
            <img src={imageUrl} alt={props.vacation.destination} />
            
            <div className="vacation-details">
                <h3>{props.vacation.destination}</h3>
                <p>{props.vacation.description}</p>
                <hr />
                <p><strong>From:</strong> {props.vacation.start_date}</p>
                <p><strong>To:</strong> {props.vacation.end_date}</p>
                <p><strong>Price:</strong> ${props.vacation.price}</p>
                
                {/* Admin controls instead of likes */}
                <div className="admin-controls">
                    <button className="edit-btn" onClick={handleEdit}>✏️ Edit</button>
                    <button className="delete-btn" onClick={handleDelete}>🗑️ Delete</button>
                </div>
            </div>
        </div>
    );
}