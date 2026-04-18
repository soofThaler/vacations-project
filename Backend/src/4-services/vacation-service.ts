import { dal } from "../2-utils/dal";
import { VacationModel } from "../3-models/vacation-model";
import { ResourceNotFoundError, ValidationError } from "../3-models/client-errors";
import { imageHandler } from "../2-utils/image-handler";

class VacationService {
    // Get all vacations with pagination + optional liked / active / upcoming filters
    public async getAllVacations(userId: number, page: number, isLiked: boolean, isActive: boolean, isUpcoming: boolean): Promise<VacationModel[]> {
        const pageSize = 9;
        const offset = (page - 1) * pageSize;
        
        let sql = `
            SELECT V.*,
                   COUNT(L.user_id) AS likes_count,
                   EXISTS(SELECT 1 FROM likes WHERE vacation_id = V.vacation_id AND user_id = ?) AS is_liked
            FROM vacations V
            LEFT JOIN likes L ON V.vacation_id = L.vacation_id
        `;
        
        const values: any[] = [userId];
        const conditions: string[] = [];

        if (isLiked) {
            conditions.push(`EXISTS(SELECT 1 FROM likes WHERE vacation_id = V.vacation_id AND user_id = ?)`);
            values.push(userId);
        }
        if (isActive) {
            conditions.push(`CURDATE() BETWEEN V.start_date AND V.end_date`);
        }
        if (isUpcoming) {
            conditions.push(`V.start_date > CURDATE()`);
        }

        if (conditions.length > 0) {
            sql += ` WHERE ` + conditions.join(' AND ');
        }

        sql += `
            GROUP BY V.vacation_id
            ORDER BY V.start_date
            LIMIT ? OFFSET ?
        `;
        
        values.push(pageSize, offset);

        const vacations = await dal.execute(sql, values) as VacationModel[];
        return vacations;
    }

    // Aggregated vacations (destination + likes count) used by both the CSV download and the reports page
    public async getVacationsForCsv(): Promise<any[]> {
        const sql = `
            SELECT V.destination, COUNT(L.user_id) AS likes_count
            FROM vacations V
            LEFT JOIN likes L ON V.vacation_id = L.vacation_id
            GROUP BY V.vacation_id
        `;
        const vacations = await dal.execute(sql) as any[];
        return vacations;
    }

    // Get a single vacation by id (includes likes_count and is_liked for the current user)
    public async getOneVacation(id: number, userId: number = 0): Promise<VacationModel> {
        const sql = `
            SELECT V.*,
                   COUNT(L.user_id) AS likes_count,
                   EXISTS(SELECT 1 FROM likes WHERE vacation_id = V.vacation_id AND user_id = ?) AS is_liked
            FROM vacations V
            LEFT JOIN likes L ON V.vacation_id = L.vacation_id
            WHERE V.vacation_id = ?
            GROUP BY V.vacation_id
        `;
        const vacations = await dal.execute(sql, [userId, id]) as VacationModel[];
        const vacation = vacations[0];
        
        if (!vacation) {
            throw new ResourceNotFoundError(id);
        }
        
        return vacation;
    }

    // Add a new vacation (Admin only), saves the uploaded image to disk if one was provided
    public async addVacation(vacation: VacationModel): Promise<VacationModel> {
        const error = vacation.validate();
        if (error) {
            throw new ValidationError(error);
        }

        if (vacation.image) {
            vacation.image_name = await imageHandler.saveImage(vacation.image);
        }

        const sql = `INSERT INTO vacations(destination, description, start_date, end_date, price, image_name)
                     VALUES(?, ?, ?, ?, ?, ?)`;

        const values = [vacation.destination, vacation.description, vacation.start_date, vacation.end_date, vacation.price, vacation.image_name];

        const info: any = await dal.execute(sql, values);
        
        vacation.vacation_id = info.insertId;
        delete vacation.image;

        return vacation;
    }

    // Update an existing vacation (Admin only), handles an optional new image upload
    public async updateVacation(vacation: VacationModel): Promise<VacationModel> {
        const error = vacation.validate();
        if (error) {
            throw new ValidationError(error);
        }

        const existingVacation = await this.getOneVacation(vacation.vacation_id);
        vacation.image_name = existingVacation.image_name;

        if (vacation.image) {
            vacation.image_name = await imageHandler.updateImage(vacation.image, existingVacation.image_name);
        }

        const sql = `UPDATE vacations SET
                        destination = ?,
                        description = ?,
                        start_date = ?,
                        end_date = ?,
                        price = ?,
                        image_name = ?
                     WHERE vacation_id = ?`;

        const values = [vacation.destination, vacation.description, vacation.start_date, vacation.end_date, vacation.price, vacation.image_name, vacation.vacation_id];

        const info: any = await dal.execute(sql, values);

        if (info.affectedRows === 0) {
            throw new ResourceNotFoundError(vacation.vacation_id);
        }

        delete vacation.image;

        return vacation;
    }

    // Delete a vacation (Admin only) and remove its image file from disk
    public async deleteVacation(id: number): Promise<void> {
        const existingVacation = await this.getOneVacation(id);
        
        const sql = `DELETE FROM vacations WHERE vacation_id = ?`;
        const info: any = await dal.execute(sql, [id]);

        if (info.affectedRows === 0) {
            throw new ResourceNotFoundError(id);
        }

        await imageHandler.deleteImage(existingVacation.image_name);
    }

    // Stats used by the chat assistant: active vacations count + average price
    public async getVacationStats(): Promise<any> {
        const sql = `
            SELECT 
                (SELECT COUNT(*) FROM vacations WHERE CURDATE() BETWEEN start_date AND end_date) AS active_vacations,
                (SELECT AVG(price) FROM vacations) AS average_price
        `;
        const result = await dal.execute(sql) as any[];
        return result[0];
    }

    // Flat list of upcoming vacations used by the chat / MCP tool
    public async getUpcomingVacationsForMcp(): Promise<any[]> {
        const sql = `SELECT destination, start_date, end_date, price FROM vacations WHERE start_date > CURDATE()`;
        return await dal.execute(sql) as any[];
    }
}

export const vacationService = new VacationService();