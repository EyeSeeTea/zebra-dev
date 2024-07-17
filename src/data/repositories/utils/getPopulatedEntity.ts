import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import { DiseaseOutbreakEvent } from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";

type NestedKeyOf<ObjectType extends object> = {
    [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
        ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
        : Key;
}[keyof ObjectType & (string | number)];

type PropertyKeyAttributeCodeMap = {
    propertyKey: NestedKeyOf<DiseaseOutbreakEvent>;
    code: string;
    type: "string" | "boolean" | "date" | "object" | "option" | "enum" | "id";
    subtype?: "string" | "boolean" | "date" | "object" | "option" | "enum" | "id";
};

const DISEASEOUTBREAKEVENT_PROPERTY_MAP: PropertyKeyAttributeCodeMap[] = [
    { propertyKey: "id", code: "", type: "id" },
    { propertyKey: "name", code: "RTSL_ZEB_TEA_EVENT_NAME", type: "string" },
    { propertyKey: "hazardType", code: "RTSL_ZEB_TEA_HAZARD_TYPE", type: "enum" },
    { propertyKey: "mainSyndrome", code: "RTSL_ZEB_TEA_MAIN_SYNDROME", type: "option" },
    { propertyKey: "suspectedDisease", code: "RTSL_ZEB_TEA_SUSPECTED_DISEASE", type: "option" },
    { propertyKey: "notificationSource", code: "RTSL_ZEB_TEA_NOTIFICATION_SOURCE", type: "option" },
    {
        propertyKey: "areasAffectedProvinces",
        code: "RTSL_ZEB_TEA_AREAS_AFFECTED_PROVINCES",
        type: "object",
    },
    {
        propertyKey: "areasAffectedDistricts",
        code: "RTSL_ZEB_TEA_AREAS_AFFECTED_DISTRICTS",
        type: "object",
    },
    { propertyKey: "incidentStatus", code: "RTSL_ZEB_TEA_INCIDENT_STATUS", type: "enum" },
    { propertyKey: "emerged.date", code: "RTSL_ZEB_TEA_DATE_EMERGED", type: "date" },
    {
        propertyKey: "emerged.narrative",
        code: "RTSL_ZEB_TEA_DATE_EMERGED_NARRATIVE",
        type: "string",
    },
    { propertyKey: "detected.date", code: "RTSL_ZEB_TEA_DATE_DETECTED", type: "date" },
    {
        propertyKey: "detected.narrative",
        code: "RTSL_ZEB_TEA_DATE_DETECTED_NARRATIVE",
        type: "string",
    },
    { propertyKey: "notified.date", code: "RTSL_ZEB_TEA_DATE_NOTIFIED", type: "date" },
    {
        propertyKey: "notified.narrative",
        code: "RTSL_ZEB_TEA_DATE_NOTIFIED_NARRATIVE",
        type: "string",
    },
    {
        propertyKey: "earlyResponseActions.initiateInvestigation",
        code: "RTSL_ZEB_TEA_INITIATE_INVESTIGATION",
        type: "date",
    },
    {
        propertyKey: "earlyResponseActions.conductEpidemiologicalAnalysis",
        code: "RTSL_ZEB_TEA_CONDUCT_EPIDEMIOLOGICAL_ANALYSIS",
        type: "date",
    },
    {
        propertyKey: "earlyResponseActions.laboratoryConfirmation.na",
        code: "RTSL_ZEB_TEA_LABORATORY_CONFIRMATION",
        type: "boolean",
    },
    {
        propertyKey: "earlyResponseActions.laboratoryConfirmation.date",
        code: "RTSL_ZEB_TEA_SPECIFY_DATE1",
        type: "date",
    },
    {
        propertyKey: "earlyResponseActions.appropriateCaseManagement.na",
        code: "RTSL_ZEB_TEA_APPROPRIATE_CASE_MANAGEMENT",
        type: "boolean",
    },
    {
        propertyKey: "earlyResponseActions.appropriateCaseManagement.date",
        code: "RTSL_ZEB_TEA_SPECIFY_DATE2",
        type: "date",
    },
    {
        propertyKey: "earlyResponseActions.initiateRiskCommunication.na",
        code: "RTSL_ZEB_TEA_APPROPRIATE_RISK_COMMUNICATION",
        type: "boolean",
    },
    {
        propertyKey: "earlyResponseActions.initiateRiskCommunication.date",
        code: "RTSL_ZEB_TEA_SPECIFY_DATE4",
        type: "date",
    },
    {
        propertyKey: "earlyResponseActions.establishCoordination",
        code: "RTSL_ZEB_TEA_ESTABLISH_COORDINATION_MECHANISM",
        type: "date",
    },
    {
        propertyKey: "earlyResponseActions.responseNarrative",
        code: "RTSL_ZEB_TEA_RESPONSE_NARRATIVE",
        type: "string",
    },
    {
        propertyKey: "incidentManager",
        code: "RTSL_ZEB_TEA_ASSIGN_INCIDENT_MANAGER",
        type: "object",
    },
    {
        propertyKey: "notes",
        code: "RTSL_ZEB_TEA_NOTES",
        type: "string",
    },
];
export function getPopulatedEntity(trackedEntity: D2TrackerTrackedEntity): DiseaseOutbreakEvent {
    const populatedDiseaseOutbreak: DiseaseOutbreakEvent = DiseaseOutbreakEvent.createEmpty();
    DISEASEOUTBREAKEVENT_PROPERTY_MAP.forEach(metadata => {
        const value = getValueFromMap(metadata.propertyKey, trackedEntity);
        switch (metadata.type) {
            case "id":
                // @ts-ignore
                populatedDiseaseOutbreak[metadata.propertyKey] = trackedEntity.trackedEntity;
                break;
            case "string":
                // @ts-ignore
                populatedDiseaseOutbreak[metadata.propertyKey] = value;
                break;
            case "boolean":
                // @ts-ignore
                populatedDiseaseOutbreak[metadata.propertyKey] = value === "true";
                break;
            case "date":
                // @ts-ignore
                populatedDiseaseOutbreak[metadata.propertyKey] = new Date(value);
                break;
            case "object":
                break;
            case "option":
                // @ts-ignore
                populatedDiseaseOutbreak[metadata.propertyKey]["id"] = value;
                break;
            case "enum":
                // @ts-ignore
                populatedDiseaseOutbreak[metadata.propertyKey] = value;
                break;
        }
    });

    // @ts-ignore
    return populatedDiseaseOutbreak;
}
export function getValueFromMap(
    key: NestedKeyOf<DiseaseOutbreakEvent>,
    trackedEntity: D2TrackerTrackedEntity
): string {
    const propertyMap = DISEASEOUTBREAKEVENT_PROPERTY_MAP.find(map => map.propertyKey === key);
    if (!propertyMap) return "";
    return trackedEntity.attributes?.find(a => a.code === propertyMap.code)?.value ?? "";
}
