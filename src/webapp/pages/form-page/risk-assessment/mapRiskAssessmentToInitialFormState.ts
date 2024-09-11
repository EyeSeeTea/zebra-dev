import i18n from "@eyeseetea/d2-ui-components/locales";
import {
    riskAssessmentGradingCodes,
    riskAssessmentQuestionnaireCodes,
    riskAssessmentSummaryCodes,
} from "../../../../data/repositories/consts/RiskAssessmentConstants";
import {
    RiskAssessmentGradingFormData,
    RiskAssessmentQuestionnaireFormData,
    RiskAssessmentSummaryFormData,
} from "../../../../domain/entities/ConfigurableForm";
import { FormState } from "../../../components/form/FormState";
import { User } from "../../../components/user-selector/UserSelector";
import { Option as UIOption } from "../../../components/utils/option";
import { mapTeamMemberToUser, mapToPresentationOptions } from "../mapEntityToFormState";
import { getDateAsLocaleDateTimeString } from "../../../../data/repositories/utils/DateTimeHelper";
import { FormSectionState } from "../../../components/form/FormSectionsState";
import { RiskAssessmentQuestionnaire } from "../../../../domain/entities/risk-assessment/RiskAssessmentQuestionnaire";
import { Maybe } from "../../../../utils/ts-utils";

// TODO: Thinking for the future about generate this FormState by iterating over Object.Keys(diseaseOutbreakEvent)
export function mapRiskGradingToInitialFormState(
    riskFormaData: RiskAssessmentGradingFormData
): FormState {
    const { options } = riskFormaData;

    const {
        populationAtRisk,
        attackRate,
        geographicalSpread,
        complexity,
        capacity,
        reputationalRisk,
        severity,
        capability,
    } = options;

    const populationAtRiskOptions: UIOption[] = mapToPresentationOptions(populationAtRisk);
    const attackRateOptions: UIOption[] = mapToPresentationOptions(attackRate);
    const geographicalSpreadOptions: UIOption[] = mapToPresentationOptions(geographicalSpread);
    const complexityOptions: UIOption[] = mapToPresentationOptions(complexity);
    const capacityOptions: UIOption[] = mapToPresentationOptions(capacity);
    const reputationalRiskOptions: UIOption[] = mapToPresentationOptions(reputationalRisk);
    const severityOptions: UIOption[] = mapToPresentationOptions(severity);
    const capabilityOptions: UIOption[] = mapToPresentationOptions(capability);

    //SNEHA TO DO : Create this form by iterating over Object Keys
    return {
        id: "",
        title: "Risk Assessment Grading",
        subtitle: riskFormaData.eventTrackerDetails.name,
        titleDescripton: "Last updated",
        subtitleDescripton: getDateAsLocaleDateTimeString(
            riskFormaData.eventTrackerDetails.lastUpdated
        ),
        saveButtonLabel: "Next",
        isValid: false,
        sections: [
            {
                title: "Population at risk",
                id: riskAssessmentGradingCodes.populationAtRisk,
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: `${riskAssessmentGradingCodes.populationAtRisk}-a`,
                        placeholder: "Select..",
                        isVisible: true,
                        errors: [],
                        type: "select",
                        multiple: false,
                        options: populationAtRiskOptions,
                        value: "",
                        required: true,
                        showIsRequired: false,
                        disabled: false,
                    },
                ],
            },
            {
                title: "Attack Rate",
                id: riskAssessmentGradingCodes.attackRate,
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: `${riskAssessmentGradingCodes.attackRate}-a`,
                        placeholder: "Select..",
                        isVisible: true,
                        errors: [],
                        type: "select",
                        multiple: false,
                        options: attackRateOptions,
                        value: "",
                        required: true,
                        showIsRequired: false,
                        disabled: false,
                    },
                ],
            },
            {
                title: "Geographical Spread",
                id: riskAssessmentGradingCodes.geographicalSpread,
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: `${riskAssessmentGradingCodes.geographicalSpread}-a`,
                        placeholder: "Select..",
                        isVisible: true,
                        errors: [],
                        type: "select",
                        multiple: false,
                        options: geographicalSpreadOptions,
                        value: "",
                        required: true,
                        showIsRequired: false,
                        disabled: false,
                    },
                ],
            },
            {
                title: "Complexity",
                id: riskAssessmentGradingCodes.complexity,
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: `${riskAssessmentGradingCodes.complexity}-a`,
                        placeholder: "Select..",
                        isVisible: true,
                        errors: [],
                        type: "select",
                        multiple: false,
                        options: complexityOptions,
                        value: "",
                        required: true,
                        showIsRequired: false,
                        disabled: false,
                    },
                ],
            },
            {
                title: "Capacity",
                id: riskAssessmentGradingCodes.capacity,
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: `${riskAssessmentGradingCodes.capacity}-a`,
                        placeholder: "Select..",
                        isVisible: true,
                        errors: [],
                        type: "select",
                        multiple: false,
                        options: capacityOptions,
                        value: "",
                        required: true,
                        showIsRequired: false,
                        disabled: false,
                    },
                ],
            },
            {
                title: "Reputational Risk",
                id: riskAssessmentGradingCodes.reputationalRisk,
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: `${riskAssessmentGradingCodes.reputationalRisk}-a`,
                        placeholder: "Select..",
                        isVisible: true,
                        errors: [],
                        type: "select",
                        multiple: false,
                        options: reputationalRiskOptions,
                        value: "",
                        required: true,
                        showIsRequired: false,
                        disabled: false,
                    },
                ],
            },
            {
                title: "Severity",
                id: riskAssessmentGradingCodes.severity,
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: `${riskAssessmentGradingCodes.severity}-a`,
                        placeholder: "Select..",
                        isVisible: true,
                        errors: [],
                        type: "select",
                        multiple: false,
                        options: severityOptions,
                        value: "",
                        required: true,
                        showIsRequired: false,
                        disabled: false,
                    },
                ],
            },
            {
                title: "Capability",
                id: riskAssessmentGradingCodes.capability,
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: `${riskAssessmentGradingCodes.capability}-a`,
                        placeholder: "Select..",
                        isVisible: true,
                        errors: [],
                        type: "select",
                        multiple: false,
                        options: capabilityOptions,
                        value: "",
                        required: true,
                        showIsRequired: false,
                        disabled: false,
                    },
                ],
            },
        ],
    };
}

