import { FutureData } from "../../data/api-futures";
import { TeamMember, TeamRole } from "../entities/incident-management-team/TeamMember";
import { Id } from "../entities/Ref";
import { IncidentManagementTeamRepository } from "../repositories/IncidentManagementTeamRepository";
import { RoleRepository } from "../repositories/RoleRepository";

export class DeleteIncidentManagementTeamMemberRoleUseCase {
    constructor(
        private options: {
            incidentManagementTeamRepository: IncidentManagementTeamRepository;
            roleRepository: RoleRepository;
        }
    ) {}

    public execute(
        teamMemberRole: TeamRole,
        incidentManagementTeam: TeamMember,
        diseaseOutbreakId: Id
    ): FutureData<void> {
        return this.options.roleRepository.getAll().flatMap(roles => {
            return this.options.incidentManagementTeamRepository.deleteIncidentManagementTeamMemberRole(
                teamMemberRole,
                incidentManagementTeam,
                diseaseOutbreakId,
                roles
            );
        });
    }
}
