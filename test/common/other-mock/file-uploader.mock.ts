import { IFileUploader } from "src/common/Application/file-uploader/file-uploader.interface"


export class FileUploaderMock implements IFileUploader {

    UploadFile(base64: string): Promise<string> {
        throw new Error("Method not implemented.");
    }

}