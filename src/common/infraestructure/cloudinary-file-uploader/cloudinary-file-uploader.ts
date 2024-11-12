import { IFileUploader } from "src/common/application/file-uploader/file-uploader.interface";

export class CloudinaryFileUploader implements IFileUploader{
    
    UploadFile(file: File, fileName: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    
}