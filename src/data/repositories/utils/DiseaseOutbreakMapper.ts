import {
    DataSource,
    DiseaseOutbreakEventBaseAttrs,
    IncidentStatusType,
} from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { D2TrackerTrackedEntity, Attribute } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import {
    DiseaseOutbreakCode,
    diseaseOutbreakCodes,
    getHazardTypeValue,
    getValueFromDiseaseOutbreak,
    isStringInDiseaseOutbreakCodes,
    KeyCode,
    RTSL_ZEBRA_ORG_UNIT_ID,
    RTSL_ZEBRA_PROGRAM_ID,
    RTSL_ZEBRA_TRACKED_ENTITY_TYPE_ID,
} from "../consts/DiseaseOutbreakConstants";
import _ from "../../../domain/entities/generic/Collection";
import { SelectedPick } from "@eyeseetea/d2-api/api";
import { D2TrackedEntityAttributeSchema } from "../../../types/d2-api";
import { D2TrackerEnrollment } from "@eyeseetea/d2-api/api/trackerEnrollments";
import { getCurrentTimeString } from "./DateTimeHelper";

type D2TrackedEntityAttribute = {
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
        name: getValueFromMap("name", trackedEntity),
        dataSource: getValueFromMap("dataSource", trackedEntity) as DataSource,
        created: trackedEntity.createdAt ? new Date(trackedEntity.createdAt) : new Date(),
        lastUpdated: trackedEntity.updatedAt ? new Date(trackedEntity.updatedAt) : new Date(),
        createdByName: undefined,
        hazardType: getHazardTypeValue(getValueFromMap("hazardType", trackedEntity)),
        mainSyndromeCode: getValueFromMap("mainSyndrome", trackedEntity),
        suspectedDiseaseCode: getValueFromMap("suspectedDisease", trackedEntity),
        notificationSourceCode: getValueFromMap("notificationSource", trackedEntity),
        areasAffectedProvinceIds: getMultipleOUFromText(
            getValueFromMap("areasAffectedProvinces", trackedEntity)
        ),
        areasAffectedDistrictIds: getMultipleOUFromText(
            getValueFromMap("areasAffectedDistricts", trackedEntity)
        ),
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
                na: getValueFromMap("laboratoryConfirmationNA", trackedEntity) === "true",
            },
            appropriateCaseManagement: {
                date: new Date(getValueFromMap("appropriateCaseManagementDate", trackedEntity)),
                na: getValueFromMap("appropriateCaseManagementNA", trackedEntity) === "true",
            },
            initiatePublicHealthCounterMeasures: {
                date: new Date(
                    getValueFromMap("initiatePublicHealthCounterMeasuresDate", trackedEntity)
                ),
                na:
                    getValueFromMap("initiatePublicHealthCounterMeasuresNA", trackedEntity) ===
                    "true",
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
    };

    return diseaseOutbreak;
}

function getMultipleOUFromText(text: string): string[] {
    //TO DO : FIXME handle multiple provinces when metadata change is done
    return [text].filter(ou => ou !== "");
}

export function mapDiseaseOutbreakEventToTrackedEntityAttributes(
    diseaseOutbreak: DiseaseOutbreakEventBaseAttrs,
    attributesMetadata: D2TrackedEntityAttribute[]
): D2TrackerTrackedEntity {
    const attributeValues: Record<DiseaseOutbreakCode, string> =
        getValueFromDiseaseOutbreak(diseaseOutbreak);

    const attributes: Attribute[] = attributesMetadata.map(attribute => {
        if (!isStringInDiseaseOutbreakCodes(attribute.trackedEntityAttribute.code)) {
            throw new Error("Attribute code not found in DiseaseOutbreakCodes");
        }
        const typedCode: KeyCode = attribute.trackedEntityAttribute.code;
        const populatedAttribute = {
            attribute: attribute.trackedEntityAttribute.id,
            value: attributeValues[typedCode],
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
        createdAt: getCurrentTimeString(),
        createdAtClient: getCurrentTimeString(),
        updatedAt: getCurrentTimeString(),
        updatedAtClient: getCurrentTimeString(),
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
    key: keyof typeof diseaseOutbreakCodes,
    trackedEntity: D2TrackerTrackedEntity
): string {
    return trackedEntity.attributes?.find(a => a.code === diseaseOutbreakCodes[key])?.value ?? "";
}
