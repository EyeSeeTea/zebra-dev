import { FutureData } from "../../data/api-futures";
import { Id } from "../entities/Ref";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";

export class DeleteIncidentManagementTeamMemberRolesUseCase {
    constructor(
        private options: {
            diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
        }
    ) {}

    public execute(diseaseOutbreakId: Id, incidentManagementTeamRoleIds: Id[]): FutureData<void> {
        return this.options.diseaseOutbreakEventRepository.deleteIncidentManagementTeamMemberRoles(
            diseaseOutbreakId,
            incidentManagementTeamRoleIds
        );
    }
}
