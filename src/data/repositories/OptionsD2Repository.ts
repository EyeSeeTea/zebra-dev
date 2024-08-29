import { D2Api, MetadataPick } from "../../types/d2-api";
import { Code, NamedRef, Option } from "../../domain/entities/Ref";
import { apiToFuture, FutureData } from "../api-futures";
import { OptionsRepository } from "../../domain/repositories/OptionsRepository";
import { assertOrError } from "./utils/AssertOrError";
import { getHazardTypeByCode } from "./consts/DiseaseOutbreakConstants";

export class OptionsD2Repository implements OptionsRepository {
    constructor(private api: D2Api) {}

    get(code: Code): FutureData<Option> {
        return apiToFuture(
            this.api.metadata.get({
                options: { fields: { code: true, name: true }, filter: { code: { eq: code } } },
            })
        )
            .flatMap(response => assertOrError(response.options[0], "Option"))
            .map(d2Option => {
                const option: Option = {
                    id: d2Option.code,
                    name: d2Option.name,
                };
                return option;
            });
    }

    getDataSources(): FutureData<Option[]> {
        return this.getOptionSetByCode("RTSL_ZEB_OS_DATA_SOURCE");
    }

    getHazardTypes(): FutureData<Option[]> {
        return this.getOptionSetByCode("RTSL_ZEB_OS_HAZARD_TYPE").map(hazardTypes => {
            return hazardTypes.reduce((acc: Option[], hazardType: NamedRef) => {
                const hazardTypeId = getHazardTypeByCode(hazardType.id);
                if (hazardTypeId) {
                    return [
                        ...acc,
                        {
                            id: hazardTypeId,
                            name: hazardType.name,
                        },
                    ];
                } else {
                    return acc;
                }
            }, [] as Option[]);
        });
    }

    getMainSyndromes(): FutureData<Option[]> {
        return this.getOptionSetByCode("AGENTS");
    }

    getSuspectedDiseases(): FutureData<Option[]> {
        return this.getOptionSetByCode("RTSL_ZEB_OS_DISEASE");
    }

    getNotificationSources(): FutureData<Option[]> {
        return this.getOptionSetByCode("RTSL_ZEB_OS_SOURCE");
    }

    getIncidentStatus(): FutureData<Option[]> {
        return this.getOptionSetByCode("RTSL_ZEB_OS_INCIDENT_STATUS");
    }

    private getOptionSetByCode(code: string): FutureData<Option[]> {
        return apiToFuture(
            this.api.metadata.get({
                optionSets: { fields: optionSetsFields, filter: { code: { eq: code } } },
            })
        )
            .flatMap(response => assertOrError(response.optionSets[0], `OptionSet ${code}`))
            .map(d2Option => this.mapD2OptionSetToOptions(d2Option));
    }

    private mapD2OptionSetToOptions(optionSet: D2OptionSet): Option[] {
        return optionSet.options.map(
            (option): Option => ({
                id: option.code,
                name: option.name,
            })
        );
    }
}

const optionSetsFields = {
    name: true,
    code: true,
    options: { id: true, name: true, code: true },
} as const;

type D2OptionSet = MetadataPick<{
    optionSets: { fields: typeof optionSetsFields };
}>["optionSets"][number];
