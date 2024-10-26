import { FutureData } from "../../../../data/api-futures";
import {
    riskAssessmentGradingOptionCodeMap,
    riskAssessmentSummaryCodes,
} from "../../../../data/repositories/consts/RiskAssessmentConstants";
import { AppConfigurations } from "../../../entities/AppConfigurations";
import {
    RiskAssessmentGradingFormData,
    RiskAssessmentQuestionnaireFormData,
    RiskAssessmentSummaryFormData,
} from "../../../entities/ConfigurableForm";
import { DiseaseOutbreakEvent } from "../../../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../../../entities/generic/Future";
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

export function getRiskAssessmentGradingWithOptions(
    eventTrackerDetails: DiseaseOutbreakEvent,
    appConfig: AppConfigurations
): RiskAssessmentGradingFormData {
    const riskGradingFormData: RiskAssessmentGradingFormData = {
        type: "risk-assessment-grading",
        eventTrackerDetails: eventTrackerDetails,
        entity: undefined,
        options: {
            populationAtRisk: appConfig.riskAssessmentGradingConfigurations.populationAtRisk.map(
                mapRiskAssessmentGradingWeightedOptionToOption
            ),
            attackRate: appConfig.riskAssessmentGradingConfigurations.lowMediumHigh.map(
                mapRiskAssessmentGradingWeightedOptionToOption
            ),
            geographicalSpread:
                appConfig.riskAssessmentGradingConfigurations.geographicalSpread.map(
                    mapRiskAssessmentGradingWeightedOptionToOption
                ),
            complexity: appConfig.riskAssessmentGradingConfigurations.lowMediumHigh.map(
                mapRiskAssessmentGradingWeightedOptionToOption
            ),
            capacity: appConfig.riskAssessmentGradingConfigurations.capacity.map(
                mapRiskAssessmentGradingWeightedOptionToOption
            ),
            reputationalRisk: appConfig.riskAssessmentGradingConfigurations.lowMediumHigh.map(
                mapRiskAssessmentGradingWeightedOptionToOption
            ),
            severity: appConfig.riskAssessmentGradingConfigurations.lowMediumHigh.map(
                mapRiskAssessmentGradingWeightedOptionToOption
            ),
            capability: appConfig.riskAssessmentGradingConfigurations.capability.map(
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

export function getRiskAssessmentSummaryWithOptions(
    eventTrackerDetails: DiseaseOutbreakEvent,
    appConfig: AppConfigurations
): RiskAssessmentSummaryFormData {
    //Every Disease Outbreak can have only one Risk Assessment Summary, so if it has been saved already, then populate it.
    const riskSummaryFormData: RiskAssessmentSummaryFormData = {
        type: "risk-assessment-summary",
        eventTrackerDetails: eventTrackerDetails,
        entity: eventTrackerDetails.riskAssessment?.summary,
        options: {
            overallRiskNational: appConfig.riskAssessmentSummaryConfigurations.overallRiskNational,
            overallRiskRegional: appConfig.riskAssessmentSummaryConfigurations.overallRiskRegional,
            overallRiskGlobal: appConfig.riskAssessmentSummaryConfigurations.overallRiskGlobal,
            overAllConfidencNational:
                appConfig.riskAssessmentSummaryConfigurations.overAllConfidencNational,
            overAllConfidencRegional:
                appConfig.riskAssessmentSummaryConfigurations.overAllConfidencRegional,
            overAllConfidencGlobal:
                appConfig.riskAssessmentSummaryConfigurations.overAllConfidencGlobal,
            riskAssessors: appConfig.riskAssessmentSummaryConfigurations.riskAssessors,
        },

        // TODO: Get labels from Datastore used in mapEntityToInitialFormState to create initial form state
        labels: {
            errors: {
                field_is_required: "This field is required",
            },
        },
        rules: [
            {
                type: "toggleSectionsVisibilityByFieldValue",
                fieldId: riskAssessmentSummaryCodes.addAnotherRiskAssessor1,
                fieldValue: true,
                sectionIds: [`${riskAssessmentSummaryCodes.riskAssessor2}-section`],
            },
            {
                type: "toggleSectionsVisibilityByFieldValue",
                fieldId: riskAssessmentSummaryCodes.addAnotherRiskAssessor2,
                fieldValue: true,
                sectionIds: [`${riskAssessmentSummaryCodes.riskAssessor3}-section`],
            },
            {
                type: "toggleSectionsVisibilityByFieldValue",
                fieldId: riskAssessmentSummaryCodes.addAnotherRiskAssessor3,
                fieldValue: true,
                sectionIds: [`${riskAssessmentSummaryCodes.riskAssessor4}-section`],
            },
            {
                type: "toggleSectionsVisibilityByFieldValue",
                fieldId: riskAssessmentSummaryCodes.addAnotherRiskAssessor4,
                fieldValue: true,
                sectionIds: [`${riskAssessmentSummaryCodes.riskAssessor5}-section`],
            },
        ],
    };

    return riskSummaryFormData;
}

export function getRiskAssessmentQuestionnaireWithOptions(
    eventTrackerDetails: DiseaseOutbreakEvent,
    appConfig: AppConfigurations
): FutureData<RiskAssessmentQuestionnaireFormData> {
    //Every Disease Outbreak can have only one Risk Assessment Questionnaire, so if it has been saved already, then populate it.
    const riskQuestionnaireFormData: RiskAssessmentQuestionnaireFormData = {
        type: "risk-assessment-questionnaire",
        eventTrackerDetails: eventTrackerDetails,
        entity: eventTrackerDetails.riskAssessment?.questionnaire,
        options: {
            likelihood: appConfig.riskAssessmentQuestionnaireConfigurations.likelihood,
            consequences: appConfig.riskAssessmentQuestionnaireConfigurations.consequences,
            risk: appConfig.riskAssessmentQuestionnaireConfigurations.risk,
        },

        // TODO: Get labels from Datastore used in mapEntityToInitialFormState to create initial form state
        labels: {
            errors: {
                field_is_required: "This field is required",
            },
        },
        rules: [],
    };
    return Future.success(riskQuestionnaireFormData);
}
