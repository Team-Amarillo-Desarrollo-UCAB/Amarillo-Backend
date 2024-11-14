import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class InvalidCategoryIconException extends DomainException{
    constructor(){super("El icono de la categoría tiene que ser un url valido")}
}