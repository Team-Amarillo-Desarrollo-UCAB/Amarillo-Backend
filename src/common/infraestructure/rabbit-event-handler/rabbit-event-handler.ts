import * as amqp from 'amqplib'
import { BundleCreated } from 'src/bundle/domain/events/bundle-created-event'
import { BundleDiscountModified } from 'src/bundle/domain/events/bundle-discount-modified'
import { BundleID } from 'src/bundle/domain/value-objects/bundle-id'

import { IEventHandler } from "src/common/application/event-handler/event-handler.interface"
import { IEventSubscriber } from "src/common/application/event-handler/subscriber.interface"
import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface"
import { Result } from 'src/common/domain/result-handler/Result'
import { OrderTotalCalculated } from 'src/order/domain/domain-event/order-amount-calculated'
import { OrderBillRecivied } from 'src/order/domain/domain-event/order-bill-recivied'
import { OrderCreated } from "src/order/domain/domain-event/order-created-event"
import { OrderRefunded } from 'src/order/domain/domain-event/order-refunded-event'
import { OrderStateChanged } from 'src/order/domain/domain-event/order-state-changed'
import { OrderBundle } from 'src/order/domain/entites/order-bundle'
import { OrderProduct } from 'src/order/domain/entites/order-product'
import { OrderBundleAmount } from 'src/order/domain/value-object/order-bundle/order-bundle-amount'
import { OrderBundleCantidad } from 'src/order/domain/value-object/order-bundle/order-bundle-cantidad'
import { OrderBundleCurrency } from 'src/order/domain/value-object/order-bundle/order-bundle-currency'
import { OrderBundleImage } from 'src/order/domain/value-object/order-bundle/order-bundle-image'
import { OrderBundleName } from 'src/order/domain/value-object/order-bundle/order-bundle-name'
import { OrderBundlePrice } from 'src/order/domain/value-object/order-bundle/order-bundle-price'
import { OrderLocationDelivery } from 'src/order/domain/value-object/order-location-delivery'
import { OrderProductAmount } from 'src/order/domain/value-object/order-product/order-product-amount'
import { OrderProductCantidad } from 'src/order/domain/value-object/order-product/order-product-cantidad'
import { OrderProductCurrency } from 'src/order/domain/value-object/order-product/order-product-currency'
import { OrderProductImage } from 'src/order/domain/value-object/order-product/order-product-image'
import { OrderProductName } from 'src/order/domain/value-object/order-product/order-product-name'
import { OrderProductPrice } from 'src/order/domain/value-object/order-product/order-product-price'
import { ProductCreated } from 'src/product/domain/domain-event/product-created-event'
import { ProductDiscountModified } from 'src/product/domain/domain-event/product-discount-modified'
import { ProductId } from 'src/product/domain/value-objects/product-id'
import { testCreated } from "src/product/infraestructure/controller/test-event"
import { UserCreated } from 'src/user/domain/events/user-created-event'
import { UserName } from 'src/user/domain/value-object/user-name'


export class RabbitEventBus implements IEventHandler {

    public static instance?: RabbitEventBus;

    // Propiedad estática para verificar si la conexión ya ha sido inicializada
    private static connectionInitialized = false;
    private exchange = "pubsub_topic"
    private connection: amqp.Connection;

    // Constructor privado para evitar que se instancien directamente fuera de la clase
    private constructor() {
        // El constructor solo inicializa propiedades si es necesario
    }

    // Método estático para obtener la instancia de RabbitEventBus
    public static getInstance(): RabbitEventBus {
        if (!this.instance) {
            this.instance = new RabbitEventBus();
            // Solo inicializar la conexión la primera vez que se crea la instancia
            if (!this.connectionInitialized) {
                this.initialize().then(() => {
                    console.log('Conexión con RabbitMQ inicializada correctamente.');
                }).catch((error) => {
                    console.error('Error al inicializar la conexión con RabbitMQ:', error);
                });
            }
        }
        return this.instance;
    }

    // Método asíncrono para inicializar la conexión con RabbitMQ
    private static async initialize(): Promise<void> {
        try {
            // Establecer la conexión con RabbitMQ solo una vez
            this.instance!.connection = await amqp.connect(process.env.RABBIRMQ_URL);
            this.connectionInitialized = true;
            console.log('Conexión a RabbitMQ exitosa');
        } catch (error) {
            console.log('Error en la conexión de RabbitMQ: ', error);
        }
    }

    async publish(events: DomainEvent[]): Promise<Result<void>> {
        if (!this.connection) {
            throw new Error("RabbitMQ connection not initialized.");
        }

        try {
            const channel = await this.connection.createChannel();
            const exchange = 'pubsub_topic';  // Usamos el exchange de tipo 'topic'
            await channel.assertExchange(exchange, 'topic', { durable: false });

            for (const event of events) {
                const routingKey = event.eventName;  // Usamos la clave de enrutamiento basada en el nombre del evento
                const message = JSON.stringify(event);
                console.log("mensaje por enviar")
                channel.publish(exchange, routingKey, Buffer.from(message));
                console.log(`Mensaje enviado al exchange ${exchange} con routingKey ${routingKey}:`);
            }

            return Result.success(null, 500)

            //await channel.close();
        } catch (error) {
            console.error("Error al publicar el evento:", error);
            Result.fail(error, 500, 'Error al publicar el evento')
        }
    }

