import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class InvalidBundleStockException extends DomainException{
    constructor(msg:string){super(msg)}
}