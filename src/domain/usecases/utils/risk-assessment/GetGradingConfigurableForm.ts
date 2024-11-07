import { riskAssessmentGradingOptionCodeMap } from "../../../../data/repositories/consts/RiskAssessmentConstants";
import { Configurations } from "../../../entities/AppConfigurations";
import { RiskAssessmentGradingFormData } from "../../../entities/ConfigurableForm";
import { DiseaseOutbreakEvent } from "../../../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import {
    Capability1,
    Capability2,
    HighCapacity,
    HighGeographicalSpread,
    HighPopulationAtRisk,
    HighWeightedOption,
    LowCapacity,
    LowGeographicalSpread,
    LowPopulationAtRisk,
    LowWeightedOption,
    MediumCapacity,
    MediumGeographicalSpread,
    MediumPopulationAtRisk,
    MediumWeightedOption,
    RiskAssessmentGrading,
} from "../../../entities/risk-assessment/RiskAssessmentGrading";

export function getRiskAssessmentGradingConfigurableForm(
    eventTrackerDetails: DiseaseOutbreakEvent,
    configurations: Configurations
): RiskAssessmentGradingFormData {
    const { riskAssessmentGradingConfigurations: riskGradingConfig } =
        configurations.selectableOptions;
    const riskGradingFormData: RiskAssessmentGradingFormData = {
        type: "risk-assessment-grading",
        eventTrackerDetails: eventTrackerDetails,
        entity: undefined,
        options: {
            populationAtRisk: riskGradingConfig.populationAtRisk.map(
                mapRiskAssessmentGradingWeightedOptionToOption
            ),
            attackRate: riskGradingConfig.lowMediumHigh.map(
                mapRiskAssessmentGradingWeightedOptionToOption
            ),
            geographicalSpread: riskGradingConfig.geographicalSpread.map(
                mapRiskAssessmentGradingWeightedOptionToOption
            ),
            complexity: riskGradingConfig.lowMediumHigh.map(
                mapRiskAssessmentGradingWeightedOptionToOption
            ),
            capacity: riskGradingConfig.capacity.map(
                mapRiskAssessmentGradingWeightedOptionToOption
            ),
            reputationalRisk: riskGradingConfig.lowMediumHigh.map(
                mapRiskAssessmentGradingWeightedOptionToOption
            ),
            severity: riskGradingConfig.lowMediumHigh.map(
                mapRiskAssessmentGradingWeightedOptionToOption
            ),
            capability: riskGradingConfig.capability.map(
                mapRiskAssessmentGradingWeightedOptionToOption
            ),
        },

        // TODO: Get labels from Datastore used in mapEntityToInitialFormState to create initial form state
        labels: {
            errors: {
                field_is_required: "This field is required",
            },
        },
        rules: [],
    };
    return riskGradingFormData;
}
function mapRiskAssessmentGradingWeightedOptionToOption(
    weightedOption:
        | (LowPopulationAtRisk | MediumPopulationAtRisk | HighPopulationAtRisk)
        | (LowWeightedOption | MediumWeightedOption | HighWeightedOption)
        | (LowGeographicalSpread | MediumGeographicalSpread | HighGeographicalSpread)
        | (LowCapacity | MediumCapacity | HighCapacity)
        | (Capability1 | Capability2)
): { id: string; name: string } {
    return {
        id: riskAssessmentGradingOptionCodeMap[weightedOption.type],
        name: RiskAssessmentGrading.getTranslatedLabel(weightedOption.type),
    };
}
