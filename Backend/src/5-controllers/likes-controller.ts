import express, { Request, Response, NextFunction, Router } from "express";
import { likeService } from "../4-services/like-service";
import { securityMiddleware } from "../6-middleware/security-middleware";
import { cyber } from "../2-utils/cyber";
import { StatusCode } from "../3-models/enums";

class LikesController {
    public readonly router: Router = express.Router();

    public constructor() {
        this.router.post("/api/likes/:vacation_id", securityMiddleware.verifyToken, this.addLike);
        this.router.delete("/api/likes/:vacation_id", securityMiddleware.verifyToken, this.deleteLike);
    }

    private async addLike(request: Request, response: Response, next: NextFunction) {
        try {
            const vacation_id = +request.params.vacation_id;
            const token = cyber.extractToken(request);
            const user_id = cyber.getTokenUserId(token);
            
            // 1. Add the like and get the updated vacation object from the service
            const updatedVacation = await likeService.addLike(user_id, vacation_id);
            
            // 2. Return status 201 AND the updated vacation as JSON
            response.status(StatusCode.Created).json(updatedVacation);
        } catch (err: any) {
            next(err);
        }
    }

    private async deleteLike(request: Request, response: Response, next: NextFunction) {
        try {
            const vacation_id = +request.params.vacation_id;
            const token = cyber.extractToken(request);
            const user_id = cyber.getTokenUserId(token);
            
            // 1. Delete the like and get the updated vacation object (with decreased like count)
            const updatedVacation = await likeService.deleteLike(user_id, vacation_id);
            
            // 2. Return status 200 (OK) with the updated object
            // We use status 200 instead of 204 (No Content) because we WANT to send the object back
            response.json(updatedVacation);
        } catch (err: any) {
            next(err);
        }
    }
}

export const likesController = new LikesController();