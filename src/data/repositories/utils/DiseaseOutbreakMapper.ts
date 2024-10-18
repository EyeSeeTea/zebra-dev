import { DiseaseOutbreakEventBaseAttrs } from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { D2TrackerTrackedEntity, Attribute } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import {
    DiseaseOutbreakCode,
    diseaseOutbreakCodes,
    getHazardTypeByCode,
    getValueFromDiseaseOutbreak,
    isStringInDiseaseOutbreakCodes,
    DiseaseOutbreakKeyCode,
    dataSourceMap,
    incidentStatusMap,
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

    const fromMap = (key: keyof typeof diseaseOutbreakCodes) => getValueFromMap(key, trackedEntity);

    const dataSource = dataSourceMap[fromMap("dataSource")];
    const incidentStatus = incidentStatusMap[fromMap("incidentStatus")];

    if (!dataSource || !incidentStatus) throw new Error("Data source or incident status not valid");

    const diseaseOutbreak: DiseaseOutbreakEventBaseAttrs = {
        id: trackedEntity.trackedEntity,
        status: trackedEntity.enrollments?.[0]?.status ?? "ACTIVE", //Zebra Outbreak has only one enrollment
        name: fromMap("name"),
        dataSource: dataSource,
        created: trackedEntity.createdAt ? new Date(trackedEntity.createdAt) : undefined,
        lastUpdated: trackedEntity.updatedAt ? new Date(trackedEntity.updatedAt) : undefined,
        createdByName: undefined,
        hazardType: getHazardTypeByCode(fromMap("hazardType")),
        mainSyndromeCode: fromMap("mainSyndrome"),
        suspectedDiseaseCode: fromMap("suspectedDisease"),
        notificationSourceCode: fromMap("notificationSource"),
        areasAffectedProvinceIds: getMultipleOUFromText(fromMap("areasAffectedProvinces")),
        areasAffectedDistrictIds: getMultipleOUFromText(fromMap("areasAffectedDistricts")),
        incidentStatus: incidentStatus,
        emerged: {
            date: new Date(fromMap("emergedDate")),
            narrative: fromMap("emergedNarrative"),
        },
        detected: {
            date: new Date(fromMap("detectedDate")),
            narrative: fromMap("detectedNarrative"),
        },
        notified: {
            date: new Date(fromMap("notifiedDate")),
            narrative: fromMap("notifiedNarrative"),
        },
        incidentManagerName: fromMap("incidentManager"),
        earlyResponseActions: {
            initiateInvestigation: new Date(fromMap("initiateInvestigation")),
            conductEpidemiologicalAnalysis: new Date(fromMap("conductEpidemiologicalAnalysis")),
            laboratoryConfirmation: {
                date: new Date(fromMap("laboratoryConfirmationDate")),
                na: fromMap("laboratoryConfirmationNA") === "true",
            },
            appropriateCaseManagement: {
                date: new Date(fromMap("appropriateCaseManagementDate")),
                na: fromMap("appropriateCaseManagementNA") === "true",
            },
            initiatePublicHealthCounterMeasures: {
                date: new Date(fromMap("initiatePublicHealthCounterMeasuresDate")),
                na: fromMap("initiatePublicHealthCounterMeasuresNA") === "true",
            },
            initiateRiskCommunication: {
                date: new Date(fromMap("initiateRiskCommunicationDate")),
                na: fromMap("initiateRiskCommunicationNA") === "true",
            },
            establishCoordination: new Date(fromMap("establishCoordination")),
            responseNarrative: fromMap("responseNarrative"),
        },
        notes: fromMap("notes"),
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
        const typedCode: DiseaseOutbreakKeyCode = attribute.trackedEntityAttribute.code;
        const populatedAttribute = {
            attribute: attribute.trackedEntityAttribute.id,
            value: attributeValues[typedCode],
        };
        return populatedAttribute;
    });

    const isExistingTEI = diseaseOutbreak.id !== "";

    if (isExistingTEI) {
        const trackedEntity: D2TrackerTrackedEntity = {
            orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
            trackedEntityType: RTSL_ZEBRA_TRACKED_ENTITY_TYPE_ID,
            trackedEntity: diseaseOutbreak.id,
            attributes: attributes,
        };

        return trackedEntity;
    } else {
        const enrollment: D2TrackerEnrollment = {
            orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
            program: RTSL_ZEBRA_PROGRAM_ID,
            enrollment: "",
            trackedEntityType: RTSL_ZEBRA_TRACKED_ENTITY_TYPE_ID,
            notes: [],
            relationships: [],
            attributes: attributes,
            events: [],
            enrolledAt: getCurrentTimeString(),
            occurredAt: getCurrentTimeString(),
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
            attributes: attributes,
            createdAt: getCurrentTimeString(),
            updatedAt: getCurrentTimeString(),
            enrollments: [enrollment],
        };

        return trackedEntity;
    }
}

export function getValueFromMap(
    key: keyof typeof diseaseOutbreakCodes,
    trackedEntity: D2TrackerTrackedEntity
): string {
    return trackedEntity.attributes?.find(a => a.code === diseaseOutbreakCodes[key])?.value ?? "";
}
