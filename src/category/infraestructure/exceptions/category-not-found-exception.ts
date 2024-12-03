export class CategoryNotFoundException extends Error {
    constructor () {
        super( 'ERROR: Category not found' )
        Object.setPrototypeOf(this, CategoryNotFoundException.prototype)
    }
}