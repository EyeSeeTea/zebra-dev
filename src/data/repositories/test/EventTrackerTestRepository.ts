import { DiseaseOutbreakEvent } from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { EventTracker } from "../../../domain/entities/event-tracker/EventTracker";
import { Future } from "../../../domain/entities/generic/Future";
import { Id } from "../../../domain/entities/Ref";
import { EventTrackerRepository } from "../../../domain/repositories/EventTrackerRepository";
import { FutureData } from "../../api-futures";

export class EventTrackerTestRepository implements EventTrackerRepository {
    get(id: Id): FutureData<EventTracker> {
        return Future.success({
            id: id,
            eventId: 11,
            name: "Disease Outbreak 1",
            created: new Date(),
            lastUpdated: new Date(),
            createdByName: "createdByName",
            hazardType: "Biological:Animal",
            mainSyndromeCode: "1",
            suspectedDiseaseCode: "1",
            notificationSourceCode: "1",
            areasAffectedDistrictIds: [],
            areasAffectedProvinceIds: [],
            incidentStatus: "Watch",
            emerged: { date: new Date(), narrative: "emerged" },
            detected: { date: new Date(), narrative: "detected" },
            notified: { date: new Date(), narrative: "notified" },
            earlyResponseActions: {
                initiateInvestigation: new Date(),
                conductEpidemiologicalAnalysis: new Date(),
                laboratoryConfirmation: { date: new Date(), na: false },
                appropriateCaseManagement: { date: new Date(), na: false },
                initiatePublicHealthCounterMeasures: { date: new Date(), na: false },
                initiateRiskCommunication: { date: new Date(), na: false },
                establishCoordination: new Date(),
                responseNarrative: "responseNarrative",
            },
            incidentManagerName: "incidentManager",
            notes: undefined,
        });
    }
    getAll(): FutureData<EventTracker[]> {
        return Future.success([
            {
                id: "1",
                eventId: 11,
                name: "Disease Outbreak 1",
                created: new Date(),
                lastUpdated: new Date(),
                createdByName: "createdByName",
                hazardType: "Biological:Animal",
                mainSyndromeCode: "1",
                suspectedDiseaseCode: "1",
                notificationSourceCode: "1",
                areasAffectedDistrictIds: [],
                areasAffectedProvinceIds: [],
                incidentStatus: "Watch",
                emerged: { date: new Date(), narrative: "emerged" },
                detected: { date: new Date(), narrative: "detected" },
                notified: { date: new Date(), narrative: "notified" },
                earlyResponseActions: {
                    initiateInvestigation: new Date(),
                    conductEpidemiologicalAnalysis: new Date(),
                    laboratoryConfirmation: { date: new Date(), na: false },
                    appropriateCaseManagement: { date: new Date(), na: false },
                    initiatePublicHealthCounterMeasures: { date: new Date(), na: false },
                    initiateRiskCommunication: { date: new Date(), na: false },
                    establishCoordination: new Date(),
                    responseNarrative: "responseNarrative",
                },
                incidentManagerName: "incidentManager",
                notes: undefined,
            },
            {
                id: "2",
                eventId: 22,
                name: "Disease Outbreak 2",
                created: new Date(),
                lastUpdated: new Date(),
                createdByName: "createdByName2",
                hazardType: "Biological:Animal",
                mainSyndromeCode: "2",
                suspectedDiseaseCode: "2",
                notificationSourceCode: "2",
                areasAffectedDistrictIds: [],
                areasAffectedProvinceIds: [],
                incidentStatus: "Watch",
                emerged: { date: new Date(), narrative: "emerged" },
                detected: { date: new Date(), narrative: "detected" },
                notified: { date: new Date(), narrative: "notified" },
                earlyResponseActions: {
                    initiateInvestigation: new Date(),
                    conductEpidemiologicalAnalysis: new Date(),
                    laboratoryConfirmation: { date: new Date(), na: false },
                    appropriateCaseManagement: { date: new Date(), na: false },
                    initiatePublicHealthCounterMeasures: { date: new Date(), na: false },
                    initiateRiskCommunication: { date: new Date(), na: false },
                    establishCoordination: new Date(),
                    responseNarrative: "responseNarrative",
                },
                incidentManagerName: "incidentManager",
                notes: undefined,
            },
        ]);
    }
    save(_diseaseOutbreak: DiseaseOutbreakEvent): FutureData<void> {
        return Future.success(undefined);
    }
    delete(_id: Id): FutureData<void> {
        throw new Error("Method not implemented.");
    }
}
