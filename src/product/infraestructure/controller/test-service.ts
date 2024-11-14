import { IEventHandler } from "src/common/application/event-handler/event-handler.interface";
import { testCreated } from "./test-event";

export class testService{

    private readonly eventHandler: IEventHandler
    
    constructor (eventHandler: IEventHandler)
    {
        this.eventHandler = eventHandler
    }

    async execute(msg: string){
        const event = testCreated.create(msg)
        await this.eventHandler.publish( [event] )
    }

}