import { FutureData } from "../../data/api-futures";
import { Id } from "../entities/Ref";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";

export class DeleteIncidentManagementTeamMemberRoleUseCase {
    constructor(
        private options: {
            diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
        }
    ) {}

    public execute(diseaseOutbreakId: Id, incidentManagementTeamRoleId: Id): FutureData<void> {
        return this.options.diseaseOutbreakEventRepository.deleteIncidentManagementTeamMemberRole(
            diseaseOutbreakId,
            incidentManagementTeamRoleId
        );
    }
}
