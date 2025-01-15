import { FutureData } from "../../data/api-futures";
import { INCIDENT_MANAGER_ROLE } from "../../data/repositories/consts/IncidentManagementTeamBuilderConstants";
import { ConfigurableForm } from "../entities/ConfigurableForm";
import {
    DiseaseOutbreakEvent,
    DiseaseOutbreakEventBaseAttrs,
} from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
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
import { CasesFileRepository } from "../repositories/CasesFileRepository";
import { ResourceRepository } from "../repositories/ResourceRepository";
import { ResourceFileRepository } from "../repositories/ResourceFileRepository";

export class SaveEntityUseCase {
    constructor(
        private options: {
            diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
            riskAssessmentRepository: RiskAssessmentRepository;
            incidentActionRepository: IncidentActionRepository;
            incidentManagementTeamRepository: IncidentManagementTeamRepository;
            teamMemberRepository: TeamMemberRepository;
            roleRepository: RoleRepository;
            casesFileRepository: CasesFileRepository;
            resourceRepository: ResourceRepository;
            resourceFileRepository: ResourceFileRepository;
        }
    ) {}

    public execute(
        formData: ConfigurableForm,
        configurations: Configurations,
        editMode: boolean,
        formOptionsToDelete?: Id[]
    ): FutureData<void | Id> {
        if (!formData || !formData.entity) return Future.error(new Error("No form data found"));
        switch (formData.type) {
            case "disease-outbreak-event":
            case "disease-outbreak-event-case-data": {
                const diseaseOutbreakEvent: DiseaseOutbreakEvent = new DiseaseOutbreakEvent({
                    ...formData.entity,

                    // NOTICE: Not needed for saving
                    createdBy: undefined,
                    mainSyndrome: undefined,
                    suspectedDisease: undefined,
                    notificationSource: undefined,
                    incidentManager: undefined,
                    riskAssessment: undefined,
                    incidentActionPlan: undefined,
                    incidentManagementTeam: undefined,
                });

                return saveDiseaseOutbreak(
                    this.options,
                    diseaseOutbreakEvent,
                    configurations,
                    editMode,
                    {
                        uploadedCasesDataFile: formData.uploadedCasesDataFile,
                        uploadedCasesDataFileId: formData.uploadedCasesDataFileId,
                        hasInitiallyCasesDataFile: formData.hasInitiallyCasesDataFile,
                    }
                );
            }
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

                                const diseaseOutbreakEvent: DiseaseOutbreakEvent =
                                    new DiseaseOutbreakEvent({
                                        ...updatedDiseaseOutbreakEvent,

                                        // NOTICE: Not needed for saving
                                        createdBy: undefined,
                                        mainSyndrome: undefined,
                                        suspectedDisease: undefined,
                                        notificationSource: undefined,
                                        incidentManager: undefined,
                                        riskAssessment: undefined,
                                        incidentActionPlan: undefined,
                                        incidentManagementTeam: undefined,
                                        uploadedCasesData: undefined,
                                    });
                                return saveDiseaseOutbreak(
                                    this.options,
                                    diseaseOutbreakEvent,
                                    configurations,
                                    editMode
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
            case "resource": {
                const { uploadedResourceFile } = formData;
                if (!uploadedResourceFile) return Future.error(new Error("No file uploaded"));

                return this.options.resourceFileRepository
                    .uploadFile(uploadedResourceFile)
                    .flatMap(resourceFileId => {
                        return this.options.resourceRepository.saveResource({
                            ...formData,
                            uploadedResourceFileId: resourceFileId,
                        });
                    });
            }
            default:
                return Future.error(new Error("Form type not supported"));
        }
    }
}
