import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { VacationModel } from "../../../../Models/VacationModel";
import { vacationsService } from "../../../../Services/vacationsService";
import { notify } from "../../../../Utils/Notify";
import { Spinner } from "../../../SharedArea/Spinner/Spinner";
import "./EditVacation.css";

export function EditVacation() {
    const { register, handleSubmit, formState, setValue } = useForm<VacationModel>();
    const navigate = useNavigate();
    const params = useParams();
    const vacationId = +params.id!;
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        // Fetch existing data and populate form
        vacationsService.getOneVacation(vacationId)
            .then(vacation => {
                setValue("destination", vacation.destination);
                setValue("description", vacation.description);
                setValue("start_date", vacation.start_date);
                setValue("end_date", vacation.end_date);
                setValue("price", vacation.price);
            })
            .catch(err => notify.error(err))
            .finally(() => setIsLoading(false));
    }, [vacationId, setValue]);

    async function send(vacation: VacationModel) {
        try {
            vacation.vacation_id = vacationId;
            
            // Handle image update logic
            if (vacation.image && (vacation.image as any).length > 0) {
                vacation.image = (vacation.image as any)[0];
            } else {
                delete vacation.image;
            }

            await vacationsService.updateVacation(vacation);
            notify.success("Vacation updated successfully!");
            navigate("/admin/vacations");
        } catch (err: any) {
            notify.error(err);
        }
    }

    if (isLoading) {
        return (
            <div className="EditVacation">
                <h2>Edit Vacation</h2>
                <Spinner />
            </div>
        );
    }

    return (
        <div className="EditVacation">
            <h2>Edit Vacation</h2>

            <form onSubmit={handleSubmit(send)}>
                
                <label>Destination:</label>
                <input type="text" {...register("destination", {
                    required: { value: true, message: "Missing destination" },
                    minLength: { value: 2, message: "Destination too short" }
                })} />
                <span className="error">{formState.errors.destination?.message}</span>

                <label>Description:</label>
                <textarea {...register("description", {
                    required: { value: true, message: "Missing description" },
                    minLength: { value: 10, message: "Description too short" }
                })} />
                <span className="error">{formState.errors.description?.message}</span>

                <label>Start Date:</label>
                <input type="date" {...register("start_date", {
                    required: { value: true, message: "Missing start date" }
                })} />
                <span className="error">{formState.errors.start_date?.message}</span>

                <label>End Date:</label>
                <input type="date" {...register("end_date", {
                    required: { value: true, message: "Missing end date" },
                    validate: (value, formValues) => {
                        // Cross-field validation: End must be >= Start
                        const start = new Date(formValues.start_date);
                        const end = new Date(value);
                        if (end < start) {
                            return "End date cannot be earlier than start date";
                        }
                        return true;
                    }
                })} />
                <span className="error">{formState.errors.end_date?.message}</span>

                <label>Price:</label>
                <input type="number" step="0.01" {...register("price", {
                    required: { value: true, message: "Missing price" },
                    min: { value: 0, message: "Price cannot be negative" },
                    max: { value: 10000, message: "Price too high" }
                })} />
                <span className="error">{formState.errors.price?.message}</span>

                <label>Change Image (Optional):</label>
                <input type="file" accept="image/*" {...register("image")} />
                
                <div className="buttons">
                    <button type="submit" disabled={formState.isSubmitting}>
                        {formState.isSubmitting ? <Spinner size="small" /> : "Update"}
                    </button>
                    <button type="button" className="cancel-btn" onClick={() => navigate("/admin/vacations")}>Cancel</button>
                </div>
            </form>
        </div>
    );
}