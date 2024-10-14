import { FutureData } from "../../data/api-futures";
import { Maybe } from "../../utils/ts-utils";
import { IncidentActionPlan } from "../entities/incident-action-plan/IncidentActionPlan";
import { Id } from "../entities/Ref";
import { IncidentActionRepository } from "../repositories/IncidentActionRepository";
import { OptionsRepository } from "../repositories/OptionsRepository";
import { TeamMemberRepository } from "../repositories/TeamMemberRepository";
import { getIncidentAction } from "./utils/incident-action/GetIncidentActionById";

export class GetIncidentActionByIdUseCase {
    constructor(
        private options: {
            incidentActionRepository: IncidentActionRepository;
            optionsRepository: OptionsRepository;
            teamMemberRepository: TeamMemberRepository;
        }
    ) {}

    public execute(diseaseOutbreakEventId: Id): FutureData<Maybe<IncidentActionPlan>> {
        return getIncidentAction(
            diseaseOutbreakEventId,
            this.options.incidentActionRepository,
            this.options.optionsRepository,
            this.options.teamMemberRepository
        );
    }
}
