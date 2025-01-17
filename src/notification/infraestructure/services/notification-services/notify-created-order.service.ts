import { IApplicationService } from "src/common/application/application-services/application-service.interface"
import { NotifyCreatedOrderServiceEntryDTO } from "../dto/entry/notify-created-order-service-entry.dto"
import { INotificationAddressRepository } from "../../interface/notification-address-repository.interface"
import { INotificationAlertRepository } from "../../interface/notification-alert-repository.interface"
import { IOrderRepository } from "src/order/domain/repositories/order-repository.interface"
import { IdGenerator } from "src/common/application/id-generator/id-generator.interface"
import { IPushSender } from "src/common/application/push-sender/push-sender.interface"
import { Result } from "src/common/domain/result-handler/Result"
import { PushNotificationDto } from "src/common/application/push-sender/dto/send-notification-dto"

export class NotifyOrderCreatedService implements
    IApplicationService<NotifyCreatedOrderServiceEntryDTO, string> {

    private readonly notiAddressRepository: INotificationAddressRepository
    private readonly notiAlertRepository: INotificationAlertRepository
    private readonly ordenRepository: IOrderRepository
    private uuidGenerator: IdGenerator<string>
    private pushNotifier: IPushSender

    constructor(
        notiAddressRepository: INotificationAddressRepository,
        notiAlertRepository: INotificationAlertRepository,
        ordenRepository: IOrderRepository,

        uuidGenerator: IdGenerator<string>,
        pushNotifier: IPushSender,
    ) {
        this.notiAddressRepository = notiAddressRepository
        this.notiAlertRepository = notiAlertRepository
        this.uuidGenerator = uuidGenerator
        this.pushNotifier = pushNotifier
        this.ordenRepository = ordenRepository
    }

    async execute(data: NotifyCreatedOrderServiceEntryDTO): Promise<Result<string>> {

        try {
            const find_tokens = await this.notiAddressRepository.findAllTokensByUser(data.userId)
            if (!find_tokens.isSuccess())
                return Result.fail(find_tokens.Error, find_tokens.StatusCode, find_tokens.Message)

            const find_orden = await this.ordenRepository.findOrderById(data.id_orden)
            if (!find_orden.isSuccess())
                return Result.fail(find_orden.Error, find_orden.StatusCode, find_orden.Message)

            const orden = find_orden.Value
            const tokens = find_tokens.Value

            const pushTitle = 'Orden #' + orden.Id.Id.slice(-3) + ' creada'
            const pushBody = 'Su Orden #' + orden.Id.Id.slice(-3) + " ha sido creada Gracias por elegirnos"

            tokens.forEach(async token => {
                this.notiAlertRepository.saveNotificationAlert({
                    alert_id: await this.uuidGenerator.generateId(),
                    user_id: token.user_id,
                    title: pushTitle,
                    body: pushBody,
                    date: new Date(),
                    user_readed: false
                })
                const pushMessage: PushNotificationDto = {
                    token: token.token,
                    notification: {
                        title: pushTitle, body: pushBody
                    }
                }
                const result = await this.pushNotifier.sendNotificationPush(pushMessage)
                if (!result.isSuccess())
                    console.log('Error para el token ',token)

            })

            return Result.success('Notification push sended', 200)

        } catch (error) {
            return Result.fail(error, 500, error.message)
        }


    }

    get name(): string {
        return this.constructor.name
    }

} 