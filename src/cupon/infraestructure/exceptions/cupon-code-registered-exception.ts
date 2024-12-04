export class CuponRegisteredException extends Error {
    constructor (code: string) {
        super( `Cupon with code ${code} does not exists`)
        Object.setPrototypeOf(this, CuponRegisteredException.prototype)
    }
}