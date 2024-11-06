import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import { Id } from "../../../domain/entities/Ref";
import { D2Api } from "../../../types/d2-api";
import { apiToFuture } from "../../api-futures";
import { Attribute } from "@eyeseetea/d2-api/api/trackedEntityInstances";
import { Maybe } from "../../../utils/ts-utils";

export function getProgramTEAsMetadata(api: D2Api, programId: Id) {
    return apiToFuture(
        api.models.programs.get({
            fields: {
                id: true,
                programTrackedEntityAttributes: {
                    trackedEntityAttribute: {
                        id: true,
                        valueType: true,
                        code: true,
                    },
                },
            },
            filter: {
                id: { eq: programId },
            },
        })
    );
}

export function getTEAttributeById(
    trackedEntity: D2TrackerTrackedEntity,
    attributeId: Id
): Maybe<Attribute> {
    if (!trackedEntity.attributes) return undefined;

    return trackedEntity.attributes
        .map(attribute => ({ attribute: attribute.attribute, value: attribute.value }))
        .find(attribute => attribute.attribute === attributeId);
}

export function getProgramStage(api: D2Api, stageId: Id) {
    return apiToFuture(
        api.models.programStages.get({
            fields: {
                id: true,
                programStageDataElements: {
                    dataElement: {
                        id: true,
                        valueType: true,
                        code: true,
                    },
                },
            },
            filter: {
                id: { eq: stageId },
            },
        })
    );
}
