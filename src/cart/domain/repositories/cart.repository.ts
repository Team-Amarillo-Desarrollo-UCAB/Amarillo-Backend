import { Cart } from '../entities/cart.entity';
import { CartID } from '../value-objects/cart-id.vo';
//import { UserID } from '../../user/value-objects/user-id.vo';
//import { ProductID } from '../../product/value-objects/product-id.vo';
//import { ComboID } from '../../combo/value-objects/combo-id.vo';
import { CartTotal } from '../value-objects/cart-total.vo';
import { DetailCart } from '../entities/detail-cart.entity';

// Interfaz que define las operaciones del repositorio del agregado Cart
export interface CartRepository {
    // Obtener el carrito por su UserID
    //getCartByUserId(userID: UserID): Promise<Cart | undefined>;

    // Añadir un producto o combo al carrito
    addProductOrComboToCart(
        cartID: CartID,
        quantity: number,
        //productID?: ProductID,
        //comboID?: ComboID
    ): Promise<Cart>;

    // Eliminar un producto o combo del carrito
    removeProductOrComboFromCart(
        cartID: CartID,
        //productID?: ProductID,
        //comboID?: ComboID
    ): Promise<Cart>;

    // Modificar la cantidad de un producto o combo en el carrito
    updateProductOrComboQuantity(
        cartID: CartID,
        quantity: number,
        //productID?: ProductID,
        //comboID?: ComboID
    ): Promise<Cart>;

    // Obtener los detalles del carrito (productos y combos)
    getCartDetails(cartID: CartID): Promise<DetailCart[]>;
}
