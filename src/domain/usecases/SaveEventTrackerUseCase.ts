import { FutureData } from "../../data/api-futures";
import { EventTracker } from "../entities/event-tracker/EventTracker";
import { EventTrackerRepository } from "../repositories/EventTrackerRepository";

export class SaveEventTrackerUseCase {
    constructor(private eventTrackerRepository: EventTrackerRepository) {}

    public execute(): FutureData<void> {
        //To DO : remove hardcoding
        const diseaseOutbreakbase: EventTracker = {
            id: "",
            eventId: 11,
            name: "Save Outbreak",
            created: new Date(),
            lastUpdated: new Date(),
            createdByName: "createdByName",
            hazardType: "Biological:Animal",
            mainSyndromeCode: "",
            suspectedDiseaseCode: "",
            notificationSourceCode: "",
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
        return this.eventTrackerRepository.save(diseaseOutbreakbase);
    }
}
