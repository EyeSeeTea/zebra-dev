import { FutureData } from "../../data/api-futures";
import { Maybe } from "../../utils/ts-utils";
import { FormType } from "../../webapp/pages/form-page/FormPage";
import { Configurations } from "../entities/AppConfigurations";
import { ConfigurableForm } from "../entities/ConfigurableForm";
import { DiseaseOutbreakEvent } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../entities/generic/Future";
import { Id } from "../entities/Ref";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";
import { IncidentActionRepository } from "../repositories/IncidentActionRepository";
import { RoleRepository } from "../repositories/RoleRepository";
import { getDiseaseOutbreakConfigurableForm } from "./utils/disease-outbreak/GetDiseaseOutbreakConfigurableForm";
import { getActionPlanConfigurableForm } from "./utils/incident-action/GetActionPlanConfigurableForm";
import { getResponseActionConfigurableForm } from "./utils/incident-action/GetResponseActionConfigurableForm";
import { getIncidentManagementConfigurableForm } from "./utils/incident-management-team/GetIncidentManagementTeamConfigurableForm";
import { getRiskAssessmentGradingConfigurableForm } from "./utils/risk-assessment/GetGradingConfigurableForm";
import { getRiskAssessmentQuestionnaireConfigurableForm } from "./utils/risk-assessment/GetQuestionnaireConfigurableForm";
import { getRiskAssessmentSummaryConfigurableForm } from "./utils/risk-assessment/GetSummaryConfigurableForm";

export class GetConfigurableFormUseCase {
    constructor(
        private options: {
            diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
            roleRepository: RoleRepository;
            incidentActionRepository: IncidentActionRepository;
        }
    ) {}

    public execute(
        formType: FormType,
        eventTrackerDetails: Maybe<DiseaseOutbreakEvent>,
        configurations: Configurations,
        id?: Id
    ): FutureData<ConfigurableForm> {
        switch (formType) {
            case "disease-outbreak-event": {
                return getDiseaseOutbreakConfigurableForm(this.options, configurations, id);
            }
            case "risk-assessment-grading":
                if (!eventTrackerDetails)
                    return Future.error(
                        new Error("Disease outbreak id is required for risk grading")
                    );
                return Future.success(
                    getRiskAssessmentGradingConfigurableForm(eventTrackerDetails, configurations)
                );
            case "risk-assessment-summary":
                if (!eventTrackerDetails)
                    return Future.error(
                        new Error("Disease outbreak id is required for risk summary")
                    );
                return Future.success(
                    getRiskAssessmentSummaryConfigurableForm(eventTrackerDetails, configurations)
                );
            case "risk-assessment-questionnaire":
                if (!eventTrackerDetails)
                    return Future.error(
                        new Error("Disease outbreak id is required for risk questionnaire")
                    );
                return Future.success(
                    getRiskAssessmentQuestionnaireConfigurableForm(
                        eventTrackerDetails,
                        configurations
                    )
                );
            case "incident-action-plan":
                if (!eventTrackerDetails)
                    return Future.error(
                        new Error("Disease outbreak id is required for incident action plan")
                    );

                return getActionPlanConfigurableForm(eventTrackerDetails, configurations);
            case "incident-response-action":
                if (!eventTrackerDetails)
                    return Future.error(
                        new Error("Disease outbreak id is required for incident action plan")
                    );

                return getResponseActionConfigurableForm(eventTrackerDetails, configurations);

            case "incident-management-team-member-assignment":
                if (!eventTrackerDetails)
                    return Future.error(
                        new Error(
                            "Disease outbreak id is required for incident management team member builder"
                        )
                    );

                return getIncidentManagementConfigurableForm(
                    id,
                    eventTrackerDetails,
                    configurations,
                    {
                        roleRepository: this.options.roleRepository,
                        diseaseOutbreakEventRepository: this.options.diseaseOutbreakEventRepository,
                    }
                );
            default:
                return Future.error(new Error("Form type not supported"));
        }
    }
}
