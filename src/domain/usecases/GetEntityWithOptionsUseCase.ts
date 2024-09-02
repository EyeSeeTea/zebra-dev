import { FutureData } from "../../data/api-futures";
import { Maybe } from "../../utils/ts-utils";
import { FormType } from "../../webapp/pages/form-page/FormPage";
import { ConfigurableForm } from "../entities/ConfigurableForm";
import { Future } from "../entities/generic/Future";
import { Id } from "../entities/Ref";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";
import { OptionsRepository } from "../repositories/OptionsRepository";
import { TeamMemberRepository } from "../repositories/TeamMemberRepository";
import { getDiseaseOutbreakWithEventOptions } from "./utils/disease-outbreak/GetDiseaseOutbreakWithOptions";
import { getRiskGradingWithOptions } from "./utils/risk-assessment/GetRiskGradingWithOptions";

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
        diseaseOutbreakId: Maybe<Id>,
        id?: Id
    ): FutureData<ConfigurableForm> {
        switch (formType) {
            case "disease-outbreak-event":
                return getDiseaseOutbreakWithEventOptions(this.options, id);
            case "risk-assessment-grading":
                if (!diseaseOutbreakId)
                    return Future.error(
                        new Error("Disease outbreak id is required for risk grading")
                    );
                return getRiskGradingWithOptions(this.options.optionsRepository, diseaseOutbreakId);
            default:
                return Future.error(new Error("Form type not supported"));
        }
    }
}
