import { FutureData } from "../../data/api-futures";
import { Maybe } from "../../utils/ts-utils";
import { IncidentManagementTeam } from "../entities/incident-management-team/IncidentManagementTeam";
import { Id } from "../entities/Ref";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";
import { TeamMemberRepository } from "../repositories/TeamMemberRepository";
import { getIncidentManagementTeamById } from "./utils/incident-management-team/GetIncidentManagementTeamById";

export class GetIncidentManagementTeamByIdUseCase {
    constructor(
        private options: {
            teamMemberRepository: TeamMemberRepository;
            diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
        }
    ) {}

    public execute(diseaseOutbreakEventId: Id): FutureData<Maybe<IncidentManagementTeam>> {
        return getIncidentManagementTeamById(diseaseOutbreakEventId, this.options);
    }
}
