import crypto from "crypto";
import jwt, { SignOptions } from "jsonwebtoken";
import { Role } from "../3-models/enums";
import { UserModel } from "../3-models/user-model";
import { appConfig } from "./app-config";
import { Request } from "express";

class Cyber {
    public hash(plainText: string): string {
        const hashText = crypto.createHmac("sha512", appConfig.hashSalt).update(plainText).digest("hex");
        return hashText;
    }

    public generateToken(user: UserModel): string {
        delete (user as any).password;
        const payload = { user };
        const options: SignOptions = { expiresIn: "3h" };
        const token = jwt.sign(payload, appConfig.jwtSecret, options);
        return token;
    }

    public extractToken(request: Request): string {
        const authorization = request.headers.authorization;
        const token = authorization?.substring(7)!;
        return token;
    }

    public verifyToken(token: string): boolean {
        try {
            if (!token) return false;
            jwt.verify(token, appConfig.jwtSecret);
            return true;
        } catch {
            return false;
        }
    }

    public verifyAdmin(token: string): boolean {
        try {
            if (!token) return false;
            jwt.verify(token, appConfig.jwtSecret);
            const payload = jwt.decode(token) as { user: UserModel };
            const user = payload.user;
            return user.role_id === Role.Admin;
        } catch {
            return false;
        }
    }

    public getTokenUserId(token: string): number {
        try {
            const payload = jwt.decode(token) as { user: UserModel };
            const user = payload.user;
            return user.user_id;
        } catch {
            return 0;
        }
    }
}

export const cyber = new Cyber();