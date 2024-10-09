import { FutureData } from "../../../../data/api-futures";
import {
    riskAssessmentGradingOptionCodeMap,
    riskAssessmentSummaryCodes,
} from "../../../../data/repositories/consts/RiskAssessmentConstants";
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
import { OptionsRepository } from "../../../repositories/OptionsRepository";
import { TeamMemberRepository } from "../../../repositories/TeamMemberRepository";

export function getRiskAssessmentGradingWithOptions(
    optionsRepository: OptionsRepository,
    eventTrackerDetails: DiseaseOutbreakEvent
): FutureData<RiskAssessmentGradingFormData> {
    return Future.joinObj(
        {
            populationAtRisk: optionsRepository.getPopulationAtRisks(),
            lowMediumHigh: optionsRepository.getLowMediumHighWeightedOptions(),
            geographicalSpread: optionsRepository.getGeographicalSpreads(),
            capacity: optionsRepository.getCapacities(),
            capability: optionsRepository.getCapabilities(),
        },
        { concurrency: 5 }
    ).flatMap(({ populationAtRisk, lowMediumHigh, geographicalSpread, capacity, capability }) => {
        const riskGradingFormData: RiskAssessmentGradingFormData = {
            type: "risk-assessment-grading",
            eventTrackerDetails: eventTrackerDetails,
            entity: undefined,
            options: {
                populationAtRisk: populationAtRisk.map(
                    mapRiskAssessmentGradingWeightedOptionToOption
                ),
                attackRate: lowMediumHigh.map(mapRiskAssessmentGradingWeightedOptionToOption),
                geographicalSpread: geographicalSpread.map(
                    mapRiskAssessmentGradingWeightedOptionToOption
                ),
                complexity: lowMediumHigh.map(mapRiskAssessmentGradingWeightedOptionToOption),
                capacity: capacity.map(mapRiskAssessmentGradingWeightedOptionToOption),
                reputationalRisk: lowMediumHigh.map(mapRiskAssessmentGradingWeightedOptionToOption),
                severity: lowMediumHigh.map(mapRiskAssessmentGradingWeightedOptionToOption),
                capability: capability.map(mapRiskAssessmentGradingWeightedOptionToOption),
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
    optionsRepository: OptionsRepository,
    teamMemberRepository: TeamMemberRepository
): FutureData<RiskAssessmentSummaryFormData> {
    //Every Disease Outbreak can have only one Risk Assessment Summary, so if it has been saved already, then populate it.
    return Future.joinObj(
        {
            lowMediumHighOptions: optionsRepository.getLowMediumHighOptions(),
            riskAssessors: teamMemberRepository.getRiskAssessors(),
        },
        { concurrency: 2 }
    ).flatMap(({ lowMediumHighOptions, riskAssessors }) => {
        const riskSummaryFormData: RiskAssessmentSummaryFormData = {
            type: "risk-assessment-summary",
            eventTrackerDetails: eventTrackerDetails,
            entity: eventTrackerDetails.riskAssessment?.summary,
            options: {
                overallRiskNational: lowMediumHighOptions,
                overallRiskRegional: lowMediumHighOptions,
                overallRiskGlobal: lowMediumHighOptions,
                overAllConfidencNational: lowMediumHighOptions,
                overAllConfidencRegional: lowMediumHighOptions,
                overAllConfidencGlobal: lowMediumHighOptions,
                riskAssessors: riskAssessors,
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
        return Future.success(riskSummaryFormData);
    });
}

export function getRiskAssessmentQuestionnaireWithOptions(
    eventTrackerDetails: DiseaseOutbreakEvent,
    optionsRepository: OptionsRepository
): FutureData<RiskAssessmentQuestionnaireFormData> {
    //Every Disease Outbreak can have only one Risk Assessment Questionnaire, so if it has been saved already, then populate it.
    return Future.joinObj(
        {
            likelihoodOptions: optionsRepository.getLikelihoodOptions(),
            consequencesOptions: optionsRepository.getConsequencesOptions(),
            riskOptions: optionsRepository.getLowMediumHighOptions(),
        },
        { concurrency: 3 }
    ).flatMap(({ likelihoodOptions, consequencesOptions, riskOptions }) => {
        const riskQuestionnaireFormData: RiskAssessmentQuestionnaireFormData = {
            type: "risk-assessment-questionnaire",
            eventTrackerDetails: eventTrackerDetails,
            entity: eventTrackerDetails.riskAssessment?.questionnaire,
            options: {
                likelihood: likelihoodOptions,
                consequences: consequencesOptions,
                risk: riskOptions,
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
    });
}
