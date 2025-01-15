import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { NotifyNewProductServiceEntryDto } from "../dto/entry/notify-new-product-service-entry.dto";
import { Result } from "src/common/domain/result-handler/Result";
import { INotificationAddressRepository } from "../../interface/notification-address-repository.interface";
import { INotificationAlertRepository } from "../../interface/notification-alert-repository.interface";
import { IProductRepository } from "src/product/domain/repositories/product-repository.interface";
import { IdGenerator } from "src/common/application/id-generator/id-generator.interface";
import { IPushSender } from "src/common/application/push-sender/push-sender.interface";
import { PushNotificationDto } from "src/common/application/push-sender/dto/send-notification-dto";
import { IDiscountRepository } from "src/discount/domain/repositories/discount.repository.interface";
import { NotifyNewProductServiceResponseDto } from "../dto/response/notify-new-product-service-response.dto";

export class NotifyNewProductService implements
    IApplicationService<NotifyNewProductServiceEntryDto, NotifyNewProductServiceResponseDto> {

    private readonly notiAddressRepository: INotificationAddressRepository
    private readonly notiAlertRepository: INotificationAlertRepository
    private readonly productRepository: IProductRepository
    private uuidGenerator: IdGenerator<string>
    private pushNotifier: IPushSender
    private readonly discountRepository: IDiscountRepository;


    constructor(
        notiAddressRepository: INotificationAddressRepository,
        notiAlertRepository: INotificationAlertRepository,
        productRepository: IProductRepository,

        uuidGenerator: IdGenerator<string>,
        pushNotifier: IPushSender,
        discountRepository: IDiscountRepository
    ) {
        this.notiAddressRepository = notiAddressRepository
        this.notiAlertRepository = notiAlertRepository
        this.uuidGenerator = uuidGenerator
        this.pushNotifier = pushNotifier
        this.productRepository = productRepository
        this.discountRepository = discountRepository

    }

    async execute(data: NotifyNewProductServiceEntryDto): Promise<Result<NotifyNewProductServiceResponseDto>> {

        const find_tokens = await this.notiAddressRepository.findAllTokens()
        if (!find_tokens.isSuccess())
            return Result.fail(find_tokens.Error, find_tokens.StatusCode, find_tokens.Message)

        const find_product = await this.productRepository.findProductById(data.id_product)
        if (!find_product.isSuccess())
            return Result.fail(find_product.Error, find_product.StatusCode, find_product.Message)

        const producto = find_product.Value

        let texto ='!'
        if(producto.Discount){
            console.log('Entramos al if de discountValue')
            const discount = await this.discountRepository.findDiscountById(producto.Discount.Value)
            texto = ` y viene con ${discount.Value.Percentage.Value*100}% de descuento! ${discount.Value.Name.Value}`
        }

        
        const listTokens = find_tokens.Value
        const pushTitle = 'NUEVO PRODUCTO DISPONIBLE!'
        const pushBody = producto.Name + " disponible por " + producto.Moneda + producto.Price + texto

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

        const r: NotifyNewProductServiceResponseDto={
            id_product: data.id_product
        }
        return Result.success(r, 200)

    }

    get name(): string {
        return this.constructor.name
    }

}