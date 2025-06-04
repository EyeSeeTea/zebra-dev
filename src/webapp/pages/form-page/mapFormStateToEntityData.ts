import { FormState } from "../../components/form/FormState";
import { diseaseOutbreakEventFieldIds } from "./disease-outbreak-event/mapDiseaseOutbreakEventToInitialFormState";
import {
    FormFieldState,
    getAllFieldsFromSections,
    getFieldFileIdById,
    getFileFieldValue,
    getStringFieldValue,
} from "../../components/form/FormFieldsState";
import {
    ConfigurableForm,
    DiseaseOutbreakEventFormData,
    ActionPlanFormData,
    IncidentManagementTeamMemberFormData,
    RiskAssessmentGradingFormData,
    RiskAssessmentQuestionnaireFormData,
    RiskAssessmentQuestionnaireOptions,
    RiskAssessmentSummaryFormData,
    ResponseActionFormData,
    SingleResponseActionFormData,
    ResourceFormData,
} from "../../../domain/entities/ConfigurableForm";
import { RiskAssessmentGrading } from "../../../domain/entities/risk-assessment/RiskAssessmentGrading";
import {
    riskAssessmentGradingCodes,
    riskAssessmentSummaryCodes,
} from "../../../data/repositories/consts/RiskAssessmentConstants";
import { RiskAssessmentSummary } from "../../../domain/entities/risk-assessment/RiskAssessmentSummary";
import _c from "../../../domain/entities/generic/Collection";
import {
    RiskAssessmentQuestion,
    RiskAssessmentQuestionnaire,
} from "../../../domain/entities/risk-assessment/RiskAssessmentQuestionnaire";
import { ActionPlanAttrs } from "../../../domain/entities/incident-action-plan/ActionPlan";
import {
    actionPlanConstants as actionPlanConstants,
    getVerificationTypeByCode,
    responseActionConstants,
    verificationCodeMap,
} from "../../../data/repositories/consts/IncidentActionConstants";
import {
    ResponseAction,
    Status,
    Verification,
} from "../../../domain/entities/incident-action-plan/ResponseAction";
import { TeamMember } from "../../../domain/entities/incident-management-team/TeamMember";
import { TEAM_ROLE_FIELD_ID } from "./incident-management-team-member-assignment/mapIncidentManagementTeamMemberToInitialFormState";
import { incidentManagementTeamBuilderCodesWithoutRoles } from "../../../data/repositories/consts/IncidentManagementTeamBuilderConstants";
import { mapFormStateToDiseaseOutbreakEvent } from "./disease-outbreak-event/mapFormStateToDiseaseOutbreakEvent";
import { isResouceType, Resource } from "../../../domain/entities/resources/Resource";
import { Id } from "../../../domain/entities/Ref";
import { Maybe } from "../../../utils/ts-utils";
import { ResourceType } from "../../../domain/entities/resources/ResourceTypeNamed";

