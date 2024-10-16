import { FutureData } from "../../data/api-futures";
import { Maybe } from "../../utils/ts-utils";
import { FormType } from "../../webapp/pages/form-page/FormPage";
import { ConfigurableForm } from "../entities/ConfigurableForm";
import { DiseaseOutbreakEvent } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../entities/generic/Future";
import { Id } from "../entities/Ref";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";
import { IncidentActionRepository } from "../repositories/IncidentActionRepository";
import { IncidentManagementTeamRepository } from "../repositories/IncidentManagementTeamRepository";
import { OptionsRepository } from "../repositories/OptionsRepository";
import { RoleRepository } from "../repositories/RoleRepository";
import { TeamMemberRepository } from "../repositories/TeamMemberRepository";
import { getDiseaseOutbreakWithEventOptions } from "./utils/disease-outbreak/GetDiseaseOutbreakWithOptions";
import {
    getIncidentActionPlanWithOptions,
    getIncidentResponseActionWithOptions,
} from "./utils/incident-action/GetIncidentActionPlanWithOptions";
import { getIncidentManagementTeamWithOptions } from "./utils/incident-management-team/GetIncidentManagementTeamWithOptions";
import {
    getRiskAssessmentGradingWithOptions,
    getRiskAssessmentQuestionnaireWithOptions,
    getRiskAssessmentSummaryWithOptions,
} from "./utils/risk-assessment/GetRiskAssessmentWithOptions";

export class GetEntityWithOptionsUseCase {
    constructor(
        private options: {
            diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
            optionsRepository: OptionsRepository;
            roleRepository: RoleRepository;
            teamMemberRepository: TeamMemberRepository;
            incidentActionRepository: IncidentActionRepository;
            incidentManagementTeamRepository: IncidentManagementTeamRepository;
        }
    ) {}

    public execute(
        formType: FormType,
        eventTrackerDetails: Maybe<DiseaseOutbreakEvent>,
        id?: Id
    ): FutureData<ConfigurableForm> {
        switch (formType) {
            case "disease-outbreak-event":
                return getDiseaseOutbreakWithEventOptions(this.options, id);
            case "risk-assessment-grading":
                if (!eventTrackerDetails)
                    return Future.error(
                        new Error("Disease outbreak id is required for risk grading")
                    );
                return getRiskAssessmentGradingWithOptions(
                    this.options.optionsRepository,
                    eventTrackerDetails
                );
            case "risk-assessment-summary":
                if (!eventTrackerDetails)
                    return Future.error(
                        new Error("Disease outbreak id is required for risk summary")
                    );
                return getRiskAssessmentSummaryWithOptions(
                    eventTrackerDetails,
                    this.options.optionsRepository,
                    this.options.teamMemberRepository
                );
            case "risk-assessment-questionnaire":
                if (!eventTrackerDetails)
                    return Future.error(
                        new Error("Disease outbreak id is required for risk questionnaire")
                    );
                return getRiskAssessmentQuestionnaireWithOptions(
                    eventTrackerDetails,
                    this.options.optionsRepository
                );
            case "incident-action-plan":
                if (!eventTrackerDetails)
                    return Future.error(
                        new Error("Disease outbreak id is required for incident action plan")
                    );

                return getIncidentActionPlanWithOptions(
                    eventTrackerDetails,
                    this.options.optionsRepository
                );
            case "incident-response-action":
                if (!eventTrackerDetails)
                    return Future.error(
                        new Error("Disease outbreak id is required for incident action plan")
                    );

                return getIncidentResponseActionWithOptions(
                    eventTrackerDetails,
                    this.options.optionsRepository,
                    this.options.teamMemberRepository
                );

            case "incident-management-team-member-assignment":
                if (!eventTrackerDetails)
                    return Future.error(
                        new Error(
                            "Disease outbreak id is required for incident management team member builder"
                        )
                    );

                return getIncidentManagementTeamWithOptions(id, eventTrackerDetails, {
                    roleRepository: this.options.roleRepository,
                    teamMemberRepository: this.options.teamMemberRepository,
                    incidentManagementTeamRepository: this.options.incidentManagementTeamRepository,
                });
            default:
                return Future.error(new Error("Form type not supported"));
        }
    }
}
