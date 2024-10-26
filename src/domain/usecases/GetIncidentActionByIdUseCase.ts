import { FutureData } from "../../data/api-futures";
import { Maybe } from "../../utils/ts-utils";
import { AppConfigurations } from "../entities/AppConfigurations";
import { IncidentActionPlan } from "../entities/incident-action-plan/IncidentActionPlan";
import { Id } from "../entities/Ref";
import { IncidentActionRepository } from "../repositories/IncidentActionRepository";
import { getIncidentAction } from "./utils/incident-action/GetIncidentActionById";

export class GetIncidentActionByIdUseCase {
    constructor(
        private options: {
            incidentActionRepository: IncidentActionRepository;
        }
    ) {}

    public execute(
        diseaseOutbreakEventId: Id,
        appConfiguration: AppConfigurations
    ): FutureData<Maybe<IncidentActionPlan>> {
        return getIncidentAction(
            diseaseOutbreakEventId,
            this.options.incidentActionRepository,
            appConfiguration
        );
    }
}
