export interface GetDiscountByIdServiceResponseDto{
    id: string;
    name: string;
    description: string;
    percentage: number;
    startDate: Date;
    deadline: Date;
}