import { riskAssessmentSummaryCodes } from "../../../../data/repositories/consts/RiskAssessmentConstants";
import { Configurations } from "../../../entities/AppConfigurations";
import { RiskAssessmentSummaryFormData } from "../../../entities/ConfigurableForm";
import { DiseaseOutbreakEvent } from "../../../entities/disease-outbreak-event/DiseaseOutbreakEvent";

export function getRiskAssessmentSummaryConfigurableForm(
    eventTrackerDetails: DiseaseOutbreakEvent,
    configurations: Configurations
): RiskAssessmentSummaryFormData {
    const { riskAssessmentSummaryConfigurations: riskSummaryConfig } =
        configurations.selectableOptions;
    //Every Disease Outbreak can have only one Risk Assessment Summary, so if it has been saved already, then populate it.
    const riskSummaryFormData: RiskAssessmentSummaryFormData = {
        type: "risk-assessment-summary",
        eventTrackerDetails: eventTrackerDetails,
        entity: eventTrackerDetails.riskAssessment?.summary,
        options: {
            overallRiskNational: riskSummaryConfig.overallRiskNational,
            overallRiskRegional: riskSummaryConfig.overallRiskRegional,
            overallRiskGlobal: riskSummaryConfig.overallRiskGlobal,
            overAllConfidencNational: riskSummaryConfig.overAllConfidencNational,
            overAllConfidencRegional: riskSummaryConfig.overAllConfidencRegional,
            overAllConfidencGlobal: riskSummaryConfig.overAllConfidencGlobal,
            riskAssessors: riskSummaryConfig.riskAssessors,
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
