export class CuponNotFoundException extends Error {
    constructor (id: string) {
        super( `Cupon ${id} not found`)
        Object.setPrototypeOf(this, CuponNotFoundException.prototype)
    }
}