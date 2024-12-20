import {
    DataSource,
    DiseaseOutbreakEvent,
    DiseaseOutbreakEventBaseAttrs,
    NationalIncidentStatus,
} from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../../../domain/entities/generic/Future";
import { Id, ConfigLabel } from "../../../domain/entities/Ref";
import { DiseaseOutbreakEventRepository } from "../../../domain/repositories/DiseaseOutbreakEventRepository";
import { FutureData } from "../../api-futures";

export class DiseaseOutbreakEventTestRepository implements DiseaseOutbreakEventRepository {
    complete(_id: Id): FutureData<void> {
        return Future.success(undefined);
    }
    get(id: Id): FutureData<DiseaseOutbreakEventBaseAttrs> {
        return Future.success({
            id: id,
            status: "ACTIVE",
            name: "Disease Outbreak 1",
            dataSource: DataSource.RTSL_ZEB_OS_DATA_SOURCE_EBS,
            created: new Date(),
            lastUpdated: new Date(),
            createdByName: "createdByName",
            hazardType: "Biological:Animal",
            mainSyndromeCode: undefined,
            suspectedDiseaseCode: undefined,
            notificationSourceCode: "1",
            areasAffectedDistrictIds: [],
            areasAffectedProvinceIds: [],
            incidentStatus: NationalIncidentStatus.RTSL_ZEB_OS_INCIDENT_STATUS_WATCH,
            emerged: { date: new Date(), narrative: "emerged" },
            detected: { date: new Date(), narrative: "detected" },
            notified: { date: new Date(), narrative: "notified" },
            earlyResponseActions: {
                initiateInvestigation: new Date(),
                conductEpidemiologicalAnalysis: new Date(),
                laboratoryConfirmation: new Date(),
                appropriateCaseManagement: { date: new Date(), na: false },
                initiatePublicHealthCounterMeasures: { date: new Date(), na: false },
                initiateRiskCommunication: { date: new Date(), na: false },
                establishCoordination: { date: new Date(), na: false },
                responseNarrative: "responseNarrative",
            },
            incidentManagerName: "incidentManager",
            notes: undefined,
        });
    }
    getAll(): FutureData<DiseaseOutbreakEventBaseAttrs[]> {
        return Future.success([
            {
                id: "1",
                status: "ACTIVE",
                name: "Disease Outbreak 1",
                dataSource: DataSource.RTSL_ZEB_OS_DATA_SOURCE_EBS,
                created: new Date(),
                lastUpdated: new Date(),
                createdByName: "createdByName",
                hazardType: "Biological:Animal",
                mainSyndromeCode: undefined,
                suspectedDiseaseCode: undefined,
                notificationSourceCode: "1",
                areasAffectedDistrictIds: [],
                areasAffectedProvinceIds: [],
                incidentStatus: NationalIncidentStatus.RTSL_ZEB_OS_INCIDENT_STATUS_WATCH,
                emerged: { date: new Date(), narrative: "emerged" },
                detected: { date: new Date(), narrative: "detected" },
                notified: { date: new Date(), narrative: "notified" },
                earlyResponseActions: {
                    initiateInvestigation: new Date(),
                    conductEpidemiologicalAnalysis: new Date(),
                    laboratoryConfirmation: new Date(),
                    appropriateCaseManagement: { date: new Date(), na: false },
                    initiatePublicHealthCounterMeasures: { date: new Date(), na: false },
                    initiateRiskCommunication: { date: new Date(), na: false },
                    establishCoordination: { date: new Date(), na: false },
                    responseNarrative: "responseNarrative",
                },
                incidentManagerName: "incidentManager",
                notes: undefined,
            },
            {
                id: "2",
                status: "ACTIVE",
                name: "Disease Outbreak 2",
                dataSource: DataSource.RTSL_ZEB_OS_DATA_SOURCE_IBS,
                created: new Date(),
                lastUpdated: new Date(),
                createdByName: "createdByName2",
                hazardType: undefined,
                mainSyndromeCode: "2",
                suspectedDiseaseCode: "2",
                notificationSourceCode: "2",
                areasAffectedDistrictIds: [],
                areasAffectedProvinceIds: [],
                incidentStatus: NationalIncidentStatus.RTSL_ZEB_OS_INCIDENT_STATUS_WATCH,
                emerged: { date: new Date(), narrative: "emerged" },
                detected: { date: new Date(), narrative: "detected" },
                notified: { date: new Date(), narrative: "notified" },
                earlyResponseActions: {
                    initiateInvestigation: new Date(),
                    conductEpidemiologicalAnalysis: new Date(),
                    laboratoryConfirmation: new Date(),
                    appropriateCaseManagement: { date: new Date(), na: false },
                    initiatePublicHealthCounterMeasures: { date: new Date(), na: false },
                    initiateRiskCommunication: { date: new Date(), na: false },
                    establishCoordination: { date: new Date(), na: false },
                    responseNarrative: "responseNarrative",
                },
                incidentManagerName: "incidentManager",
                notes: undefined,
            },
        ]);
    }
    save(_diseaseOutbreak: DiseaseOutbreakEvent): FutureData<Id> {
        return Future.success("");
    }
    delete(_id: Id): FutureData<void> {
        throw new Error("Method not implemented.");
    }
    getConfigStrings(): FutureData<ConfigLabel[]> {
        throw new Error("Method not implemented.");
    }
}
