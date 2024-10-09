import { FutureData } from "../../data/api-futures";
import { TeamMember, TeamRole } from "../entities/incident-management-team/TeamMember";
import { Id } from "../entities/Ref";
import { IncidentManagementTeamRepository } from "../repositories/IncidentManagementTeamRepository";

export class DeleteIncidentManagementTeamMemberRoleUseCase {
    constructor(
        private options: {
            incidentManagementTeamRepository: IncidentManagementTeamRepository;
        }
    ) {}

    public execute(
        teamMemberRole: TeamRole,
        incidentManagementTeam: TeamMember,
        diseaseOutbreakId: Id
    ): FutureData<void> {
        return this.options.incidentManagementTeamRepository.deleteIncidentManagementTeamMemberRole(
            teamMemberRole,
            incidentManagementTeam,
            diseaseOutbreakId
        );
    }
}
