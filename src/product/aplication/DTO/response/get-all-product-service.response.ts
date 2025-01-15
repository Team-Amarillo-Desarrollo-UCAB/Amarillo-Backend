export interface GetAllProductServiceResponseDTO{

    id: string

    name: string

    price: number

    currency: string
    
    stock: number

    measurement: string

    weight: number

    description: string

    images?: string[]

    caducityDate?:Date
    category?: string[]
    discount?:string
    image3d?:string

}