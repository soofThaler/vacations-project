import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VacationModel } from "../Models/VacationModel";

// Define the shape of the vacations state
export interface VacationsState {
    vacations: VacationModel[];
}

const initialState: VacationsState = {
    vacations: []
};

const vacationsSlice = createSlice({
    name: "vacations",
    initialState,
    reducers: {
        // Init all vacations (when fetching from server)
        setVacations: (state, action: PayloadAction<VacationModel[]>) => {
            state.vacations = action.payload;
        },
        // Add a single new vacation (Admin)
        addVacation: (state, action: PayloadAction<VacationModel>) => {
            state.vacations.push(action.payload);
        },
        // Update an existing vacation (Admin/Likes)
        updateVacation: (state, action: PayloadAction<VacationModel>) => {
            const index = state.vacations.findIndex(v => v.vacation_id === action.payload.vacation_id);
            if (index >= 0) {
                state.vacations[index] = action.payload;
            }
        },
        // Delete a vacation (Admin)
        deleteVacation: (state, action: PayloadAction<number>) => {
            const index = state.vacations.findIndex(v => v.vacation_id === action.payload);
            if (index >= 0) {
                state.vacations.splice(index, 1);
            }
        }
    }
});

export const { setVacations, addVacation, updateVacation, deleteVacation } = vacationsSlice.actions;
export const vacationsReducers = vacationsSlice.reducer;