export function mapFormStateToEntityData(
    formState: FormState,
    currentUserName: string,
    formData: ConfigurableForm
): ConfigurableForm {
    switch (formData.type) {
        case "disease-outbreak-event":
        case "disease-outbreak-event-case-data": {
            const diseaseEntity = mapFormStateToDiseaseOutbreakEvent(
                formState,
                currentUserName,
                formData
            );

            const allFields: FormFieldState[] = getAllFieldsFromSections(formState.sections);
            const uploadedCasesDataFileValue = getFileFieldValue(
                diseaseOutbreakEventFieldIds.casesDataFile,
                allFields
            );
            const uploadedCasesDataFileId = getFieldFileIdById(
                diseaseOutbreakEventFieldIds.casesDataFile,
                allFields
            );

            const diseaseForm: DiseaseOutbreakEventFormData = {
                ...formData,
                entity: diseaseEntity,
                uploadedCasesDataFile: uploadedCasesDataFileValue,
                uploadedCasesDataFileId: uploadedCasesDataFileId,
            };
            return diseaseForm;
        }

        case "risk-assessment-grading": {
            const riskEntity = mapFormStateToRiskAssessmentGrading(formState);
            const riskForm: RiskAssessmentGradingFormData = {
                ...formData,
                entity: riskEntity,
            };
            return riskForm;
        }
        case "risk-assessment-summary": {
            const riskSummary = mapFormStateToRiskAssessmentSummary(formState, formData);
            const riskSummaryForm: RiskAssessmentSummaryFormData = {
                ...formData,
                entity: riskSummary,
            };
            return riskSummaryForm;
        }
        case "risk-assessment-questionnaire": {
            const riskQuestionnaire = mapFormStateToRiskAssessmentQuestionnaire(
                formState,
                formData
            );
            const riskQuestionnaireForm: RiskAssessmentQuestionnaireFormData = {
                ...formData,
                entity: riskQuestionnaire,
            };
            return riskQuestionnaireForm;
        }
        case "incident-action-plan": {
            const actionPlan = mapFormStateToIncidentActionPlan(formState, formData);
            const actionPlanForm: ActionPlanFormData = {
                ...formData,
                entity: actionPlan,
            };

            return actionPlanForm;
        }
        case "incident-response-actions": {
            const responseActions = mapFormStateToIncidentResponseActions(formState, formData);
            const responseActionForm: ResponseActionFormData = {
                ...formData,
                entity: responseActions,
            };

            return responseActionForm;
        }
        case "incident-response-action": {
            const responseAction = mapFormStateToIncidentResponseAction(formState, formData);
            const responseActionForm: SingleResponseActionFormData = {
                ...formData,
                entity: responseAction,
            };

            return responseActionForm;
        }
        case "incident-management-team-member-assignment": {
            const incidentManagementTeamMember: TeamMember =
                mapFormStateToIncidentManagementTeamMember(formState, formData);
            const incidentManagementTeamMemberForm: IncidentManagementTeamMemberFormData = {
                ...formData,
                entity: incidentManagementTeamMember,
            };
            return incidentManagementTeamMemberForm;
        }
        case "resource": {
            const resource = mapFormStateToResource(formData.entity?.id, formState);

            const allFields: FormFieldState[] = getAllFieldsFromSections(formState.sections);
            const uploadedResourceFileValue = getFileFieldValue("resourceFile", allFields);

            const resourceForm: ResourceFormData = {
                ...formData,
                entity: resource,
                uploadedResourceFile: uploadedResourceFileValue,
            };

            return resourceForm;
        }

        default:
            return formData;
    }
}

function mapFormStateToRiskAssessmentGrading(formState: FormState): RiskAssessmentGrading {
    const allFields: FormFieldState[] = getAllFieldsFromSections(formState.sections);

    const populationValue = allFields.find(field =>
        field.id.includes(riskAssessmentGradingCodes.populationAtRisk)
    )?.value as string;
    const attackRateValue = allFields.find(field =>
        field.id.includes(riskAssessmentGradingCodes.attackRate)
    )?.value as string;
    const geographicalSpreadValue = allFields.find(field =>
        field.id.includes(riskAssessmentGradingCodes.geographicalSpread)
    )?.value as string;
    const complexityValue = allFields.find(field =>
        field.id.includes(riskAssessmentGradingCodes.complexity)
    )?.value as string;
    const capacityValue = allFields.find(field =>
        field.id.includes(riskAssessmentGradingCodes.capacity)
    )?.value as string;
    const capabilityValue = allFields.find(field =>
        field.id.includes(riskAssessmentGradingCodes.capability)
    )?.value as string;
    const reputationalRiskValue = allFields.find(field =>
        field.id.includes(riskAssessmentGradingCodes.reputationalRisk)
    )?.value as string;
    const severityValue = allFields.find(field =>
        field.id.includes(riskAssessmentGradingCodes.severity)
    )?.value as string;

    const riskAssessmentGrading: RiskAssessmentGrading = RiskAssessmentGrading.create({
        id: "",
        lastUpdated: new Date(),
        populationAtRisk: RiskAssessmentGrading.getOptionTypeByCodePopulation(populationValue),
        attackRate: RiskAssessmentGrading.getOptionTypeByCodeWeighted(attackRateValue),
        geographicalSpread:
            RiskAssessmentGrading.getOptionTypeByCodeGeographicalSpread(geographicalSpreadValue),
        complexity: RiskAssessmentGrading.getOptionTypeByCodeWeighted(complexityValue),
        capacity: RiskAssessmentGrading.getOptionTypeByCodeCapacity(capacityValue),
        capability: RiskAssessmentGrading.getOptionTypeByCodeCapability(capabilityValue),
        reputationalRisk: RiskAssessmentGrading.getOptionTypeByCodeWeighted(reputationalRiskValue),
        severity: RiskAssessmentGrading.getOptionTypeByCodeWeighted(severityValue),
    });
    return riskAssessmentGrading;
}

