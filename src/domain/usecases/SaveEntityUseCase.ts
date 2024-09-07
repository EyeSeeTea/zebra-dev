import { FutureData } from "../../data/api-futures";
import { ConfigurableForm } from "../entities/ConfigurableForm";
import { Future } from "../entities/generic/Future";
import { Id } from "../entities/Ref";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";
import { RiskAssessmentGradingRepository } from "../repositories/RiskAssessmentGradingRepository";
import { saveDiseaseOutbreak } from "./utils/disease-outbreak/SaveDiseaseOutbreak";
import { saveRiskAssessmentGrading } from "./utils/risk-assessment/SaveRiskAssessmentGrading";

export class SaveEntityUseCase {
    constructor(
        private diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository,
        private riskAssessmentGrading: RiskAssessmentGradingRepository
    ) {}

    public execute(formData: ConfigurableForm): FutureData<void | Id> {
        if (!formData || !formData.entity) return Future.error(new Error("No form data found"));
        switch (formData.type) {
            case "disease-outbreak-event":
                return saveDiseaseOutbreak(this.diseaseOutbreakEventRepository, formData.entity);
            case "risk-assessment-grading":
                return saveRiskAssessmentGrading(
                    this.riskAssessmentGrading,
                    formData.entity,
                    formData.diseaseOutbreakId
                );

            default:
                return Future.error(new Error("Form type not supported"));
        }
    }
}
