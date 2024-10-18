import { FutureData } from "../../data/api-futures";
import { DiseaseOutbreakEvent } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../entities/generic/Future";
import { Id } from "../entities/Ref";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";
import { IncidentManagementTeamRepository } from "../repositories/IncidentManagementTeamRepository";
import { OptionsRepository } from "../repositories/OptionsRepository";
import { OrgUnitRepository } from "../repositories/OrgUnitRepository";
import { RiskAssessmentRepository } from "../repositories/RiskAssessmentRepository";
import { RoleRepository } from "../repositories/RoleRepository";
import { TeamMemberRepository } from "../repositories/TeamMemberRepository";
import { getIncidentManagementTeamById } from "./utils/incident-management-team/GetIncidentManagementTeamById";
import { getAll } from "./utils/risk-assessment/GetRiskAssessmentById";

export class GetDiseaseOutbreakByIdUseCase {
    constructor(
        private options: {
            diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
            optionsRepository: OptionsRepository;
            teamMemberRepository: TeamMemberRepository;
            orgUnitRepository: OrgUnitRepository;
            riskAssessmentRepository: RiskAssessmentRepository;
            incidentManagementTeamRepository: IncidentManagementTeamRepository;
            roleRepository: RoleRepository;
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
                    areasAffectedProvinces:
                        this.options.orgUnitRepository.get(areasAffectedProvinceIds),
                    areasAffectedDistricts:
                        this.options.orgUnitRepository.get(areasAffectedDistrictIds),
                    riskAssessment: getAll(
                        id,
                        this.options.riskAssessmentRepository,
                        this.options.optionsRepository,
                        this.options.teamMemberRepository
                    ),
                    incidentManagementTeam: getIncidentManagementTeamById(id, this.options),
                    roles: this.options.roleRepository.getAll(),
                }).flatMap(
                    ({
                        mainSyndrome,
                        suspectedDisease,
                        notificationSource,
                        areasAffectedProvinces,
                        areasAffectedDistricts,
                        riskAssessment,
                        incidentManagementTeam,
                        roles,
                    }) => {
                        return this.options.incidentManagementTeamRepository
                            .getIncidentManagementTeamMember(incidentManagerName, id, roles)
                            .flatMap(incidentManager => {
                                const diseaseOutbreakEvent: DiseaseOutbreakEvent =
                                    new DiseaseOutbreakEvent({
                                        ...diseaseOutbreakEventBase,
                                        createdBy: undefined, //TO DO : FIXME populate once metadata change is done.
                                        mainSyndrome: mainSyndrome,
                                        suspectedDisease: suspectedDisease,
                                        notificationSource: notificationSource,
                                        areasAffectedProvinces: areasAffectedProvinces,
                                        areasAffectedDistricts: areasAffectedDistricts,
                                        incidentManager: incidentManager,
                                        riskAssessment: riskAssessment,
                                        incidentActionPlan: undefined, //TO DO : FIXME populate once incidentActionPlan repo is implemented
                                        incidentManagementTeam: incidentManagementTeam,
                                    });
                                return Future.success(diseaseOutbreakEvent);
                            });
                    }
                );
            });
    }
}
