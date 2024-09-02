import { Ref } from "../../../domain/entities/Ref";
import { D2Api } from "../../../types/d2-api";
import { apiToFuture, FutureData } from "../../api-futures";

export function getProgramTEAsMetadata(api: D2Api, programId: string) {
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

export function getUserGroupsByCode(api: D2Api, code: string): FutureData<Ref[]> {
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
    ).map(response => response.userGroups);
}
