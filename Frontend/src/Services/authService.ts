import axios from "axios";
import { appConfig } from "../Utils/AppConfig";
import { store } from "../Redux/store";
import { loginUser, logoutUser } from "../Redux/authSlice";
import { UserModel } from "../Models/UserModel";
import { CredentialsModel } from "../Models/CredentialsModel";

class AuthService {

    // Register a new user
    public async register(user: UserModel): Promise<void> {
        // Send user data to the server
        const response = await axios.post<string>(appConfig.registerUrl, user);
        
        // The server returns a JWT token upon successful registration
        const token = response.data;
        
        // Dispatch the token to Redux to log the user in immediately
        store.dispatch(loginUser(token));
    }

    // Login an existing user
    public async login(credentials: CredentialsModel): Promise<void> {
        // Send email and password to the server
        const response = await axios.post<string>(appConfig.loginUrl, credentials);
        
        // The server returns a JWT token upon successful login
        const token = response.data;
        
        // Dispatch the token to Redux to log the user in
        store.dispatch(loginUser(token));
    }

    // Logout the current user
    public logout(): void {
        // Dispatch the logout action to clear Redux and localStorage
        store.dispatch(logoutUser());
    }

}

export const authService = new AuthService();