    async subscribe(eventName: string, callback: (event: DomainEvent) => Promise<void>, operation: string): Promise<Result<IEventSubscriber>> {
        if (!this.connection) {
            throw new Error("RabbitMQ connection not initialized.");
        }

        try {
            const channel = await this.connection.createChannel();
            const exchange = 'pubsub_topic';  // Usamos el exchange de tipo 'topic'
            await channel.assertExchange(exchange, 'topic', { durable: false });

            // Crear una cola exclusiva para este consumidor
            const q = await channel.assertQueue(operation, { durable: false });

            // Vincular la cola a la clave de enrutamiento que corresponda al nombre del evento
            await channel.bindQueue(q.queue, exchange, eventName);

            await channel.prefetch(1);  // Solo procesa un mensaje a la vez

            // Consumir los mensajes de la cola
            await channel.consume(q.queue, async (msg) => {
                if (msg) {
                    const event_data = JSON.parse(msg.content.toString());
                    console.log("mensaje recibido en JSON: ", event_data)
                    let event: DomainEvent;
                    switch (eventName) {
                        case 'OrderCreated':
                            event = OrderCreated.create(
                                event_data.id,
                                event_data.estado,
                                new Date(event_data.fecha_creacion),
                                await Promise.all(
                                    event_data.productos.map(async (p) => {
                                        return OrderProduct.create(
                                            ProductId.create(p.id.id),
                                            OrderProductName.create(p.name.name),
                                            OrderProductCantidad.create(p.cantidad.cantidad),
                                            OrderProductPrice.create(
                                                OrderProductAmount.create(p.precio.amount),
                                                OrderProductCurrency.create(p.precio.currency)
                                            ),
                                            OrderProductImage.create(p.image.url)
                                        )
                                    })
                                ),
                                await Promise.all(
                                    event_data.bundles.map(async (c) => {
                                        return OrderBundle.create(
                                            BundleID.create(c.id.id),
                                            OrderBundleName.create(c.name.name),
                                            OrderBundleCantidad.create(c.cantidad.cantidad),
                                            OrderBundlePrice.create(
                                                OrderBundleAmount.create(c.precio.amount),
                                                OrderBundleCurrency.create(c.precio.currency)
                                            ),
                                            OrderBundleImage.create(c.image.url)
                                        )
                                    })
                                ),
                                OrderLocationDelivery.create(
                                    event_data.ubicacion.direccion,
                                    event_data.ubicacion.longitud,
                                    event_data.ubicacion.latitud
                                ),
                                event_data.fecha_entrega ? new Date(event_data.fecha_entrega) : null,
                            );
                            break;
                        case 'OrderTotalCalculated':
                            event = OrderTotalCalculated.create(
                                event_data.id,
                                event_data.total,
                                event_data.subTotal,
                                event_data.moneda,
                                event_data.descuento,
                                event_data.shippingFee
                            )
                            break;
                        case 'OrderStateChanged':
                            event = OrderStateChanged.create(
                                event_data.id,
                                event_data.estado
                            )
                            break;
                        case 'OrderRefunded':
                            event = OrderRefunded.create(
                                event_data.id,
                                event_data.monto,
                                event_data.moneda
                            )
                            break;
                        case 'OrderBillRecivied':
                            event = OrderBillRecivied.create(
                                event_data.id,
                                event_data.factura
                            )
                            break;
                        case 'ProductCreated':
                            event = ProductCreated.create(
                                event_data.id,
                                event_data.name,
                                event_data.description,
                                event_data.unit,
                                event_data.cantidad_medida,
                                event_data.amount,
                                event_data.currency,
                                event_data.image,
                                event_data.stock,
                                null
                            )
                            break;
                        case 'testCreated':
                            event = testCreated.create(
                                event_data.msg
                            )
                            break;
                        case 'UserCreated':
                            event = UserCreated.create(
                                event_data.userId,
                                event_data.userName,
                                event_data.userPhone,
                                event_data.userEmail,
                                event_data.userImage,
                                event_data.userRole
                            );
                            break;
                        // TODO: Revisar si es necesario tenerlo como un evento
                        case 'GetCode':
                            event = UserCreated.create(
                                event_data.userId,
                                event_data.userName,
                                event_data.userPhone,
                                event_data.userEmail,
                                event_data.userImage,
                                event_data.userRole
                            );
                            break;
                        case 'BundleDiscountModified':
                            event = BundleDiscountModified.create(
                                event_data.id,
                                event_data.discount
                            );
                            break;
                        case 'ProductDiscountModified':
                            event = ProductDiscountModified.create(
                                event_data.id,
                                event_data.discount
                            );
                        break;
                        case 'ProductCreated':
                            event = ProductCreated.create(
                                event_data.id,
                                event_data.name,
                                event_data.description,
                                event_data.unit,
                                event_data.cantidad_medida,
                                event_data.amount,
                                event_data.currency,
                                event_data.images,
                                event_data.stock,
                                event_data.categories,
                                event_data.discount,
                                event_data.caducityDate,
                                event_data.image3d

                            )
                        break;
                        case 'BundleCreated':
                        event = BundleCreated.create(
                            event_data.id,
                            event_data.name,
                            event_data.description,
                            event_data.measurement,
                            event_data.weight,
                            event_data.price,
                            event_data.currency,
                            event_data.categories,
                            event_data.images,
                            event_data.stock,
                            event_data.products,
                            event_data.bundleCaducityDate,
                            event_data.discount
                        )
                        break;

                            
                    }

                    // Ejecutar el callback con el evento procesado
                    const result = await callback(event);

                    // Acknowledge del mensaje
                    channel.ack(msg);

                    const remainingMessages = await channel.checkQueue(q.queue);
                    if (remainingMessages.messageCount === 0) {
                        await channel.deleteQueue(q.queue);  // Eliminar la cola manualmente
                        console.log(`Cola ${q.queue} eliminada.`);
                    }

                }
            }, { noAck: false });

        } catch (error) {
            return Result.fail(error, 500, error.message)
        }

        return Result.success({
            unsubscribe: async () => {
                console.log(`Desuscribiéndose del evento ${eventName}`);
            }
        }, 200);
    }


}