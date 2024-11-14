import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class InvalidCategoryNameException extends DomainException{
    constructor(){super("El nombre de la categoría tiene que ser válido")}
}