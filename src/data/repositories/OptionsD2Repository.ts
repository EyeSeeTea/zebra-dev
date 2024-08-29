import { D2Api, MetadataPick } from "../../types/d2-api";
import { Code, Option } from "../../domain/entities/Ref";
import { apiToFuture, FutureData } from "../api-futures";
import { OptionsRepository } from "../../domain/repositories/OptionsRepository";
import { assertOrError } from "./utils/AssertOrError";
import { getHazardTypeByCode } from "./consts/DiseaseOutbreakConstants";

const MAIN_SYNDROME_OPTION_SET_CODE = "AGENTS";
const SUSPECTED_DISEASE_OPTION_SET_CODE = "RTSL_ZEB_OS_DISEASE";
const NOTIFICATION_SOURCE_OPTION_SET_CODE = "RTSL_ZEB_OS_SOURCE";

export class OptionsD2Repository implements OptionsRepository {
    constructor(private api: D2Api) {}

    private get(optionCode: Code, optionSetCode: Code): FutureData<Option> {
        return apiToFuture(
            this.api.metadata.get({
                options: {
                    fields: { code: true, name: true, optionSet: { id: true, code: true } },
                    filter: {
                        code: { eq: optionCode },
                        "optionSet.code": {
                            eq: optionSetCode,
                        },
                    },
                },
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

    //Event Tracker Options
    getMainSyndrome(optionCode: Code): FutureData<Option> {
        return this.get(optionCode, MAIN_SYNDROME_OPTION_SET_CODE);
    }

    getSuspectedDisease(optionCode: Code): FutureData<Option> {
        return this.get(optionCode, SUSPECTED_DISEASE_OPTION_SET_CODE);
    }

    getNotificationSource(optionCode: Code): FutureData<Option> {
        return this.get(optionCode, NOTIFICATION_SOURCE_OPTION_SET_CODE);
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
        return this.getOptionSetByCode(MAIN_SYNDROME_OPTION_SET_CODE);
    }

    getAllSuspectedDiseases(): FutureData<Option[]> {
        return this.getOptionSetByCode(SUSPECTED_DISEASE_OPTION_SET_CODE);
    }

    getAllNotificationSources(): FutureData<Option[]> {
        return this.getOptionSetByCode(NOTIFICATION_SOURCE_OPTION_SET_CODE);
    }

    getAllIncidentStatus(): FutureData<Option[]> {
        return this.getOptionSetByCode("RTSL_ZEB_OS_INCIDENT_STATUS");
    }

    //Risk Assessment Grading Options
    getPopulationAtRisks(): FutureData<Option[]> {
        return this.getOptionSetByCode("RTSL_ZEB_OS_POPULATION_AT_RISK");
    }

    getLowMediumHighOptions(): FutureData<Option[]> {
        return this.getOptionSetByCode("RTSL_ZEB_OS_LMH");
    }
    getGeographicalSpreads(): FutureData<Option[]> {
        return this.getOptionSetByCode("RTSL_ZEB_OS_GEOGRAPHICAL_SPREAD");
    }

    getCapacities(): FutureData<Option[]> {
        return this.getOptionSetByCode("RTSL_ZEB_OS_CAPACITY");
    }
    getCapabilities(): FutureData<Option[]> {
        return this.getOptionSetByCode("RTSL_ZEB_OS_CAPABILITY");
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
