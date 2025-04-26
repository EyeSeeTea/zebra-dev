import { OutbreakData } from "../../../domain/entities/alert/OutbreakAlert";
import {
    CasesDataSource,
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
            created: new Date(),
            lastUpdated: new Date(),
            createdByName: "createdByName",
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
            casesDataSource: CasesDataSource.RTSL_ZEB_OS_CASE_DATA_SOURCE_eIDSR,
        });
    }
    getAll(): FutureData<DiseaseOutbreakEventBaseAttrs[]> {
        return Future.success([
            {
                id: "1",
                status: "ACTIVE",
                name: "Disease Outbreak 1",
                created: new Date(),
                lastUpdated: new Date(),
                createdByName: "createdByName",
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
                casesDataSource: CasesDataSource.RTSL_ZEB_OS_CASE_DATA_SOURCE_eIDSR,
            },
            {
                id: "2",
                status: "ACTIVE",
                name: "Disease Outbreak 2",
                created: new Date(),
                lastUpdated: new Date(),
                createdByName: "createdByName2",
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
                casesDataSource: CasesDataSource.RTSL_ZEB_OS_CASE_DATA_SOURCE_eIDSR,
            },
        ]);
    }
    getEventByDisease(_filter: OutbreakData): FutureData<DiseaseOutbreakEventBaseAttrs[]> {
        return Future.success([
            {
                id: "1",
                name: "Disease Outbreak 1",
                created: new Date(),
                lastUpdated: new Date(),
                createdByName: "createdByName",
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
                status: "ACTIVE",
                casesDataSource: CasesDataSource.RTSL_ZEB_OS_CASE_DATA_SOURCE_eIDSR,
            },
            {
                id: "2",
                name: "Disease Outbreak 2",
                created: new Date(),
                lastUpdated: new Date(),
                createdByName: "createdByName2",
                mainSyndromeCode: "2",
                suspectedDiseaseCode: undefined,
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
                status: "COMPLETED",
                casesDataSource: CasesDataSource.RTSL_ZEB_OS_CASE_DATA_SOURCE_eIDSR,
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
