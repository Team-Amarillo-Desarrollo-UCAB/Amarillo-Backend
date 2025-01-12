import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { Result } from "src/common/domain/result-handler/Result";
import { INotificationAddressRepository } from "../../interface/notification-address-repository.interface";
import { INotificationAlertRepository } from "../../interface/notification-alert-repository.interface";
import { IBundleRepository } from "src/bundle/domain/repositories/bundle-repository.interface";
import { IdGenerator } from "src/common/application/id-generator/id-generator.interface";
import { IPushSender } from "src/common/application/push-sender/push-sender.interface";
import { PushNotificationDto } from "src/common/application/push-sender/dto/send-notification-dto";
import { NotifyBundlesByNamesServiceEntryDTO } from "../dto/entry/notify-bundles-by-names-service.dto";

export class NotifyBundlesByNameService implements 
    IApplicationService<NotifyBundlesByNamesServiceEntryDTO, string> {

    private readonly notiAddressRepository: INotificationAddressRepository;
    private readonly notiAlertRepository: INotificationAlertRepository;
    private readonly bundleRepository: IBundleRepository;
    private readonly uuidGenerator: IdGenerator<string>;
    private readonly pushNotifier: IPushSender;

    constructor(
        notiAddressRepository: INotificationAddressRepository,
        notiAlertRepository: INotificationAlertRepository,
        bundleRepository: IBundleRepository,
        uuidGenerator: IdGenerator<string>,
        pushNotifier: IPushSender,
    ) {
        this.notiAddressRepository = notiAddressRepository;
        this.notiAlertRepository = notiAlertRepository;
        this.bundleRepository = bundleRepository;
        this.uuidGenerator = uuidGenerator;
        this.pushNotifier = pushNotifier;
    }

    async execute(data: NotifyBundlesByNamesServiceEntryDTO): Promise<Result<string>> {
        const findTokens = await this.notiAddressRepository.findAllTokens();
        if (!findTokens.isSuccess()) {
            return Result.fail(findTokens.Error, findTokens.StatusCode, findTokens.Message);
        }

        const listTokens = findTokens.Value;

        for (const bundleName of data.bundles_names) {
            const findBundles = await this.bundleRepository.findAllBundles(null,null,null,bundleName);
            if (!findBundles.isSuccess()) {
                return Result.fail(findBundles.Error, findBundles.StatusCode, findBundles.Message);
            }

            const bundles = findBundles.Value;
            const bundle = bundles.find(b => b.name.Value === bundleName);
            if (!bundle) {
                console.error(`No se encontró un bundle con el nombre: ${bundleName}`);
                continue; 
            }            
            const pushTitle = `PIDE YA EL COMBO ${bundle.name.Value}!`;
            const pushBody = `${bundle.name.Value} disponible por ${bundle.price.Price} ${bundle.price.Currency}`;

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
            
        }

        return Result.success("Notifications for bundles by names sent successfully", 200);
    }

    get name(): string {
        return this.constructor.name;
    }
}
