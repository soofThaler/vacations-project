import { NextFunction, Request, Response } from "express";
import { cyber } from "../2-utils/cyber";
import { UnauthorizedError } from "../3-models/client-errors";
import striptags from "striptags";

class SecurityMiddleware {
    // Make sure the request has a valid JWT token (user must be logged in)
    public verifyToken(request: Request, response: Response, next: NextFunction): void {
        const token = cyber.extractToken(request);
        if (!cyber.verifyToken(token)) {
            next(new UnauthorizedError("You are not logged-in."));
            return;
        }
        next();
    }

    // Make sure the request comes from an admin user (used on admin-only routes)
    public verifyAdmin(request: Request, response: Response, next: NextFunction): void {
        const token = cyber.extractToken(request);
        if (!cyber.verifyAdmin(token)) {
            next(new UnauthorizedError("You are not authorized."));
            return;
        }
        next();
    }

    // Make sure the token's user_id matches the :id in the URL (so a user can only act on their own data)
    public verifyMe(request: Request, response: Response, next: NextFunction): void {
        const token = cyber.extractToken(request);
        const tokenUserId = cyber.getTokenUserId(token);
        const routeId = +request.params.id;

        if (tokenUserId !== routeId) {
            next(new UnauthorizedError("You are not authorized."));
            return;
        }
        next();
    }

    // Strip HTML tags from every string field on the request body to prevent XSS
    public preventXss(request: Request, response: Response, next: NextFunction): void {
        for (const prop in request.body) {
            const value = request.body[prop];
            if (typeof value === "string") {
                request.body[prop] = striptags(value);
            }
        }
        next();
    }
}

export const securityMiddleware = new SecurityMiddleware();