function mapFormStateToRiskAssessmentSummary(
    formState: FormState,
    formData: RiskAssessmentSummaryFormData
): RiskAssessmentSummary {
    const allFields: FormFieldState[] = getAllFieldsFromSections(formState.sections);

    const riskAssessmentDate = allFields.find(field =>
        field.id.includes(riskAssessmentSummaryCodes.riskAssessmentDate)
    )?.value as Date;

    const riskAssessor1Value = allFields.find(field =>
        field.id.includes(riskAssessmentSummaryCodes.riskAssessor1)
    )?.value as string;
    const riskAssessor2Value = allFields.find(field =>
        field.id.includes(riskAssessmentSummaryCodes.riskAssessor2)
    )?.value as string;
    const riskAssessor3Value = allFields.find(field =>
        field.id.includes(riskAssessmentSummaryCodes.riskAssessor3)
    )?.value as string;
    const riskAssessor4Value = allFields.find(field =>
        field.id.includes(riskAssessmentSummaryCodes.riskAssessor4)
    )?.value as string;
    const riskAssessor5Value = allFields.find(field =>
        field.id.includes(riskAssessmentSummaryCodes.riskAssessor5)
    )?.value as string;
    const riskAssessor1 = formData.options.riskAssessors.find(
        riskAssessor => riskAssessor.username === riskAssessor1Value
    );
    const riskAssessor2 = formData.options.riskAssessors.find(
        riskAssessor => riskAssessor.username === riskAssessor2Value
    );
    const riskAssessor3 = formData.options.riskAssessors.find(
        riskAssessor => riskAssessor.username === riskAssessor3Value
    );
    const riskAssessor4 = formData.options.riskAssessors.find(
        riskAssessor => riskAssessor.username === riskAssessor4Value
    );
    const riskAssessor5 = formData.options.riskAssessors.find(
        riskAssessor => riskAssessor.username === riskAssessor5Value
    );

    const qualitativeRiskAssessment = allFields.find(field =>
        field.id.includes(riskAssessmentSummaryCodes.qualitativeRiskAssessment)
    )?.value as string;

    const overallRiskNationalValue = allFields.find(field =>
        field.id.includes(riskAssessmentSummaryCodes.overallRiskNational)
    )?.value as string;
    const overallRiskNational = formData.options.overallRiskNational.find(
        option => option.id === overallRiskNationalValue
    );
    if (!overallRiskNational) throw new Error("Overall risk national not found");

    const overallRiskRegionalValue = allFields.find(field =>
        field.id.includes(riskAssessmentSummaryCodes.overallRiskRegional)
    )?.value as string;
    const overallRiskRegional = formData.options.overallRiskRegional.find(
        option => option.id === overallRiskRegionalValue
    );
    if (!overallRiskRegional) throw new Error("Overall risk regional not found");

    const overallRiskGlobalValue = allFields.find(field =>
        field.id.includes(riskAssessmentSummaryCodes.overallRiskGlobal)
    )?.value as string;
    const overallRiskGlobal = formData.options.overallRiskGlobal.find(
        option => option.id === overallRiskGlobalValue
    );
    if (!overallRiskGlobal) throw new Error("Overall risk global not found");

    const overallConfidenceNationalValue = allFields.find(field =>
        field.id.includes(riskAssessmentSummaryCodes.overallConfidenceNational)
    )?.value as string;
    const overallConfidenceNational = formData.options.overAllConfidencNational.find(
        option => option.id === overallConfidenceNationalValue
    );
    if (!overallConfidenceNational) throw new Error("Overall confidence national not found");

    const overallConfidenceRegionalValue = allFields.find(field =>
        field.id.includes(riskAssessmentSummaryCodes.overallConfidenceRegional)
    )?.value as string;
    const overallConfidenceRegional = formData.options.overAllConfidencRegional.find(
        option => option.id === overallConfidenceRegionalValue
    );
    if (!overallConfidenceRegional) throw new Error("Overall confidence regional not found");

    const overallConfidenceGlobalValue = allFields.find(field =>
        field.id.includes(riskAssessmentSummaryCodes.overallConfidenceGlobal)
    )?.value as string;
    const overallConfidenceGlobal = formData.options.overAllConfidencGlobal.find(
        option => option.id === overallConfidenceGlobalValue
    );
    if (!overallConfidenceGlobal) throw new Error("Overall confidence global not found");

    const riskAssessmentSummary: RiskAssessmentSummary = new RiskAssessmentSummary({
        id: formData.entity?.id ?? "",
        riskAssessmentDate: riskAssessmentDate,
        riskAssessors: _c([
            riskAssessor1,
            riskAssessor2,
            riskAssessor3,
            riskAssessor4,
            riskAssessor5,
        ])
            .compact()
            .value(),
        qualitativeRiskAssessment: qualitativeRiskAssessment,
        overallRiskNational: overallRiskNational,
        overallRiskRegional: overallRiskRegional,
        overallRiskGlobal: overallRiskGlobal,
        overallConfidenceNational: overallConfidenceNational,
        overallConfidenceRegional: overallConfidenceRegional,
        overallConfidenceGlobal: overallConfidenceGlobal,
        riskId: "",
    });
    return riskAssessmentSummary;
}

