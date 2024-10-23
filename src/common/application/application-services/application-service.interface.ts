import { Result } from 'src/common/domain/result-handler/Result';
import { ApplicationServiceEntryDto } from './DTO/application-service-entry.dto';

export interface IApplicationService<D extends ApplicationServiceEntryDto, R> {
  execute(data: D): Promise<Result<R>>;

  get name(): string;
}
