import { UploadedFile } from "express-fileupload";
import path from "path";
import { v4 as uuid } from "uuid";
import fsPromises from "fs/promises";
import fs from "fs";

const imagesFolder = path.join(__dirname, "..", "1-assets", "images");

if (!fs.existsSync(imagesFolder)) {
    fs.mkdirSync(imagesFolder, { recursive: true });
}

class ImageHandler {
    public async saveImage(image: UploadedFile): Promise<string> {
        const extension = image.name.substring(image.name.lastIndexOf("."));
        const uniqueName = uuid() + extension;
        const absolutePath = path.join(imagesFolder, uniqueName);
        await image.mv(absolutePath);
        return uniqueName;
    }

    public async updateImage(image: UploadedFile, existingImageName: string): Promise<string> {
        await this.deleteImage(existingImageName);
        const uniqueName = await this.saveImage(image);
        return uniqueName;
    }

    public async deleteImage(imageName: string): Promise<void> {
        try {
            if (!imageName) return;
            const absolutePath = path.join(imagesFolder, imageName);
            if (fs.existsSync(absolutePath)) {
                await fsPromises.unlink(absolutePath);
            }
        } catch (err: any) {
            console.error(err);
        }
    }
}

export const imageHandler = new ImageHandler();