function mapFormStateToRiskAssessmentQuestionnaire(
    formState: FormState,
    formData: RiskAssessmentQuestionnaireFormData
): RiskAssessmentQuestionnaire {
    const allFields: FormFieldState[] = getAllFieldsFromSections(formState.sections);

    const indexes = ["1", "2", "3"] as const;
    const questions = indexes.map((index): RiskAssessmentQuestion => {
        const { likelihoodOption, consequencesOption, riskOption } =
            getRiskAssessmentQuestionsWithOption("std", allFields, formData.options, index);
        return {
            likelihood: likelihoodOption,
            consequences: consequencesOption,
            risk: riskOption,
            rational: allFields.find(field => field.id.includes(`std-rational${index}`))
                ?.value as string,
        };
    });

    const additionalQuestions = formState.sections
        .filter(section => section.id.startsWith("additionalQuestions"))
        .map((customSection, index): RiskAssessmentQuestion => {
            const { likelihoodOption, consequencesOption, riskOption } =
                getRiskAssessmentQuestionsWithOption(
                    "custom",
                    allFields,
                    formData.options,
                    index.toString()
                );

            return {
                id: customSection.id.replace("additionalQuestions", "").replace(`_${index}`, ""),
                question: allFields.find(field => field.id.includes(`custom-question${index}`))
                    ?.value as string,
                likelihood: likelihoodOption,
                consequences: consequencesOption,
                risk: riskOption,
                rational: allFields.find(field => field.id.includes(`custom-rational${index}`))
                    ?.value as string,
            };
        });

    if (!questions[0] || !questions[1] || !questions[2]) throw new Error("Questions not found");

    const riskAssessmentQuestionnaire: RiskAssessmentQuestionnaire =
        new RiskAssessmentQuestionnaire({
            id: formData.entity?.id ?? "",
            potentialRiskForHumanHealth: questions[0],
            riskOfEventSpreading: questions[1],
            riskOfInsufficientCapacities: questions[2],
            additionalQuestions: additionalQuestions,
        });
    return riskAssessmentQuestionnaire;
}

