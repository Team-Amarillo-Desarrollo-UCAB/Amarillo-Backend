import { DomainEvent } from 'src/common/domain/domain-event/domain-event.interface';
//import { UserID } from '../user/value-objects/user-id.vo'; // asumiendo que existe en el agregado de User
import { DetailCart } from './detail-cart.entity';
import { AggregateRoot } from 'src/common/domain/aggregate-root/aggregate-root';
import { CartID } from '../value-objects/cart-id.vo';
import { CartTotal } from '../value-objects/cart-total.vo';

export class Cart extends AggregateRoot<CartID> {
    private readonly cartTotal: CartTotal;
    //private readonly userID: UserID;
    private detailCarts: DetailCart[] = [];

    private constructor(id: CartID, /*userID: UserID,*/ cartTotal: CartTotal, event: DomainEvent) {
        super(id, event);
        this.cartTotal = cartTotal;
        //this.userID = userID;
        this.ensureValidState();
    }

    // Método estático para crear una instancia de Cart
    public static create(id: CartID, cartTotal: CartTotal, event: DomainEvent): Cart {
        return new Cart(id, cartTotal, event);
    }

    protected applyEvent(event: DomainEvent): void {
        // Implementar la lógica que corresponda según el evento
        //este console.log es solo por ahora para este sprint 1
        console.log("Evento aplicado al Cart:", event);
    }

    protected ensureValidState(): void {
        // if (!this.userID) {
        //     throw new Error("El UserID es requerido para el carrito.");
        // }
    }

    public agregarDetalle(detailCart: DetailCart): void {
        this.detailCarts.push(detailCart);
    }

    public obtenerDetalles(): DetailCart[] {
        return this.detailCarts;
    }
}
