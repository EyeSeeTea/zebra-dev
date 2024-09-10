import { FutureData } from "../../data/api-futures";
import { Maybe } from "../../utils/ts-utils";
import { EventTrackerDetails } from "../../webapp/contexts/current-event-tracker-context";
import { FormType } from "../../webapp/pages/form-page/FormPage";
import { ConfigurableForm } from "../entities/ConfigurableForm";
import { DiseaseOutbreakEvent } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../entities/generic/Future";
import { Id } from "../entities/Ref";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";
import { OptionsRepository } from "../repositories/OptionsRepository";
import { TeamMemberRepository } from "../repositories/TeamMemberRepository";
import { getDiseaseOutbreakWithEventOptions } from "./utils/disease-outbreak/GetDiseaseOutbreakWithOptions";
import {
    getRiskAssessmentGradingWithOptions,
    getRiskAssessmentSummaryWithOptions,
} from "./utils/risk-assessment/GetRiskAssessmentWithOptions";

export class GetEntityWithOptionsUseCase {
    constructor(
        private options: {
            diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
            optionsRepository: OptionsRepository;
            teamMemberRepository: TeamMemberRepository;
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

            default:
                return Future.error(new Error("Form type not supported"));
        }
    }
}