function mapFormStateToIncidentActionPlan(
    formState: FormState,
    formData: ActionPlanFormData
): ActionPlanAttrs {
    const allFields: FormFieldState[] = getAllFieldsFromSections(formState.sections);

    const iapType = allFields.find(field => field.id.includes(actionPlanConstants.iapType))
        ?.value as string;

    const phoecLevel = allFields.find(field => field.id.includes(actionPlanConstants.phoecLevel))
        ?.value as string;

    const criticalInfoRequirements = allFields.find(field =>
        field.id.includes(actionPlanConstants.criticalInfoRequirements)
    )?.value as string;

    const planningAssumptions = allFields.find(field =>
        field.id.includes(actionPlanConstants.planningAssumptions)
    )?.value as string;

    const responseObjectives = allFields.find(field =>
        field.id.includes(actionPlanConstants.responseObjectives)
    )?.value as string;

    const responseStrategies = allFields.find(field =>
        field.id.includes(actionPlanConstants.responseStrategies)
    )?.value as string;

    const expectedResults = allFields.find(field =>
        field.id.includes(actionPlanConstants.expectedResults)
    )?.value as string;

    const responseActivitiesNarrative = allFields.find(field =>
        field.id.includes(actionPlanConstants.responseActivitiesNarrative)
    )?.value as string;

    const incidentActionPlan: ActionPlanAttrs = {
        lastUpdated: new Date(),
        iapType: iapType,
        phoecLevel: phoecLevel,
        id: formData.entity?.id ?? "",
        criticalInfoRequirements: criticalInfoRequirements,
        planningAssumptions: planningAssumptions,
        responseObjectives: responseObjectives,
        responseStrategies: responseStrategies,
        expectedResults: expectedResults,
        responseActivitiesNarrative: responseActivitiesNarrative,
    };

    return incidentActionPlan;
}

function mapFormStateToIncidentResponseActions(
    formState: FormState,
    formData: ResponseActionFormData
): ResponseAction[] {
    const allFields: FormFieldState[] = getAllFieldsFromSections(formState.sections);

    const incidentResponseActions: ResponseAction[] = formState.sections
        .filter(section => !section.id.includes("addNewResponseActionSection"))
        .map((section): ResponseAction => {
            const sectionIndex = extractIndex(section.id);

            const mainTask = allFields.find(field =>
                field.id.includes(`${responseActionConstants.mainTask}_${sectionIndex}`)
            )?.value as string;
            const subActivities = allFields.find(field =>
                field.id.includes(`${responseActionConstants.subActivities}_${sectionIndex}`)
            )?.value as string;
            const subPillar = allFields.find(field =>
                field.id.includes(`${responseActionConstants.subPillar}_${sectionIndex}`)
            )?.value as string;
            const dueDate = allFields.find(field =>
                field.id.includes(`${responseActionConstants.dueDate}_${sectionIndex}`)
            )?.value as Date;

            const searchAssignROValue = allFields.find(field =>
                field.id.includes(`${responseActionConstants.searchAssignRO}_${sectionIndex}`)
            )?.value as string;
            const searchAssignRO = formData.options.searchAssignRO.find(
                option => option.id === searchAssignROValue
            );
            if (!searchAssignRO) throw new Error("Responsible officer not found");

            const statusValue = allFields.find(field =>
                field.id.includes(`${responseActionConstants.status}_${sectionIndex}`)
            )?.value as string;
            const status = formData.options.status.find(option => option.id === statusValue);
            if (!status) throw new Error("Status not found");

            const verificationValue = allFields.find(field =>
                field.id.includes(`${responseActionConstants.verification}_${sectionIndex}`)
            )?.value as string;
            const verification = formData.options.verification.find(
                option => option.id === verificationValue
            ) ?? {
                id: verificationCodeMap.Unverified,
                name: getVerificationTypeByCode(verificationCodeMap.Unverified) ?? "",
            };
            if (!verification) throw new Error("Verification not found");

            const selectedEntityData =
                sectionIndex !== undefined ? formData.entity[sectionIndex] : undefined;
            const isResponseActionValid = selectedEntityData !== undefined;
            const responseActionId = isResponseActionValid ? selectedEntityData.id : "";

            const responseAction = new ResponseAction({
                id: responseActionId,
                mainTask: mainTask,
                subActivities: subActivities,
                subPillar: subPillar,
                dueDate: dueDate,
                searchAssignRO: searchAssignRO,
                status: status.id as Status,
                verification: verification.id as Verification,
            });

            return responseAction;
        });

    return incidentResponseActions;
}

