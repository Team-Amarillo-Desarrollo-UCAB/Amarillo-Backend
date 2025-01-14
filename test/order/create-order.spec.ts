import { OrderCalculationTotal } from "src/common/domain/domain-service/calcular-monto-orden";
import { TaxesCalculationAdapter } from "src/common/infraestructure/domain-services-adapters/taxes-calculation-order.adapter";
import { CashPaymentMethod } from "src/common/infraestructure/payment/cash-payment-method";
import { PaypalPaymentMethod } from "src/common/infraestructure/payment/paypal-payment-method";
import { StripePaymentMethod } from "src/common/infraestructure/payment/stripe-payment-method";
import { CreateOrderEntryServiceDTO } from "src/order/application/DTO/entry/create-order-entry-service";
import { CreateOrderService } from "src/order/application/services/command/create-order.service";
import { EnumPaymentMethod } from "src/payment-method/domain/enum/PaymentMethod";
import { BundleObjectMother } from "test/common/objects-mock/bundle.object-mother";
import { DiscountObjectMother } from "test/common/objects-mock/discount.object-mother";
import { PaymentMethodObjectMock } from "test/common/objects-mock/payment-method.object-mother";
import { ProductObjectMother } from "test/common/objects-mock/product.object-mother";
import { UserObjectMother } from "test/common/objects-mock/user.object-mother";
import { StripePaymentMethodMock } from "test/common/other-mock/payment-stripe.mock";
import { ShippingFeeLocationMock } from "test/common/other-mock/shipping-fee-location.mock";
import { UuidGeneratorMock } from "test/common/other-mock/uuid-generator.mock";
import { BundleRepositoryMock } from "test/common/repository-mock/bundle-repository.mock";
import { CuponRepositoryMock } from "test/common/repository-mock/cupon-repository.mock";
import { DiscountMockRepository } from "test/common/repository-mock/discount-repository.mock";
import { EstadoRepositoryMock } from "test/common/repository-mock/estado-repository.mock";
import { EventHandlerMock } from "test/common/repository-mock/event-handler.mock";
import { OrderRepositoryMock } from "test/common/repository-mock/order-repository.mock";
import { PaymentMethodRepositoryMock } from "test/common/repository-mock/payment-method-repository.mock";
import { ProductRepositoryMock } from "test/common/repository-mock/product-repository.mock";
import { UserMockRepository } from "test/common/repository-mock/user-repository-mock";

