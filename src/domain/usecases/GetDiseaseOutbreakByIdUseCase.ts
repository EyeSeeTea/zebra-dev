import { FutureData } from "../../data/api-futures";
import { Configurations } from "../entities/AppConfigurations";
import { DiseaseOutbreakEvent } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../entities/generic/Future";
import { Id } from "../entities/Ref";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";
import { IncidentActionRepository } from "../repositories/IncidentActionRepository";
import { IncidentManagementTeamRepository } from "../repositories/IncidentManagementTeamRepository";
import { OrgUnitRepository } from "../repositories/OrgUnitRepository";
import { RiskAssessmentRepository } from "../repositories/RiskAssessmentRepository";
import { RoleRepository } from "../repositories/RoleRepository";
import { TeamMemberRepository } from "../repositories/TeamMemberRepository";
import { getIncidentAction } from "./utils/incident-action/GetIncidentActionById";
import { getIncidentManagementTeamById } from "./utils/incident-management-team/GetIncidentManagementTeamById";
import { getAll } from "./utils/risk-assessment/GetRiskAssessmentById";

export class GetDiseaseOutbreakByIdUseCase {
    constructor(
        private options: {
            diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
            teamMemberRepository: TeamMemberRepository;
            orgUnitRepository: OrgUnitRepository;
            riskAssessmentRepository: RiskAssessmentRepository;
            incidentActionRepository: IncidentActionRepository;
            incidentManagementTeamRepository: IncidentManagementTeamRepository;
            roleRepository: RoleRepository;
        }
    ) {}

    public execute(id: Id, configurations: Configurations): FutureData<DiseaseOutbreakEvent> {
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

                const { selectableOptions } = configurations;

                const mainSyndrome =
                    selectableOptions.eventTrackerConfigurations.mainSyndromes.find(
                        mainSyndrome => mainSyndrome.id === mainSyndromeCode
                    );
                const suspectedDisease =
                    selectableOptions.eventTrackerConfigurations.suspectedDiseases.find(
                        suspectedDisease => suspectedDisease.id === suspectedDiseaseCode
                    );
                const notificationSource =
                    selectableOptions.eventTrackerConfigurations.notificationSources.find(
                        notificationSource => notificationSource.id === notificationSourceCode
                    );

                if (!notificationSource)
                    return Future.error(new Error("Notification source not found"));

                return Future.joinObj({
                    areasAffectedProvinces:
                        this.options.orgUnitRepository.get(areasAffectedProvinceIds),
                    areasAffectedDistricts:
                        this.options.orgUnitRepository.get(areasAffectedDistrictIds),
                    riskAssessment: getAll(
                        id,
                        this.options.riskAssessmentRepository,
                        configurations
                    ),
                    incidentAction: getIncidentAction(
                        id,
                        this.options.incidentActionRepository,
                        configurations
                    ),
                    incidentManagementTeam: getIncidentManagementTeamById(
                        id,
                        this.options,
                        configurations
                    ),
                    roles: this.options.roleRepository.getAll(),
                }).flatMap(
                    ({
                        areasAffectedProvinces,
                        areasAffectedDistricts,
                        riskAssessment,
                        incidentAction,
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
                                        incidentActionPlan: incidentAction,
                                        incidentManagementTeam: incidentManagementTeam,
                                    });
                                return Future.success(diseaseOutbreakEvent);
                            });
                    }
                );
            });
    }
}
