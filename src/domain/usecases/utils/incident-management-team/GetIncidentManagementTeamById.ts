import { FutureData } from "../../../../data/api-futures";
import { Maybe } from "../../../../utils/ts-utils";
import { Configurations } from "../../../entities/AppConfigurations";
import { IncidentManagementTeam } from "../../../entities/incident-management-team/IncidentManagementTeam";
import { Id } from "../../../entities/Ref";
import { IncidentManagementTeamRepository } from "../../../repositories/IncidentManagementTeamRepository";
import { RoleRepository } from "../../../repositories/RoleRepository";
import { TeamMemberRepository } from "../../../repositories/TeamMemberRepository";

export function getIncidentManagementTeamById(
    diseaseOutbreakId: Id,
    repositories: {
        roleRepository: RoleRepository;
        teamMemberRepository: TeamMemberRepository;
        incidentManagementTeamRepository: IncidentManagementTeamRepository;
    },
    configurations: Configurations
): FutureData<Maybe<IncidentManagementTeam>> {
    return repositories.roleRepository.getAll().flatMap(roles => {
        return repositories.incidentManagementTeamRepository.get(
            diseaseOutbreakId,
            configurations.teamMembers.all,
            roles
        );
    });
}
