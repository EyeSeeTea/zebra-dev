import { Future } from "../../domain/entities/generic/Future";
import { D2Api, MetadataPick } from "../../types/d2-api";
import { apiToFuture, FutureData } from "../api-futures";
import { ResourceTypeNamedRepository } from "../../domain/repositories/ResourceTypeNamedRepository";
import { ResourceTypeNamed } from "../../domain/entities/resources/ResourceTypeNamed";
import { assertOrError } from "./utils/AssertOrError";
import { dhis2ResourceTypeToResourceType, isDHIS2ResourceType } from "./consts/ResourceConstants";

const RESOURCE_TYPE_OPTION_SET_ID = "WjsDiwAaXLy";

export class ResourceTypeNamedD2Repository implements ResourceTypeNamedRepository {
    constructor(private api: D2Api) {}

    public get(): FutureData<ResourceTypeNamed[]> {
        return apiToFuture(
            this.api.metadata.get({
                optionSets: {
                    fields: optionSetsFields,
                    filter: { id: { eq: RESOURCE_TYPE_OPTION_SET_ID } },
                },
            })
        )
            .flatMap(response =>
                assertOrError(response.optionSets[0], "Resource Type option set not found")
            )
            .flatMap(optionSet => {
                return this.buildResourceTypesNamed(optionSet);
            });
    }

    private buildResourceTypesNamed(optionSet: D2OptionSet): FutureData<ResourceTypeNamed[]> {
        const options = optionSet.options.reduce(
            (acc: ResourceTypeNamed[], option): ResourceTypeNamed[] => {
                const resourceType = isDHIS2ResourceType(option.code)
                    ? dhis2ResourceTypeToResourceType(option.code)
                    : undefined;

                return resourceType
                    ? [
                          ...acc,
                          {
                              id: resourceType,
                              name: option.name,
                          },
                      ]
                    : acc;
            },
            []
        );
        return Future.success(options);
    }
}

export const optionSetsFields = {
    name: true,
    code: true,
    options: { id: true, name: true, code: true },
} as const;

export type D2OptionSet = MetadataPick<{
    optionSets: { fields: typeof optionSetsFields };
}>["optionSets"][number];
