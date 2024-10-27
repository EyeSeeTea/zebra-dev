import { FutureData } from "../../data/api-futures";
import { Maybe } from "../../utils/ts-utils";
import { Configurations } from "../entities/AppConfigurations";
import { IncidentManagementTeam } from "../entities/incident-management-team/IncidentManagementTeam";
import { Id } from "../entities/Ref";
import { IncidentManagementTeamRepository } from "../repositories/IncidentManagementTeamRepository";
import { RoleRepository } from "../repositories/RoleRepository";
import { TeamMemberRepository } from "../repositories/TeamMemberRepository";
import { getIncidentManagementTeamById } from "./utils/incident-management-team/GetIncidentManagementTeamById";

export class GetIncidentManagementTeamByIdUseCase {
    constructor(
        private options: {
            roleRepository: RoleRepository;
            teamMemberRepository: TeamMemberRepository;
            incidentManagementTeamRepository: IncidentManagementTeamRepository;
        }
    ) {}

    public execute(
        diseaseOutbreakEventId: Id,
        configurations: Configurations
    ): FutureData<Maybe<IncidentManagementTeam>> {
        return getIncidentManagementTeamById(diseaseOutbreakEventId, this.options, configurations);
    }
}
