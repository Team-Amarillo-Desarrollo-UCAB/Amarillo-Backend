import { IEventHandler } from "src/common/application/event-handler/event-handler.interface";
import { IEventSubscriber } from "src/common/application/event-handler/subscriber.interface";
import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";
import { Result } from '../../../src/common/domain/result-handler/Result';



export class EventHandlerMock implements IEventHandler {
    async publish(events: DomainEvent[]): Promise<Result<void>> {
        return Result.success(null,200)
    }
    subscribe(eventName: string, callback: (event: DomainEvent) => Promise<void>): Promise<Result<IEventSubscriber>> {
        throw new Error("Method not implemented.")
    }

}