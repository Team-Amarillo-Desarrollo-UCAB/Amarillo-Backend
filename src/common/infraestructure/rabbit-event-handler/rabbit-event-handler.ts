import { HttpException } from "@nestjs/common"
import amqp, { ChannelWrapper } from "amqp-connection-manager"
import { IAmqpConnectionManager } from "amqp-connection-manager/dist/types/AmqpConnectionManager"
import { IEventHandler } from "src/common/application/event-handler/event-handler.interface"
import { IEventSubscriber } from "src/common/application/event-handler/subscriber.interface"
import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface"


export class RabbitEventBus implements IEventHandler{

    public static instance?: IEventHandler = undefined
    private readonly publishConnection: IAmqpConnectionManager
    private readonly subscribeConnection: IAmqpConnectionManager
    private readonly publishChannelWrapper: ChannelWrapper
    private readonly subscribeChannelWrapper: ChannelWrapper
    private constructor (){
        this.publishConnection = amqp.connect([process.env.RABBITMQ_URL]);
        this.subscribeConnection = amqp.connect([process.env.RABBITMQ_URL]);
        this.publishChannelWrapper = this.publishConnection.createChannel();
        this.subscribeChannelWrapper = this.subscribeConnection.createChannel();
    }

    public static getInstance(): IEventHandler {
        if (!this.instance)
            this.instance = new RabbitEventBus()
        return this.instance
    }

    async publish ( events: DomainEvent[] ): Promise<void>
    {
        try {
            for (const event of events) {
                console.log(this.publishChannelWrapper)
                await this.publishChannelWrapper.assertQueue(event.eventName, { durable: true });
                await this.publishChannelWrapper.sendToQueue(
                    event.eventName,
                    Buffer.from(JSON.stringify(event)),
                    {
                        persistent: false,
                    },
                    );
            }
            console.log("hola fuera")

          } catch (error) {
            throw new HttpException(
              error.message,
              500,
            );
          }
    }
    
    async subscribe ( eventName: string, callback: ( event: DomainEvent ) => Promise<void> ): Promise<IEventSubscriber>
    {
        await this.subscribeChannelWrapper.assertQueue(eventName, { durable: true });
        await this.subscribeChannelWrapper.consume(eventName, async (message) => {
            if (message) {
                const event = JSON.parse(message.content.toString());
                await callback(event);
                this.subscribeChannelWrapper.ack(message);
            }
        },
        {
            noAck: false,
        });
        return {
            unsubscribe: async () => {
                
            }
        }
    }

}