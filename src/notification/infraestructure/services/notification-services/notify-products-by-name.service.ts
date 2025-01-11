import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { Result } from "src/common/domain/result-handler/Result";
import { INotificationAddressRepository } from "../../interface/notification-address-repository.interface";
import { INotificationAlertRepository } from "../../interface/notification-alert-repository.interface";
import { IProductRepository } from "src/product/domain/repositories/product-repository.interface";
import { IdGenerator } from "src/common/application/id-generator/id-generator.interface";
import { IPushSender } from "src/common/application/push-sender/push-sender.interface";
import { PushNotificationDto } from "src/common/application/push-sender/dto/send-notification-dto";
import { NotifyProductsByNamesServiceEntryDTO } from "../dto/entry/notify-products-by-names-entry.dto";

export class NotifyProductsByNameService implements 
    IApplicationService<NotifyProductsByNamesServiceEntryDTO, string> {

    private readonly notiAddressRepository: INotificationAddressRepository;
    private readonly notiAlertRepository: INotificationAlertRepository;
    private readonly productRepository: IProductRepository;
    private readonly uuidGenerator: IdGenerator<string>;
    private readonly pushNotifier: IPushSender;

    constructor(
        notiAddressRepository: INotificationAddressRepository,
        notiAlertRepository: INotificationAlertRepository,
        productRepository: IProductRepository,
        uuidGenerator: IdGenerator<string>,
        pushNotifier: IPushSender,
    ) {
        this.notiAddressRepository = notiAddressRepository;
        this.notiAlertRepository = notiAlertRepository;
        this.productRepository = productRepository;
        this.uuidGenerator = uuidGenerator;
        this.pushNotifier = pushNotifier;
    }

    async execute(data: NotifyProductsByNamesServiceEntryDTO): Promise<Result<string>> {
        const findTokens = await this.notiAddressRepository.findAllTokens();
        if (!findTokens.isSuccess()) {
            return Result.fail(findTokens.Error, findTokens.StatusCode, findTokens.Message);
        }

        const listTokens = findTokens.Value;

        for (const productName of data.products_names) {
            const findProduct = await this.productRepository.findProductByName(productName);
            if (!findProduct.isSuccess()) {
                return Result.fail(findProduct.Error, findProduct.StatusCode, findProduct.Message);
            }

            const product = findProduct.Value;
            const pushTitle = `New product: ${product.Name} is available now!`;
            const pushBody = `${product.Name} is available for ${product.Price} ${product.Moneda}. Only ${product.Stock} left!`;

            for (const tokenInfo of listTokens) {
                this.notiAlertRepository.saveNotificationAlert({
                    alert_id: await this.uuidGenerator.generateId(),
                    user_id: tokenInfo.user_id,
                    title: pushTitle,
                    body: pushBody,
                    date: new Date(),
                    user_readed: false,
                });

                const pushMessage: PushNotificationDto = {
                    token: tokenInfo.token,
                    notification: {
                        title: pushTitle,
                        body: pushBody,
                    },
                };

                const result = await this.pushNotifier.sendNotificationPush(pushMessage);
                if (!result.isSuccess()) {
                    return Result.fail<string>(result.Error, 500, result.Message);
                }
            }
        }

        return Result.success("Notifications for products by names sent successfully", 200);
    }

    get name(): string {
        return this.constructor.name;
    }
}
