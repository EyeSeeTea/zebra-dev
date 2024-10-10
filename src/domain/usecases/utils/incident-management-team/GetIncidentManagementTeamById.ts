import { FutureData } from "../../../../data/api-futures";
import { Maybe } from "../../../../utils/ts-utils";
import { Future } from "../../../entities/generic/Future";
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
    }
): FutureData<Maybe<IncidentManagementTeam>> {
    return Future.joinObj({
        roles: repositories.roleRepository.getAll(),
        teamMembers: repositories.teamMemberRepository.getAll(),
    }).flatMap(({ roles, teamMembers }) => {
        return repositories.incidentManagementTeamRepository.get(
            diseaseOutbreakId,
            teamMembers,
            roles
        );
    });
}
