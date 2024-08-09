import {
    DiseaseOutbreakEventBaseAttrs,
    HazardType,
    IncidentStatusType,
} from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { D2TrackerTrackedEntity, Attribute } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import {
    DiseaseOutbreakCodes,
    RTSL_ZEBRA_ORG_UNIT_ID,
    RTSL_ZEBRA_PROGRAM_ID,
    RTSL_ZEBRA_TRACKED_ENTITY_TYPE_ID,
} from "../consts/DiseaseOutbreakConstants";
import _c from "../../../domain/entities/generic/Collection";
import { SelectedPick } from "@eyeseetea/d2-api/api";
import { D2TrackedEntityAttributeSchema } from "@eyeseetea/d2-api/2.36";
import { D2TrackerEnrollment } from "@eyeseetea/d2-api/api/trackerEnrollments";

export type D2TrackedEntityAttribute = {
    trackedEntityAttribute: SelectedPick<
        D2TrackedEntityAttributeSchema,
        {
            id: true;
            valueType: true;
            code: true;
        }
    >;
};

export function mapTrackedEntityAttributesToDiseaseOutbreak(
    trackedEntity: D2TrackerTrackedEntity
): DiseaseOutbreakEventBaseAttrs {
    if (!trackedEntity.trackedEntity) throw new Error("Tracked entity not found");

    const diseaseOutbreak: DiseaseOutbreakEventBaseAttrs = {
        id: trackedEntity.trackedEntity,
        eventId: parseInt(getValueFromMap("eventId", trackedEntity)),
        name: getValueFromMap("name", trackedEntity),
        created: trackedEntity.createdAt ? new Date(trackedEntity.createdAt) : new Date(),
        lastUpdated: trackedEntity.updatedAt ? new Date(trackedEntity.updatedAt) : new Date(),
        createdByName: undefined,
        hazardType: getValueFromMap("hazardType", trackedEntity) as HazardType,
        mainSyndromeId: getValueFromMap("mainSyndrome", trackedEntity),
        suspectedDiseaseId: getValueFromMap("suspectedDisease", trackedEntity),

        notificationSourceId: getValueFromMap("notificationSource", trackedEntity),

        areasAffectedProvinceIds: [getValueFromMap("areasAffectedProvinces", trackedEntity)].filter(
            ou => ou !== ""
        ), //TO DO : handle multiple provinces when metadata change is done
        areasAffectedDistrictIds: [getValueFromMap("areasAffectedDistricts", trackedEntity)].filter(
            ou => ou !== ""
        ), //TO DO : handle multiple provinces when metadata change is done
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
        incidentManagerName: getValueFromMap("incidentManager", trackedEntity),

        earlyResponseActions: {
            initiateInvestigation: new Date(
                getValueFromMap("initiateInvestigation", trackedEntity)
            ),
            conductEpidemiologicalAnalysis: new Date(
                getValueFromMap("conductEpidemiologicalAnalysis", trackedEntity)
            ),
            laboratoryConfirmation: {
                date: new Date(getValueFromMap("laboratoryConfirmationDate", trackedEntity)),
                na:
                    getValueFromMap("laboratoryConfirmationNA", trackedEntity) === "true"
                        ? false
                        : true,
            },
            appropriateCaseManagement: {
                date: new Date(getValueFromMap("appropriateCaseManagementDate", trackedEntity)),
                na:
                    getValueFromMap("appropriateCaseManagementNA", trackedEntity) === "true"
                        ? false
                        : true,
            },
            initiatePublicHealthCounterMeasures: {
                date: new Date(
                    getValueFromMap("initiatePublicHealthCounterMeasuresDate", trackedEntity)
                ),
                na:
                    getValueFromMap("initiatePublicHealthCounterMeasuresNA", trackedEntity) ===
                    "true"
                        ? false
                        : true,
            },
            initiateRiskCommunication: {
                date: new Date(getValueFromMap("initiateRiskCommunicationDate", trackedEntity)),
                na:
                    getValueFromMap("initiateRiskCommunicationNA", trackedEntity) === "true"
                        ? false
                        : true,
            },
            establishCoordination: new Date(
                getValueFromMap("establishCoordination", trackedEntity)
            ),
            responseNarrative: getValueFromMap("responseNarrative", trackedEntity),
        },
        notes: getValueFromMap("notes", trackedEntity),
    };

    return diseaseOutbreak;
}

