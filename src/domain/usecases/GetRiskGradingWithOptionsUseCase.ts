import { FutureData } from "../../data/api-futures";
import { RiskAssessmentGradingFormData } from "../entities/ConfigurableForm";
import { Future } from "../entities/generic/Future";
import { OptionsRepository } from "../repositories/OptionsRepository";

export class GetRiskGradingWithOptionsUseCase {
    constructor(private optionsRepository: OptionsRepository) {}

    public execute(): FutureData<RiskAssessmentGradingFormData> {
        return Future.parallel(
            [
                this.optionsRepository.getPopulationAtRisks(),
                this.optionsRepository.getLowMediumHighOptions(),
                this.optionsRepository.getGeographicalSpreads(),
                this.optionsRepository.getCapacities(),
                this.optionsRepository.getCapabilities(),
            ],
            { concurrency: 5 }
        ).flatMap(([populationAtRisk, lowMediumHigh, geographicalSpread, capacity, capability]) => {
            if (
                !populationAtRisk ||
                !lowMediumHigh ||
                !geographicalSpread ||
                !capacity ||
                !capability
            )
                return Future.error(
                    new Error("Cannot get all neccessary options to load Risk Grading form")
                );
            const riskGradingFormData: RiskAssessmentGradingFormData = {
                type: "risk-assessment-grading",
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
}
