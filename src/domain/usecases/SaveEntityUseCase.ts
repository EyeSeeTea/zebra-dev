import { FutureData } from "../../data/api-futures";
import { INCIDENT_MANAGER_ROLE } from "../../data/repositories/consts/IncidentManagementTeamBuilderConstants";
import { ConfigurableForm } from "../entities/ConfigurableForm";
import { DiseaseOutbreakEventBaseAttrs } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../entities/generic/Future";
import { Id } from "../entities/Ref";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";
import { IncidentActionRepository } from "../repositories/IncidentActionRepository";
import { RiskAssessmentRepository } from "../repositories/RiskAssessmentRepository";
import { TeamMemberRepository } from "../repositories/TeamMemberRepository";
import { saveDiseaseOutbreak } from "./utils/disease-outbreak/SaveDiseaseOutbreak";
import { RoleRepository } from "../repositories/RoleRepository";

export class SaveEntityUseCase {
    constructor(
        private options: {
            diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
            riskAssessmentRepository: RiskAssessmentRepository;
            incidentActionRepository: IncidentActionRepository;
            teamMemberRepository: TeamMemberRepository;
            roleRepository: RoleRepository;
        }
    ) {}

    public execute(formData: ConfigurableForm): FutureData<void | Id> {
        if (!formData || !formData.entity) return Future.error(new Error("No form data found"));
        switch (formData.type) {
            case "disease-outbreak-event":
                return saveDiseaseOutbreak(
                    {
                        diseaseOutbreakEventRepository: this.options.diseaseOutbreakEventRepository,
                        teamMemberRepository: this.options.teamMemberRepository,
                        roleRepository: this.options.roleRepository,
                    },
                    formData.entity
                );
            case "risk-assessment-grading":
            case "risk-assessment-summary":
            case "risk-assessment-questionnaire":
                return this.options.riskAssessmentRepository.saveRiskAssessment(
                    formData,
                    formData.eventTrackerDetails.id
                );
            case "incident-action-plan":
            case "incident-response-action":
                return this.options.incidentActionRepository.saveIncidentAction(
                    formData,
                    formData.eventTrackerDetails.id
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
                                    lastUpdated: new Date(),
                                    incidentManagerName: updatedIncidentManager,
                                };

                                return saveDiseaseOutbreak(
                                    {
                                        diseaseOutbreakEventRepository:
                                            this.options.diseaseOutbreakEventRepository,
                                        teamMemberRepository: this.options.teamMemberRepository,
                                        roleRepository: this.options.roleRepository,
                                    },
                                    updatedDiseaseOutbreakEvent
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

                    return this.options.diseaseOutbreakEventRepository.saveIncidentManagementTeamMemberRole(
                        teamRoleToSave,
                        formData.entity,
                        formData.eventTrackerDetails.id,
                        formData.options.roles
                    );
                }
            }
            default:
                return Future.error(new Error("Form type not supported"));
        }
    }
}
