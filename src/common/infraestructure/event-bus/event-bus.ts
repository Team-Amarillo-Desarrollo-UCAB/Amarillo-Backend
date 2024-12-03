import { IEventHandler } from "src/common/application/event-handler/event-handler.interface"
import { IEventSubscriber } from "src/common/application/event-handler/subscriber.interface"
import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface"

export class EventBus implements IEventHandler{

    public static instance?: IEventHandler = undefined
    private subscribers: {[key: string]: (( event: DomainEvent ) => Promise<void>)[]}

    private constructor()
    {
        this.subscribers = {}
    }

    public static getInstance(): IEventHandler {
        if (!this.instance)
            this.instance = new EventBus()
        return this.instance

    }

    async publish ( events: DomainEvent[] ): Promise<void>
    {
        for ( const event of events ){
            const subscribers = this.subscribers[event.eventName] || []
            for ( const subscriber of subscribers ){
                await subscriber( event )
            }
        }
    }

    async subscribe ( eventName: string, callback: ( event: DomainEvent ) => Promise<void> ): Promise<IEventSubscriber>
    {
        if ( !this.subscribers[eventName] )
        {
            this.subscribers[eventName] = []
        }
        this.subscribers[eventName].push( callback )

        return {
            unsubscribe: () => {
                this.subscribers[eventName] = this.subscribers[eventName].filter( subscriber => subscriber !== callback )
            }
        }
    }
}