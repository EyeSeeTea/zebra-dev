import { FutureData } from "../../data/api-futures";
import { ConfigurableForm } from "../entities/ConfigurableForm";
import { Future } from "../entities/generic/Future";
import { Id } from "../entities/Ref";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";
import { IncidentActionRepository } from "../repositories/IncidentActionRepository";
import { RiskAssessmentRepository } from "../repositories/RiskAssessmentRepository";
import { saveDiseaseOutbreak } from "./utils/disease-outbreak/SaveDiseaseOutbreak";

export class SaveEntityUseCase {
    constructor(
        private options: {
            diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
            riskAssessmentRepository: RiskAssessmentRepository;
            incidentActionRepository: IncidentActionRepository;
        }
    ) {}

    public execute(formData: ConfigurableForm): FutureData<void | Id> {
        if (!formData || !formData.entity) return Future.error(new Error("No form data found"));
        switch (formData.type) {
            case "disease-outbreak-event":
                return saveDiseaseOutbreak(
                    this.options.diseaseOutbreakEventRepository,
                    formData.entity
                );
            case "risk-assessment-grading":
            case "risk-assessment-summary":
            case "risk-assessment-questionnaire":
                return this.options.riskAssessmentRepository.saveRiskAssessment(
                    formData,
                    formData.eventTrackerDetails.id
                );
            case "incident-action-plan":
            case "incident-response-action":
                return this.options.incidentActionRepository.saveIncidentAction(
                    formData,
                    formData.eventTrackerDetails.id
                );

            default:
                return Future.error(new Error("Form type not supported"));
        }
    }
}
