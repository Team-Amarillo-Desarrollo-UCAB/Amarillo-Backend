export interface GetAllBundlesServiceResponseDTO{
    id: string
    name:string
    images: string [ ]
    price: number
    currency:string
    weight: number
    measurement: string
    stock:number
    discount:[{
    id:string,
    percentage:number //SOLO PORCENTAJE (0.20, 0.50…etc)
    }]
}