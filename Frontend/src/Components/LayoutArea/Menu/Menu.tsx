import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import { authService } from "../../../Services/authService";
import "./Menu.css";
import { notify } from "../../../Utils/Notify";

// 1. Define Admin Role ID constant for clean code
const ADMIN_ROLE_ID = 1;

export function Menu() {
    // 2. Listen to Redux: Get the current user from the auth slice
    const user = useSelector((state: RootState) => state.auth.user);
    
    // 3. Hook for navigation
    const navigate = useNavigate();

    // 4. Logout handler
    function logout(e: any) {
    e.preventDefault(); 
    authService.logout();
    
    notify.success("Logged out successfully!"); 
    
    navigate("/login");
}
    return (
        <div className="Menu">
            {/* What to show if the user is NOT logged in */}
            {!user && (
                <>
                    <NavLink to="/login">Login</NavLink>
                    <span> | </span>
                    <NavLink to="/register">Register</NavLink>
                </>
            )}

            {/* What to show if the user IS logged in */}
            {user && (
                <>
                    <span className="greeting">Hello {user.first_name} | </span>
                    
                    {/* Common links for ALL logged-in users */}
                    <NavLink to="/vacations">Vacations</NavLink>
                    <span> | </span>
                    <NavLink to="/ai-recommendation">Ai Recommendation</NavLink>
                    <span> | </span>
                    
                    {/* --- ADMIN ONLY LINKS --- */}
                    {user.role_id === ADMIN_ROLE_ID && (
                        <>
                            <NavLink className="admin-link" to="/admin/vacations">Manage Vacations</NavLink>
                            <span> | </span>
                            <NavLink className="admin-link" to="/admin/reports">Reports</NavLink>
                            <span> | </span>
                        </>
                    )}
                    
                    <NavLink to="#" onClick={logout}>Logout</NavLink>
                </>
            )}
        </div>
    );
}
