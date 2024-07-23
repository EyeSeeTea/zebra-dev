import { FutureData } from "../../data/api-futures";
import { DiseaseOutbreakEventBaseAttrs } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";

export class SaveDiseaseOutbreakUseCase {
    constructor(private diseaseOutbreakRepository: DiseaseOutbreakEventRepository) {}

    public execute(): FutureData<void> {
        //To DO : remove hardcoding
        const diseaseOutbreakbase: DiseaseOutbreakEventBaseAttrs = {
            id: "",
            eventId: 11,
            name: "Save Outbreak",
            created: new Date(),
            lastUpdated: new Date(),
            createdByName: "createdByName",
            hazardType: "Biological:Animal",
            mainSyndromeId: "",
            suspectedDiseaseId: "",
            notificationSourceId: "",
            areasAffectedDistrictIds: ["oEBf29y8JP8"],
            areasAffectedProvinceIds: ["AWn3s2RqgAN"],
            incidentStatus: "Watch",
            emerged: { date: new Date(), narrative: "emerged" },
            detected: { date: new Date(), narrative: "detected" },
            notified: { date: new Date(), narrative: "notified" },
            earlyResponseActions: {
                initiateInvestigation: new Date(),
                conductEpidemiologicalAnalysis: new Date(),
                laboratoryConfirmation: { date: new Date(), na: true },
                appropriateCaseManagement: { date: new Date(), na: true },
                initiatePublicHealthCounterMeasures: { date: new Date(), na: true },
                initiateRiskCommunication: { date: new Date(), na: true },
                establishCoordination: new Date(),
                responseNarrative: "responseNarrative",
            },
            incidentManagerName: "test",
            notes: "notes notes notes",
        };
        return this.diseaseOutbreakRepository.save(diseaseOutbreakbase);
    }
}
