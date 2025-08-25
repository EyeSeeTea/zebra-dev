import { Id } from "../../../domain/entities/Ref";
import { D2Api, MetadataPick } from "../../../types/d2-api";
import { apiToFuture, FutureData } from "../../api-futures";
import { assertOrError } from "../utils/AssertOrError";

export function getOptionSet(
    api: D2Api,
    optionSetCode: Id,
    optionSetName: string
): FutureData<D2OptionSet> {
    return apiToFuture(
        api.metadata.get({
            optionSets: { fields: optionSetsFields, filter: { id: { eq: optionSetCode } } },
        })
    ).flatMap(response => assertOrError(response.optionSets[0], `Option set ${optionSetName}`));
}

const optionSetsFields = {
    name: true,
    code: true,
    options: { id: true, name: true, code: true },
} as const;

export type D2OptionSet = MetadataPick<{
    optionSets: { fields: typeof optionSetsFields };
}>["optionSets"][number];
