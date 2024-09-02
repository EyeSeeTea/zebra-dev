import { Id } from "../../../domain/entities/Ref";
import { D2Api } from "../../../types/d2-api";
import { apiToFuture } from "../../api-futures";

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

export function getProgramStage(api: D2Api, programId: Id, stageId: Id) {
    return apiToFuture(
        api.models.programStages.get({
            id: stageId,
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
                program: { eq: programId },
            },
        })
    );
}
