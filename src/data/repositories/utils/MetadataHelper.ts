import { D2Api } from "@eyeseetea/d2-api/2.36";

export function getProgramTEAsMetadata(api: D2Api, programId: string) {
    const teasMetadataResponse = api.models.programs.get({
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
    });

    return teasMetadataResponse;
}
