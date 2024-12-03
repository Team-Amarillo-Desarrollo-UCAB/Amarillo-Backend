import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class InvalidCategoryException extends DomainException{
    constructor(mensaje:string){super(mensaje)}
}