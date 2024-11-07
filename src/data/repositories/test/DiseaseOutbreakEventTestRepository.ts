import {
    DataSource,
    DiseaseOutbreakEventBaseAttrs,
    NationalIncidentStatus,
} from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import {
    DiseaseOutbreakEventAggregateRoot,
    IncidentManagementTeamInAggregateRoot,
} from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEventAggregateRoot";
import { Future } from "../../../domain/entities/generic/Future";
import { TeamMember, TeamRole } from "../../../domain/entities/TeamMember";
import { Id } from "../../../domain/entities/Ref";
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

    save(_diseaseOutbreak: DiseaseOutbreakEventBaseAttrs): FutureData<Id> {
        return Future.success("");
    }

    delete(_id: Id): FutureData<void> {
        throw new Error("Method not implemented.");
    }

    getIncidentManagementTeam(
        _diseaseOutbreakId: Id
    ): FutureData<IncidentManagementTeamInAggregateRoot> {
        return Future.success(
            new IncidentManagementTeamInAggregateRoot({
                teamHierarchy: [],
                lastUpdated: new Date(),
            })
        );
    }

    saveIncidentManagementTeamMemberRole(
        _teamMemberRole: TeamRole,
        _incidentManagementTeamMember: TeamMember,
        _diseaseOutbreakId: Id
    ): FutureData<void> {
        return Future.success(undefined);
    }

    deleteIncidentManagementTeamMemberRole(
        _diseaseOutbreakId: Id,
        _incidentManagementTeamRoleId: Id
    ): FutureData<void> {
        return Future.success(undefined);
    }

    getAggregateRoot(id: Id): FutureData<DiseaseOutbreakEventAggregateRoot> {
        return Future.success(
            new DiseaseOutbreakEventAggregateRoot({
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
                riskAssessment: undefined,
                incidentActionPlan: undefined,
                incidentManagementTeam: undefined,
            })
        );
    }

    deleteIncidentManagementTeamMemberRoles(
        _diseaseOutbreakId: Id,
        _incidentManagementTeamRoleIds: Id[]
    ): FutureData<void> {
        return Future.success(undefined);
    }
}
