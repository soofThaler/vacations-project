import axios, { InternalAxiosRequestConfig } from "axios";

class Interceptor {
    public create(): void {

        // 1. Request Interceptor: Inject token into headers before request leaves
        axios.interceptors.request.use((httpRequest: InternalAxiosRequestConfig) => {
            const token = localStorage.getItem("token");
            
            if (token) {
                httpRequest.headers.Authorization = "Bearer " + token;
            }
            
            return httpRequest;
        });

        // 2. Response Interceptor: Handle server responses globally
        axios.interceptors.response.use(
            (response) => {
                // Pass through successful responses
                return response;
            },
            (error) => {
                // If token is expired or invalid (401 Unauthorized)
                if (error.response && error.response.status === 401) {
                    const url = error.config?.url || "";
                    const isAuthRoute = url.includes("/api/login") || url.includes("/api/register");

                    // Only redirect if this is NOT a login/register attempt
                    // (auth routes should show error notifications, not redirect)
                    if (!isAuthRoute) {
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                    }
                }

                // Reject the promise to let components handle their specific UI states
                return Promise.reject(error);
            }
        );
    }
}

export const interceptor = new Interceptor();