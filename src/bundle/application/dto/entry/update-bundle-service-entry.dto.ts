import { ApplicationServiceEntryDto } from '../../../../../src/common/application/application-services/DTO/application-service-entry.dto';

export interface UpdateBundleServiceEntryDto extends ApplicationServiceEntryDto{
    
    name?: string
    description?: string
    images?:string [ ]// base-64
    price?: number
    currency?: string //(usd | bsf | eur)
    weight?: number
    measurement?: string //(kg,gr,mg,ml,lt,cm3)
    stock?: number
    category?: [
    {
    id: string
    }
    ]
    caducityDate?:Date
    productId?:string[ ]

}