export interface GetAllDiscountServiceResponseDto{
    id: string;
    name: string;
    description: string;
    percentage: number;
    startDate: Date;
    deadline: Date;
    image?: string;
}