export function mapDiseaseOutbreakEventToTrackedEntityAttributes(
    diseaseOutbreak: DiseaseOutbreakEventBaseAttrs,
    attributesMetadata: D2TrackedEntityAttribute[]
): D2TrackerTrackedEntity {
    const attributes: Attribute[] = attributesMetadata.map(attribute => {
        const populatedAttribute = {
            attribute: attribute.trackedEntityAttribute.id,
            value: getValueFromDiseaseOutbreak(
                attribute.trackedEntityAttribute
                    .code as (typeof DiseaseOutbreakCodes)[keyof typeof DiseaseOutbreakCodes], //TO DO :  Can we avoid?
                diseaseOutbreak
            ),
        };
        return populatedAttribute;
    });
    const enrollment: D2TrackerEnrollment = {
        orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
        program: RTSL_ZEBRA_PROGRAM_ID,
        enrollment: "",
        trackedEntityType: RTSL_ZEBRA_TRACKED_ENTITY_TYPE_ID,
        notes: [],
        relationships: [],
        attributes: attributes,
        events: [],
        enrolledAt: diseaseOutbreak.created.toISOString(),
        occurredAt: diseaseOutbreak.lastUpdated.toISOString(),
        createdAt: new Date().getTime().toString(),
        createdAtClient: new Date().getTime().toString(),
        updatedAt: new Date().getTime().toString(),
        updatedAtClient: new Date().getTime().toString(),
        status: "ACTIVE",
        orgUnitName: "",
        followUp: false,
        deleted: false,
        storedBy: "",
    };
    const trackedEntity: D2TrackerTrackedEntity = {
        trackedEntity: diseaseOutbreak.id,
        orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
        trackedEntityType: RTSL_ZEBRA_TRACKED_ENTITY_TYPE_ID,
        createdAt: diseaseOutbreak.created.toISOString(),
        updatedAt: diseaseOutbreak.lastUpdated.toISOString(),
        attributes: attributes,
        enrollments: [enrollment],
    };

    return trackedEntity;
}

export function getValueFromMap(
    key: keyof typeof DiseaseOutbreakCodes,
    trackedEntity: D2TrackerTrackedEntity
): string {
    return trackedEntity.attributes?.find(a => a.code === DiseaseOutbreakCodes[key])?.value ?? "";
}

