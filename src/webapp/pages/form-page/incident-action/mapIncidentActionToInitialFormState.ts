import {
    actionPlanConstants,
    responseActionConstants,
} from "../../../../data/repositories/consts/IncidentActionConstants";
import {
    ActionPlanFormData,
    ResponseActionFormData,
} from "../../../../domain/entities/ConfigurableForm";
import { ResponseAction } from "../../../../domain/entities/incident-action-plan/ResponseAction";
import { Maybe } from "../../../../utils/ts-utils";
import { FormSectionState } from "../../../components/form/FormSectionsState";
import { FormState } from "../../../components/form/FormState";
import { Option as UIOption } from "../../../components/utils/option";
import { mapToPresentationOptions } from "../mapEntityToFormState";
import { getAnotherOptionSection } from "../risk-assessment/mapRiskAssessmentToInitialFormState";

type ActionPlanSectionKeys =
    | "iapType"
    | "phoecLevel"
    | "criticalInfoRequirements"
    | "planningAssumptions"
    | "responseObjectives"
    | "responseStrategies"
    | "expectedResults"
    | "responseActivitiesNarrative";

type ResponseActionSectionKeys =
    | "mainTask"
    | "subActivities"
    | "subPillar"
    | "searchAssignRO"
    | "dueDate"
    | "timeline"
    | "status"
    | "verification";

export function mapIncidentActionPlanToInitialFormState(
    incidentActionPlanFormData: ActionPlanFormData
): FormState {
    const { entity: incidentActionPlan, eventTrackerDetails, options } = incidentActionPlanFormData;
    const { iapType, phoecLevel } = options;

    const iapTypeOptions: UIOption[] = mapToPresentationOptions(iapType);
    const phoexLevelOptions: UIOption[] = mapToPresentationOptions(phoecLevel);

    const mainSections: Record<ActionPlanSectionKeys, FormSectionState> = {
        iapType: {
            title: "IAP type",
            id: "iap_type_section",
            isVisible: true,
            required: true,
            direction: "column",
            fields: [
                {
                    id: `${actionPlanConstants.iapType}-section`,
                    isVisible: true,
                    errors: [],
                    type: "select",
                    multiple: false,
                    options: iapTypeOptions,
                    value: incidentActionPlan?.iapType || "",
                    required: true,
                },
            ],
        },
        phoecLevel: {
            title: "PHOEC level",
            id: "phoec_level_section",
            isVisible: true,
            required: true,
            direction: "column",
            fields: [
                {
                    id: `${actionPlanConstants.phoecLevel}-section`,
                    isVisible: true,
                    errors: [],
                    type: "select",
                    multiple: false,
                    options: phoexLevelOptions,
                    value: incidentActionPlan?.phoecLevel || "",
                    required: true,
                },
            ],
        },
        criticalInfoRequirements: {
            title: "Response mode critical information requirements (CIRs)",
            id: "critical_info_requirements_section",
            isVisible: true,
            required: true,
            direction: "column",
            fields: [
                {
                    id: `${actionPlanConstants.criticalInfoRequirements}-section`,
                    isVisible: true,
                    errors: [],
                    type: "text",
                    value: incidentActionPlan?.criticalInfoRequirements || "",
                    multiline: true,
                    required: true,
                },
            ],
        },
        planningAssumptions: {
            title: "Planning assumptions",
            id: "planning_assumptions_section",
            isVisible: true,
            required: true,
            direction: "column",
            fields: [
                {
                    id: `${actionPlanConstants.planningAssumptions}-section`,
                    isVisible: true,
                    errors: [],
                    type: "text",
                    value: incidentActionPlan?.planningAssumptions || "",
                    multiline: true,
                    required: true,
                    helperText:
                        "Evidence based facts and assumptions in the context of developing the plan.",
                },
            ],
        },
        responseObjectives: {
            title: "Response objectives",
            id: "response_objectives_section",
            isVisible: true,
            required: true,
            direction: "column",
            fields: [
                {
                    id: `${actionPlanConstants.responseObjectives}-section`,
                    isVisible: true,
                    errors: [],
                    type: "text",
                    value: incidentActionPlan?.responseObjectives || "",
                    multiline: true,
                    required: true,
                    helperText: "SMART: Specific, measurable, achievable, relevant, time-bound",
                },
            ],
        },
        responseStrategies: {
            title: "Response strategies",
            id: "response_strategies_section",
            isVisible: true,
            required: true,
            direction: "column",
            fields: [
                {
                    id: `${actionPlanConstants.responseStrategies}-section`,
                    isVisible: true,
                    errors: [],
                    type: "text",
                    value: incidentActionPlan?.responseStrategies || "",
                    multiline: true,
                    required: true,
                },
            ],
        },
        expectedResults: {
            title: "Expected results",
            id: "expected_results_section",
            isVisible: true,
            direction: "column",
            fields: [
                {
                    id: `${actionPlanConstants.expectedResults}-section`,
                    isVisible: true,
                    errors: [],
                    type: "text",
                    value: incidentActionPlan?.expectedResults || "",
                    multiline: true,
                    helperText: "Clear objectives for functional area",
                },
            ],
        },
        responseActivitiesNarrative: {
            title: "Response activities narrative",
            id: "response_activities_narrative_section",
            isVisible: true,
            direction: "column",
            fields: [
                {
                    id: `${actionPlanConstants.responseActivitiesNarrative}-section`,
                    isVisible: true,
                    errors: [],
                    type: "text",
                    value: incidentActionPlan?.responseActivitiesNarrative || "",
                    multiline: true,
                },
            ],
        },
    };

    return {
        id: eventTrackerDetails.id ?? "",
        title: "Incident Action Plan",
        subtitle: eventTrackerDetails.name,
        titleDescripton: "Step 1:",
        subtitleDescripton: "Define the action plan",
        saveButtonLabel: "Save & Continue",
        isValid: incidentActionPlan ? true : false,
        sections: [
            mainSections.iapType,
            mainSections.phoecLevel,
            mainSections.criticalInfoRequirements,
            mainSections.planningAssumptions,
            mainSections.responseObjectives,
            mainSections.responseStrategies,
            mainSections.expectedResults,
            mainSections.responseActivitiesNarrative,
        ],
    };
}

