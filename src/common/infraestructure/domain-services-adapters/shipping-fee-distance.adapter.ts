import axios from 'axios'

import { IShippingFee } from "src/common/domain/domain-service/shipping-fee-calculate.port";
import { Result } from "src/common/domain/result-handler/Result";
import { InvalidOrderShippingFee } from 'src/order/domain/domain-exception/invalid-order-shipping-fee';
import { OrderLocationDelivery } from "src/order/domain/value-object/order-location-delivery";
import { OrderShippingFee } from "src/order/domain/value-object/order-shipping-fee";
import { OrderTotal } from 'src/order/domain/value-object/order-total';

export class ShippingFeeDistance implements IShippingFee {

    async execute(ubicacion: OrderLocationDelivery, total?: OrderTotal): Promise<Result<OrderShippingFee>> {

        try {
            const origen: string = '10.463325,-66.977302'
            const destino: string = `${ubicacion.Latitud},${ubicacion.Longitud}`

            const url = `https://router.hereapi.com/v8/routes?transportMode=car&origin=${origen}&destination=${destino}&return=summary&apikey=-${process.env.HERE_API_KEY}`
            let respuesta
            const peticion = await axios.get(url)
                .then(response => {
                    respuesta = response.data.routes[0].sections[0]
                })
                .catch(error => {
                    return Result.fail<OrderShippingFee>(error, 500, "Fallo en la ruta")
                });
            if (!respuesta)
                return Result.fail<OrderShippingFee>(new Error('Fallo en la ruta'), 500, "Fallo en la ruta")

            const distancia = Math.floor(respuesta.summary.length / 1000) // Transformacion de la distancia a km
            console.log("Distancia obtenida: ",distancia)
            const rango = Math.floor(distancia / 5) * 5;

            let shipping_fee: OrderShippingFee
            if (rango === 0) { // 0-5Km 0.15$
                shipping_fee = OrderShippingFee.create(parseFloat((distancia * 0.15).toFixed(2)))
            } else if (rango === 5) { // 5-10Km 0.10$
                shipping_fee = OrderShippingFee.create(parseFloat((distancia * 0.10).toFixed(2)))
            } else if (rango === 10) { // 10-15Km 0.07$
                shipping_fee = OrderShippingFee.create(parseFloat((distancia * 0.07).toFixed(2)))
            } else {
                shipping_fee = OrderShippingFee.create(parseFloat((distancia * 0.05).toFixed(2))) // Mas de 15Km
            }

            console.log("Shipping fee: ",shipping_fee)

            if(!shipping_fee)
                return Result.fail<OrderShippingFee>(new InvalidOrderShippingFee('Rango de distancia invalida'),500,'Rango de distancia invalida')

            return Result.success<OrderShippingFee>(shipping_fee, 200)

        } catch (error) {
            return Result.fail<OrderShippingFee>(error, 500, error.message);
        }

    }

}