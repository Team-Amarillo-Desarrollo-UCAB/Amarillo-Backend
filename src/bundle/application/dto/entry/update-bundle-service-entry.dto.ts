import { ApplicationServiceEntryDto } from '../../../../common/application/application-services/dto/application-service-entry.dto';

export interface UpdateBundleServiceEntryDto extends ApplicationServiceEntryDto{
    id:string
    name?: string
    description?: string
    images?:string [ ]// base-64
    price?: number
    currency?: string //(usd | bsf | eur)
    weight?: number
    measurement?: string //(kg,gr,mg,ml,lt,cm3)
    stock?: number
    category?: string[
        // {
        // id: string
        // }
        ]
    caducityDate?:Date
    productId?:string[ ]
    discount?:string

}