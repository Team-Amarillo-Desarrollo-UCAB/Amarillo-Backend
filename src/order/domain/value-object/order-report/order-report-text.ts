import { IValueObject } from "src/common/domain/value-object/value-object.interface";
import { InvalidOrderReportText } from "../../domain-exception/invalid-order-report-text";

export class OrderReportText implements IValueObject<OrderReportText> {

    private readonly texto: string;

    protected constructor(texto: string) {
        let _existente: boolean = true;

        if (!texto) _existente = false;

        if (!_existente || texto === null)
            throw new InvalidOrderReportText('El texto del reporte de la orden es invalido');

        this.texto = texto;
    }

    get Texto(): string {
        return this.texto;
    }

    equals(valueObject: OrderReportText): boolean {
        return this.texto === valueObject.Texto
    }

    static create(texto: string): OrderReportText {
        return new OrderReportText(texto)
    }
}