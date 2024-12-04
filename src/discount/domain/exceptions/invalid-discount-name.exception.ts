import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class InvalidDiscountNameException extends DomainException{
    constructor(msg:string){super(msg); 
        this.name = "InvalidDiscountNameException"
    }
    
}