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
        private options: {
            diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
            optionsRepository: OptionsRepository;
            teamMemberRepository: TeamMemberRepository;
            orgUnitRepository: OrgUnitRepository;
        }
    ) {}

    public execute(id: Id): FutureData<DiseaseOutbreakEvent> {
        return this.options.diseaseOutbreakEventRepository
            .get(id)
            .flatMap(diseaseOutbreakEventBase => {
                const {
                    mainSyndromeCode,
                    suspectedDiseaseCode,
                    notificationSourceCode,
                    incidentManagerName,
                    areasAffectedDistrictIds,
                    areasAffectedProvinceIds,
                } = diseaseOutbreakEventBase;
                return Future.joinObj({
                    mainSyndrome: mainSyndromeCode
                        ? this.options.optionsRepository.getMainSyndrome(mainSyndromeCode)
                        : Future.success(undefined),
                    suspectedDisease: suspectedDiseaseCode
                        ? this.options.optionsRepository.getSuspectedDisease(suspectedDiseaseCode)
                        : Future.success(undefined),
                    notificationSource:
                        this.options.optionsRepository.getNotificationSource(
                            notificationSourceCode
                        ),
                    incidentManager: incidentManagerName
                        ? this.options.teamMemberRepository.get(incidentManagerName)
                        : Future.success(undefined),
                    areasAffectedProvinces:
                        this.options.orgUnitRepository.get(areasAffectedProvinceIds),
                    areasAffectedDistricts:
                        this.options.orgUnitRepository.get(areasAffectedDistrictIds),
                }).flatMap(
                    ({
                        mainSyndrome,
                        suspectedDisease,
                        notificationSource,
                        incidentManager,
                        areasAffectedProvinces,
                        areasAffectedDistricts,
                    }) => {
                        const diseaseOutbreakEvent: DiseaseOutbreakEvent = new DiseaseOutbreakEvent(
                            {
                                ...diseaseOutbreakEventBase,
                                createdBy: undefined, //TO DO : FIXME populate once metadata change is done.
                                mainSyndrome: mainSyndrome,
                                suspectedDisease: suspectedDisease,
                                notificationSource: notificationSource,
                                areasAffectedProvinces: areasAffectedProvinces,
                                areasAffectedDistricts: areasAffectedDistricts,
                                incidentManager: incidentManager,
                                riskAssessments: undefined, //TO DO : FIXME populate once riskAssessment repo is implemented
                                incidentActionPlan: undefined, //TO DO : FIXME populate once incidentActionPlan repo is implemented
                                incidentManagementTeam: undefined, //TO DO : FIXME populate once incidentManagementTeam repo is implemented
                            }
                        );
                        return Future.success(diseaseOutbreakEvent);
                    }
                );
            });
    }
}
