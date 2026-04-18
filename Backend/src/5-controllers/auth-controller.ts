import express, { Request, Response, NextFunction, Router } from "express";
import { userService } from "../4-services/user-service";
import { UserModel } from "../3-models/user-model";
import { CredentialsModel } from "../3-models/credentials-model";
import { StatusCode } from "../3-models/enums";

class AuthController {
    public readonly router: Router = express.Router();

    public constructor() {
        this.router.post("/api/register", this.register);
        this.router.post("/api/login", this.login);
    }

    // Register a new user, returns the JWT token so the client can log in right away
    private async register(request: Request, response: Response, next: NextFunction) {
        try {
            const user = new UserModel(request.body);
            const token = await userService.register(user);
            response.status(StatusCode.Created).json(token);
        } catch (err: any) {
            next(err);
        }
    }

    // Log the user in and return a fresh JWT token
    private async login(request: Request, response: Response, next: NextFunction) {
        try {
            const credentials = new CredentialsModel(request.body);
            const token = await userService.login(credentials);
            response.json(token);
        } catch (err: any) {
            next(err);
        }
    }
}

export const authController = new AuthController();