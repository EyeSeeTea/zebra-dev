import { FutureData } from "../../../../data/api-futures";
import { RiskAssessmentGradingFormData } from "../../../entities/ConfigurableForm";
import { Future } from "../../../entities/generic/Future";
import { Id } from "../../../entities/Ref";
import { OptionsRepository } from "../../../repositories/OptionsRepository";

export function getRiskGradingWithOptions(
    optionsRepository: OptionsRepository,
    diseaseOutbreakId: Id
): FutureData<RiskAssessmentGradingFormData> {
    return Future.parallel(
        [
            optionsRepository.getPopulationAtRisks(),
            optionsRepository.getLowMediumHighOptions(),
            optionsRepository.getGeographicalSpreads(),
            optionsRepository.getCapacities(),
            optionsRepository.getCapabilities(),
        ],
        { concurrency: 5 }
    ).flatMap(([populationAtRisk, lowMediumHigh, geographicalSpread, capacity, capability]) => {
        if (!populationAtRisk || !lowMediumHigh || !geographicalSpread || !capacity || !capability)
            return Future.error(
                new Error("Cannot get all neccessary options to load Risk Grading form")
            );
        const riskGradingFormData: RiskAssessmentGradingFormData = {
            type: "risk-assessment-grading",
            diseaseOutbreakId: diseaseOutbreakId,
            entity: undefined,
            options: {
                populationAtRisk: populationAtRisk,
                attackRate: lowMediumHigh,
                geographicalSpread: geographicalSpread,
                complexity: lowMediumHigh,
                capacity: capacity,
                reputationalRisk: lowMediumHigh,
                severity: lowMediumHigh,
                capability: capability,
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
