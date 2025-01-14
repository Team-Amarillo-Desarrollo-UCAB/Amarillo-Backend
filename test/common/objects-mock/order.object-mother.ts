import { BundleID } from "src/bundle/domain/value-objects/bundle-id";
import { OrderBundle } from "src/order/domain/entites/order-bundle";
import { OrderProduct } from "src/order/domain/entites/order-product";
import { EnumOrderEstados } from "src/order/domain/enum/order-estados-enum";
import { Order } from "src/order/domain/order";
import { OrderBundleCantidad } from "src/order/domain/value-object/order-bundle/order-bundle-cantidad";
import { OrderBundleName } from "src/order/domain/value-object/order-bundle/order-bundle-name";
import { OrderBundlePrice } from "src/order/domain/value-object/order-bundle/order-bundle-price";
import { OrderEstado } from "src/order/domain/value-object/order-estado";
import { OrderCreationDate } from "src/order/domain/value-object/order-fecha-creacion";
import { OrderId } from "src/order/domain/value-object/order-id";
import { OrderInstructions } from "src/order/domain/value-object/order-instructions";
import { OrderLocationDelivery } from "src/order/domain/value-object/order-location-delivery";
import { OrderProductAmount } from "src/order/domain/value-object/order-product/order-product-amount";
import { OrderProductCantidad } from "src/order/domain/value-object/order-product/order-product-cantidad";
import { OrderProductCurrency } from "src/order/domain/value-object/order-product/order-product-currency";
import { OrderProductName } from "src/order/domain/value-object/order-product/order-product-name";
import { OrderProductPrice } from "src/order/domain/value-object/order-product/order-product-price";
import { OrderReciviedDate } from "src/order/domain/value-object/order-recivied-date";
import { OrderTotal } from "src/order/domain/value-object/order-total";
import { ProductId } from "src/product/domain/value-objects/product-id";
import { UserId } from "src/user/domain/value-object/user-id";
import { OrderBundleAmount } from '../../../src/order/domain/value-object/order-bundle/order-bundle-amount';
import { OrderBundleCurrency } from "src/order/domain/value-object/order-bundle/order-bundle-currency";
import { OrderReport } from "src/order/domain/entites/order-report";
import { OrderReportId } from "src/order/domain/value-object/order-report/order-report-id";
import { OrderReportText } from "src/order/domain/value-object/order-report/order-report-text";

export class OrderObjectMother {

    static createOrder(): Order {

        return Order.create(
            OrderId.create('cb0e2f2c-1326-428e-9fd4-b7822ff94ab7'),
            OrderEstado.create(EnumOrderEstados.CREADA),
            OrderCreationDate.create(new Date('2025-01-13')),
            OrderLocationDelivery.create('Universidad Catolia', 74.0060, 40.7128),
            [OrderProduct.create(
                ProductId.create('cb0e2f2c-1326-428e-9fd4-b7822ff94ab7'),
                OrderProductName.create('Casa'),
                OrderProductCantidad.create(21),
                OrderProductPrice.create(
                    OrderProductAmount.create(20),
                    OrderProductCurrency.create('usd')
                )
            )],
            [OrderBundle.create(
                BundleID.create('cb0e2f2c-1326-428e-9fd4-b7822ff94ab0'),
                OrderBundleName.create('Combo familiar'),
                OrderBundleCantidad.create(21),
                OrderBundlePrice.create(
                    OrderBundleAmount.create(20),
                    OrderBundleCurrency.create('usd')
                )
            )],
            OrderReciviedDate.create(new Date('2026-12-03')),
            UserId.create('cb0e2f2c-1326-428e-9fd4-b7822ff94ab0')
        )
    }

    static createOrderWithReport(): Order {

        return Order.createWithReport(
            OrderId.create('cb0e2f2c-1326-428e-9fd4-b7822ff94ab7'),
            OrderEstado.create(EnumOrderEstados.CREADA),
            OrderCreationDate.create(new Date('2026-12-02')),
            OrderLocationDelivery.create('Universidad Catolia', 74.0060, 40.7128),
            [OrderProduct.create(
                ProductId.create('cb0e2f2c-1326-428e-9fd4-b7822ff94ab7'),
                OrderProductName.create('Casa'),
                OrderProductCantidad.create(21),
                OrderProductPrice.create(
                    OrderProductAmount.create(20),
                    OrderProductCurrency.create('usd')
                )
            )],
            [OrderBundle.create(
                BundleID.create('cb0e2f2c-1326-428e-9fd4-b7822ff94ab0'),
                OrderBundleName.create('Combo familiar'),
                OrderBundleCantidad.create(21),
                OrderBundlePrice.create(
                    OrderBundleAmount.create(20),
                    OrderBundleCurrency.create('usd')
                )
            )],
            OrderReport.create(
                OrderReportId.create('c1L22f2c-1457-428e-9fd4-b7822ff94ab7'),
                OrderReportText.create("Orden reportada")
            ),
            OrderReciviedDate.create(new Date('2026-12-03')),
            UserId.create('c1L22f2c-1326-428e-9fd4-b7822ff94ab7')
        )
    }


}