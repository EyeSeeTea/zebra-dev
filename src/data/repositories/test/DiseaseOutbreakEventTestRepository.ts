import { DiseaseOutbreakEvent } from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../../../domain/entities/generic/Future";
import { TeamMember } from "../../../domain/entities/incident-management-team/TeamMember";
import { Id, ConfigLabel } from "../../../domain/entities/Ref";
import { DiseaseOutbreakEventRepository } from "../../../domain/repositories/DiseaseOutbreakEventRepository";
import { FutureData } from "../../api-futures";

export class DiseaseOutbreakEventTestRepository implements DiseaseOutbreakEventRepository {
    get(id: Id): FutureData<DiseaseOutbreakEvent> {
        return Future.success(
            new DiseaseOutbreakEvent({
                id: id,
                name: "Disease Outbreak 1",
                created: new Date(),
                lastUpdated: new Date(),
                createdBy: undefined,
                hazardType: "Biological:Animal",
                mainSyndrome: { id: "1", name: "Syndrome 1" },
                suspectedDisease: { id: "1", name: "Suspected Disease 1" },
                notificationSource: { id: "1", name: "Notification Source 1" },
                areasAffectedProvinces: [],
                areasAffectedDistricts: [],
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
                incidentManager: new TeamMember({
                    id: "1",
                    name: "incidentManager",
                    email: "",
                    phone: "",
                    role: { id: "1", name: "role" },
                    status: "Available",
                    photo: undefined,
                }),
                notes: undefined,
                riskAssessments: [],
                incidentActionPlan: undefined,
                incidentManagementTeam: undefined,
            })
        );
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
    // getOptions(): FutureData<DiseaseOutbreakEventOption[]> {
    //     throw new Error("Method not implemented.");
    // }
    getConfigStrings(): FutureData<ConfigLabel[]> {
        throw new Error("Method not implemented.");
    }
}
