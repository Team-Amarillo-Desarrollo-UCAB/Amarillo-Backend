import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto";

export interface CreateCategoryServiceEntryDto extends ApplicationServiceEntryDto {
  name: string; // Nombre de la categoría
  icon?:string; // Ícono de la categoría (string o File?)
}
