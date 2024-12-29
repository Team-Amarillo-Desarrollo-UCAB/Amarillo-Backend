import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";
import { Measurement } from "../../../common/domain/enum/commons-enums/measurement-enum";

export class BundleWeightModified extends DomainEvent {
    protected constructor(
        public id: string,
        public weight: number,
        public measurement: Measurement
    ) {
        super();
    }

    static create(id: string, weight: number, measurement: Measurement): BundleWeightModified {
        return new BundleWeightModified(id, weight,measurement);
    }
}
