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
import { IncidentManagementTeamRepository } from "../repositories/IncidentManagementTeamRepository";
import { RoleRepository } from "../repositories/RoleRepository";
import { TeamMemberRepository } from "../repositories/TeamMemberRepository";
import { getDiseaseOutbreakConfigurableForm } from "./utils/disease-outbreak/GetDiseaseOutbreakConfigurableForm";
import { getActionPlanConfigurableForm } from "./utils/incident-action/GetActionPlanConfigurableForm";
import {
    getResponseActionConfigurableForm,
    getSingleResponseActionConfigurableForm,
} from "./utils/incident-action/GetResponseActionConfigurableForm";
import { getIncidentManagementTeamWithOptions } from "./utils/incident-management-team/GetIncidentManagementTeamWithOptions";
import { getRiskAssessmentGradingConfigurableForm } from "./utils/risk-assessment/GetGradingConfigurableForm";
import { getRiskAssessmentQuestionnaireConfigurableForm } from "./utils/risk-assessment/GetQuestionnaireConfigurableForm";
import { getRiskAssessmentSummaryConfigurableForm } from "./utils/risk-assessment/GetSummaryConfigurableForm";

export class GetConfigurableFormUseCase {
    constructor(
        private options: {
            diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
            roleRepository: RoleRepository;
            teamMemberRepository: TeamMemberRepository;
            incidentActionRepository: IncidentActionRepository;
            incidentManagementTeamRepository: IncidentManagementTeamRepository;
        }
    ) {}

    public execute(options: {
        formType: FormType;
        eventTrackerDetails: Maybe<DiseaseOutbreakEvent>;
        configurations: Configurations;
        id?: Id;
        responseActionId?: Id;
    }): FutureData<ConfigurableForm> {
        const { formType, eventTrackerDetails, configurations, id, responseActionId } = options;

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
            case "incident-response-actions":
                if (!eventTrackerDetails)
                    return Future.error(
                        new Error("Disease outbreak id is required for incident action plan")
                    );

                return getResponseActionConfigurableForm(eventTrackerDetails, configurations);
            case "incident-response-action":
                if (!eventTrackerDetails)
                    return Future.error(
                        new Error("Disease outbreak id is required for incident action plan")
                    );

                if (!responseActionId)
                    return Future.error(
                        new Error(
                            "Response action id is required for single incident response action"
                        )
                    );

                return getSingleResponseActionConfigurableForm({
                    eventTrackerDetails: eventTrackerDetails,
                    responseActionId: responseActionId,
                    configurations: configurations,
                });
            case "incident-management-team-member-assignment":
                if (!eventTrackerDetails)
                    return Future.error(
                        new Error(
                            "Disease outbreak id is required for incident management team member builder"
                        )
                    );

                return getIncidentManagementTeamWithOptions(
                    id,
                    eventTrackerDetails,
                    {
                        roleRepository: this.options.roleRepository,
                        teamMemberRepository: this.options.teamMemberRepository,
                        incidentManagementTeamRepository:
                            this.options.incidentManagementTeamRepository,
                    },
                    configurations
                );
            default:
                return Future.error(new Error("Form type not supported"));
        }
    }
}
