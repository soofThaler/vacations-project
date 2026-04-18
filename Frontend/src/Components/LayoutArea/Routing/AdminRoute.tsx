import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { AuthState } from "../../../Redux/authSlice";
import { ReactNode } from "react";

const ADMIN_ROLE_ID = 1;

interface AdminRouteProps {
    children: ReactNode;
}

export function AdminRoute(props: AdminRouteProps) {
    
    // 1. Get the current user from Redux
    const user = useSelector((state: { auth: AuthState }) => state.auth.user);

    // 2. Check if user is logged in AND is an admin
    if (!user || user.role_id !== ADMIN_ROLE_ID) {
        
        // notify.error("You are not authorized to view this page.");
        
        // 3. Redirect them to the main page 
        return <Navigate to="/vacations" />;
    }

    // 4. If all is good, render the protected component
    return <>{props.children}</>;
}