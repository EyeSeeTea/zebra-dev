import { FutureData } from "../../../../data/api-futures";
import { Maybe } from "../../../../utils/ts-utils";
import { IncidentManagementTeam } from "../../../entities/incident-management-team/IncidentManagementTeam";
import { Id } from "../../../entities/Ref";
import { DiseaseOutbreakEventRepository } from "../../../repositories/DiseaseOutbreakEventRepository";
import { TeamMemberRepository } from "../../../repositories/TeamMemberRepository";

export function getIncidentManagementTeamById(
    diseaseOutbreakId: Id,
    repositories: {
        teamMemberRepository: TeamMemberRepository;
        diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
    }
): FutureData<Maybe<IncidentManagementTeam>> {
    return repositories.teamMemberRepository.getAll().flatMap(teamMembers => {
        return repositories.diseaseOutbreakEventRepository.getIncidentManagementTeam(
            diseaseOutbreakId,
            teamMembers
        );
    });
}
