import { Result } from 'src/common/domain/result-handler/Result';
import { ApplicationServiceEntryDto } from './dto/application-service-entry.dto';

//para todos los services apps que vayamos a hacer! ej crear orden
export interface IApplicationService<D extends ApplicationServiceEntryDto, R> {
  execute(data: D): Promise<Result<R>>;

  get name(): string;
}
