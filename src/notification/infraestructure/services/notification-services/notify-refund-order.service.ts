import { IApplicationService } from "src/common/application/application-services/application-service.interface"
import { INotificationAddressRepository } from "../../interface/notification-address-repository.interface"
import { INotificationAlertRepository } from "../../interface/notification-alert-repository.interface"
import { IOrderRepository } from "src/order/domain/repositories/order-repository.interface"
import { IdGenerator } from "src/common/application/id-generator/id-generator.interface"
import { IPushSender } from "src/common/application/push-sender/push-sender.interface"
import { Result } from "src/common/domain/result-handler/Result"
import { NotifyRefundOrderServiceEntryDTO } from "../dto/entry/notify-refund-order-service-entry.dto"
import { PushNotificationDto } from "src/common/application/push-sender/dto/send-notification-dto"

export class NotifyRefundOrderService implements
    IApplicationService<NotifyRefundOrderServiceEntryDTO, string> {

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

    async execute(data: NotifyRefundOrderServiceEntryDTO): Promise<Result<string>> {

        const find_tokens = await this.notiAddressRepository.findAllTokensByUser(data.userId)
        if (!find_tokens.isSuccess())
            return Result.fail(find_tokens.Error, find_tokens.StatusCode, find_tokens.Message)

        const find_orden = await this.ordenRepository.findOrderById(data.id_orden)
        if (!find_orden.isSuccess())
            return Result.fail(find_orden.Error, find_orden.StatusCode, find_orden.Message)

        const orden = find_orden.Value
        const tokens = find_tokens.Value
        const pushTitle = 'Orden #' + orden.Id.Id.slice(-3) + ' reembolsada'
        const pushBody = 'La orden #' + orden.Id.Id.slice(-3) + " ha sido reembolsada por la cantidad de " + data.monto_reembolsado + orden.Payment.CurrencyPayment().Currency

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

    }

    get name(): string {
        return this.constructor.name
    }

}
