import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class InvalidCategoryIdException extends DomainException{
    constructor(){super("El id de la categoría tiene que ser un UUID válido")}
}