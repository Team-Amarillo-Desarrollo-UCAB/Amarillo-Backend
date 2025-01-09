import { IFileUploader } from "src/common/Application/file-uploader/file-uploader.interface"


export class FileUploaderMock implements IFileUploader {

    async UploadFile(base64: string): Promise<string> {
        return  '_mocked_url.com' 
    }

}