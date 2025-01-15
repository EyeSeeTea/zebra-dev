import { FutureData } from "../../data/api-futures";
import {
    IncidentActionRepository,
    UpdateIncidentResponseActionOptions,
} from "../repositories/IncidentActionRepository";

export class UpdateIncidentResponseActionUseCase {
    constructor(private options: { incidentActionRepository: IncidentActionRepository }) {}

    public execute(options: UpdateIncidentResponseActionOptions): FutureData<void> {
        return this.options.incidentActionRepository.updateIncidentResponseAction(options);
    }
}
