import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface"
import { IEventSubscriber } from "./subscriber.interface"


export interface IEventHandler {

    publish ( events: DomainEvent[] ): Promise<void>

    subscribe ( eventName: string, callback: ( event: DomainEvent ) => Promise<void>, operation: string ): Promise<IEventSubscriber>

}