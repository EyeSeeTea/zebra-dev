import { D2Api } from "@eyeseetea/d2-api/2.36";
import { Id } from "../../../domain/entities/Ref";
import { apiToFuture, FutureData } from "../../api-futures";
import {
    DiseaseOutbreakEvent,
    HazardType,
    IncidentStatusType,
} from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import { TeamMember } from "../../../domain/entities/incident-management-team/TeamMember";

const DiseaseOutbreakCodes = {
    name: "RTSL_ZEB_TEA_EVENT_NAME",
    hazardType: "RTSL_ZEB_TEA_HAZARD_TYPE",
    mainSyndrome: "RTSL_ZEB_TEA_MAIN_SYNDROME",
    suspectedDisease: "RTSL_ZEB_TEA_SUSPECTED_DISEASE",
    notificationSource: "RTSL_ZEB_TEA_NOTIFICATION_SOURCE",
    areasAffectedProvinces: "RTSL_ZEB_TEA_AREAS_AFFECTED_PROVINCES",
    areasAffectedDistricts: "RTSL_ZEB_TEA_AREAS_AFFECTED_DISTRICTS",
    incidentStatus: "RTSL_ZEB_TEA_INCIDENT_STATUS",
    emergedDate: "RTSL_ZEB_TEA_DATE_EMERGED",
    emergedNarrative: "RTSL_ZEB_TEA_DATE_EMERGED_NARRATIVE",
    detectedDate: "RTSL_ZEB_TEA_DATE_DETECTED",
    detectedNarrative: "RTSL_ZEB_TEA_DATE_DETECTED_NARRATIVE",
    notifiedDate: "RTSL_ZEB_TEA_DATE_NOTIFIED",
    notifiedNarrative: "RTSL_ZEB_TEA_DATE_NOTIFIED_NARRATIVE",
    initiateInvestigation: "RTSL_ZEB_TEA_INITIATE_INVESTIGATION",
    conductEpidemiologicalAnalysis: "RTSL_ZEB_TEA_CONDUCT_EPIDEMIOLOGICAL_ANALYSIS",
    laboratoryConfirmationNA: "RTSL_ZEB_TEA_LABORATORY_CONFIRMATION",
    laboratoryConfirmationDate: "RTSL_ZEB_TEA_SPECIFY_DATE1",
    appropriateCaseManagementNA: "RTSL_ZEB_TEA_APPROPRIATE_CASE_MANAGEMENT",
    appropriateCaseManagementDate: "RTSL_ZEB_TEA_SPECIFY_DATE2",
    initiateRiskCommunicationNA: "RTSL_ZEB_TEA_APPROPRIATE_RISK_COMMUNICATION",
    initiateRiskCommunicationDate: "RTSL_ZEB_TEA_SPECIFY_DATE4",
    establishCoordination: "RTSL_ZEB_TEA_ESTABLISH_COORDINATION_MECHANISM",
    responseNarrative: "RTSL_ZEB_TEA_RESPONSE_NARRATIVE",
    incidentManager: "RTSL_ZEB_TEA_ASSIGN_INCIDENT_MANAGER",
    notes: "RTSL_ZEB_TEA_NOTES",
} as const;

export function getTrackerEntityAttributes(
    api: D2Api,
    programId: Id,
    orgUnitId: Id,
    trackedEntityId: Id
): FutureData<DiseaseOutbreakEvent> {
    return apiToFuture(
        api.tracker.trackedEntities.get({
            program: programId,
            orgUnit: orgUnitId,
            trackedEntity: trackedEntityId,
            fields: { attributes: true, trackedEntity: true },
        })
    ).map(trackedEntity => {
        if (!trackedEntity.instances[0]) throw new Error("Tracked entity not found");
        return mapTrackedEntityAttributesToDiseaseOutbreak(trackedEntity.instances[0]);
    });
}