describe('Create order', () => {

    it('should create a new order with the payment method cash', async () => {

        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = new UserMockRepository();
        await userRepositoryMock.saveUserAggregate(user)

        const product = await ProductObjectMother.createProductWithOutDiscount('Product test')
        const productRepositoryMock = new ProductRepositoryMock()
        await productRepositoryMock.createProduct(product)

        const bundle = await BundleObjectMother.createBundleWithOutDiscount('Bundle test')
        const bundleRepositoryMock = new BundleRepositoryMock()
        await bundleRepositoryMock.addBundle(bundle)

        const metodo_pago = await PaymentMethodObjectMock.createNormal(EnumPaymentMethod.EFECTIVO)
        const paymentMethodRepositoryMock = new PaymentMethodRepositoryMock()
        await paymentMethodRepositoryMock.savePaymentMethodAggregate(metodo_pago)

        const cuponRepositoryMock = new CuponRepositoryMock()

        const entry: CreateOrderEntryServiceDTO = {
            userId: user.Id.Id,
            orderReciviedDate: '2025-10-5',
            address: 'Universidad Catolinca Andres Bello',
            latitude: 10.4854606,
            longitude: -66.9343683,
            products: [
                {
                    id: product.Id.Id,
                    quantity: 1
                }
            ],
            bundles: [
                {
                    id: bundle.Id.Value,
                    quantity: 1
                }
            ]
        }

        const service = new CreateOrderService(
            new OrderRepositoryMock(
                new EstadoRepositoryMock()
            ),
            productRepositoryMock,
            bundleRepositoryMock,
            cuponRepositoryMock,
            new DiscountMockRepository(),
            new UuidGeneratorMock(),
            new EventHandlerMock(),
            new OrderCalculationTotal(
                new CashPaymentMethod(
                    new UuidGeneratorMock(),
                    paymentMethodRepositoryMock,
                    metodo_pago.Id.Id
                ),
                new TaxesCalculationAdapter(),
                new ShippingFeeLocationMock()
            )
        )

        const result = await service.execute(entry)

        expect(result.isSuccess()).toBeTruthy()

    })

    it('should create a new order with the payment method PayPal', async () => {

        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = new UserMockRepository();
        await userRepositoryMock.saveUserAggregate(user)

        const product = await ProductObjectMother.createProductWithOutDiscount('Product test')
        const productRepositoryMock = new ProductRepositoryMock()
        await productRepositoryMock.createProduct(product)

        const bundle = await BundleObjectMother.createBundleWithOutDiscount('Bundle test')
        const bundleRepositoryMock = new BundleRepositoryMock()
        await bundleRepositoryMock.addBundle(bundle)

        const metodo_pago = await PaymentMethodObjectMock.createNormal(EnumPaymentMethod.PAYPAL)
        const paymentMethodRepositoryMock = new PaymentMethodRepositoryMock()
        await paymentMethodRepositoryMock.savePaymentMethodAggregate(metodo_pago)

        const cuponRepositoryMock = new CuponRepositoryMock()

        const entry: CreateOrderEntryServiceDTO = {
            userId: user.Id.Id,
            orderReciviedDate: '2025-10-5',
            address: 'Universidad Catolinca Andres Bello',
            latitude: 10.4854606,
            longitude: -66.9343683,
            products: [
                {
                    id: product.Id.Id,
                    quantity: 1
                }
            ],
            bundles: [
                {
                    id: bundle.Id.Value,
                    quantity: 1
                }
            ]
        }

        const service = new CreateOrderService(
            new OrderRepositoryMock(
                new EstadoRepositoryMock()
            ),
            productRepositoryMock,
            bundleRepositoryMock,
            cuponRepositoryMock,
            new DiscountMockRepository(),
            new UuidGeneratorMock(),
            new EventHandlerMock(),
            new OrderCalculationTotal(
                new PaypalPaymentMethod(
                    "testPaypal@gmail.com",
                    new UuidGeneratorMock(),
                    paymentMethodRepositoryMock,
                    metodo_pago.Id.Id
                ),
                new TaxesCalculationAdapter(),
                new ShippingFeeLocationMock()
            )
        )

        const result = await service.execute(entry)

        expect(result.isSuccess()).toBeTruthy()

    })

    it('should create a new order with the payment method Stripe', async () => {

        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = new UserMockRepository();
        await userRepositoryMock.saveUserAggregate(user)

        const product = await ProductObjectMother.createProductWithOutDiscount('Product test')
        const productRepositoryMock = new ProductRepositoryMock()
        await productRepositoryMock.createProduct(product)

        const bundle = await BundleObjectMother.createBundleWithOutDiscount('Bundle test')
        const bundleRepositoryMock = new BundleRepositoryMock()
        await bundleRepositoryMock.addBundle(bundle)

        const metodo_pago = await PaymentMethodObjectMock.createNormal(EnumPaymentMethod.STRIPE)
        const paymentMethodRepositoryMock = new PaymentMethodRepositoryMock()
        await paymentMethodRepositoryMock.savePaymentMethodAggregate(metodo_pago)

        const cuponRepositoryMock = new CuponRepositoryMock()

        const entry: CreateOrderEntryServiceDTO = {
            userId: user.Id.Id,
            orderReciviedDate: '2025-10-5',
            address: 'Universidad Catolinca Andres Bello',
            latitude: 10.4854606,
            longitude: -66.9343683,
            products: [
                {
                    id: product.Id.Id,
                    quantity: 1
                }
            ],
            bundles: [
                {
                    id: bundle.Id.Value,
                    quantity: 1
                }
            ]
        }

        const service = new CreateOrderService(
            new OrderRepositoryMock(
                new EstadoRepositoryMock()
            ),
            productRepositoryMock,
            bundleRepositoryMock,
            cuponRepositoryMock,
            new DiscountMockRepository(),
            new UuidGeneratorMock(),
            new EventHandlerMock(),
            new OrderCalculationTotal(
                new StripePaymentMethodMock(
                    new UuidGeneratorMock(),
                    paymentMethodRepositoryMock,
                    metodo_pago.Id.Id
                ),
                new TaxesCalculationAdapter(),
                new ShippingFeeLocationMock()
            )
        )

        const result = await service.execute(entry)

        expect(result.isSuccess()).toBeTruthy()

    })

    it('should fail if does not have product and bundle', async () => {

        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = new UserMockRepository();
        await userRepositoryMock.saveUserAggregate(user)

        const product = await ProductObjectMother.createProductWithOutDiscount('Product test')
        const productRepositoryMock = new ProductRepositoryMock()
        await productRepositoryMock.createProduct(product)

        const bundle = await BundleObjectMother.createBundleWithOutDiscount('Bundle test')
        const bundleRepositoryMock = new BundleRepositoryMock()
        await bundleRepositoryMock.addBundle(bundle)

        const metodo_pago = await PaymentMethodObjectMock.createNormal(EnumPaymentMethod.EFECTIVO)
        const paymentMethodRepositoryMock = new PaymentMethodRepositoryMock()
        await paymentMethodRepositoryMock.savePaymentMethodAggregate(metodo_pago)

        const cuponRepositoryMock = new CuponRepositoryMock()

        const entry: CreateOrderEntryServiceDTO = {
            userId: user.Id.Id,
            orderReciviedDate: '2025-10-5',
            address: 'Universidad Catolinca Andres Bello',
            latitude: 10.4854606,
            longitude: -66.9343683,
            products: [],
            bundles: []
        }

        const service = new CreateOrderService(
            new OrderRepositoryMock(
                new EstadoRepositoryMock()
            ),
            productRepositoryMock,
            bundleRepositoryMock,
            cuponRepositoryMock,
            new DiscountMockRepository(),
            new UuidGeneratorMock(),
            new EventHandlerMock(),
            new OrderCalculationTotal(
                new CashPaymentMethod(
                    new UuidGeneratorMock(),
                    paymentMethodRepositoryMock,
                    metodo_pago.Id.Id
                ),
                new TaxesCalculationAdapter(),
                new ShippingFeeLocationMock()
            )
        )

        const result = await service.execute(entry)

        expect(result.isSuccess()).toBeFalsy()


    })

    it('should fail if does not exists the products', async () => {

        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = new UserMockRepository();
        await userRepositoryMock.saveUserAggregate(user)

        const product = await ProductObjectMother.createProductWithOutDiscount('Product test')
        const productRepositoryMock = new ProductRepositoryMock()

        const bundle = await BundleObjectMother.createBundleWithOutDiscount('Bundle test')
        const bundleRepositoryMock = new BundleRepositoryMock()

        const metodo_pago = await PaymentMethodObjectMock.createNormal(EnumPaymentMethod.EFECTIVO)
        const paymentMethodRepositoryMock = new PaymentMethodRepositoryMock()
        await paymentMethodRepositoryMock.savePaymentMethodAggregate(metodo_pago)

        const cuponRepositoryMock = new CuponRepositoryMock()

        const entry: CreateOrderEntryServiceDTO = {
            userId: user.Id.Id,
            orderReciviedDate: '2025-10-5',
            address: 'Universidad Catolinca Andres Bello',
            latitude: 10.4854606,
            longitude: -66.9343683,
            products: [
                {
                    id: product.Id.Id,
                    quantity: 1
                }
            ],
            bundles: [
                {
                    id: bundle.Id.Value,
                    quantity: 1
                }
            ]
        }

        const service = new CreateOrderService(
            new OrderRepositoryMock(
                new EstadoRepositoryMock()
            ),
            productRepositoryMock,
            bundleRepositoryMock,
            cuponRepositoryMock,
            new DiscountMockRepository(),
            new UuidGeneratorMock(),
            new EventHandlerMock(),
            new OrderCalculationTotal(
                new CashPaymentMethod(
                    new UuidGeneratorMock(),
                    paymentMethodRepositoryMock,
                    metodo_pago.Id.Id
                ),
                new TaxesCalculationAdapter(),
                new ShippingFeeLocationMock()
            )
        )

        const result = await service.execute(entry)

        expect(result.isSuccess()).toBeFalsy()

    })

})