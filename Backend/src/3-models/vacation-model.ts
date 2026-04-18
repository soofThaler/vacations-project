import Joi from "joi";
import { UploadedFile } from "express-fileupload";

export class VacationModel {
    public vacation_id: number;
    public destination: string;
    public description: string;
    public start_date: string;
    public end_date: string;
    public price: number;
    public image_name: string;
    public image?: UploadedFile;
    public likes_count: number;
    public is_liked: number;

    public constructor(vacation: VacationModel) {
        this.vacation_id = vacation.vacation_id;
        this.destination = vacation.destination;
        this.description = vacation.description;
        this.start_date = vacation.start_date;
        this.end_date = vacation.end_date;
        this.price = vacation.price;
        this.image_name = vacation.image_name;
        this.image = vacation.image;
        this.likes_count = vacation.likes_count;
        this.is_liked = vacation.is_liked;
    }

    private static readonly validationSchema = Joi.object({
        vacation_id: Joi.number().optional().positive(),
        destination: Joi.string().required().min(2).max(100),
        description: Joi.string().required().min(10).max(1000),
        start_date: Joi.string().required(),
        end_date: Joi.string().required(),
        price: Joi.number().required().min(0).max(10000),
        image_name: Joi.string().optional(),
        image: Joi.object().optional(),
        likes_count: Joi.number().optional(),
        is_liked: Joi.number().optional()
    });

    public validate(): string | undefined {
        const result = VacationModel.validationSchema.validate(this);
        if (result.error) return result.error.message;

        // Validate end_date >= start_date
        if (new Date(this.end_date) < new Date(this.start_date)) {
            return "End date cannot be before start date";
        }
    }
}