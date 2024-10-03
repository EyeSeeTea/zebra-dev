import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import { Id, Ref } from "../../../domain/entities/Ref";
import { D2Api } from "../../../types/d2-api";
import { apiToFuture, FutureData } from "../../api-futures";
import { assertOrError } from "./AssertOrError";
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

export function getUserGroupByCode(api: D2Api, code: string): FutureData<Ref> {
    return apiToFuture(
        api.metadata.get({
            userGroups: {
                fields: {
                    id: true,
                },
                filter: {
                    code: { eq: code },
                },
            },
        })
    )
        .flatMap(response => assertOrError(response.userGroups[0], `User group ${code}`))
        .map(userGroup => userGroup);
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
