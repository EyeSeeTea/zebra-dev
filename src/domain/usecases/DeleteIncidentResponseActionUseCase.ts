import { FutureData } from "../../data/api-futures";
import { Id } from "../entities/Ref";
import { IncidentActionRepository } from "../repositories/IncidentActionRepository";

export class DeleteIncidentResponseActionUseCase {
    constructor(private options: { incidentActionRepository: IncidentActionRepository }) {}

    public execute(eventId: Id): FutureData<void> {
        return this.options.incidentActionRepository.deleteIncidentResponseAction(eventId);
    }
}
