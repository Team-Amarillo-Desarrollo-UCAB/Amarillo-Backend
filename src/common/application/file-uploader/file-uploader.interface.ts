export interface IFileUploader
{
    UploadFile ( base64: string): Promise<string>
}