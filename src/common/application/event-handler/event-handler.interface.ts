import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface"
import { IEventSubscriber } from "./subscriber.interface"
import { Result } from "src/common/domain/result-handler/Result"


export interface IEventHandler {

    publish ( events: DomainEvent[] ): Promise<Result<void>>

    subscribe ( eventName: string, callback: ( event: DomainEvent ) => Promise<void>, operation: string ): Promise<Result<IEventSubscriber>>

}