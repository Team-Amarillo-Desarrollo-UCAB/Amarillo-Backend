export interface GetProductByIdServiceResponseDTO{

    id:string;

    name: string

    price: number

    currency: string
    
    stock: number

    measurement: string

    weight:number

    description: string

    images: string[]

    caducityDate?:Date
    categories?: string[]
    discount?:string
    image3d?:string;
    


}