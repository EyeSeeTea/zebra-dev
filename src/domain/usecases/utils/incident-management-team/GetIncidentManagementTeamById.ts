import { FutureData } from "../../../../data/api-futures";
import { Maybe } from "../../../../utils/ts-utils";
import { Future } from "../../../entities/generic/Future";
import { IncidentManagementTeam } from "../../../entities/incident-management-team/IncidentManagementTeam";
import { Id } from "../../../entities/Ref";
import { DiseaseOutbreakEventRepository } from "../../../repositories/DiseaseOutbreakEventRepository";
import { RoleRepository } from "../../../repositories/RoleRepository";
import { TeamMemberRepository } from "../../../repositories/TeamMemberRepository";

export function getIncidentManagementTeamById(
    diseaseOutbreakId: Id,
    repositories: {
        roleRepository: RoleRepository;
        teamMemberRepository: TeamMemberRepository;
        diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
    }
): FutureData<Maybe<IncidentManagementTeam>> {
    return Future.joinObj({
        roles: repositories.roleRepository.getAll(),
        teamMembers: repositories.teamMemberRepository.getAll(),
    }).flatMap(({ roles, teamMembers }) => {
        return repositories.diseaseOutbreakEventRepository.getIncidentManagementTeam(
            diseaseOutbreakId,
            teamMembers,
            roles
        );
    });
}
