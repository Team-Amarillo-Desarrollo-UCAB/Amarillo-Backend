const amqp = require('amqplib');

async function sendMessage() {
  try {
    // Conexión a RabbitMQ
    const connection = await amqp.connect('amqps://qtqvqnvz:GwI-cQ4Y7VMeu9YOKHkCa6exDZ5S9WYY@moose.rmq.cloudamqp.com/qtqvqnvz');

    // Crear los canales de comunicación
    const channel = await connection.createChannel();
    const channel_2 = await connection.createChannel();

    const queue = 'product';
    const queue_2 = 'pproducto2';
    const message = 'Nuevo producto disponible: Camisa';
    const message2 = 'Nuevo producto disponible: Zapatos';

    // Declarar las colas
    await channel.assertQueue(queue, { durable: false });
    await channel.assertQueue(queue_2, { durable: false });

    // Suscribirse a la cola 'product' en channel_2
    await channel_2.consume(queue, async (message) => {
      if (message) {
        await recibirMensaje(message);
        channel_2.ack(message);  // Reconocer en el mismo canal
      }
    });

    // Suscribirse a la cola 'pproducto2' en channel_2
    await channel_2.consume(queue_2, async (message) => {
      if (message) {
        await recibirMensaje2(message);
        channel_2.ack(message);  // Reconocer en el mismo canal
      }
    });

    console.log("Se suscribió");

    // Enviar mensajes a las colas
    channel.sendToQueue(queue, Buffer.from(message));
    channel.sendToQueue(queue_2, Buffer.from(message2));
    console.log(`Mensaje enviado a la cola: ${message}`);
    console.log(`Mensaje enviado a la cola: ${message2}`);

    // Cerrar los canales y la conexión después de un breve retraso
    setTimeout(() => {
      channel.close();
      channel_2.close();
      connection.close();
    }, 500);

  } catch (error) {
    console.error('Error:', error);
  }
}

async function recibirMensaje(msg) {
  console.log("Mensaje recibido:", msg.content.toString());
}

async function recibirMensaje2(msg) {
  console.log("Mensaje 2 recibido:", msg.content.toString());
}

sendMessage();

/*export class testEvent{
    public msg: string
    public fecha: Date

    constructor(params: string) {
        this.msg = params
        this.fecha = new Date()
    }

    toJson(){
        return JSON.stringify(this)
    }
}

const evento = new testEvent("HOLA")
console.log(evento.toJson())

console.log(Buffer.from(JSON.stringify(evento)))
const mensaje = Buffer.from(JSON.stringify(evento))

console.log(mensaje.toString())*/
