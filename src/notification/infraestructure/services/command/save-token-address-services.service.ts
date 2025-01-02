import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { INotificationAddressRepository } from "../../interface/notification-address-repository.interface";
import { SaveTokenAddressServiceEntryDto } from "../dto/entry/save-token-address-service-entry.dto";
import { SaveTokenServiceResponseDTO } from "../dto/response/save-token-service-response";

export class SaveTokenAddressInfraService implements
    IApplicationService<SaveTokenAddressServiceEntryDto, SaveTokenServiceResponseDTO> {

    private readonly notiAddressRepository: INotificationAddressRepository

    constructor(
        notiAddressRepository: INotificationAddressRepository,
    ) {
        this.notiAddressRepository = notiAddressRepository
    }

    async execute(saveTokenDto: SaveTokenAddressServiceEntryDto): Promise<Result<SaveTokenServiceResponseDTO>> {
        const saveResult = await this.notiAddressRepository.saveNotificationAddress({
            token: saveTokenDto.token,
            user_id: saveTokenDto.userId
        })

        if (!saveResult.isSuccess())
            return Result.fail<SaveTokenServiceResponseDTO>(saveResult.Error, saveResult.StatusCode, saveResult.Message)

        const response: SaveTokenServiceResponseDTO = {
            user_id: saveResult.Value.user_id,
            token: saveResult.Value.token
        }

        return Result.success(response, 200)
    }

    get name(): string { return this.constructor.name }

}