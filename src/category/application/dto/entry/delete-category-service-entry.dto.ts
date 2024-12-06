import { ApplicationServiceEntryDto } from 'src/common/application/application-services/dto/application-service-entry.dto';
export interface DeleteCategoryServiceEntryDto extends ApplicationServiceEntryDto {
    id: string; // ID de la categoría a eliminar
  }
  