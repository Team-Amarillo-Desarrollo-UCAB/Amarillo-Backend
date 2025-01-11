export interface GetAllDiscountServiceResponseDto{
    id: string;
    name: string;
    description: string;
    percentage: number;
    initDate: Date;
    expireDate: Date;
    image?: string;
}