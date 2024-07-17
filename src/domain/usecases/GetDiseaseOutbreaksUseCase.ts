import { FutureData } from "../../data/api-futures";
import { DiseaseOutbreakEvent } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../entities/generic/Future";
import { Id } from "../entities/Ref";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";
import { OptionsRepository } from "../repositories/OptionsRepository";
import { OrgUnitRepository } from "../repositories/OrgUnitRepository";
import { TeamMemberRepository } from "../repositories/TeamMemberRepository";

export class GetDiseaseOutbreaksUseCase {
    constructor(
        private diseaseOutbreakRepository: DiseaseOutbreakEventRepository,
        private optionsRepository: OptionsRepository,
        private teamMemberRepository: TeamMemberRepository,
        private orgUnitRepository: OrgUnitRepository
    ) {}

    public execute(id: Id): FutureData<DiseaseOutbreakEvent> {
        return this.diseaseOutbreakRepository.get(id).flatMap(diseaseOutbreakEventBase => {
            return Future.joinObj({
                mainSyndrome: diseaseOutbreakEventBase.mainSyndrome.id 
                    ? this.optionsRepository.get(diseaseOutbreakEventBase.mainSyndrome.id)
                    : Future.success({ id: "", name: "" }),
                suspectedDisease: diseaseOutbreakEventBase.suspectedDisease.id
                    ? this.optionsRepository.get(diseaseOutbreakEventBase.suspectedDisease.id)
                    : Future.success({ id: "", name: "" }),
                notificationSource: diseaseOutbreakEventBase.notificationSource.id
                    ? this.optionsRepository.get(diseaseOutbreakEventBase.notificationSource.id)
                    : Future.success({ id: "", name: "" }),
                incidentManager: this.teamMemberRepository.get(
                    diseaseOutbreakEventBase.incidentManager.id
                ),
                areasAffectedProvinces: this.orgUnitRepository.get(
                    diseaseOutbreakEventBase.areasAffectedProvinces.map(orgUnit => orgUnit.id)
                ),
                areasAffectedDistricts: this.orgUnitRepository.get(
                    diseaseOutbreakEventBase.areasAffectedDistricts.map(orgUnit => orgUnit.id)
                ),
            }).flatMap(
                ({
                    mainSyndrome,
                    suspectedDisease,
                    notificationSource,
                    incidentManager,
                    areasAffectedProvinces,
                    areasAffectedDistricts,
                }) => {
                    const diseaseOutbreakEvent = diseaseOutbreakEventBase._update({
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
