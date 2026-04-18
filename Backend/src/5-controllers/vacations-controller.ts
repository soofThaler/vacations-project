import express, { Request, Response, NextFunction, Router } from "express";
import path from "path";
import fs from "fs";
import { vacationService } from "../4-services/vacation-service";
import { StatusCode } from "../3-models/enums";
import { VacationModel } from "../3-models/vacation-model";
import { RouteNotFoundError } from "../3-models/client-errors";
import { securityMiddleware } from "../6-middleware/security-middleware";
import { cyber } from "../2-utils/cyber";
import { aiService } from "../4-services/ai-service";

class VacationsController {
    public readonly router: Router = express.Router();

    public constructor() {
        this.router.get("/api/vacations", securityMiddleware.verifyToken, this.getAllVacations);
        this.router.get("/api/vacations/download/csv", securityMiddleware.verifyAdmin, this.downloadCsv);
        this.router.get("/api/vacations/reports/data", securityMiddleware.verifyAdmin, this.getReportsData);
        this.router.get("/api/vacations/images/:imageName", this.getImage);
        this.router.get("/api/vacations/ai/recommendation/:destination", securityMiddleware.verifyToken, this.getAiRecommendation);
        this.router.get("/api/vacations/:id", securityMiddleware.verifyToken, this.getOneVacation);
        this.router.post("/api/vacations", securityMiddleware.verifyAdmin, this.addVacation);
        this.router.put("/api/vacations/:id", securityMiddleware.verifyAdmin, this.updateVacation);
        this.router.delete("/api/vacations/:id", securityMiddleware.verifyAdmin, this.deleteVacation);
    }

    // Get all vacations (with pagination + optional liked / active / upcoming filters)
    private async getAllVacations(request: Request, response: Response, next: NextFunction) {
        try {
            const token = cyber.extractToken(request);
            const userId = cyber.getTokenUserId(token);
            
            const page = +(request.query.page || 1);
            const isLiked = request.query.isLiked === 'true';
            const isActive = request.query.isActive === 'true';
            const isUpcoming = request.query.isUpcoming === 'true';

            const vacations = await vacationService.getAllVacations(userId, page, isLiked, isActive, isUpcoming);
            response.json(vacations);
        } catch (err: any) {
            next(err);
        }
    }

    // Download the vacations list as a CSV file (Admin only)
    private async downloadCsv(request: Request, response: Response, next: NextFunction) {
        try {
            const vacations = await vacationService.getVacationsForCsv();
            
            let csv = "Destination,Likes\n";
            for (const item of vacations) {
                csv += `"${item.destination}",${item.likes_count}\n`;
            }

            response.setHeader("Content-Type", "text/csv");
            response.setHeader("Content-Disposition", "attachment; filename=vacations.csv");
            response.send(csv);
        } catch (err: any) {
            next(err);
        }
    }

    // Return the same aggregated data as JSON for the reports page chart (Admin only)
    private async getReportsData(request: Request, response: Response, next: NextFunction) {
    try {
        // We reuse the exact same service method used for CSV
        const vacations = await vacationService.getVacationsForCsv();
        response.json(vacations);
    } catch (err: any) {
        next(err);
    }
}

    // Serve a vacation image from the assets folder (returns 404 if the file is missing)
    private async getImage(request: Request, response: Response, next: NextFunction) {
        try {
            const imageName = request.params.imageName;
            const absolutePath = path.join(__dirname, "..", "1-assets", "images", imageName);
            
            if (!fs.existsSync(absolutePath)) {
                throw new RouteNotFoundError(request.originalUrl);
            }
            
            response.sendFile(absolutePath);
        } catch (err: any) {
            next(err);
        }
    }

    // Get a single vacation by id
    private async getOneVacation(request: Request, response: Response, next: NextFunction) {
        try {
            const id = +request.params.id;
            const token = cyber.extractToken(request);
            const userId = cyber.getTokenUserId(token);
            const vacation = await vacationService.getOneVacation(id, userId);
            response.json(vacation);
        } catch (err: any) {
            next(err);
        }
    }

    // Add a new vacation (Admin only), the image file comes in as multipart/form-data
    private async addVacation(request: Request, response: Response, next: NextFunction) {
        try {
            request.body.image = request.files?.image;
            const vacation = new VacationModel(request.body);
            const addedVacation = await vacationService.addVacation(vacation);
            response.status(StatusCode.Created).json(addedVacation);
        } catch (err: any) {
            next(err);
        }
    }

    // Update an existing vacation (Admin only), also supports swapping the image
    private async updateVacation(request: Request, response: Response, next: NextFunction) {
        try {
            const id = +request.params.id;
            request.body.vacation_id = id;
            request.body.image = request.files?.image;
            const vacation = new VacationModel(request.body);
            const updatedVacation = await vacationService.updateVacation(vacation);
            response.json(updatedVacation);
        } catch (err: any) {
            next(err);
        }
    }

    // Delete a vacation (Admin only)
    private async deleteVacation(request: Request, response: Response, next: NextFunction) {
        try {
            const id = +request.params.id;
            await vacationService.deleteVacation(id);
            response.sendStatus(StatusCode.NoContent);
        } catch (err: any) {
            next(err);
        }
    }

    // Get a short AI-generated travel recommendation for a given destination
    private async getAiRecommendation(request: Request, response: Response, next: NextFunction) {
        try {
            const destination = request.params.destination;
            const recommendation = await aiService.getRecommendation(destination);
            response.json({ recommendation });
        } catch (err: any) {
            next(err);
        }
    }
}

export const vacationsController = new VacationsController();