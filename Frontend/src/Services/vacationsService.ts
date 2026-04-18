import axios from "axios";
import { VacationModel } from "../Models/VacationModel";
import { appConfig } from "../Utils/AppConfig";
import { store } from "../Redux/store";
import { setVacations, addVacation, updateVacation, deleteVacation } from "../Redux/vacationsSlice";

class VacationsService {

    /**
     * Private helper to format dates from ISO string (YYYY-MM-DDTHH:mm:ss.sssZ) 
     * to a simple date string (YYYY-MM-DD) required by HTML date inputs and clean UI.
     */
    private formatVacationDates(vacation: VacationModel): VacationModel {
        if (vacation.start_date) vacation.start_date = vacation.start_date.split('T')[0];
        if (vacation.end_date) vacation.end_date = vacation.end_date.split('T')[0];
        return vacation;
    }

    // Get all vacations
    public async getAllVacations(page: number = 1, isLiked: boolean = false, isActive: boolean = false, isUpcoming: boolean = false): Promise<VacationModel[]> {

        // Build the URL with query parameters exactly as the backend expects them
        const url = `${appConfig.vacationsUrl}?page=${page}&isLiked=${isLiked}&isActive=${isActive}&isUpcoming=${isUpcoming}`;

        // Fetch from the backend with the new URL
        const response = await axios.get<VacationModel[]>(url);
        
        // Map through the results and format the dates for each vacation
        const vacations = response.data.map(v => this.formatVacationDates(v));
        
        // Save the result into Redux
        store.dispatch(setVacations(vacations));
        
        return vacations;
    }

    // Get one vacation by ID (now with date formatting)
    public async getOneVacation(id: number): Promise<VacationModel> {
        const response = await axios.get<VacationModel>(appConfig.vacationsUrl + id);
        
        // Format the dates before returning the object
        const vacation = this.formatVacationDates(response.data);
        
        return vacation;
    }

    // Add a new vacation (Admin only)
    public async addVacation(vacation: VacationModel): Promise<void> {
        // We must use FormData instead of a regular JSON object because we are sending an image file
        const formData = new FormData();
        formData.append("destination", vacation.destination);
        formData.append("description", vacation.description);
        formData.append("start_date", vacation.start_date);
        formData.append("end_date", vacation.end_date);
        formData.append("price", vacation.price.toString());
        
        if (vacation.image) {
            formData.append("image", vacation.image);
        }

        const response = await axios.post<VacationModel>(appConfig.vacationsUrl, formData);
        
        // Format dates for the returned object before saving to Redux
        const addedVacation = this.formatVacationDates(response.data);
        
        // Update Redux with the newly created vacation
        store.dispatch(addVacation(addedVacation));
    }

    // Update an existing vacation (Admin only)
    public async updateVacation(vacation: VacationModel): Promise<void> {
        const formData = new FormData();
        formData.append("destination", vacation.destination);
        formData.append("description", vacation.description);
        formData.append("start_date", vacation.start_date);
        formData.append("end_date", vacation.end_date);
        formData.append("price", vacation.price.toString());
        
        if (vacation.image) {
            formData.append("image", vacation.image);
        }

        const response = await axios.put<VacationModel>(appConfig.vacationsUrl + vacation.vacation_id, formData);
        
        // Format dates for the returned object before saving to Redux
        const updatedVacation = this.formatVacationDates(response.data);
        
        // Replace the old vacation with the updated one in Redux
        store.dispatch(updateVacation(updatedVacation));
    }

    // Delete a vacation (Admin only)
    public async deleteVacation(id: number): Promise<void> {
        await axios.delete(appConfig.vacationsUrl + id);
        
        // Remove the vacation from Redux
        store.dispatch(deleteVacation(id));
    }

    // Toggle a like for a vacation
    public async toggleLike(vacationId: number): Promise<void> {
        
        // 1. Find the specific vacation in the Redux store
        const vacation = store.getState().vacations.vacations.find(v => v.vacation_id === vacationId);

        // Safely check if it's liked (handles 1, "1", or true just in case)
        const isCurrentlyLiked = vacation && (vacation.is_liked === 1 || vacation.is_liked === true);

        let response;

        // 2. Decision logic:
        if (isCurrentlyLiked) {
            response = await axios.delete<VacationModel>(appConfig.likesUrl + vacationId);
        } else {
            response = await axios.post<VacationModel>(appConfig.likesUrl + vacationId, null);
        }

        // Format dates for the updated object from the server
        const updatedVacation = this.formatVacationDates(response.data); 
        
        // 3. FORCE THE STATE: Manually set the new is_liked status so Redux never gets confused
        updatedVacation.is_liked = isCurrentlyLiked ? 0 : 1;
        
        // 4. Update Redux
        store.dispatch(updateVacation(updatedVacation));
    }

    // Get data for the Admin Reports chart
public async getReportsData(): Promise<{ destination: string, likes_count: number }[]> {
    const response = await axios.get(appConfig.reportsDataUrl);
    return response.data;
}

// Download CSV securely (with JWT token)
public async downloadCsv(): Promise<void> {
    // 1. Fetch the file as a Blob 
    const response = await axios.get(appConfig.downloadCsvUrl, { responseType: "blob" });
    
    // 2. Create a virtual URL for the blob
    const blob = new Blob([response.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    
    // 3. Create a temporary anchor tag, click it, and remove it
    const a = document.createElement("a");
    a.href = url;
    a.download = "vacations.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url); // Clean up memory
}
}

export const vacationsService = new VacationsService();