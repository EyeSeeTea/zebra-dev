import { FutureData } from "../../data/api-futures";
import { INCIDENT_MANAGER_ROLE } from "../../data/repositories/consts/IncidentManagementTeamBuilderConstants";
import { ConfigurableForm } from "../entities/ConfigurableForm";
import { DiseaseOutbreakEventBaseAttrs } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../entities/generic/Future";
import { Id } from "../entities/Ref";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";
import { IncidentActionRepository } from "../repositories/IncidentActionRepository";
import { IncidentManagementTeamRepository } from "../repositories/IncidentManagementTeamRepository";
import { RiskAssessmentRepository } from "../repositories/RiskAssessmentRepository";
import { TeamMemberRepository } from "../repositories/TeamMemberRepository";
import { saveDiseaseOutbreak } from "./utils/disease-outbreak/SaveDiseaseOutbreak";
import { RoleRepository } from "../repositories/RoleRepository";
import { Configurations } from "../entities/AppConfigurations";
import moment from "moment";
import { ResourceRepository } from "../repositories/ResourceRepository";

export class SaveEntityUseCase {
    constructor(
        private options: {
            diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
            riskAssessmentRepository: RiskAssessmentRepository;
            incidentActionRepository: IncidentActionRepository;
            incidentManagementTeamRepository: IncidentManagementTeamRepository;
            teamMemberRepository: TeamMemberRepository;
            roleRepository: RoleRepository;
            resourceRepository: ResourceRepository;
        }
    ) {}

    public execute(
        formData: ConfigurableForm,
        configurations: Configurations,
        formOptionsToDelete?: Id[]
    ): FutureData<void | Id> {
        if (!formData || !formData.entity) return Future.error(new Error("No form data found"));
        switch (formData.type) {
            case "disease-outbreak-event":
                return saveDiseaseOutbreak(
                    {
                        diseaseOutbreakEventRepository: this.options.diseaseOutbreakEventRepository,
                        incidentManagementTeamRepository:
                            this.options.incidentManagementTeamRepository,
                        teamMemberRepository: this.options.teamMemberRepository,
                        roleRepository: this.options.roleRepository,
                    },
                    formData.entity,
                    configurations
                );
            case "risk-assessment-grading":
            case "risk-assessment-summary":
            case "risk-assessment-questionnaire":
                return this.options.riskAssessmentRepository.saveRiskAssessment(
                    formData,
                    formData.eventTrackerDetails.id,
                    formOptionsToDelete
                );
            case "incident-action-plan":
            case "incident-response-actions":
            case "incident-response-action":
                return this.options.incidentActionRepository.saveIncidentAction(
                    formData,
                    formData.eventTrackerDetails.id,
                    formOptionsToDelete
                );
            case "incident-management-team-member-assignment": {
                const isIncidentManager = formData.entity.teamRoles?.find(
                    role => role.roleId === INCIDENT_MANAGER_ROLE
                );

                const hasIncidentManagerChanged =
                    formData.eventTrackerDetails.incidentManagerName !== formData.entity.username;

                if (isIncidentManager && hasIncidentManagerChanged) {
                    const updatedIncidentManager = formData.entity.username;
                    return this.options.diseaseOutbreakEventRepository
                        .get(formData.eventTrackerDetails.id)
                        .flatMap(diseaseOutbreakEventBase => {
                            if (
                                diseaseOutbreakEventBase.incidentManagerName !==
                                updatedIncidentManager
                            ) {
                                const updatedDiseaseOutbreakEvent: DiseaseOutbreakEventBaseAttrs = {
                                    ...diseaseOutbreakEventBase,
                                    lastUpdated: moment.utc().toDate(),
                                    incidentManagerName: updatedIncidentManager,
                                };

                                return saveDiseaseOutbreak(
                                    {
                                        diseaseOutbreakEventRepository:
                                            this.options.diseaseOutbreakEventRepository,
                                        incidentManagementTeamRepository:
                                            this.options.incidentManagementTeamRepository,
                                        teamMemberRepository: this.options.teamMemberRepository,
                                        roleRepository: this.options.roleRepository,
                                    },
                                    updatedDiseaseOutbreakEvent,
                                    configurations
                                );
                            } else {
                                return Future.success(undefined);
                            }
                        });
                } else {
                    const teamRoleToSave = formData.entity.teamRoles?.find(
                        role => role.id === formData.incidentManagementTeamRoleId || role.id === ""
                    );

                    if (!teamRoleToSave) {
                        return Future.error(new Error("No team role to save found"));
                    }

                    return this.options.incidentManagementTeamRepository.saveIncidentManagementTeamMemberRole(
                        teamRoleToSave,
                        formData.entity,
                        formData.eventTrackerDetails.id,
                        formData.options.roles
                    );
                }
            }
            case "resource":
                return this.options.resourceRepository.saveResource(formData);
            default:
                return Future.error(new Error("Form type not supported"));
        }
    }
}
