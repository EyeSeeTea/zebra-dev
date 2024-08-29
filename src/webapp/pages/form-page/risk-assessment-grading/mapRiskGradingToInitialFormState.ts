import { RiskAssessmentGradingFormData } from "../../../../domain/entities/ConfigurableForm";
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
                id: "1",
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: "1a",
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
                id: "2",
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: "2a",
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
                id: "3",
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: "3a",
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
                id: "4",
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: "4a",
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
                id: "5",
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: "5a",
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
                id: "6",
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: "5a",
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
                id: "7",
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: "7a",
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
                id: "8",
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: "8a",
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
