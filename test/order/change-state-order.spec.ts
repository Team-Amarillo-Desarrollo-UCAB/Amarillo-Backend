import { BundleObjectMother } from "test/common/objects-mock/bundle.object-mother";
import { ProductObjectMother } from "test/common/objects-mock/product.object-mother";
import { UserObjectMother } from "test/common/objects-mock/user.object-mother";
import { BundleRepositoryMock } from "test/common/repository-mock/bundle-repository.mock";
import { ProductRepositoryMock } from "test/common/repository-mock/product-repository.mock";
import { UserMockRepository } from "test/common/repository-mock/user-repository-mock";
import { PaymentMethodObjectMock } from '../common/objects-mock/payment-method.object-mother';
import { PaymentMethodRepositoryMock } from "test/common/repository-mock/payment-method-repository.mock";
import { EnumPaymentMethod } from "src/payment-method/domain/enum/PaymentMethod";
import { OrderObjectMother } from "test/common/objects-mock/order.object-mother";
import { OrderRepositoryMock } from "test/common/repository-mock/order-repository.mock";
import { EstadoRepositoryMock } from "test/common/repository-mock/estado-repository.mock";
import { ChangeOrderStateService } from "src/order/application/services/command/change-order-state.service";
import { EventHandlerMock } from "test/common/repository-mock/event-handler.mock";
import { ChangeOrderServiceEntryDTO } from "src/order/application/DTO/entry/change-order-service-entry.dto";
import { EnumOrderEstados } from "src/order/domain/enum/order-estados-enum";

describe('Create order', () => {

    it('should change the state of the order', async () => {

        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = new UserMockRepository();
        await userRepositoryMock.saveUserAggregate(user)

        const metodo_pago = await PaymentMethodObjectMock.createNormal(EnumPaymentMethod.EFECTIVO)
        const paymentMethodRepositoryMock = new PaymentMethodRepositoryMock()
        await paymentMethodRepositoryMock.savePaymentMethodAggregate(metodo_pago)

        const orden = await OrderObjectMother.createOrder()
        const orderRepositoryMock = new OrderRepositoryMock(
            new EstadoRepositoryMock()
        )
        await orderRepositoryMock.saveOrderAggregate(orden)

        const entry: ChangeOrderServiceEntryDTO = {
            userId: user.Id.Id,
            id_order: orden.Id.Id,
            orderState: EnumOrderEstados.BEING_PROCESSED
        }

        const service = new ChangeOrderStateService(
            orderRepositoryMock,
            new EventHandlerMock()
        )

        const response = await service.execute(entry)

        expect(response.isSuccess()).toBeTruthy()

    })

    it('should fail in change the state of the order because is already cancelled', async () => {

        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = new UserMockRepository();
        await userRepositoryMock.saveUserAggregate(user)

        const metodo_pago = await PaymentMethodObjectMock.createNormal(EnumPaymentMethod.EFECTIVO)
        const paymentMethodRepositoryMock = new PaymentMethodRepositoryMock()
        await paymentMethodRepositoryMock.savePaymentMethodAggregate(metodo_pago)

        const orden = await OrderObjectMother.createOrderCancelled()
        const orderRepositoryMock = new OrderRepositoryMock(
            new EstadoRepositoryMock()
        )
        await orderRepositoryMock.saveOrderAggregate(orden)

        const entry: ChangeOrderServiceEntryDTO = {
            userId: user.Id.Id,
            id_order: orden.Id.Id,
            orderState: EnumOrderEstados.BEING_PROCESSED
        }

        const service = new ChangeOrderStateService(
            orderRepositoryMock,
            new EventHandlerMock()
        )

        const response = await service.execute(entry)

        expect(response.isSuccess()).toBeFalsy()

    })
})