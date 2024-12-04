import { IEventHandler } from "src/common/application/event-handler/event-handler.interface";
import { testCreated } from "./test-event";
import { OrderCreated } from "src/order/domain/domain-event/order-created-event";
import { EnumOrderEstados } from "src/order/domain/enum/order-estados-enum";

export class testService{

    private readonly eventHandler: IEventHandler
    
    constructor (eventHandler: IEventHandler)
    {
        this.eventHandler = eventHandler
    }

    async execute(msg: string){
        const event = testCreated.create(
            "Hola luig",
        )
        await this.eventHandler.publish( [event] )
    }

}