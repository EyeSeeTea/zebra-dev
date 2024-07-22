import {
    DiseaseOutbreakEvent,
    DiseaseOutbreakEventBaseAttrs,
} from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../../../domain/entities/generic/Future";
import { Id, ConfigLabel } from "../../../domain/entities/Ref";
import { DiseaseOutbreakEventRepository } from "../../../domain/repositories/DiseaseOutbreakEventRepository";
import { FutureData } from "../../api-futures";

export class DiseaseOutbreakEventTestRepository implements DiseaseOutbreakEventRepository {
    get(id: Id): FutureData<DiseaseOutbreakEventBaseAttrs> {
        return Future.success({
            id: id,
            name: "Disease Outbreak 1",
            created: new Date(),
            lastUpdated: new Date(),
            createdByName: "createdByName",
            hazardType: "Biological:Animal",
            mainSyndromeId: "1",
            suspectedDiseaseId: "1",
            notificationSourceId: "1",
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
    getAll(): FutureData<DiseaseOutbreakEvent[]> {
        throw new Error("Method not implemented.");
    }
    save(_diseaseOutbreak: DiseaseOutbreakEvent): FutureData<void> {
        throw new Error("Method not implemented.");
    }
    delete(_id: Id): FutureData<void> {
        throw new Error("Method not implemented.");
    }
    getConfigStrings(): FutureData<ConfigLabel[]> {
        throw new Error("Method not implemented.");
    }
}
