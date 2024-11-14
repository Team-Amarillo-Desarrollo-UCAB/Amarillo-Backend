//import { ComboID } from '../combo/value-objects/combo-id.vo';
import { Entity } from 'src/common/domain/entity/entity';
import { CartID } from '../value-objects/cart-id.vo';
import { DetailCantidad } from '../value-objects/detail-cantidad.vo';
import { ProductId } from 'src/product/domain/value-objects/product-id';

export class DetailCart extends Entity<CartID> {
    private readonly productos: ProductId[];
    //private readonly combos: ComboID[];
    private readonly cartID: CartID;
    private readonly detailCantidad: DetailCantidad;

    private constructor(id: CartID, productos: ProductId[], /*combos: ComboID[],*/ detailCantidad: DetailCantidad) {
        super(id);
        this.cartID = id;
        this.productos = productos;
        // this.combos = combos;
        this.detailCantidad = detailCantidad;
        //this.ensureValidState();
    }

    // Método estático para crear una instancia de DetailCart
    public static create(id: CartID, detailCantidad: DetailCantidad,productos:ProductId[]): DetailCart {
        return new DetailCart(id, productos,detailCantidad);
    }

    //esto es un metodo de aggregateRoot
    // private ensureValidState(): void {
    //     const productosLength = this.productos.length;
    //     const combosLength = this.combos.length;

    //     if ((productosLength === 0 && combosLength === 0) || (productosLength > 0 && combosLength > 0)) {
    //         throw new Error("Debe haber al menos un Producto o Combo, pero no ambos simultáneamente en cero.");
    //     }
    // }

    public obtenerProductos(): ProductId[] {
        return this.productos;
    }

    // public obtenerCombos(): ComboID[] {
    //     return this.combos;
    // }

    public obtenerCantidad(): DetailCantidad {
        return this.detailCantidad;
    }
}
