import {
    DiseaseOutbreakEventBaseAttrs,
    HazardType,
    IncidentStatusType,
} from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { D2TrackerTrackedEntity, Attribute } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import {
    DiseaseOutbreakCode,
    DiseaseOutbreakCodes,
    getValueFromDiseaseOutbreak,
    isHazardType,
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

function getHazardTypeValue(hazardType: string): HazardType {
    if (isHazardType(hazardType)) {
        return hazardType;
    } else {
        return "Unknown";
    }
}

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
                na: !(getValueFromMap("laboratoryConfirmationNA", trackedEntity) === "true"),
            },
            appropriateCaseManagement: {
                date: new Date(getValueFromMap("appropriateCaseManagementDate", trackedEntity)),
                na: !(getValueFromMap("appropriateCaseManagementNA", trackedEntity) === "true"),
            },
            initiatePublicHealthCounterMeasures: {
                date: new Date(
                    getValueFromMap("initiatePublicHealthCounterMeasuresDate", trackedEntity)
                ),
                na: !(
                    getValueFromMap("initiatePublicHealthCounterMeasuresNA", trackedEntity) ===
                    "true"
                ),
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

function getMultipleOUFromText(text: string): string[] {
    //TO DO : FIXME handle multiple provinces when metadata change is done
    return [text].filter(ou => ou !== "");
}

function getValueOfCodeIfSpecifyDateIsTrue(
    attributeValues: Record<DiseaseOutbreakCode, string>,
    code: DiseaseOutbreakCode,
    specifyDateCode: DiseaseOutbreakCode
): string | undefined {
    return attributeValues[specifyDateCode] === "true" ? attributeValues[code] : undefined;
}

function getValueByDiseaseOutbreakCode(
    attributeValues: Record<DiseaseOutbreakCode, string>,
    code: DiseaseOutbreakCode
): string | undefined {
    switch (code) {
        case "RTSL_ZEB_TEA_LABORATORY_CONFIRMATION":
        case "RTSL_ZEB_TEA_SPECIFY_DATE1":
            return getValueOfCodeIfSpecifyDateIsTrue(
                attributeValues,
                code,
                "RTSL_ZEB_TEA_LABORATORY_CONFIRMATION"
            );
        case "RTSL_ZEB_TEA_APPROPRIATE_CASE_MANAGEMENT":
        case "RTSL_ZEB_TEA_SPECIFY_DATE2":
            return getValueOfCodeIfSpecifyDateIsTrue(
                attributeValues,
                code,
                "RTSL_ZEB_TEA_APPROPRIATE_CASE_MANAGEMENT"
            );
        case "RTSL_ZEB_TEA_APPROPRIATE_PUBLIC_HEALTH":
        case "RTSL_ZEB_TEA_SPECIFY_DATE3":
            return getValueOfCodeIfSpecifyDateIsTrue(
                attributeValues,
                code,
                "RTSL_ZEB_TEA_APPROPRIATE_PUBLIC_HEALTH"
            );
        case "RTSL_ZEB_TEA_APPROPRIATE_RISK_COMMUNICATION":
        case "RTSL_ZEB_TEA_SPECIFY_DATE4":
            return getValueOfCodeIfSpecifyDateIsTrue(
                attributeValues,
                code,
                "RTSL_ZEB_TEA_APPROPRIATE_RISK_COMMUNICATION"
            );
        default:
            return attributeValues[code];
    }
}

export function mapDiseaseOutbreakEventToTrackedEntityAttributes(
    diseaseOutbreak: DiseaseOutbreakEventBaseAttrs,
    attributesMetadata: D2TrackedEntityAttribute[]
): D2TrackerTrackedEntity {
    const attributeValues: Record<DiseaseOutbreakCode, string> =
        getValueFromDiseaseOutbreak(diseaseOutbreak);

    const attributeValuesCleaned = (Object.keys(attributeValues) as DiseaseOutbreakCode[]).reduce(
        (acc: Record<DiseaseOutbreakCode, string>, code: DiseaseOutbreakCode) => {
            const value = getValueByDiseaseOutbreakCode(attributeValues, code);
            return value
                ? { ...acc, [code]: getValueByDiseaseOutbreakCode(attributeValues, code) }
                : acc;
        },
        {} as Record<DiseaseOutbreakCode, string>
    );

    const attributes: Attribute[] = _(
        attributesMetadata.map((attribute): Attribute | null => {
            if (!isStringInDiseaseOutbreakCodes(attribute.trackedEntityAttribute.code)) {
                throw new Error("Attribute code not found in DiseaseOutbreakCodes");
            }
            const typedCode: KeyCode = attribute.trackedEntityAttribute.code;

            return attributeValuesCleaned[typedCode]
                ? {
                      attribute: attribute.trackedEntityAttribute.id,
                      value: attributeValuesCleaned[typedCode],
                  }
                : null;
        })
    )
        .compact()
        .value();

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

function getValueFromMap(
    key: keyof typeof DiseaseOutbreakCodes,
    trackedEntity: D2TrackerTrackedEntity
): string {
    return trackedEntity.attributes?.find(a => a.code === DiseaseOutbreakCodes[key])?.value ?? "";
}
