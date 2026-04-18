import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { CredentialsModel } from "../../../Models/CredentialsModel";
import { authService } from "../../../Services/authService";
import { notify } from "../../../Utils/Notify";
import { Spinner } from "../../SharedArea/Spinner/Spinner";
import "./Login.css";

export function Login() {
    // Hook for managing the form data and validation
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CredentialsModel>();
    
    // Hook for navigating between routes programmatically
    const navigate = useNavigate();

    // The function that runs when the form is submitted
    async function send(credentials: CredentialsModel) {
        try {
            // Send credentials to the server via authService
            await authService.login(credentials);
            notify.success("Welcome back!");
            
            // Redirect the user to the vacations page after successful login
            navigate("/vacations"); 
        } catch (err: any) {
            // Display error from the server (e.g., "Incorrect email or password")
            notify.error(err);
        }
    }

    return (
        <div className="Login">
            <h2>Login</h2>
            
            {/* handleSubmit prevents the default browser refresh and calls our 'send' function */}
            <form onSubmit={handleSubmit(send)}>
                
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
                    {isSubmitting ? <Spinner size="small" /> : "Login"}
                </button>
            </form>
        </div>
    );
}