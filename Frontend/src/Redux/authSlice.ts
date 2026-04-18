import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserModel } from "../Models/UserModel";
import { jwtDecode } from "jwt-decode";

// Define the shape of the authentication state
export interface AuthState {
    user: UserModel | null;
    token: string | null;
}

// Function to initialize state from localStorage (keeps user logged in after refresh)
const loadStateFromLocalStorage = (): AuthState => {
    const token = localStorage.getItem("token");
    if (token) {
        try {
            const container: { user: UserModel } = jwtDecode(token);
            return { user: container.user, token };
        } catch (error) {
            console.error("Invalid token found in local storage");
            localStorage.removeItem("token");
        }
    }
    return { user: null, token: null };
};

const initialState: AuthState = loadStateFromLocalStorage();

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Reducer for login and register
        loginUser: (state, action: PayloadAction<string>) => {
            const token = action.payload;
            const container: { user: UserModel } = jwtDecode(token);
            state.token = token;
            state.user = container.user;
            localStorage.setItem("token", token);
        },
        // Reducer for logout
        logoutUser: (state) => {
            state.token = null;
            state.user = null;
            localStorage.removeItem("token");
        }
    }
});

export const { loginUser, logoutUser } = authSlice.actions;
export const authReducers = authSlice.reducer;