export function mapIncidentResponseActionToInitialFormState(
    incidentResponseActionFormData: ResponseActionFormData
): FormState {
    const {
        entity: incidentResponseActions,
        eventTrackerDetails,
        options,
    } = incidentResponseActionFormData;

    const { searchAssignRO, status, verification } = options;
    const searchAssignROOptions: UIOption[] = mapToPresentationOptions(searchAssignRO);
    const statusOptions: UIOption[] = mapToPresentationOptions(status);
    const verificationOptions: UIOption[] = mapToPresentationOptions(verification);

    const sectionOptions = {
        searchAssignROOptions: searchAssignROOptions,
        statusOptions: statusOptions,
        verificationOptions: verificationOptions,
    };

    const responseActionSections =
        incidentResponseActions.flatMap((incidentResponseAction, index) => {
            return getIncidentResponseActionFormSections(
                {
                    ...sectionOptions,
                    incidentResponseAction,
                },
                index
            );
        }) ?? [];

    const addNewOptionSection: FormSectionState = getAnotherOptionSection();

    return {
        id: eventTrackerDetails.id ?? "",
        title: "Incident Action Plan",
        subtitle: eventTrackerDetails.name,
        titleDescripton: "Step 2:",
        subtitleDescripton: "Assign response actions",
        saveButtonLabel: "Save plan",
        isValid: incidentResponseActions ? true : false,
        sections: [...responseActionSections, addNewOptionSection],
    };
}

