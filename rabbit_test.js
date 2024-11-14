const amqp = require('amqplib');

async function sendMessage() {
  try {
    // Conexión a RabbitMQ
    const connection = await amqp.connect('amqps://qtqvqnvz:GwI-cQ4Y7VMeu9YOKHkCa6exDZ5S9WYY@moose.rmq.cloudamqp.com/qtqvqnvz');

    // Crear un canal de comunicación
    const channel = await connection.createChannel();

    const queue = 'product';
    const message = 'Nuevo producto disponible: Camisa';

    // Declarar la cola 'product'
    await channel.assertQueue(queue, {
      durable: false
    });

    await channel.consume(queue, async (message) => {
      if (message) {
        await recibirMensaje(message);
        channel.ack(message);
      }
    })

    // Enviar un mensaje a la cola 'product'
    channel.sendToQueue(queue, Buffer.from(message));
    console.log(`Mensaje enviado a la cola: ${message}`);

    // Cerrar el canal y la conexión
    setTimeout(() => {
      channel.close();
      connection.close();
    }, 500);

  } catch (error) {
    console.error('Error:', error);
  }
}

async function recibirMensaje(msg) {
  console.log("Se envio???")
}

sendMessage();
