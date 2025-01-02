import { BundleCurrency } from 'src/bundle/domain/enum/bundle-currency-enum';
import { ApplicationServiceEntryDto } from '../../../../common/application/application-services/DTO/application-service-entry.dto';
import { Measurement } from 'src/common/domain/enum/commons-enums/measurement-enum';

export interface UpdateBundleServiceEntryDto extends ApplicationServiceEntryDto{
    id:string
    name?: string
    description?: string
    images?:string [ ]// base-64
    price?: number
    currency?: BundleCurrency //(usd | bsf | eur)
    weight?: number
    measurement?: Measurement //(kg,gr,mg,ml,lt,cm3)
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