function getIncidentResponseActionFormSections(
    options: {
        incidentResponseAction: Maybe<ResponseAction>;
        searchAssignROOptions: UIOption[];
        statusOptions: UIOption[];
        verificationOptions: UIOption[];
    },
    index: number
): FormSectionState[] {
    const { incidentResponseAction, searchAssignROOptions, statusOptions, verificationOptions } =
        options;

    const mainSections: Record<ResponseActionSectionKeys, FormSectionState> = {
        mainTask: {
            title: "Main task",
            id: `main_task_section${index}`,
            isVisible: true,
            required: true,
            fields: [
                {
                    id: `${responseActionConstants.mainTask}-section`,
                    placeholder: "Select..",
                    isVisible: true,
                    errors: [],
                    value: incidentResponseAction?.mainTask || "",
                    type: "text",
                    required: true,
                },
            ],
        },
        subActivities: {
            title: "Sub activities",
            id: `sub_activities_section${index}`,
            isVisible: true,
            required: true,
            fields: [
                {
                    id: `${responseActionConstants.subActivities}-section`,
                    placeholder: "Select..",
                    isVisible: true,
                    errors: [],
                    value: incidentResponseAction?.subActivities || "",
                    type: "text",
                    required: true,
                },
            ],
        },
        subPillar: {
            title: "Sub pilar",
            id: `sub_pillar_section${index}`,
            isVisible: true,
            required: true,
            fields: [
                {
                    id: `${responseActionConstants.subPillar}-section`,
                    placeholder: "Select..",
                    isVisible: true,
                    errors: [],
                    value: incidentResponseAction?.subPillar || "",
                    type: "text",
                    required: true,
                },
            ],
        },
        searchAssignRO: {
            title: "Responsible officer",
            id: `responsible_officer_section${index}`,
            isVisible: true,
            required: true,
            fields: [
                {
                    id: `${responseActionConstants.searchAssignRO}-section`,
                    placeholder: "Select..",
                    isVisible: true,
                    errors: [],
                    value: incidentResponseAction?.searchAssignRO?.id || "",
                    type: "select",
                    multiple: false,
                    options: searchAssignROOptions,
                    required: true,
                },
            ],
        },
        dueDate: {
            title: "Due date",
            id: `due_date_section${index}`,
            isVisible: true,
            required: true,
            fields: [
                {
                    id: `${responseActionConstants.dueDate}-section`,
                    placeholder: "Select..",
                    isVisible: true,
                    errors: [],
                    type: "date",
                    required: true,
                    value: incidentResponseAction?.dueDate || new Date(),
                    width: "200px",
                },
            ],
        },
        timeline: {
            title: "Time line",
            id: `time_line_section${index}`,
            isVisible: true,
            required: true,
            fields: [
                {
                    id: `${responseActionConstants.timeLine}-section`,
                    placeholder: "Select..",
                    isVisible: true,
                    errors: [],
                    value: incidentResponseAction?.timeLine || "",
                    type: "text",
                    required: true,
                },
            ],
        },
        status: {
            title: "Status",
            id: `status_section${index}`,
            isVisible: true,
            required: true,
            fields: [
                {
                    id: `${responseActionConstants.status}-section`,
                    placeholder: "Select..",
                    isVisible: true,
                    errors: [],
                    value: incidentResponseAction?.status || "",
                    type: "select",
                    multiple: false,
                    options: statusOptions,
                    required: true,
                },
            ],
        },
        verification: {
            title: "Verification",
            id: `verification_section${index}`,
            isVisible: true,
            required: true,
            fields: [
                {
                    id: `${responseActionConstants.verification}-section`,
                    placeholder: "Select..",
                    isVisible: true,
                    errors: [],
                    value: incidentResponseAction?.verification || "",
                    type: "select",
                    multiple: false,
                    options: verificationOptions,
                    required: true,
                },
            ],
        },
    };

    return [
        mainSections.mainTask,
        mainSections.subActivities,
        mainSections.subPillar,
        mainSections.searchAssignRO,
        mainSections.dueDate,
        mainSections.timeline,
        mainSections.status,
        mainSections.verification,
    ];
}

export function addNewResponseActionSection(sections: FormSectionState[]): FormSectionState[] {
    const newResponseActionSection = getIncidentResponseActionFormSections(
        {
            incidentResponseAction: undefined,
            searchAssignROOptions:
                sections[0]?.fields[0]?.type === "select" ? sections[0].fields[0].options : [],
            statusOptions:
                sections[0]?.fields[1]?.type === "select" ? sections[0].fields[1].options : [],
            verificationOptions:
                sections[0]?.fields[2]?.type === "select" ? sections[0].fields[2].options : [],
        },
        sections.length % 8 // not absolutely correct
    );

    return newResponseActionSection;
}