function mapTrackedEntityAttributesToDiseaseOutbreak(
    trackedEntity: D2TrackerTrackedEntity
): DiseaseOutbreakEvent {
    if (!trackedEntity.trackedEntity) throw new Error("Tracked entity not found");

    const diseaseOutbreak: DiseaseOutbreakEvent = new DiseaseOutbreakEvent({
        id: trackedEntity.trackedEntity,
        name: getValueFromMap("name", trackedEntity),
        created: trackedEntity.createdAt ? new Date(trackedEntity.createdAt) : new Date(),
        lastUpdated: trackedEntity.updatedAt ? new Date(trackedEntity.updatedAt) : new Date(),
        createdBy: undefined,
        hazardType: getValueFromMap("hazardType", trackedEntity) as HazardType,
        mainSyndrome: {
            id: getValueFromMap("mainSyndrome", trackedEntity),
            name: "",
        },
        suspectedDisease: {
            id: getValueFromMap("suspectedDisease", trackedEntity),
            name: "",
        },
        notificationSource: {
            id: getValueFromMap("notificationSource", trackedEntity),
            name: "",
        },
        areasAffectedProvinces: [
            //TO DO : handle multiple provinces when metadata change is done
            {
                id: getValueFromMap("areasAffectedProvinces", trackedEntity),
                code: "",
                name: "",
            },
        ],
        areasAffectedDistricts: [
            //TO DO : handle multiple provinces when metadata change is done
            {
                id: getValueFromMap("areasAffectedDistricts", trackedEntity),
                code: "",
                name: "",
            },
        ],
        incidentStatus: getValueFromMap("incidentStatus", trackedEntity) as IncidentStatusType,
        emerged: {
            date: new Date(getValueFromMap("emergedDate", trackedEntity)),
            narrative: getValueFromMap("emergedNarrative", trackedEntity),
        },
        detected: {
            date: new Date(getValueFromMap("detectedDate", trackedEntity)),
            narrative: getValueFromMap("detectedNarrative", trackedEntity),
        },
        notified: {
            date: new Date(getValueFromMap("notifiedDate", trackedEntity)),
            narrative: getValueFromMap("notifiedNarrative", trackedEntity),
        },
        incidentManager: new TeamMember({
            id: getValueFromMap("incidentManager", trackedEntity),
            name: "",
            phone: undefined,
            email: undefined,
            status: undefined,
            role: undefined,
            photo: undefined,
        }),
        earlyResponseActions: {
            initiateInvestigation: new Date(
                getValueFromMap("initiateInvestigation", trackedEntity)
            ),
            conductEpidemiologicalAnalysis: new Date(
                getValueFromMap("conductEpidemiologicalAnalysis", trackedEntity)
            ),
            laboratoryConfirmation: {
                date: new Date(getValueFromMap("laboratoryConfirmationDate", trackedEntity)),
                na: getValueFromMap("laboratoryConfirmationNA", trackedEntity) === "true",
            },
            appropriateCaseManagement: {
                date: new Date(getValueFromMap("appropriateCaseManagementDate", trackedEntity)),
                na: getValueFromMap("appropriateCaseManagementNA", trackedEntity) === "true",
            },
            initiatePublicHealthCounterMeasures: {
                date: new Date(getValueFromMap("initiateRiskCommunicationDate", trackedEntity)),
                na: getValueFromMap("initiateRiskCommunicationNA", trackedEntity) === "true",
            },
            initiateRiskCommunication: {
                date: new Date(getValueFromMap("initiateRiskCommunicationDate", trackedEntity)),
                na: getValueFromMap("initiateRiskCommunicationNA", trackedEntity) === "true",
            },
            establishCoordination: new Date(
                getValueFromMap("establishCoordination", trackedEntity)
            ),
            responseNarrative: getValueFromMap("responseNarrative", trackedEntity),
        },
        notes: getValueFromMap("notes", trackedEntity),
        riskAssessments: undefined,
        incidentActionPlan: undefined,
        incidentManagementTeam: undefined,
    });

    return diseaseOutbreak;
}

function getValueFromMap(
    key: keyof typeof DiseaseOutbreakCodes,
    trackedEntity: D2TrackerTrackedEntity
): string {
    return trackedEntity.attributes?.find(a => a.code === DiseaseOutbreakCodes[key])?.value ?? "";
}
