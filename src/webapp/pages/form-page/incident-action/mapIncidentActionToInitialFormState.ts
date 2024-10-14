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

    const initialResponseActionSection = getResponseActionSection({
        incidentResponseAction: undefined,
        options: {
            searchAssignROOptions: searchAssignROOptions,
            statusOptions: statusOptions,
            verificationOptions: verificationOptions,
        },
        index: 0,
    });

    const responseActionSections =
        incidentResponseActions.length !== 0
            ? incidentResponseActions.map((incidentResponseAction, index) => {
                  return getResponseActionSection({
                      incidentResponseAction: incidentResponseAction,
                      options: {
                          searchAssignROOptions: searchAssignROOptions,
                          statusOptions: statusOptions,
                          verificationOptions: verificationOptions,
                      },
                      index: index,
                  });
              })
            : [initialResponseActionSection];

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

function getResponseActionSection(options: {
    incidentResponseAction: Maybe<ResponseAction>;
    options: {
        searchAssignROOptions: UIOption[];
        statusOptions: UIOption[];
        verificationOptions: UIOption[];
    };
    index: number;
}) {
    const { incidentResponseAction, options: formOptions, index } = options;
    const { searchAssignROOptions, statusOptions, verificationOptions } = formOptions;

    const responseActionSection: FormSectionState = {
        title: "",
        id: `response_action_section`,
        isVisible: true,
        direction: "row",
        fields: [
            {
                id: `${responseActionConstants.mainTask}_${index}`,
                label: "Main task",
                isVisible: true,
                errors: [],
                value: incidentResponseAction?.mainTask || "",
                type: "text",
                required: true,
                showIsRequired: true,
                disabled: false,
            },
            {
                id: `${responseActionConstants.subActivities}_${index}`,
                label: "Sub activities",
                isVisible: true,
                errors: [],
                value: incidentResponseAction?.subActivities || "",
                type: "text",
                required: true,
                showIsRequired: true,
                disabled: false,
            },
            {
                id: `${responseActionConstants.subPillar}_${index}`,
                label: "Sub pilar",
                isVisible: true,
                errors: [],
                value: incidentResponseAction?.subPillar || "",
                type: "text",
                required: true,
                showIsRequired: true,
                disabled: false,
            },
            {
                id: `${responseActionConstants.searchAssignRO}_${index}`,
                label: "Responsible officer",
                isVisible: true,
                errors: [],
                value: incidentResponseAction?.searchAssignRO?.id || "",
                type: "select",
                multiple: false,
                options: searchAssignROOptions,
                required: true,
                showIsRequired: true,
                disabled: false,
            },
            {
                id: `${responseActionConstants.dueDate}_${index}`,
                label: "Due date",
                isVisible: true,
                errors: [],
                value: incidentResponseAction?.dueDate || new Date(),
                type: "date",
                width: "200px",
                required: true,
                showIsRequired: true,
                disabled: false,
            },
            {
                id: `${responseActionConstants.timeLine}_${index}`,
                label: "Time line",
                isVisible: true,
                errors: [],
                value: incidentResponseAction?.timeLine || "",
                type: "text",
                required: true,
                showIsRequired: true,
                disabled: false,
            },
            {
                id: `${responseActionConstants.status}_${index}`,
                label: "Status",
                isVisible: true,
                errors: [],
                value: incidentResponseAction?.status || "",
                type: "select",
                multiple: false,
                options: statusOptions,
                required: true,
                showIsRequired: true,
                disabled: false,
            },
            {
                id: `${responseActionConstants.verification}_${index}`,
                label: "Verification",
                isVisible: true,
                errors: [],
                value: incidentResponseAction?.verification || "",
                type: "select",
                multiple: false,
                options: verificationOptions,
                required: true,
                showIsRequired: true,
                disabled: false,
            },
        ],
    };

    return responseActionSection;
}

export function addNewResponseActionSection(sections: FormSectionState[]): FormSectionState {
    const responseActionSections = sections.filter(
        section => !section.id.startsWith("addNewOptionSection")
    );

    const newResponseActionSection = getResponseActionSection({
        incidentResponseAction: undefined,
        options: {
            searchAssignROOptions:
                sections[0]?.fields[3]?.type === "select" ? sections[0].fields[3].options : [],
            statusOptions:
                sections[0]?.fields[6]?.type === "select" ? sections[0].fields[6].options : [],
            verificationOptions:
                sections[0]?.fields[7]?.type === "select" ? sections[0].fields[7].options : [],
        },
        index: responseActionSections.length,
    });

    return newResponseActionSection;
}
