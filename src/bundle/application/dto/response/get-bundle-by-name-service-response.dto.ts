export interface GetBundleByNameServiceResponseDTO{
    name: string
    description: string
    images:string [ ] //base-64
    price: number
    currency: string //(usd | bsf | eur)
    weight: number
    measurement: string //(kg,gr,mg,ml,lt,cm3)
    stock: number
    category: [
    {
    id: string
    }
    ]
    productId:string[ ]
    caducityDate?:Date
    discount:string
 }