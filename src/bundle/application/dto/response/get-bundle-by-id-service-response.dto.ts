export interface GetBundleByIdServiceResponseDTO{
    id:string
    name: string
    description: string
    images:string [ ] //base-64
    price: number
    currency: string //(usd | bsf | eur)
    weight: number
    measurement: string //(kg,gr,mg,ml,lt,cm3)
    stock: number
    category: string[
    // {
    // id: string
    // }
    ]
    products:string[ ]
    caducityDate?:Date
    discount:string
 }