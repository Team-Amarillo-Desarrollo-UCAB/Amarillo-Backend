import { ApplicationServiceEntryDto } from 'src/common/application/application-services/DTO/application-service-entry.dto';
export interface DeleteCategoryServiceEntryDto extends ApplicationServiceEntryDto {
    id: string; // ID de la categoría a eliminar
  }
  