function mapFormStateToIncidentResponseAction(
    formState: FormState,
    formData: SingleResponseActionFormData
): ResponseAction {
    const allFields: FormFieldState[] = getAllFieldsFromSections(formState.sections);

    const mainTask = allFields.find(field => field.id.includes(responseActionConstants.mainTask))
        ?.value as string;

    const subActivities = allFields.find(field =>
        field.id.includes(responseActionConstants.subActivities)
    )?.value as string;

    const subPillar = allFields.find(field => field.id.includes(responseActionConstants.subPillar))
        ?.value as string;

    const dueDate = allFields.find(field => field.id.includes(responseActionConstants.dueDate))
        ?.value as Date;

    const searchAssignROValue = allFields.find(field =>
        field.id.includes(responseActionConstants.searchAssignRO)
    )?.value as string;
    const searchAssignRO = formData.options.searchAssignRO.find(
        option => option.id === searchAssignROValue
    );
    if (!searchAssignRO) throw new Error("Responsible officer not found");

    const statusValue = allFields.find(field => field.id.includes(responseActionConstants.status))
        ?.value as string;
    const status = formData.options.status.find(option => option.id === statusValue);
    if (!status) throw new Error("Status not found");

    const verificationValue = allFields.find(field =>
        field.id.includes(responseActionConstants.verification)
    )?.value as string;
    const verification = formData.options.verification.find(
        option => option.id === verificationValue
    ) ?? {
        id: verificationCodeMap.Unverified,
        name: getVerificationTypeByCode(verificationCodeMap.Unverified) ?? "",
    };
    if (!verification) throw new Error("Verification not found");

    const responseAction = new ResponseAction({
        id: formData.entity?.id ?? "",
        mainTask: mainTask,
        subActivities: subActivities,
        subPillar: subPillar,
        dueDate: dueDate,
        searchAssignRO: searchAssignRO,
        status: status.id as Status,
        verification: verification.id as Verification,
    });

    return responseAction;
}

function getRiskAssessmentQuestionsWithOption(
    questionType: "std" | "custom",
    allFields: FormFieldState[],
    options: RiskAssessmentQuestionnaireOptions,
    index: string
) {
    const likelihood = allFields.find(field =>
        field.id.includes(`${questionType}-likelihood${index}`)
    )?.value as string;
    const likelihoodOption = options.likelihood.find(option => option.id === likelihood);
    if (!likelihoodOption) throw new Error("Likelihood not found");

    const consequences = allFields.find(field =>
        field.id.includes(`${questionType}-consequences${index}`)
    )?.value as string;
    const consequencesOption = options.consequences.find(option => option.id === consequences);
    if (!consequencesOption) throw new Error("Consequences not found");

    const risk = allFields.find(field => field.id.includes(`${questionType}-risk${index}`))
        ?.value as string;
    const riskOption = options.risk.find(option => option.id === risk);
    if (!riskOption) throw new Error("Risk  not found");

    return { likelihoodOption, consequencesOption, riskOption };
}

