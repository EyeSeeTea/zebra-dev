import { FutureData } from "../../data/api-futures";
import { DiseaseOutbreakEvent } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../entities/generic/Future";
import { Id } from "../entities/Ref";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";
import { OptionsRepository } from "../repositories/OptionsRepository";
import { OrgUnitRepository } from "../repositories/OrgUnitRepository";
import { TeamMemberRepository } from "../repositories/TeamMemberRepository";

export class GetDiseaseOutbreakByIdUseCase {
    constructor(
        private diseaseOutbreakRepository: DiseaseOutbreakEventRepository,
        private optionsRepository: OptionsRepository,
        private teamMemberRepository: TeamMemberRepository,
        private orgUnitRepository: OrgUnitRepository
    ) {}

    public execute(id: Id): FutureData<DiseaseOutbreakEvent> {
        return this.diseaseOutbreakRepository.get(id).flatMap(diseaseOutbreakEventBase => {
            const {
                mainSyndromeCode,
                suspectedDiseaseCode,
                notificationSourceCode,
                incidentManagerName,
                areasAffectedDistrictIds,
                areasAffectedProvinceIds,
            } = diseaseOutbreakEventBase;

            return Future.joinObj({
                mainSyndrome: this.optionsRepository.get(mainSyndromeCode),
                suspectedDisease: this.optionsRepository.get(suspectedDiseaseCode),
                notificationSource: this.optionsRepository.get(notificationSourceCode),
                incidentManager: incidentManagerName
                    ? this.teamMemberRepository.get(incidentManagerName)
                    : Future.success(undefined),
                areasAffectedProvinces: this.orgUnitRepository.get(areasAffectedProvinceIds),
                areasAffectedDistricts: this.orgUnitRepository.get(areasAffectedDistrictIds),
            }).flatMap(
                ({
                    mainSyndrome,
                    suspectedDisease,
                    notificationSource,
                    incidentManager,
                    areasAffectedProvinces,
                    areasAffectedDistricts,
                }) => {
                    const diseaseOutbreakEvent: DiseaseOutbreakEvent = new DiseaseOutbreakEvent({
                        ...diseaseOutbreakEventBase,
                        createdBy: undefined, //TO DO : populate once metadata change is done.
                        mainSyndrome: mainSyndrome,
                        suspectedDisease: suspectedDisease,
                        notificationSource: notificationSource,
                        areasAffectedProvinces: areasAffectedProvinces,
                        areasAffectedDistricts: areasAffectedDistricts,
                        incidentManager: incidentManager,
                        riskAssessments: undefined, //TO DO : populate once riskAssessment repo is implemented
                        incidentActionPlan: undefined, //TO DO : populate once incidentActionPlan repo is implemented
                        incidentManagementTeam: undefined, //TO DO : populate once incidentManagementTeam repo is implemented
                    });
                    return Future.success(diseaseOutbreakEvent);
                }
            );
        });
    }
}
