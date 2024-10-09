import { FutureData } from "../../../../data/api-futures";
import { Maybe } from "../../../../utils/ts-utils";
import { IncidentManagementTeam } from "../../../entities/incident-management-team/IncidentManagementTeam";
import { Id } from "../../../entities/Ref";
import { IncidentManagementTeamRepository } from "../../../repositories/IncidentManagementTeamRepository";
import { TeamMemberRepository } from "../../../repositories/TeamMemberRepository";

export function getIncidentManagementTeamById(
    diseaseOutbreakId: Id,
    incidentManagementTeamRepository: IncidentManagementTeamRepository,
    teamMemberRepository: TeamMemberRepository
): FutureData<Maybe<IncidentManagementTeam>> {
    return teamMemberRepository.getAll().flatMap(teamMembers => {
        return incidentManagementTeamRepository.get(diseaseOutbreakId, teamMembers);
    });
}
