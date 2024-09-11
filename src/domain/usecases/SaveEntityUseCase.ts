import { FutureData } from "../../data/api-futures";
import { ConfigurableForm } from "../entities/ConfigurableForm";
import { Future } from "../entities/generic/Future";
import { Id } from "../entities/Ref";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";
import { RiskAssessmentRepository } from "../repositories/RiskAssessmentRepository";
import { saveDiseaseOutbreak } from "./utils/disease-outbreak/SaveDiseaseOutbreak";

export class SaveEntityUseCase {
    constructor(
        private diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository,
        private riskAssessmentRepository: RiskAssessmentRepository
    ) {}

    public execute(formData: ConfigurableForm): FutureData<void | Id> {
        if (!formData || !formData.entity) return Future.error(new Error("No form data found"));
        switch (formData.type) {
            case "disease-outbreak-event":
                return saveDiseaseOutbreak(this.diseaseOutbreakEventRepository, formData.entity);
            case "risk-assessment-grading":
            case "risk-assessment-summary":
            case "risk-assessment-questionnaire":
                return this.riskAssessmentRepository.saveRiskAssessment(
                    formData,
                    formData.eventTrackerDetails.id
                );

            default:
                return Future.error(new Error("Form type not supported"));
        }
    }
}
