import { D2Api, MetadataPick } from "../../types/d2-api";
import { Code, Option } from "../../domain/entities/Ref";
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

    getAllDataSources(): FutureData<Option[]> {
        return this.getOptionSetByCode("RTSL_ZEB_OS_DATA_SOURCE");
    }

    getAllHazardTypes(): FutureData<Option[]> {
        return this.getOptionSetByCode("RTSL_ZEB_OS_HAZARD_TYPE").map(hazardTypes => {
            return hazardTypes.map(hazardType => ({
                id: getHazardTypeByCode(hazardType.id),
                name: hazardType.name,
            }));
        });
    }

    getAllMainSyndromes(): FutureData<Option[]> {
        return this.getOptionSetByCode("RTSL_ZEB_OS_SYNDROME");
    }

    getAllSuspectedDiseases(): FutureData<Option[]> {
        return this.getOptionSetByCode("RTSL_ZEB_OS_DISEASE");
    }

    getAllNotificationSources(): FutureData<Option[]> {
        return this.getOptionSetByCode("RTSL_ZEB_OS_SOURCE");
    }

    getAllIncidentStatus(): FutureData<Option[]> {
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
};

type D2OptionSet = MetadataPick<{
    optionSets: { fields: typeof optionSetsFields };
}>["optionSets"][number];
