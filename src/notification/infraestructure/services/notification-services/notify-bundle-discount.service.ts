import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { Result } from "src/common/domain/result-handler/Result";
import { INotificationAddressRepository } from "../../interface/notification-address-repository.interface";
import { INotificationAlertRepository } from "../../interface/notification-alert-repository.interface";
import { IBundleRepository } from "src/bundle/domain/repositories/bundle-repository.interface";
import { IdGenerator } from "src/common/application/id-generator/id-generator.interface";
import { IPushSender } from "src/common/application/push-sender/push-sender.interface";
import { PushNotificationDto } from "src/common/application/push-sender/dto/send-notification-dto";
import { NotifyBundleDiscountServiceEntryDTO } from "../dto/entry/notify-bundle-discount-service-entry.dto";
import { IDiscountRepository } from "src/discount/domain/repositories/discount.repository.interface";
import { NotifyBundleDiscountServiceResponseDTO } from "../../controller/dto/response/notify-bundle-discount-response.dto";


export class NotifyBundleDiscountService implements 
    IApplicationService<NotifyBundleDiscountServiceEntryDTO, NotifyBundleDiscountServiceResponseDTO> {

    private readonly notiAddressRepository: INotificationAddressRepository;
    private readonly notiAlertRepository: INotificationAlertRepository;
    private readonly bundleRepository: IBundleRepository;
    private readonly uuidGenerator: IdGenerator<string>;
    private readonly pushNotifier: IPushSender;
    private readonly discountRepository: IDiscountRepository;

    constructor(
        notiAddressRepository: INotificationAddressRepository,
        notiAlertRepository: INotificationAlertRepository,
        bundleRepository: IBundleRepository,
        uuidGenerator: IdGenerator<string>,
        pushNotifier: IPushSender,
        discountRepository: IDiscountRepository
    ) {
        this.notiAddressRepository = notiAddressRepository;
        this.notiAlertRepository = notiAlertRepository;
        this.bundleRepository = bundleRepository;
        this.uuidGenerator = uuidGenerator;
        this.pushNotifier = pushNotifier;
        this.discountRepository = discountRepository
    }

    async execute(data: NotifyBundleDiscountServiceEntryDTO): Promise<Result<NotifyBundleDiscountServiceResponseDTO>> {
        const findTokens = await this.notiAddressRepository.findAllTokens();
        if (!findTokens.isSuccess()) {
            return Result.fail(findTokens.Error, findTokens.StatusCode, findTokens.Message);
        }

        const listTokens = findTokens.Value;

        //for (const bundleName of data.bundles_names) {
            const bundleDiscount = await this.bundleRepository.findBundleById(data.bundle_id)
            if (!bundleDiscount.isSuccess()) {
                return Result.fail(bundleDiscount.Error, bundleDiscount.StatusCode, bundleDiscount.Message);
            }

            const bundleV = bundleDiscount.Value;  

            const discount = await this.discountRepository.findDiscountById(bundleV.Discount.Value);

            if (!discount.isSuccess()) {
                return Result.fail(discount.Error, discount.StatusCode, discount.Message);
            }

            const pushTitle = `NUEVO DESCUENTO! VACÍLATELO`;
            const pushBody = `${bundleV.name.Value} EN ${discount.Value.Percentage.Value*100}% DE DESCUENTO! ${discount.Value.Name.Value}`;

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

        const r: NotifyBundleDiscountServiceResponseDTO={
            bundle_id: data.bundle_id
        }

        return Result.success(r, 200);
    }

    get name(): string {
        return this.constructor.name;
    }
}