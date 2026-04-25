import dotenv from "dotenv";

dotenv.config({ quiet: true });

class AppConfig {
    public readonly isDevelopment = process.env.ENVIRONMENT === "development";
    public readonly isProduction = process.env.ENVIRONMENT === "production";
    public readonly port = Number(process.env.PORT);
    public readonly mysqlHost = process.env.MYSQL_HOST;
    public readonly mysqlUser = process.env.MYSQL_USER;
    public readonly mysqlPassword = process.env.MYSQL_PASSWORD;
    public readonly mysqlDatabase = process.env.MYSQL_DATABASE;
    public readonly hashSalt = process.env.HASH_SALT!;
    public readonly jwtSecret = process.env.JWT_SECRET!;
    public readonly recaptchaSecretKey = "YourRecaptchaSecretKeyHere";
    public readonly recaptchaUrl = "https://www.google.com/recaptcha/api/siteverify";
    public readonly openAiKey = process.env.OPEN_AI_KEY;
}

export const appConfig = new AppConfig();