function mapFormStateToIncidentManagementTeamMember(
    formState: FormState,
    formData: IncidentManagementTeamMemberFormData
): TeamMember {
    const { options, incidentManagementTeamRoleId } = formData;
    const { roles, teamMembers } = options;

    const allFields: FormFieldState[] = getAllFieldsFromSections(formState.sections);
    const getStringFieldValueById = (id: string): string => getStringFieldValue(id, allFields);

    const teamRoleSelected = roles.find(
        role => role.id === getStringFieldValueById(TEAM_ROLE_FIELD_ID)
    );
    const teamMemberAssigned = teamMembers.find(teamMember => {
        return (
            teamMember.username ===
            getStringFieldValueById(
                incidentManagementTeamBuilderCodesWithoutRoles.teamMemberAssigned
            )
        );
    });

    const reportsToUserNameSelected =
        getStringFieldValueById(incidentManagementTeamBuilderCodesWithoutRoles.reportsToUsername) ||
        "";

    const filteredTeamMemberAssignedRoles = teamMemberAssigned?.teamRoles?.filter(
        teamRole => teamRole.id !== incidentManagementTeamRoleId
    );

    const newTeamMemberAssignedRoles = [
        ...(filteredTeamMemberAssignedRoles || []),
        {
            id: incidentManagementTeamRoleId || "",
            roleId: teamRoleSelected?.id || "",
            name: teamRoleSelected?.name || "",
            reportsToUsername: reportsToUserNameSelected,
        },
    ];

    return new TeamMember({
        id: teamMemberAssigned?.id || "",
        teamRoles: teamRoleSelected ? newTeamMemberAssignedRoles : undefined,
        username: teamMemberAssigned?.username || "",
        name: teamMemberAssigned?.name || "",
        phone: teamMemberAssigned?.phone,
        email: teamMemberAssigned?.email,
        photo: teamMemberAssigned?.photo,
        workPosition: teamMemberAssigned?.workPosition,
        status: teamMemberAssigned?.status,
    });
}

function mapFormStateToResource(resourceId: Maybe<Id>, formState: FormState): Resource {
    const allFields: FormFieldState[] = getAllFieldsFromSections(formState.sections);

    const resource = buildResource(resourceId, allFields);

    return resource;
}

function extractIndex(input: string): number | undefined {
    const parts = input.split("_");
    const lastPart = parts[parts.length - 1];
    const index = Number(lastPart);

    return isNaN(index) ? undefined : index;
}

export function buildResource(resourceId: Maybe<Id>, allFields: FormFieldState[]): Resource {
    const resourceType = getStringFieldValue("resourceType", allFields);
    if (!isResouceType(resourceType)) {
        throw new Error(`Invalid resource type: ${resourceType}`);
    }

    const resourceLabel = getStringFieldValue("resourceLabel", allFields);
    const resourceFolder = getStringFieldValue(
        resourceType === ResourceType.RESPONSE_DOCUMENT
            ? "responseResourceFolder"
            : "eventResourceFolder",
        allFields
    );
    const uploadedResourceFileId = getFieldFileIdById("resourceFile", allFields);
    const diseaseOutbreakEventId = getStringFieldValue("resourceDiseaseOutbreakEventId", allFields);

    switch (resourceType) {
        case ResourceType.RESPONSE_DOCUMENT:
            if (!resourceFolder) throw new Error("Missing resource folder for Response Document");
            return {
                id: resourceId || "",

                type: resourceType,
                name: resourceLabel,
                folder: resourceFolder,
                fileId: uploadedResourceFileId,
            };

        case ResourceType.TEMPLATE:
            return {
                id: resourceId || "",
                type: resourceType,
                name: resourceLabel,
                fileId: uploadedResourceFileId,
            };

        case ResourceType.DISEASE_OUTBREAK_EVENT_DOCUMENT:
            if (!diseaseOutbreakEventId || !resourceFolder)
                throw new Error(
                    "Missing Disease Outbreak Event Id or Resource Folder for Event Document"
                );
            return {
                id: resourceId || "",
                type: resourceType,
                name: resourceLabel,
                fileId: uploadedResourceFileId,
                folder: resourceFolder,
                diseaseOutbreakEventId: diseaseOutbreakEventId,
            };

        default:
            throw new Error(`Invalid resource type: ${resourceType}`);
    }
}
