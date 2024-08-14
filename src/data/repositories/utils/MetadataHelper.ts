import { D2Api } from "../../../types/d2-api";
import { apiToFuture } from "../../api-futures";

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
