import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { VacationModel } from "../../../../Models/VacationModel";
import { appConfig } from "../../../../Utils/AppConfig";
import { vacationsService } from "../../../../Services/vacationsService";
import { notify } from "../../../../Utils/Notify";
import { ConfirmModal } from "../../../SharedArea/ConfirmModal/ConfirmModal";
import "./AdminVacationCard.css";

interface AdminVacationCardProps {
    vacation: VacationModel;
    onDelete: (vacationId: number) => void;
}

export function AdminVacationCard(props: AdminVacationCardProps) {
    const navigate = useNavigate();
    const imageUrl = `${appConfig.imagesUrl}${props.vacation.image_name}`;
    const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);

    function handleEdit() {
        navigate(`/admin/vacations/edit/${props.vacation.vacation_id}`);
    }

    function handleDelete() {
        setIsConfirmOpen(true);
    }

    async function confirmDelete() {
        setIsConfirmOpen(false);
        try {
            await vacationsService.deleteVacation(props.vacation.vacation_id);
            notify.success(`Vacation to ${props.vacation.destination} deleted successfully`);
            props.onDelete(props.vacation.vacation_id);
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

                <div className="admin-controls">
                    <button className="edit-btn" onClick={handleEdit}>✏️ Edit</button>
                    <button className="delete-btn" onClick={handleDelete}>🗑️ Delete</button>
                </div>
            </div>

            <ConfirmModal
                isOpen={isConfirmOpen}
                title="Delete Vacation"
                message={`Are you sure you want to delete the vacation to ${props.vacation.destination}?`}
                variant="danger"
                confirmText="Delete"
                onConfirm={confirmDelete}
                onCancel={() => setIsConfirmOpen(false)}
            />
        </div>
    );
}
