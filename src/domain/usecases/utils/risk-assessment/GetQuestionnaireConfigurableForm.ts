import { Configurations } from "../../../entities/AppConfigurations";
import { RiskAssessmentQuestionnaireFormData } from "../../../entities/ConfigurableForm";
import { DiseaseOutbreakEvent } from "../../../entities/disease-outbreak-event/DiseaseOutbreakEvent";

export function getRiskAssessmentQuestionnaireConfigurableForm(
    eventTrackerDetails: DiseaseOutbreakEvent,
    configurations: Configurations
): RiskAssessmentQuestionnaireFormData {
    const { riskAssessmentQuestionnaireConfigurations: riskQuestionnaireConfig } =
        configurations.selectableOptions;

    //Every Disease Outbreak can have only one Risk Assessment Questionnaire, so if it has been saved already, then populate it.
    const riskQuestionnaireFormData: RiskAssessmentQuestionnaireFormData = {
        type: "risk-assessment-questionnaire",
        eventTrackerDetails: eventTrackerDetails,
        entity: eventTrackerDetails.riskAssessment?.questionnaire,
        options: {
            likelihood: riskQuestionnaireConfig.likelihood,
            consequences: riskQuestionnaireConfig.consequences,
            risk: riskQuestionnaireConfig.risk,
        },

        // TODO: Get labels from Datastore used in mapEntityToInitialFormState to create initial form state
        labels: {
            errors: {
                field_is_required: "This field is required",
            },
        },
        rules: [],
    };
    return riskQuestionnaireFormData;
}
