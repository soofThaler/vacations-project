import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { VacationModel } from "../../../../Models/VacationModel";
import { vacationsService } from "../../../../Services/vacationsService";
import { notify } from "../../../../Utils/Notify";
import { Spinner } from "../../../SharedArea/Spinner/Spinner";
import "./AddVacation.css";

export function AddVacation() {
    const { register, handleSubmit, formState } = useForm<VacationModel>();
    const navigate = useNavigate();

    async function send(vacation: VacationModel) {
        try {
            // Take the first file from the FileList object
            vacation.image = (vacation.image as any)[0];
            
            await vacationsService.addVacation(vacation);
            notify.success("Vacation added successfully!");
            navigate("/admin/vacations");
        } catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="AddVacation">
            <h2>Add New Vacation</h2>

            <form onSubmit={handleSubmit(send)}>
                
                <label>Destination:</label>
                <input type="text" {...register("destination", {
                    required: { value: true, message: "Missing destination" },
                    minLength: { value: 3, message: "Destination too short" }
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
                    required: { value: true, message: "Missing start date" },
                    validate: (value) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        if (new Date(value) < today) {
                            return "Start date cannot be in the past";
                        }
                        return true;
                    }
                })} />
                <span className="error">{formState.errors.start_date?.message}</span>

                <label>End Date:</label>
                <input type="date" {...register("end_date", {
                    required: { value: true, message: "Missing end date" },
                    validate: (value, formValues) => {
                        // Logic check: End date cannot be before start date
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

                <label>Image:</label>
                <input type="file" accept="image/*" {...register("image", {
                    required: { value: true, message: "Missing image" }
                })} />
                <span className="error">{formState.errors.image?.message}</span>

                <div className="buttons">
                    <button type="submit" disabled={formState.isSubmitting}>
                        {formState.isSubmitting ? <Spinner size="small" /> : "Add"}
                    </button>
                    <button type="button" className="cancel-btn" onClick={() => navigate("/admin/vacations")}>Cancel</button>
                </div>
            </form>
        </div>
    );
}