import { RiskAssessmentGradingFormData } from "../../../../domain/entities/ConfigurableForm";
import { riskAssessmentGradingCodes } from "../../../../domain/entities/risk-assessment/RiskAssessmentGrading";
import { FormState } from "../../../components/form/FormState";
import { Option as UIOption } from "../../../components/utils/option";
import { mapToPresentationOptions } from "../mapEntityToFormState";

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
        title: "Risk Assessment",
        saveButtonLabel: "Save & Continue",
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
