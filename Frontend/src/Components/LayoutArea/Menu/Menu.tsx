import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import { authService } from "../../../Services/authService";
import { notify } from "../../../Utils/Notify";
import { ConfirmModal } from "../../SharedArea/ConfirmModal/ConfirmModal";
import "./Menu.css";

const ADMIN_ROLE_ID = 1;

export function Menu() {
    const user = useSelector((state: RootState) => state.auth.user);
    const navigate = useNavigate();
    const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);

    function logout(e: any) {
        e.preventDefault();
        setIsConfirmOpen(true);
    }

    function confirmLogout() {
        setIsConfirmOpen(false);
        authService.logout();
        notify.success("Logged out successfully!");
        navigate("/login");
    }

    return (
        <div className="Menu">
            {!user && (
                <>
                    <NavLink to="/login">Login</NavLink>
                    <span> | </span>
                    <NavLink to="/register">Register</NavLink>
                </>
            )}

            {user && (
                <>
                    <span className="greeting">Hello {user.first_name} | </span>

                    <NavLink to="/vacations">Vacations</NavLink>
                    <span> | </span>
                    <NavLink to="/ai-recommendation">Ai Recommendation</NavLink>
                    <span> | </span>

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

            <ConfirmModal
                isOpen={isConfirmOpen}
                title="Logout"
                message="Are you sure you want to log out?"
                variant="warning"
                confirmText="Logout"
                onConfirm={confirmLogout}
                onCancel={() => setIsConfirmOpen(false)}
            />
        </div>
    );
}