export function getValueFromDiseaseOutbreak(
    key: (typeof DiseaseOutbreakCodes)[keyof typeof DiseaseOutbreakCodes],
    diseaseOutbreak: DiseaseOutbreakEventBaseAttrs
): string {
    switch (key) {
        case "RTSL_ZEB_TEA_EVENT_id":
        case "RTSL_ZEB_TEA_NATIONAL_EVENT_id":
            return diseaseOutbreak.eventId?.toString() || "";
        case "RTSL_ZEB_TEA_EVENT_NAME":
            return diseaseOutbreak.name;
        case "RTSL_ZEB_TEA_HAZARD_TYPE":
            switch (diseaseOutbreak.hazardType) {
                case "Biological:Animal":
                    return "BIOLOGICAL_ANIMAL";
                case "Biological:Human":
                    return "BIOLOGICAL_HUMAN";
                case "Chemical":
                    return "CHEMICAL";
                case "Environmental":
                    return "ENVIRONMENTAL";
                case "Unknown":
                    return "UNKNOWN";
            }
            break;
        case "RTSL_ZEB_TEA_MAIN_SYNDROME":
            return diseaseOutbreak.mainSyndromeId;
        case "RTSL_ZEB_TEA_DISEASE":
        case "RTSL_ZEB_TEA_SUSPECTED_DISEASE":
            return diseaseOutbreak.suspectedDiseaseId;
        case "RTSL_ZEB_TEA_NOTIFICATION_SOURCE":
            return diseaseOutbreak.notificationSourceId;
        case "RTSL_ZEB_TEA_AREAS_AFFECTED_PROVINCES":
            return diseaseOutbreak.areasAffectedProvinceIds[0] ?? ""; //TO DO : Handle multiple provinces once metadata change is done
        case "RTSL_ZEB_TEA_AREAS_AFFECTED_DISTRICTS":
            return diseaseOutbreak.areasAffectedDistrictIds[0] ?? ""; //TO DO : Handle multiple provinces once metadata change is done
        case "RTSL_ZEB_TEA_INCIDENT_STATUS":
            return diseaseOutbreak.incidentStatus;
        case "RTSL_ZEB_TEA_DATE_EMERGED":
            return diseaseOutbreak.emerged.date.toISOString();
        case "RTSL_ZEB_TEA_DATE_EMERGED_NARRATIVE":
            return diseaseOutbreak.emerged.narrative;
        case "RTSL_ZEB_TEA_DATE_DETECTED":
            return diseaseOutbreak.detected.date.toISOString();
        case "RTSL_ZEB_TEA_DATE_DETECTED_NARRATIVE":
            return diseaseOutbreak.detected.narrative;
        case "RTSL_ZEB_TEA_DATE_NOTIFIED":
            return diseaseOutbreak.notified.date.toISOString();
        case "RTSL_ZEB_TEA_DATE_NOTIFIED_NARRATIVE":
            return diseaseOutbreak.notified.narrative;
        case "RTSL_ZEB_TEA_INITIATE_INVESTIGATION":
            return diseaseOutbreak.earlyResponseActions.initiateInvestigation.toISOString();
        case "RTSL_ZEB_TEA_CONDUCT_EPIDEMIOLOGICAL_ANALYSIS":
            return diseaseOutbreak.earlyResponseActions.conductEpidemiologicalAnalysis.toISOString();
        case "RTSL_ZEB_TEA_LABORATORY_CONFIRMATION":
            return diseaseOutbreak.earlyResponseActions.laboratoryConfirmation.na ? "true" : "";
        case "RTSL_ZEB_TEA_SPECIFY_DATE1":
            return diseaseOutbreak.earlyResponseActions.laboratoryConfirmation.date?.toISOString();
        case "RTSL_ZEB_TEA_APPROPRIATE_CASE_MANAGEMENT":
            return diseaseOutbreak.earlyResponseActions.appropriateCaseManagement.na ? "true" : "";
        case "RTSL_ZEB_TEA_SPECIFY_DATE2":
            return diseaseOutbreak.earlyResponseActions.appropriateCaseManagement.date?.toISOString();
        case "RTSL_ZEB_TEA_APPROPRIATE_PUBLIC_HEALTH":
            return diseaseOutbreak.earlyResponseActions.initiatePublicHealthCounterMeasures.na
                ? "true"
                : "";
        case "RTSL_ZEB_TEA_SPECIFY_DATE3":
            return diseaseOutbreak.earlyResponseActions.initiatePublicHealthCounterMeasures.date?.toISOString();
        case "RTSL_ZEB_TEA_APPROPRIATE_RISK_COMMUNICATION":
            return diseaseOutbreak.earlyResponseActions.initiateRiskCommunication.na ? "true" : "";
        case "RTSL_ZEB_TEA_SPECIFY_DATE4":
            return diseaseOutbreak.earlyResponseActions.initiateRiskCommunication.date?.toISOString();
        case "RTSL_ZEB_TEA_ESTABLISH_COORDINATION_MECHANISM":
            return diseaseOutbreak.earlyResponseActions.establishCoordination.toISOString();
        case "RTSL_ZEB_TEA_RESPONSE_NARRATIVE":
            return diseaseOutbreak.earlyResponseActions.responseNarrative;
        case "RTSL_ZEB_TEA_ASSIGN_INCIDENT_MANAGER":
            return diseaseOutbreak.incidentManagerName;
        case "RTSL_ZEB_TEA_NOTES":
            return diseaseOutbreak.notes ?? "";
    }
}
