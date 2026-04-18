import { configureStore } from "@reduxjs/toolkit";
import { authReducers } from "./authSlice";
import { vacationsReducers } from "./vacationsSlice";

// Create the global Redux store containing all slices
export const store = configureStore({
    reducer: {
        auth: authReducers,
        vacations: vacationsReducers
    },
    // Middleware configuration to prevent serialization warnings with Date objects or Files
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: false
        })
});

// Export types for TypeScript to know the structure of our state
export type RootState = ReturnType<typeof store.getState>;