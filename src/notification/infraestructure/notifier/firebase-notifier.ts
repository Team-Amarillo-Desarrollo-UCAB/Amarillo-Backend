import * as admin from 'firebase-admin';

import { PushMulticastDto } from 'src/common/application/push-sender/dto/send-multi-notification-dto';
import { PushNotificationDto } from 'src/common/application/push-sender/dto/send-notification-dto';
import { IPushSender } from 'src/common/application/push-sender/push-sender.interface';
import { Result } from 'src/common/domain/result-handler/Result';

export class FirebaseNotifier implements IPushSender {

    private static instance: FirebaseNotifier

    private constructor() {
        const credentials: object = {
            type: process.env.FB_TYPE,
            project_id: process.env.FB_PROJECT_ID,
            private_key_id: process.env.FB_PRIVATE_KEY_ID,
            private_key: process.env.FB_PRIVATE_KEY.replace(/\\n/gm, "\n"),
            client_email: process.env.FB_CLIENT_EMAIL,
            client_id: process.env.FB_CLIENT_ID,
            auth_uri: process.env.FB_AUTH_URI,
            token_uri: process.env.FB_TOKEN_URI,
            auth_provider_x509_cert_url: process.env.FB_AUTH_PROVIDER,
            client_x509_cert_url: process.env.FB_CLIENT,
            universe_domain: process.env.FB_DOMAIN
        }
        admin.initializeApp({ credential: admin.credential.cert(credentials) })
    }

    async sendMulticastPush(message: PushMulticastDto): Promise<void> {
        const msg = {
            tokens: message.token,
            android: { notification: { title: message.notification.title, body: message.notification.body }, },
            webpush: { notification: { title: message.notification.title, body: message.notification.body }, },
        }
        const res = await admin.messaging().sendEachForMulticast(msg)
    }

    public static getInstance(): FirebaseNotifier {
        if (!FirebaseNotifier.instance) FirebaseNotifier.instance = new FirebaseNotifier();
        return FirebaseNotifier.instance;
    }

    async sendNotificationPush(message: PushNotificationDto): Promise<Result<string>> {
        const msg = {
            token: message.token,
            android: {
                notification: {
                    title: message.notification.title,
                    body: message.notification.body,
                    clickAction: '/main',
                }
            },
            webpush: {
                //fcmOptions: { link: 'https://ginastic-center.web.app/home/main-course?id=c6ba86d8-987c-4601-8201-dbaa67456006', },
                notification: {
                    title: message.notification.title,
                    body: message.notification.body,
                    //actions: [ { action: 'idk', title: 'Eso Brad', icon: icon } ],
                },
            },
        }
        try {
            const res = await admin.messaging().send(msg).then(e => { console.log(' sendeeeeed ') })
            return Result.success<string>('push_sended', 200)
        } catch (e) {
            console.log("ERROR e:",e)
            return Result.fail<string>(new Error('error_sending_push'), 500, 'error_sending_push')
        }
    }

}