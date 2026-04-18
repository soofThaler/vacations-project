import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { UserModel } from "../../../Models/UserModel";
import { authService } from "../../../Services/authService";
import { notify } from "../../../Utils/Notify";
import { Spinner } from "../../SharedArea/Spinner/Spinner";
import "./Register.css";

// Local interface for the form, extending UserModel to include a password
// The server needs the password to create the account, but we won't keep it in Redux later.
interface RegisterForm extends UserModel {
    password?: string;
}

export function Register() {
    // Hook for managing the form data
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>();
    
    // Hook for navigating after successful registration
    const navigate = useNavigate();

    // The function that runs when the form is submitted
    async function send(user: RegisterForm) {
        try {
            // Send new user data to the server via authService
            await authService.register(user);
            notify.success("Welcome! Registration successful.");
            
            // Redirect the user to the vacations page
            navigate("/vacations"); 
        } catch (err: any) {
            // Display error from the server (e.g., "Email already exists")
            notify.error(err);
        }
    }

    return (
        <div className="Register">
            <h2>Register</h2>
            
            <form onSubmit={handleSubmit(send)}>
                
                <label>First Name: </label>
                <input
                    type="text"
                    {...register("first_name", { required: true, minLength: 2 })}
                />
                {errors.first_name?.type === "required" && <span className="error">First name is required</span>}
                {errors.first_name?.type === "minLength" && <span className="error">First name must be at least 2 characters</span>}
                <br /><br />

                <label>Last Name: </label>
                <input
                    type="text"
                    {...register("last_name", { required: true, minLength: 2 })}
                />
                {errors.last_name?.type === "required" && <span className="error">Last name is required</span>}
                {errors.last_name?.type === "minLength" && <span className="error">Last name must be at least 2 characters</span>}
                <br /><br />

                <label>Email: </label>
                <input
                    type="email"
                    {...register("email", { required: true })}
                />
                {errors.email && <span className="error">Email is required</span>}
                <br /><br />

                <label>Password: </label>
                <input
                    type="password"
                    {...register("password", { required: true, minLength: 4 })}
                />
                {errors.password?.type === "required" && <span className="error">Password is required</span>}
                {errors.password?.type === "minLength" && <span className="error">Password must be at least 4 characters</span>}
                <br /><br />
                
                <button disabled={isSubmitting}>
                    {isSubmitting ? <Spinner size="small" /> : "Register"}
                </button>
            </form>
        </div>
    );
}