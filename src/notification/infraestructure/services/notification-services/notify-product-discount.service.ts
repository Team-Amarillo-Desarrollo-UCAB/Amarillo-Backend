import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { Result } from "src/common/domain/result-handler/Result";
import { INotificationAddressRepository } from "../../interface/notification-address-repository.interface";
import { INotificationAlertRepository } from "../../interface/notification-alert-repository.interface";
import { IProductRepository } from "src/product/domain/repositories/product-repository.interface";  // Cambio de bundleRepository por productRepository
import { IdGenerator } from "src/common/application/id-generator/id-generator.interface";
import { IPushSender } from "src/common/application/push-sender/push-sender.interface";
import { PushNotificationDto } from "src/common/application/push-sender/dto/send-notification-dto";
import { IDiscountRepository } from "src/discount/domain/repositories/discount.repository.interface";
import { NotifyProductDiscountServiceResponseDTO } from "../dto/response/notify-product-response.dto";
import { NotifyProductDiscountServiceEntryDTO } from "../dto/entry/notify-product-discount-service-entry.dto";

export class NotifyProductDiscountService implements 
    IApplicationService<NotifyProductDiscountServiceEntryDTO, NotifyProductDiscountServiceResponseDTO> {  

    private readonly notiAddressRepository: INotificationAddressRepository;
    private readonly notiAlertRepository: INotificationAlertRepository;
    private readonly productRepository: IProductRepository;  
    private readonly uuidGenerator: IdGenerator<string>;
    private readonly pushNotifier: IPushSender;
    private readonly discountRepository: IDiscountRepository;

    constructor(
        notiAddressRepository: INotificationAddressRepository,
        notiAlertRepository: INotificationAlertRepository,
        productRepository: IProductRepository,  
        uuidGenerator: IdGenerator<string>,
        pushNotifier: IPushSender,
        discountRepository: IDiscountRepository
    ) {
        this.notiAddressRepository = notiAddressRepository;
        this.notiAlertRepository = notiAlertRepository;
        this.productRepository = productRepository;  
        this.uuidGenerator = uuidGenerator;
        this.pushNotifier = pushNotifier;
        this.discountRepository = discountRepository
    }

    async execute(data: NotifyProductDiscountServiceEntryDTO): Promise<Result<NotifyProductDiscountServiceResponseDTO>> { 
        const findTokens = await this.notiAddressRepository.findAllTokens();
        if (!findTokens.isSuccess()) {
            return Result.fail(findTokens.Error, findTokens.StatusCode, findTokens.Message);
        }

        const listTokens = findTokens.Value;

        //for (const productName of data.products_names) 
            const productDiscount = await this.productRepository.findProductById(data.product_id)
            if (!productDiscount.isSuccess()) {
                return Result.fail(productDiscount.Error, productDiscount.StatusCode, productDiscount.Message);
            }

            const productV = productDiscount.Value; 

            const discount = await this.discountRepository.findDiscountById(productV.Discount.Value);

            if (!discount.isSuccess()) {
                return Result.fail(discount.Error, discount.StatusCode, discount.Message);
            }

            const pushTitle = "¡NUEVO DESCUENTO! ¡VACÍLATELO!";
            const pushBody = `${productV.Name} EN ${discount.Value.Percentage.Value*100}% DE DESCUENTO! ${discount.Value.Name.Value}`;

            for (const tokenInfo of listTokens) {
                try {
                    console.log(`Enviando notificación al token: ${tokenInfo.token}`);
                    
                    const pushMessage: PushNotificationDto = {
                        token: tokenInfo.token,
                        notification: {
                            title: pushTitle,
                            body: pushBody,
                        },
                    };
            
                    const result = await this.pushNotifier.sendNotificationPush(pushMessage);
                    if (!result.isSuccess()) {
                        console.error(`Error enviando notificación: ${result.Error.message}`);
                    } else {
                        console.log(`Notificación enviada exitosamente al token: ${tokenInfo.token}`);
                    }
                } catch (error) {
                    console.error(`Error inesperado para el token ${tokenInfo.token}: ${error.message}`);
                }
            }
            
        //}

        const r: NotifyProductDiscountServiceResponseDTO={ 
            product_id: data.product_id  
        }

        return Result.success(r, 200);
    }

    get name(): string {
        return this.constructor.name;
    }
}
