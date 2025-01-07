export interface GetProductByIdServiceResponseDTO{

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
    


}