export function mapRiskAssessmentSummaryToInitialFormState(
    riskFormaData: RiskAssessmentSummaryFormData
): FormState {
    const { entity: riskAssessmentSummary, options } = riskFormaData;

    const {
        overallRiskNational,
        overallRiskRegional,
        overallRiskGlobal,
        overAllConfidencNational,
        overAllConfidencRegional,
        overAllConfidencGlobal,
        riskAssessors,
    } = options;

    const riskAssessorUsers: User[] = riskAssessors.map(tm => mapTeamMemberToUser(tm));

    const overallRiskNationalOptions: UIOption[] = mapToPresentationOptions(overallRiskNational);
    const overallRiskRegionalOptions: UIOption[] = mapToPresentationOptions(overallRiskRegional);
    const overallRiskGlobalOptions: UIOption[] = mapToPresentationOptions(overallRiskGlobal);
    const overAllConfidencNationalOptions: UIOption[] =
        mapToPresentationOptions(overAllConfidencNational);
    const overAllConfidencRegionalOptions: UIOption[] =
        mapToPresentationOptions(overAllConfidencRegional);
    const overAllConfidencGlobalOptions: UIOption[] =
        mapToPresentationOptions(overAllConfidencGlobal);

    //SNEHA TO DO : Create this form by iterating over Object Keys
    return {
        id: "",
        title: "Risk Assessment Summary",
        subtitle: riskFormaData.eventTrackerDetails.name,
        titleDescripton: "Last updated",
        subtitleDescripton: getDateAsLocaleDateTimeString(
            riskFormaData.eventTrackerDetails.lastUpdated
        ),
        saveButtonLabel: "Next",
        isValid: false,
        sections: [
            {
                title: "Risk Assessment Date",
                id: riskAssessmentSummaryCodes.riskAssessmentDate,
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: `${riskAssessmentSummaryCodes.riskAssessmentDate}-a`,
                        isVisible: true,
                        errors: [],
                        type: "date",
                        value: riskAssessmentSummary?.riskAssessmentDate || null,
                        width: "200px",
                        required: true,
                        showIsRequired: false,
                    },
                ],
            },
            {
                title: "Risk Assessor",
                id: `${riskAssessmentSummaryCodes.riskAssessor1}-section`,
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: riskAssessmentSummaryCodes.riskAssessor1,
                        placeholder: "Select a risk assessor",
                        isVisible: true,
                        errors: [],
                        type: "user",
                        options: riskAssessorUsers,
                        value: riskAssessmentSummary?.riskAssessors[0]?.username || "",
                        required: true,
                        showIsRequired: false,
                    },
                    {
                        id: riskAssessmentSummaryCodes.addAnotherRiskAssessor1,
                        label: i18n.t("Add another"),
                        isVisible: true,
                        errors: [],
                        type: "boolean",
                        value:
                            riskAssessmentSummary?.riskAssessors &&
                            riskAssessmentSummary.riskAssessors.length > 1
                                ? true
                                : false,
                    },
                ],
            },
            {
                title: "Risk Assessor",
                id: `${riskAssessmentSummaryCodes.riskAssessor2}-section`,
                isVisible:
                    riskAssessmentSummary?.riskAssessors &&
                    riskAssessmentSummary.riskAssessors.length > 1,
                required: false,
                fields: [
                    {
                        id: riskAssessmentSummaryCodes.riskAssessor2,
                        placeholder: "Select a risk assessor",
                        isVisible: true,
                        errors: [],
                        type: "user",
                        options: riskAssessorUsers,
                        value: riskAssessmentSummary?.riskAssessors[1]?.username || "",
                    },
                    {
                        id: riskAssessmentSummaryCodes.addAnotherRiskAssessor2,
                        label: i18n.t("Add another"),
                        isVisible: true,
                        errors: [],
                        type: "boolean",
                        value:
                            riskAssessmentSummary?.riskAssessors &&
                            riskAssessmentSummary.riskAssessors.length > 2
                                ? true
                                : false,
                    },
                ],
            },
            {
                title: "Risk Assessor",
                id: `${riskAssessmentSummaryCodes.riskAssessor3}-section`,
                isVisible:
                    riskAssessmentSummary?.riskAssessors &&
                    riskAssessmentSummary.riskAssessors.length > 2,
                required: false,
                fields: [
                    {
                        id: riskAssessmentSummaryCodes.riskAssessor3,
                        placeholder: "Select a risk assessor",
                        isVisible: true,
                        errors: [],
                        type: "user",
                        options: riskAssessorUsers,
                        value: riskAssessmentSummary?.riskAssessors[2]?.username || "",
                    },
                    {
                        id: riskAssessmentSummaryCodes.addAnotherRiskAssessor3,
                        label: i18n.t("Add another"),
                        isVisible: true,
                        errors: [],
                        type: "boolean",
                        value:
                            riskAssessmentSummary?.riskAssessors &&
                            riskAssessmentSummary.riskAssessors.length > 3
                                ? true
                                : false,
                    },
                ],
            },
            {
                title: "Risk Assessor",
                id: `${riskAssessmentSummaryCodes.riskAssessor4}-section`,
                isVisible:
                    riskAssessmentSummary?.riskAssessors &&
                    riskAssessmentSummary.riskAssessors.length > 3,
                required: false,
                fields: [
                    {
                        id: riskAssessmentSummaryCodes.riskAssessor4,
                        placeholder: "Select a risk assessor",
                        isVisible: true,
                        errors: [],
                        type: "user",
                        options: riskAssessorUsers,
                        value: riskAssessmentSummary?.riskAssessors[3]?.username || "",
                    },
                    {
                        id: riskAssessmentSummaryCodes.addAnotherRiskAssessor4,
                        label: i18n.t("Add another"),
                        isVisible: true,
                        errors: [],
                        type: "boolean",
                        value:
                            riskAssessmentSummary?.riskAssessors &&
                            riskAssessmentSummary.riskAssessors.length > 4
                                ? true
                                : false,
                    },
                ],
            },
            {
                title: "Risk Assessor",
                id: `${riskAssessmentSummaryCodes.riskAssessor5}-section`,
                isVisible:
                    riskAssessmentSummary?.riskAssessors &&
                    riskAssessmentSummary.riskAssessors.length > 4,
                required: false,
                fields: [
                    {
                        id: riskAssessmentSummaryCodes.riskAssessor5,
                        placeholder: "Select a risk assessor",
                        isVisible: true,
                        errors: [],
                        type: "user",
                        options: riskAssessorUsers,
                        value: riskAssessmentSummary?.riskAssessors[4]?.username || "",
                    },
                ],
            },
            {
                title: "Overall Risk - National",
                id: riskAssessmentSummaryCodes.overallRiskNational,
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: `${riskAssessmentSummaryCodes.overallRiskNational}-a`,
                        placeholder: "Select..",
                        isVisible: true,
                        errors: [],
                        type: "select",
                        multiple: false,
                        options: overallRiskNationalOptions,
                        value: riskAssessmentSummary?.overallRiskNational.id || "",
                        required: true,
                        showIsRequired: false,
                        disabled: false,
                    },
                ],
            },
            {
                title: "Overall Risk - Regional",
                id: riskAssessmentSummaryCodes.overallRiskRegional,
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: `${riskAssessmentSummaryCodes.overallRiskRegional}-a`,
                        placeholder: "Select..",
                        isVisible: true,
                        errors: [],
                        type: "select",
                        multiple: false,
                        options: overallRiskRegionalOptions,
                        value: riskAssessmentSummary?.overallRiskRegional.id || "",
                        required: true,
                        showIsRequired: false,
                        disabled: false,
                    },
                ],
            },
            {
                title: "Overall Risk - Global",
                id: riskAssessmentSummaryCodes.overallRiskGlobal,
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: `${riskAssessmentSummaryCodes.overallRiskGlobal}-a`,
                        placeholder: "Select..",
                        isVisible: true,
                        errors: [],
                        type: "select",
                        multiple: false,
                        options: overallRiskGlobalOptions,
                        value: riskAssessmentSummary?.overallRiskGlobal.id || "",
                        required: true,
                        showIsRequired: false,
                        disabled: false,
                    },
                ],
            },
            {
                title: "Overall Confidence - National",
                id: riskAssessmentSummaryCodes.overallConfidenceNational,
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: `${riskAssessmentSummaryCodes.overallConfidenceNational}-a`,
                        placeholder: "Select..",
                        isVisible: true,
                        errors: [],
                        type: "select",
                        multiple: false,
                        options: overAllConfidencNationalOptions,
                        value: riskAssessmentSummary?.overallConfidenceNational.id || "",
                        required: true,
                        showIsRequired: false,
                        disabled: false,
                    },
                ],
            },
            {
                title: "Overall Confidence - Regional",
                id: riskAssessmentSummaryCodes.overallConfidenceRegional,
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: `${riskAssessmentSummaryCodes.overallConfidenceRegional}-a`,
                        placeholder: "Select..",
                        isVisible: true,
                        errors: [],
                        type: "select",
                        multiple: false,
                        options: overAllConfidencRegionalOptions,
                        value: riskAssessmentSummary?.overallConfidenceRegional.id || "",
                        required: true,
                        showIsRequired: false,
                        disabled: false,
                    },
                ],
            },
            {
                title: "Overall Confidence - Global",
                id: riskAssessmentSummaryCodes.overallConfidenceGlobal,
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: `${riskAssessmentSummaryCodes.overallConfidenceGlobal}-a`,
                        placeholder: "Select..",
                        isVisible: true,
                        errors: [],
                        type: "select",
                        multiple: false,
                        options: overAllConfidencGlobalOptions,
                        value: riskAssessmentSummary?.overallConfidenceGlobal.id || "",
                        required: true,
                        showIsRequired: false,
                        disabled: false,
                    },
                ],
            },
            {
                title: "Qualitative Risk Assessment",
                id: riskAssessmentSummaryCodes.qualitativeRiskAssessment,
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: `${riskAssessmentSummaryCodes.qualitativeRiskAssessment}-a`,
                        isVisible: true,
                        errors: [],
                        type: "text",
                        value: riskAssessmentSummary?.qualitativeRiskAssessment || "",
                        required: true,
                        showIsRequired: false,
                        disabled: false,
                    },
                ],
            },
        ],
    };
}

