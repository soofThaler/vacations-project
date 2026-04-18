import { Navigate, Route, Routes } from "react-router-dom";
import { Page404 } from "../../PagesArea/Page404/Page404";
import { Login } from "../../AuthArea/Login/login";
import { Vacations } from "../../PagesArea/Vacations/Vacations"; 
import { Register } from "../../AuthArea/Register/Register";
import { AiRecommendation } from "../../PagesArea/AiRecommendation/AiRecommendation";

// 1. Import the AdminRoute guard
import { AdminRoute } from "./AdminRoute"; 

// 2. Imports for Admin components - Add and Edit are now active!
import { AdminVacations } from "../../PagesArea/AdminArea/AdminVacations/AdminVacations";
import { AddVacation } from "../../PagesArea/AdminArea/AddVacation/AddVacation";
import { EditVacation } from "../../PagesArea/AdminArea/EditVacation/EditVacation";
 import { Reports } from "../../PagesArea/AdminArea/Reports/Reports";

export function Routing() {
    return (
        <Routes>
            {/* Default route redirects to vacations */}
            <Route path="/" element={<Navigate to="/vacations" />} />

            {/* Auth routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            
            {/* Main content routes */}
            <Route path="/vacations" element={<Vacations />} />
            
            {/* ai recommendation routes*/}
            <Route path="/ai-recommendation" element={<AiRecommendation />} />

            {/* --- Admin Protected Routes --- */}
            
            {/* Main Admin List */}
            <Route path="/admin/vacations" element={<AdminRoute><AdminVacations /></AdminRoute>} />
            
            {/* Add New Vacation */}
            <Route path="/admin/vacations/new" element={<AdminRoute><AddVacation /></AdminRoute>} />
            
            {/* Edit Existing Vacation - note the :id parameter */}
            <Route path="/admin/vacations/edit/:id" element={<AdminRoute><EditVacation /></AdminRoute>} />
            
            {/* Reports - keeping this commented until we build the component */}
            <Route path="/admin/reports" element={<AdminRoute><Reports /></AdminRoute>} />

            {/* Page not found route */}
            <Route path="*" element={<Page404 />} />
        </Routes>
    );
}