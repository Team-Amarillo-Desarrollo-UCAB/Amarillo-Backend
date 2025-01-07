import { IEventHandler } from "src/common/application/event-handler/event-handler.interface";
import { IEventSubscriber } from "src/common/application/event-handler/subscriber.interface";
import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";



export class EventHandlerMock implements IEventHandler{
    async publish ( events: DomainEvent[] ): Promise<void>
    {
        
    }
    subscribe ( eventName: string, callback: ( event: DomainEvent ) => Promise<void> ): Promise<IEventSubscriber>
    {
        throw new Error( "Method not implemented." )
    }

}