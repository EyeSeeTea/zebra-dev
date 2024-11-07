import { FutureData } from "../../../../data/api-futures";
import { Maybe } from "../../../../utils/ts-utils";
import { IncidentManagementTeamInAggregateRoot } from "../../../entities/disease-outbreak-event/DiseaseOutbreakEventAggregateRoot";
import { Id } from "../../../entities/Ref";
import { DiseaseOutbreakEventRepository } from "../../../repositories/DiseaseOutbreakEventRepository";

export function getIncidentManagementTeamById(
    diseaseOutbreakId: Id,
    repositories: {
        diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
    }
): FutureData<Maybe<IncidentManagementTeamInAggregateRoot>> {
    return repositories.diseaseOutbreakEventRepository.getIncidentManagementTeam(diseaseOutbreakId);
}
