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

type NestedKeyOf<ObjectType extends object> = {
    [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
        ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
        : Key;
}[keyof ObjectType & (string | number)];

type PropertyKeyAttributeCodeMap = {
    propertyKey: NestedKeyOf<DiseaseOutbreakEvent>;
    code: string;
};

const DISEASEOUTBREAKEVENT_PROPERTY_MAP: PropertyKeyAttributeCodeMap[] = [
    { propertyKey: "name", code: "RTSL_ZEB_TEA_EVENT_NAME" },
    { propertyKey: "hazardType", code: "RTSL_ZEB_TEA_HAZARD_TYPE" },
    { propertyKey: "mainSyndrome", code: "RTSL_ZEB_TEA_MAIN_SYNDROME" },
    { propertyKey: "suspectedDisease", code: "RTSL_ZEB_TEA_SUSPECTED_DISEASE" },
    { propertyKey: "notificationSource", code: "RTSL_ZEB_TEA_NOTIFICATION_SOURCE" },
    { propertyKey: "areasAffectedProvinces", code: "RTSL_ZEB_TEA_AREAS_AFFECTED_PROVINCES" },
    { propertyKey: "areasAffectedDistricts", code: "RTSL_ZEB_TEA_AREAS_AFFECTED_DISTRICTS" },
    { propertyKey: "incidentStatus", code: "RTSL_ZEB_TEA_INCIDENT_STATUS" },
    { propertyKey: "emerged.date", code: "RTSL_ZEB_TEA_DATE_EMERGED" },
    { propertyKey: "emerged.narrative", code: "RTSL_ZEB_TEA_DATE_EMERGED_NARRATIVE" },
    { propertyKey: "detected.date", code: "RTSL_ZEB_TEA_DATE_DETECTED" },
    { propertyKey: "detected.narrative", code: "RTSL_ZEB_TEA_DATE_DETECTED_NARRATIVE" },
    { propertyKey: "notified.date", code: "RTSL_ZEB_TEA_DATE_NOTIFIED" },
    { propertyKey: "notified.narrative", code: "RTSL_ZEB_TEA_DATE_NOTIFIED_NARRATIVE" },
    {
        propertyKey: "earlyResponseActions.initiateInvestigation",
        code: "RTSL_ZEB_TEA_INITIATE_INVESTIGATION",
    },
    {
        propertyKey: "earlyResponseActions.conductEpidemiologicalAnalysis",
        code: "RTSL_ZEB_TEA_CONDUCT_EPIDEMIOLOGICAL_ANALYSIS",
    },
    {
        propertyKey: "earlyResponseActions.laboratoryConfirmation.na",
        code: "RTSL_ZEB_TEA_LABORATORY_CONFIRMATION",
    },
    {
        propertyKey: "earlyResponseActions.laboratoryConfirmation.date",
        code: "RTSL_ZEB_TEA_SPECIFY_DATE1",
    },
    {
        propertyKey: "earlyResponseActions.appropriateCaseManagement.na",
        code: "RTSL_ZEB_TEA_APPROPRIATE_CASE_MANAGEMENT",
    },
    {
        propertyKey: "earlyResponseActions.appropriateCaseManagement.date",
        code: "RTSL_ZEB_TEA_SPECIFY_DATE2",
    },
    {
        propertyKey: "earlyResponseActions.initiateRiskCommunication.na",
        code: "RTSL_ZEB_TEA_APPROPRIATE_RISK_COMMUNICATION",
    },
    {
        propertyKey: "earlyResponseActions.initiateRiskCommunication.date",
        code: "RTSL_ZEB_TEA_SPECIFY_DATE4",
    },
    {
        propertyKey: "earlyResponseActions.establishCoordination",
        code: "RTSL_ZEB_TEA_ESTABLISH_COORDINATION_MECHANISM",
    },
    {
        propertyKey: "earlyResponseActions.responseNarrative",
        code: "RTSL_ZEB_TEA_RESPONSE_NARRATIVE",
    },
    {
        propertyKey: "incidentManager",
        code: "RTSL_ZEB_TEA_ASSIGN_INCIDENT_MANAGER",
    },
    {
        propertyKey: "notes",
        code: "RTSL_ZEB_TEA_NOTES",
    },
];

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
        // Hardcoded values for DiseaseOutbreakEvent properties
        id: trackedEntity.trackedEntity,
        name: getValueFromMap("name", trackedEntity) || "",
        created: new Date(getValueFromMap("created", trackedEntity) || ""),
        lastUpdated: new Date(getValueFromMap("lastUpdated", trackedEntity) || ""),
        createdBy: undefined,
        hazardType: getValueFromMap("hazardType", trackedEntity) as HazardType,
        mainSyndrome: {
            id: getValueFromMap("mainSyndrome", trackedEntity) || "",
            code: "",
            name: "",
        }, //TO DO : Option set not yet created
        suspectedDisease: {
            id: getValueFromMap("suspectedDisease", trackedEntity) || "",
            code: "",
            name: "",
        }, //TO DO : Option set not yet created
        notificationSource: {
            id: getValueFromMap("notificationSource", trackedEntity) || "",
            code: "",
            name: "",
        }, //TO DO : Option set not yet created
        areasAffectedProvinces: [
            {
                id: getValueFromMap("areasAffectedProvinces", trackedEntity) || "",
                code: "",
                name: "",
            },
        ],
        areasAffectedDistricts: [
            {
                id: getValueFromMap("areasAffectedDistricts", trackedEntity) || "",
                code: "",
                name: "",
            },
        ],
        incidentStatus: getValueFromMap("incidentStatus", trackedEntity) as IncidentStatusType,
        emerged: {
            date: new Date(getValueFromMap("emerged.date", trackedEntity) || ""),
            narrative: getValueFromMap("emerged.narrative", trackedEntity) || "",
        },
        detected: {
            date: new Date(getValueFromMap("detected.date", trackedEntity) || ""),
            narrative: getValueFromMap("detected.narrative", trackedEntity) || "",
        },
        notified: {
            date: new Date(getValueFromMap("notified.date", trackedEntity) || ""),
            narrative: getValueFromMap("notified.narrative", trackedEntity) || "",
        },
        incidentManager: new TeamMember({
            id: getValueFromMap("incidentManager", trackedEntity) || "",
            name: "",
            phone: undefined,
            email: undefined,
            status: undefined,
            role: undefined,
            photo: undefined,
        }),
        earlyResponseActions: {
            initiateInvestigation: new Date(
                getValueFromMap("earlyResponseActions.initiateInvestigation", trackedEntity) || ""
            ),
            conductEpidemiologicalAnalysis: new Date(
                getValueFromMap(
                    "earlyResponseActions.conductEpidemiologicalAnalysis",
                    trackedEntity
                ) || ""
            ),
            laboratoryConfirmation: {
                date: new Date(
                    getValueFromMap(
                        "earlyResponseActions.laboratoryConfirmation.date",
                        trackedEntity
                    ) || ""
                ),
                na:
                    getValueFromMap(
                        "earlyResponseActions.laboratoryConfirmation.na",
                        trackedEntity
                    ) === "true"
                        ? true
                        : false || false,
            },
            appropriateCaseManagement: {
                date: new Date(
                    getValueFromMap(
                        "earlyResponseActions.appropriateCaseManagement.date",
                        trackedEntity
                    ) || ""
                ),
                na:
                    getValueFromMap(
                        "earlyResponseActions.appropriateCaseManagement.na",
                        trackedEntity
                    ) === "true"
                        ? true
                        : false || false,
            },
            initiatePublicHealthCounterMeasures: {
                date: new Date(
                    getValueFromMap(
                        "earlyResponseActions.initiatePublicHealthCounterMeasures.date",
                        trackedEntity
                    ) || ""
                ),
                na:
                    getValueFromMap(
                        "earlyResponseActions.initiatePublicHealthCounterMeasures.na",
                        trackedEntity
                    ) === "true"
                        ? true
                        : false || false,
            },
            initiateRiskCommunication: {
                date: new Date(
                    getValueFromMap(
                        "earlyResponseActions.initiateRiskCommunication.date",
                        trackedEntity
                    ) || ""
                ),
                na:
                    getValueFromMap(
                        "earlyResponseActions.initiateRiskCommunication.na",
                        trackedEntity
                    ) === "true"
                        ? true
                        : false || false,
            },
            establishCoordination: new Date(
                getValueFromMap("earlyResponseActions.establishCoordination", trackedEntity) || ""
            ),
            responseNarrative:
                getValueFromMap("earlyResponseActions.responseNarrative", trackedEntity) || "",
        },
        notes: getValueFromMap("notes", trackedEntity) || "",
        riskAssessments: undefined,
        incidentActionPlan: undefined,
        incidentManagementTeam: undefined,
    });

    return diseaseOutbreak;
}

function getValueFromMap(
    key: NestedKeyOf<DiseaseOutbreakEvent>,
    trackedEntity: D2TrackerTrackedEntity
) {
    const propertyMap = DISEASEOUTBREAKEVENT_PROPERTY_MAP.find(map => map.propertyKey === key);
    if (!propertyMap) return undefined;
    return trackedEntity.attributes?.find(a => a.code === propertyMap.code)?.value;
}
