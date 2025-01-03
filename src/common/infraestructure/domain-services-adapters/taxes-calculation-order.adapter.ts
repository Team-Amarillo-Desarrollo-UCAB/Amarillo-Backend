import axios from "axios";
import { ITaxesCalculationPort } from "src/common/domain/domain-service/taxes-calculation.port";
import { Result } from "src/common/domain/result-handler/Result";
import { OrderTotal } from "src/order/domain/value-object/order-total";

export class TaxesCalculationAdapter implements ITaxesCalculationPort {
    private readonly ivaApiUrl: string;

    constructor() {
        this.ivaApiUrl = "https://api.example.com/vat/venezuela";
    }

    async execute(t: OrderTotal): Promise<Result<number>> {
        //     try {
        //         const response = await axios.get<{ ivaPercentage: number }>(this.ivaApiUrl);
        //         if (response.status === 200 && response.data.ivaPercentage) {
        //             const ivaPercentage = response.data.ivaPercentage;
        //             const iva = t.Total * (ivaPercentage / 100);
        //             return Result.success(iva, 200);
        //         }
        //         return Result.fail<number>(
        //             new Error("No se pudo obtener el porcentaje del IVA"),
        //             response.status,
        //             "El servicio externo no devolvió datos válidos"
        //         );
        //     } catch (error) {
        //         return Result.fail<number>(
        //             new Error(error.message),
        //             500,
        //             "Error al consultar el servicio externo de IVA"
        //         );
        //     }
        // }

        const iva = t.Total * 0.16
        return Result.success(iva, 200)
    }
}
