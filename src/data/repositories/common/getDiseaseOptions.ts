import { D2Api, MetadataPick } from "@eyeseetea/d2-api/2.36";
import { apiToFuture, FutureData } from "../../api-futures";
import { assertOrError } from "../utils/AssertOrError";

export function getDiseaseOptions(api: D2Api): FutureData<D2OptionSet> {
    return apiToFuture(
        api.metadata.get({
            optionSets: {
                fields: optionSetsFields,
                filter: { id: { eq: "DFSpWpoNq5r" } },
            },
        })
    ).flatMap(response => assertOrError(response.optionSets[0], "Disease option set not found"));
}

const optionSetsFields = {
    name: true,
    code: true,
    options: { id: true, name: true, code: true },
} as const;

export type D2OptionSet = MetadataPick<{
    optionSets: { fields: typeof optionSetsFields };
}>["optionSets"][number];
