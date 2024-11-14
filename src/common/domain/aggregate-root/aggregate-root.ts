import { DomainEvent } from "../domain-event/domain-event.interface";
import { Entity } from "../entity/entity"

export abstract class AggregateRoot<T> extends Entity<T> {
    protected events: DomainEvent[] = []

    // Nota: Esto mas adelante se determinara si lo construye a partir del evento de dominio created
    protected constructor(id: T ,event: DomainEvent) {
        super(id);
        this.onEvent(event);
    }

    protected onEvent(event: DomainEvent): void {
        this.applyEvent(event)
        this.ensureValidState()
        this.events.push(event)
    }

    protected abstract applyEvent(event: DomainEvent): void

    protected abstract ensureValidState(): void

    //por que reiniciar eventos?? 
    //se parece al builder
    public pullEvents(): DomainEvent[] {
        const events = this.events
        this.events = []
        return events
    }
}