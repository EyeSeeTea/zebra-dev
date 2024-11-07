import { FutureData } from "../../../../data/api-futures";
import { Maybe } from "../../../../utils/ts-utils";
import { Configurations } from "../../../entities/AppConfigurations";
import { IncidentManagementTeam } from "../../../entities/incident-management-team/IncidentManagementTeam";
import { Id } from "../../../entities/Ref";
import { DiseaseOutbreakEventRepository } from "../../../repositories/DiseaseOutbreakEventRepository";

export function getIncidentManagementTeamById(
    diseaseOutbreakId: Id,
    configurations: Configurations,
    repositories: {
        diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
    }
): FutureData<Maybe<IncidentManagementTeam>> {
    return repositories.diseaseOutbreakEventRepository.getIncidentManagementTeam(
        diseaseOutbreakId,
        configurations.teamMembers.all
    );
}
