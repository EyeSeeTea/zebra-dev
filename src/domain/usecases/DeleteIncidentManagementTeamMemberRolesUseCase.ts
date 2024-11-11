import { FutureData } from "../../data/api-futures";
import { Id } from "../entities/Ref";
import { IncidentManagementTeamRepository } from "../repositories/IncidentManagementTeamRepository";

export class DeleteIncidentManagementTeamMemberRolesUseCase {
    constructor(
        private options: {
            incidentManagementTeamRepository: IncidentManagementTeamRepository;
        }
    ) {}

    public execute(diseaseOutbreakId: Id, incidentManagementTeamRoleIds: Id[]): FutureData<void> {
        return this.options.incidentManagementTeamRepository.deleteIncidentManagementTeamMemberRoles(
            diseaseOutbreakId,
            incidentManagementTeamRoleIds
        );
    }
}
