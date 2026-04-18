import Joi from "joi";

export class CredentialsModel {
    public email: string;
    public password: string;

    public constructor(credentials: CredentialsModel) {
        this.email = credentials.email;
        this.password = credentials.password;
    }

    private static readonly validationSchema = Joi.object({
        email: Joi.string().required().email().max(100),
        password: Joi.string().required().min(4).max(255)
    });

    public validate(): string | undefined {
        const result = CredentialsModel.validationSchema.validate(this);
        return result.error?.message;
    }
}