export function mapRiskAssessmentQuestionnaireToInitialFormState(
    riskFormaData: RiskAssessmentQuestionnaireFormData
): FormState {
    const { entity: riskAssessmentQuestionnaire, options } = riskFormaData;

    const { likelihood, consequences, risk } = options;

    const likelihoodOptions: UIOption[] = mapToPresentationOptions(likelihood);
    const consequencesOptions: UIOption[] = mapToPresentationOptions(consequences);
    const riskOptions: UIOption[] = mapToPresentationOptions(risk);

    const sectionOptions = {
        riskAssessmentQuestionnaire,
        likelihoodOptions,
        consequencesOptions,
        riskOptions,
    };

    const potentialRiskForHumanHealthSection = getRiskAssessmentQuestionSection(
        "Potential Risk For Human Health",
        "potentialRiskForHumanHealth",
        `1`,
        sectionOptions
    );

    const riskOfEventSpreadingSection = getRiskAssessmentQuestionSection(
        "Risk Of Event Spreading",
        "riskOfEventSpreading",
        `2`,
        sectionOptions
    );

    const riskOfInsufficientCapacitiesSection = getRiskAssessmentQuestionSection(
        "Risk Of Insufficient Capacities",
        "riskOfInsufficientCapacities",
        `3`,
        sectionOptions
    );

    //SNEHA TO DO : Create this form by iterating over Object Keys
    return {
        id: riskAssessmentQuestionnaire?.id ?? "",
        title: "Risk Assessment Questionnaire",
        subtitle: riskFormaData.eventTrackerDetails.name,
        titleDescripton: "Last updated",
        subtitleDescripton: "TO DO SNEHA",
        saveButtonLabel: "Next",
        isValid: false,
        sections: [
            potentialRiskForHumanHealthSection,
            riskOfEventSpreadingSection,
            riskOfInsufficientCapacitiesSection,
        ],
    };
}

