import { dal } from "../2-utils/dal";
import { cyber } from "../2-utils/cyber";
import { Role } from "../3-models/enums";
import { UserModel } from "../3-models/user-model";
import { CredentialsModel } from "../3-models/credentials-model";
import { ValidationError, UnauthorizedError } from "../3-models/client-errors";
import { OkPacketParams } from "mysql2";

class UserService {
    // Check if an email is already registered (used during register)
    private async isEmailTaken(email: string): Promise<boolean> {
        const sql = `SELECT COUNT(*) AS count FROM users WHERE email = ?`;
        const result = await dal.execute(sql, [email]) as any[];
        return result[0].count > 0;
    }

    // Register a new user and return a JWT token
    public async register(user: UserModel): Promise<string> {
        const error = user.validate();
        if (error) {
            throw new ValidationError(error);
        }

        const emailTaken = await this.isEmailTaken(user.email);
        if (emailTaken) {
            throw new ValidationError(`Email ${user.email} is already taken.`);
        }

        user.password = cyber.hash(user.password);
        user.role_id = Role.User;

        const sql = `INSERT INTO users(first_name, last_name, email, password, role_id)
                     VALUES(?, ?, ?, ?, ?)`;
        
        const values = [user.first_name, user.last_name, user.email, user.password, user.role_id];
        const info = await dal.execute(sql, values) as OkPacketParams;
        
        user.user_id = info.insertId!;
        
        const token = cyber.generateToken(user);
        return token;
    }

    // Log the user in and return a JWT token
    public async login(credentials: CredentialsModel): Promise<string> {
        const error = credentials.validate();
        if (error) {
            throw new ValidationError(error);
        }

        credentials.password = cyber.hash(credentials.password);

        const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;
        const values = [credentials.email, credentials.password];
        
        const users = await dal.execute(sql, values) as UserModel[];
        const user = users[0];

        if (!user) {
            throw new UnauthorizedError("Incorrect email or password.");
        }

        const token = cyber.generateToken(user);
        return token;
    }
}

export const userService = new UserService();