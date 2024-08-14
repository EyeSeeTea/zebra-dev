import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import { diseaseOutbreakCodes, RTSL_ZEBRA_ORG_UNIT_ID } from "../consts/DiseaseOutbreakConstants";
import { Attribute } from "@eyeseetea/d2-api/api/trackedEntityInstances";
import { D2TrackedEntityAttribute, getValueFromMap } from "./DiseaseOutbreakMapper";
import { DistrictEvent } from "../../../domain/entities/disease-outbreak-event/DistrictEvent";
import { HazardType } from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";

export function mapTrackedEntityAttributesToDistrictOutbreak(
    trackedEntity: D2TrackerTrackedEntity
): DistrictEvent {
    if (!trackedEntity.trackedEntity) throw new Error("Tracked entity not found");

    const diseaseOutbreak: DistrictEvent = {
        id: trackedEntity.trackedEntity,
        name: getValueFromMap("name", trackedEntity),
        hazardType: getValueFromMap("hazardType", trackedEntity) as HazardType,
        suspectedDiseaseCode: getValueFromMap("suspectedDisease", trackedEntity),
    };

    return diseaseOutbreak;
}

export function mapDistrictOutbreakEventToTrackedEntities(
    diseaseOutbreak: DistrictEvent,
    attributesMetadata: D2TrackedEntityAttribute[],
    tetsMetadata: D2TrackerTrackedEntity[]
): D2TrackerTrackedEntity {
    const attributes: Attribute[] = attributesMetadata
        // .filter(attribute => attribute.trackedEntityAttribute.code === diseaseOutbreakCodes.eventId)
        .map(attribute => {
            const populatedAttribute = {
                attribute: attribute.trackedEntityAttribute.id,
                value:
                    getValueFromDistrictOutbreak(
                        attribute.trackedEntityAttribute
                            .code as (typeof diseaseOutbreakCodes)[keyof typeof diseaseOutbreakCodes],
                        diseaseOutbreak
                    ) ?? "",
            };
            return populatedAttribute;
        });

    const trackedEntityType = tetsMetadata.find(
        type => type.trackedEntity === diseaseOutbreak.id
    )?.trackedEntityType;

    const trackedEntity: D2TrackerTrackedEntity = {
        trackedEntity: diseaseOutbreak.id,
        orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
        trackedEntityType: trackedEntityType,
        attributes: attributes,
    };

    return trackedEntity;
}

function getValueFromDistrictOutbreak(
    key: (typeof diseaseOutbreakCodes)[keyof typeof diseaseOutbreakCodes],
    districtEvent: DistrictEvent
): string | undefined {
    switch (key) {
        case "RTSL_ZEB_TEA_EVENT_NAME":
            return districtEvent.name;
        case "RTSL_ZEB_TEA_HAZARD_TYPE":
            switch (districtEvent.hazardType) {
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
        case "RTSL_ZEB_TEA_SUSPECTED_DISEASE":
            return districtEvent.suspectedDiseaseCode;
    }
}