function getRiskAssessmentQuestionSection(
    title:
        | "Potential Risk For Human Health"
        | "Risk Of Event Spreading"
        | "Risk Of Insufficient Capacities",
    id: "potentialRiskForHumanHealth" | "riskOfEventSpreading" | "riskOfInsufficientCapacities",
    index: "1" | "2" | "3",
    options: {
        riskAssessmentQuestionnaire: Maybe<RiskAssessmentQuestionnaire>;
        likelihoodOptions: UIOption[];
        consequencesOptions: UIOption[];
        riskOptions: UIOption[];
    }
): FormSectionState {
    const { riskAssessmentQuestionnaire, likelihoodOptions, consequencesOptions, riskOptions } =
        options;
    const riskAssesssmentQuestionFormSection: FormSectionState = {
        title: title,
        id: id,
        isVisible: true,
        required: true,
        fields: [],
        direction: "column",
        subsections: [
            {
                id: `likelihood${index}`,
                title: "Likelihood",
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: `${riskAssessmentQuestionnaireCodes[`likelihood${index}`]}`,
                        placeholder: "Select..",
                        isVisible: true,
                        errors: [],
                        type: "select",
                        multiple: false,
                        options: likelihoodOptions,
                        value: riskAssessmentQuestionnaire
                            ? riskAssessmentQuestionnaire[id].likelihood.id
                            : "",
                        required: true,
                        showIsRequired: false,
                        disabled: false,
                    },
                ],
            },
            {
                id: `consequences${index}`,
                title: "Consequences",
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: `${riskAssessmentQuestionnaireCodes[`consequences${index}`]}`,
                        placeholder: "Select..",
                        isVisible: true,
                        errors: [],
                        type: "select",
                        multiple: false,
                        options: consequencesOptions,
                        value: riskAssessmentQuestionnaire
                            ? riskAssessmentQuestionnaire[id].consequences.id
                            : "",
                        required: true,
                        showIsRequired: false,
                        disabled: false,
                    },
                ],
            },
            {
                id: `risk${index}`,
                title: "Risk",
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: `${riskAssessmentQuestionnaireCodes[`risk${index}`]}`,
                        placeholder: "Select..",
                        isVisible: true,
                        errors: [],
                        type: "select",
                        multiple: false,
                        options: riskOptions,
                        value: riskAssessmentQuestionnaire
                            ? riskAssessmentQuestionnaire[id].risk.id
                            : "",
                        required: true,
                        showIsRequired: false,
                        disabled: false,
                    },
                ],
            },
            {
                id: `rational${index}`,
                title: "Rational",
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: `${riskAssessmentQuestionnaireCodes[`rational${index}`]}`,
                        isVisible: true,
                        errors: [],
                        type: "text",
                        value: riskAssessmentQuestionnaire
                            ? riskAssessmentQuestionnaire[id].rational
                            : "",
                        required: true,
                        showIsRequired: false,
                        disabled: false,
                    },
                ],
            },
        ],
    };
    return riskAssesssmentQuestionFormSection;
}
