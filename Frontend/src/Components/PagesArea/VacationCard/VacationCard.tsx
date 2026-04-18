import { VacationModel } from "../../../Models/VacationModel";
import { appConfig } from "../../../Utils/AppConfig";
import { vacationsService } from "../../../Services/vacationsService";
import { notify } from "../../../Utils/Notify";
import "./VacationCard.css";

interface VacationCardProps {
    vacation: VacationModel;
}

export function VacationCard(props: VacationCardProps) {
    const imageUrl = `${appConfig.imagesUrl}${props.vacation.image_name}`;

    async function handleLike() {
        try {
            await vacationsService.toggleLike(props.vacation.vacation_id);
        } catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="VacationCard">
            
            <img src={imageUrl} alt={props.vacation.destination} />
            
            <div className="vacation-details">
                <h3>{props.vacation.destination}</h3>
                <p>{props.vacation.description}</p>
                
                <hr />
                
                <p><strong>From:</strong> {props.vacation.start_date}</p>
                <p><strong>To:</strong> {props.vacation.end_date}</p>
                <p><strong>Price:</strong> ${props.vacation.price}</p>
                
                <div className="likes-area">
                    <button onClick={handleLike}>❤️ Like</button>
                    <span> {props.vacation.likes_count || 0} Likes</span>
                </div>
            </div>

        </div>
    );
}