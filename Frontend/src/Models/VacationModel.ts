export class VacationModel {
    public vacation_id!: number;
    public destination!: string;
    public description!: string;
    public start_date!: string; 
    public end_date!: string;
    public price!: number;
    public image_name!: string;
    
    public likes_count?: number;
    public is_liked?: boolean | number;
    public image?: File; 
}