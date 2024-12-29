export interface GetProductByNameServiceResponseDTO{

    id_producto: string

    nombre: string

    precio: number

    moneda: string
    
    stock: number

    unidad_medida: string

    cantidad_medida: number

    descripcion: string

    images?: string[]

    caducityDate?:Date
    category?: string[]
    discount?:string


}