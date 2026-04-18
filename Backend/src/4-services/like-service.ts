import { dal } from "../2-utils/dal";
import { VacationModel } from "../3-models/vacation-model";

class LikeService {

    // Added user_id parameter to check if the current user liked the vacation
    private async getOneVacation(vacation_id: number, user_id: number): Promise<any> {
        const sql = `
            SELECT 
                V.vacation_id,
                V.destination,
                V.description,
                V.start_date,
                V.end_date,
                V.price,
                V.image_name,
                COUNT(L.user_id) AS likes_count,
                -- Returns 1 if this specific user liked it, 0 otherwise
                EXISTS(SELECT 1 FROM likes WHERE vacation_id = ? AND user_id = ?) AS is_liked
            FROM vacations AS V
            LEFT JOIN likes AS L ON V.vacation_id = L.vacation_id
            WHERE V.vacation_id = ?
            GROUP BY V.vacation_id
        `;
        
        // Pass parameters matching the '?' order: vacation_id, user_id, vacation_id
        const result: any = await dal.execute(sql, [vacation_id, user_id, vacation_id]);

        // If no record found, return undefined to prevent crashes
        if (!result || result.length === 0) return undefined;

        return result[0];
    }

    public async addLike(user_id: number, vacation_id: number): Promise<any> {
        // Using snake_case column names as defined in your vacation_management schema
        const sql = `INSERT IGNORE INTO likes(user_id, vacation_id) VALUES(?, ?)`;
        await dal.execute(sql, [user_id, vacation_id]);
        
        // Pass user_id to ensure the returned vacation includes is_liked: 1
        return await this.getOneVacation(vacation_id, user_id);
    }

    public async deleteLike(user_id: number, vacation_id: number): Promise<any> {
        // Ensure column names match your SQL CREATE TABLE exactly
        const sql = `DELETE FROM likes WHERE user_id = ? AND vacation_id = ?`;
        await dal.execute(sql, [user_id, vacation_id]);
        
        // Pass user_id to ensure the returned vacation includes is_liked: 0
        return await this.getOneVacation(vacation_id, user_id);
    }
}

export const likeService = new LikeService();