import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto";

export interface CreateCategoryServiceEntryDto extends ApplicationServiceEntryDto {
  name: string; 
  image?:string; 
}
