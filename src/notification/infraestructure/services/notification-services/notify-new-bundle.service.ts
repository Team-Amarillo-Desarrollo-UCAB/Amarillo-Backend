import { IBundleRepository } from "src/bundle/domain/repositories/bundle-repository.interface"
import { IApplicationService } from "src/common/application/application-services/application-service.interface"
import { IdGenerator } from "src/common/application/id-generator/id-generator.interface"
import { PushNotificationDto } from "src/common/application/push-sender/dto/send-notification-dto"
import { IPushSender } from "src/common/application/push-sender/push-sender.interface"
import { Result } from "src/common/domain/result-handler/Result"
import { IDiscountRepository } from "src/discount/domain/repositories/discount.repository.interface"
import { INotificationAddressRepository } from "../../interface/notification-address-repository.interface"
import { INotificationAlertRepository } from "../../interface/notification-alert-repository.interface"
import { NotifyNewBundleServiceEntryDto } from "../dto/entry/notify-new-bundle-service-entry.dto"
import { NotifyNewBundleServiceResponseDto } from "../dto/response/notify-new-bundle-service-response.dto"


export class NotifyNewBundleService implements
    IApplicationService<NotifyNewBundleServiceEntryDto, NotifyNewBundleServiceResponseDto> {

    private readonly notiAddressRepository: INotificationAddressRepository
    private readonly notiAlertRepository: INotificationAlertRepository
    private readonly bundleRepository: IBundleRepository
    private uuidGenerator: IdGenerator<string>
    private pushNotifier: IPushSender
    private readonly discountRepository: IDiscountRepository;


    constructor(
        notiAddressRepository: INotificationAddressRepository,
        notiAlertRepository: INotificationAlertRepository,
        bundleRepository: IBundleRepository,

        uuidGenerator: IdGenerator<string>,
        pushNotifier: IPushSender,
        discountRepository: IDiscountRepository
    ) {
        this.notiAddressRepository = notiAddressRepository
        this.notiAlertRepository = notiAlertRepository
        this.uuidGenerator = uuidGenerator
        this.pushNotifier = pushNotifier
        this.bundleRepository = bundleRepository
        this.discountRepository = discountRepository

    }

    async execute(data: NotifyNewBundleServiceEntryDto): Promise<Result<NotifyNewBundleServiceResponseDto>> {

        const find_tokens = await this.notiAddressRepository.findAllTokens()
        if (!find_tokens.isSuccess())
            return Result.fail(find_tokens.Error, find_tokens.StatusCode, find_tokens.Message)

        const find_bundle = await this.bundleRepository.findBundleById(data.id_bundle)
        if (!find_bundle.isSuccess())
            return Result.fail(find_bundle.Error, find_bundle.StatusCode, find_bundle.Message)

        const combo = find_bundle.Value

        let texto ='!'
        if(combo.Discount){
            console.log('Entramos al if de discountValue')
            const discount = await this.discountRepository.findDiscountById(combo.Discount.Value)
            texto = ` y viene con ${discount.Value.Percentage.Value*100}% de descuento! ${discount.Value.Name.Value}`
        }

        
        const listTokens = find_tokens.Value
        const pushTitle = 'NUEVO COMBO DISPONIBLE!'
        const pushBody = combo.name.Value + " disponible por " + combo.price.Currency + combo.price.Price + texto

        listTokens.forEach(async e => {
            this.notiAlertRepository.saveNotificationAlert({
                alert_id: await this.uuidGenerator.generateId(),
                user_id: e.user_id,
                title: pushTitle,
                body: pushBody,
                date: new Date(),
                user_readed: false
            })
            const pushMessage: PushNotificationDto = {
                token: e.token,
                notification: {
                    title: pushTitle, body: pushBody
                }
            }
            const result = await this.pushNotifier.sendNotificationPush(pushMessage)
            if (!result.isSuccess())
                return Result.fail<string>(result.Error, 500, result.Message)
        })

        const r: NotifyNewBundleServiceResponseDto={
            id_bundle: data.id_bundle
        }
        return Result.success(r, 200)

    }

    get name(): string {
        return this.constructor.name
    }

}
