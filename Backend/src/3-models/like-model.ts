export class LikeModel {
    public user_id: number;
    public vacation_id: number;

    public constructor(like: LikeModel) {
        this.user_id = like.user_id;
        this.vacation_id = like.vacation_id;
    }
}