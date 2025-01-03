export class BundleNotFoundException extends Error {
    constructor () {
        super( 'ERROR: Bundle not found' )
        Object.setPrototypeOf(this, BundleNotFoundException.prototype)
    }
}