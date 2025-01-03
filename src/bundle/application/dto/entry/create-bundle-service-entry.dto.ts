import { BundleCurrency } from "src/bundle/domain/enum/bundle-currency-enum"
import { Measurement } from "src/bundle/domain/enum/measurement-enum"
import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto"

export interface CreateBundleServiceEntryDto extends ApplicationServiceEntryDto{
    name: string
    description: string
    images:string [ ] 
    price: number
    currency: BundleCurrency 
    weight: number
    measurement: Measurement
    stock: number
    category: string[
    // {
    // id: string
    // }
    ]
    productId:string[ ]
    caducityDate?:Date
    discount?:string;
}

