import { FutureData } from "../../../../data/api-futures";
import { riskAssessmentGradingOptionCodeMap } from "../../../../data/repositories/consts/RiskAssessmentGradingConstants";
import { RiskAssessmentGradingFormData } from "../../../entities/ConfigurableForm";
import { Future } from "../../../entities/generic/Future";
import { Id } from "../../../entities/Ref";
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
import { OptionsRepository } from "../../../repositories/OptionsRepository";

export function getRiskGradingWithOptions(
    optionsRepository: OptionsRepository,
    diseaseOutbreakId: Id
): FutureData<RiskAssessmentGradingFormData> {
    return Future.joinObj(
        {
            populationAtRisk: optionsRepository.getPopulationAtRisks(),
            lowMediumHigh: optionsRepository.getLowMediumHighOptions(),
            geographicalSpread: optionsRepository.getGeographicalSpreads(),
            capacity: optionsRepository.getCapacities(),
            capability: optionsRepository.getCapabilities(),
        },
        { concurrency: 5 }
    ).flatMap(({ populationAtRisk, lowMediumHigh, geographicalSpread, capacity, capability }) => {
        const riskGradingFormData: RiskAssessmentGradingFormData = {
            type: "risk-assessment-grading",
            diseaseOutbreakId: diseaseOutbreakId,
            entity: undefined,
            options: {
                populationAtRisk: populationAtRisk.map(mapRiskGradingWeightedOptionToOption),
                attackRate: lowMediumHigh.map(mapRiskGradingWeightedOptionToOption),
                geographicalSpread: geographicalSpread.map(mapRiskGradingWeightedOptionToOption),
                complexity: lowMediumHigh.map(mapRiskGradingWeightedOptionToOption),
                capacity: capacity.map(mapRiskGradingWeightedOptionToOption),
                reputationalRisk: lowMediumHigh.map(mapRiskGradingWeightedOptionToOption),
                severity: lowMediumHigh.map(mapRiskGradingWeightedOptionToOption),
                capability: capability.map(mapRiskGradingWeightedOptionToOption),
            },

            // TODO: Get labels from Datastore used in mapEntityToInitialFormState to create initial form state
            labels: {
                errors: {
                    field_is_required: "This field is required",
                },
            },
            rules: [],
        };
        return Future.success(riskGradingFormData);
    });
}
function mapRiskGradingWeightedOptionToOption(
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
