export class UserModel {
    public user_id!: number;
    public first_name!: string;
    public last_name!: string;
    public email!: string;
    public role_id!: number; // 1 for Admin, 2 for User
}