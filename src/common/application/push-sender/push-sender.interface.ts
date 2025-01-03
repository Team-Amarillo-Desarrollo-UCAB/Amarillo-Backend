import { Result } from "../../Domain/result-handler/Result";
import { PushMulticastDto } from "./dto/send-multi-notification-dto";
import { PushNotificationDto } from "./dto/send-notification-dto";

export interface IPushSender {
    sendNotificationPush(message: PushNotificationDto): Promise<Result<string>>
    sendMulticastPush(message: PushMulticastDto): Promise<void>
}