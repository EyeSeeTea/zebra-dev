import {
    DiseaseOutbreakEventOptions,
    IncidentActionPlanOptions,
    IncidentResponseActionOptions,
    RiskAssessmentQuestionnaireOptions,
    RiskAssessmentSummaryOptions,
} from "./ConfigurableForm";

import {
    LowPopulationAtRisk,
    MediumPopulationAtRisk,
    HighPopulationAtRisk,
    HighWeightedOption,
    LowWeightedOption,
    MediumWeightedOption,
    HighGeographicalSpread,
    LowGeographicalSpread,
    MediumGeographicalSpread,
    HighCapacity,
    LowCapacity,
    MediumCapacity,
    Capability1,
    Capability2,
} from "./risk-assessment/RiskAssessmentGrading";

export type AppConfigurations = {
    eventTrackerConfigurations: DiseaseOutbreakEventOptions;
    riskAssessmentGradingConfigurations: {
        populationAtRisk: Array<
            LowPopulationAtRisk | MediumPopulationAtRisk | HighPopulationAtRisk
        >;
        lowMediumHigh: Array<LowWeightedOption | MediumWeightedOption | HighWeightedOption>;
        geographicalSpread: Array<
            LowGeographicalSpread | MediumGeographicalSpread | HighGeographicalSpread
        >;
        capacity: Array<LowCapacity | MediumCapacity | HighCapacity>;
        capability: Array<Capability1 | Capability2>;
    };
    riskAssessmentSummaryConfigurations: RiskAssessmentSummaryOptions;
    riskAssessmentQuestionnaireConfigurations: RiskAssessmentQuestionnaireOptions;
    incidentActionPlanConfigurations: IncidentActionPlanOptions;
    incidentResponseActionConfigurations: IncidentResponseActionOptions;
};
