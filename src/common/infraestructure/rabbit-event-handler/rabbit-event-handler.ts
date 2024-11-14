import { HttpException } from "@nestjs/common"
import * as amqp from 'amqplib'

import { IEventHandler } from "src/common/application/event-handler/event-handler.interface"
import { IEventSubscriber } from "src/common/application/event-handler/subscriber.interface"
import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface"


export class RabbitEventBus implements IEventHandler {

    public static instance?: RabbitEventBus;

    // Propiedad estática para verificar si la conexión ya ha sido inicializada
    private static connectionInitialized = false;
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
            this.instance!.connection = await amqp.connect('amqps://qtqvqnvz:GwI-cQ4Y7VMeu9YOKHkCa6exDZ5S9WYY@moose.rmq.cloudamqp.com/qtqvqnvz');
            this.connectionInitialized = true;
            console.log('Conexión a RabbitMQ exitosa');
        } catch (error) {
            console.log('Error en la conexión de RabbitMQ: ', error);
        }
    }

    public async publish(events: DomainEvent[]): Promise<void> {
        if (!this.connection) {
            throw new Error("RabbitMQ connection not initialized.");
        }

        try {
            for (const event of events) {
                const channel = await this.connection.createChannel();
                // Asegúrate de que la conexión esté inicializada
                await channel.assertQueue(event.eventName, { durable: true })
                channel.sendToQueue(
                    event.eventName,
                    Buffer.from(JSON.stringify(event)),
                    {
                        persistent: false,
                    },
                )
                console.log(`Mensaje enviado a la cola ${event.eventName}:`, event)
            }
        } catch (error) {
            console.error("Error al publicar el evento:", error);
        }
    }


    async subscribe(eventName: string, callback: (event: DomainEvent) => Promise<void>): Promise<IEventSubscriber> {
        if (!this.connection) {
            throw new Error("RabbitMQ connection not initialized.");
        }

        try{
            const channel = await this.connection.createChannel();
            await channel.consume(eventName, async (message) => {
                if(message){
                    const event = JSON.parse(message.content.toString())
                    console.log("evento: ",event)
                    await callback(event)
                    channel.ack(message)
                }
            },
            {
                noAck: false,
            })
        }catch(error){
            console.error("Error al subscribirse al evento:", error);
        }
        return {
            unsubscribe: async () => {

            }
        }
        
    }

}