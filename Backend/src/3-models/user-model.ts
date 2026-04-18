import Joi from "joi";

export class UserModel {
    public user_id: number;
    public first_name: string;
    public last_name: string;
    public email: string;
    public password: string;
    public role_id: number;

    public constructor(user: UserModel) {
        this.user_id = user.user_id;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.password = user.password;
        this.role_id = user.role_id;
    }

    private static readonly validationSchema = Joi.object({
        user_id: Joi.number().optional().positive(),
        first_name: Joi.string().required().min(2).max(50),
        last_name: Joi.string().required().min(2).max(50),
        email: Joi.string().required().email().max(100),
        password: Joi.string().required().min(4).max(255),
        role_id: Joi.number().optional()
    });

    public validate(): string | undefined {
        const result = UserModel.validationSchema.validate(this);
        return result.error?.message;
    }
}