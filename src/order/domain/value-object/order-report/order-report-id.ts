import { IValueObject } from "src/common/domain/value-object/value-object.interface";
import { InvalidOrderReportId } from "../../domain-exception/invalid-order-report-id";

export class OrderReportId implements IValueObject<OrderReportId> {

    private readonly id: string;

    protected constructor(id: string) {
        let _existente: boolean = true;

        if (!id) _existente = false;

        if (!_existente)
            throw new InvalidOrderReportId('El id del reporte no puede ser vacío');

        const regex = new RegExp(
            '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
        );
        if (!regex.test(id))
            throw new InvalidOrderReportId("El id del reporte no puede ser vacío");

        this.id = id;
    }

    get Id(): string {
        return this.id;
    }

    equals(valueObject: OrderReportId): boolean {
        return this.id === valueObject.id
    }

    static create(id: string): OrderReportId {
        return new OrderReportId(id)
    }
}