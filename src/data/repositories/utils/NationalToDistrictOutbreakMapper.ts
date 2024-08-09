import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import { DiseaseOutbreakCodes, RTSL_ZEBRA_ORG_UNIT_ID } from "../consts/DiseaseOutbreakConstants";
import { DiseaseOutbreakEventBaseAttrs } from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Attribute } from "@eyeseetea/d2-api/api/trackedEntityInstances";
import { D2TrackedEntityAttribute, getValueFromDiseaseOutbreak } from "./DiseaseOutbreakMapper";

export function mapDiseaseOutbreakEventToTrackedEntityAttributes(
    diseaseOutbreak: DiseaseOutbreakEventBaseAttrs,
    attributesMetadata: D2TrackedEntityAttribute[],
    tetsMetadata: D2TrackerTrackedEntity[]
): D2TrackerTrackedEntity {
    const attributes: Attribute[] = attributesMetadata
        .filter(attribute => attribute.trackedEntityAttribute.code === DiseaseOutbreakCodes.eventId)
        .map(attribute => {
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
