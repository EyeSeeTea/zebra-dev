import _ from "../../domain/entities/generic/Collection";
import { D2Api, MetadataPick } from "../../types/d2-api";
import { Code, Option } from "../../domain/entities/Ref";
import { apiToFuture, FutureData } from "../api-futures";
import { OptionsRepository } from "../../domain/repositories/OptionsRepository";
import { assertOrError } from "./utils/AssertOrError";
import { getHazardTypeByCode } from "./consts/DiseaseOutbreakConstants";
import { riskAssessmentGradingOptionCodes } from "./consts/RiskAssessmentGradingConstants";

const MAIN_SYNDROME_OPTION_SET_CODE = "AGENTS";
const SUSPECTED_DISEASE_OPTION_SET_CODE = "RTSL_ZEB_OS_DISEASE";
const NOTIFICATION_SOURCE_OPTION_SET_CODE = "RTSL_ZEB_OS_SOURCE";

export class OptionsD2Repository implements OptionsRepository {
    constructor(private api: D2Api) {}

    getMainSyndrome(optionCode: Code): FutureData<Option> {
        return this.get(optionCode, MAIN_SYNDROME_OPTION_SET_CODE);
    }

    getSuspectedDisease(optionCode: Code): FutureData<Option> {
        return this.get(optionCode, SUSPECTED_DISEASE_OPTION_SET_CODE);
    }

    getNotificationSource(optionCode: Code): FutureData<Option> {
        return this.get(optionCode, NOTIFICATION_SOURCE_OPTION_SET_CODE);
    }

    get(optionCode: Code, optionSetCode: Code): FutureData<Option> {
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

    getDataSources(): FutureData<Option[]> {
        return this.getOptionSetByCode("RTSL_ZEB_OS_DATA_SOURCE");
    }

    getHazardTypes(): FutureData<Option[]> {
        return this.getOptionSetByCode("RTSL_ZEB_OS_HAZARD_TYPE").map(hazardTypes => {
            return _(hazardTypes)
                .compactMap(hazardType => {
                    const hazardTypeId = getHazardTypeByCode(hazardType.id);
                    if (hazardTypeId) {
                        return {
                            id: hazardTypeId,
                            name: hazardType.name,
                        };
                    }
                })
                .toArray();
        });
    }

    getMainSyndromes(): FutureData<Option[]> {
        return this.getOptionSetByCode("AGENTS");
    }

    getSuspectedDiseases(): FutureData<Option[]> {
        return this.getOptionSetByCode(SUSPECTED_DISEASE_OPTION_SET_CODE);
    }

    getNotificationSources(): FutureData<Option[]> {
        return this.getOptionSetByCode(NOTIFICATION_SOURCE_OPTION_SET_CODE);
    }

    getIncidentStatus(): FutureData<Option[]> {
        return this.getOptionSetByCode("RTSL_ZEB_OS_INCIDENT_STATUS");
    }

    //Risk Assessment Grading Options
    getPopulationAtRisks(): FutureData<Option[]> {
        return this.getOptionSetByCode("RTSL_ZEB_OS_POPULATION_AT_RISK").map(
            populationAtRiskOptions => {
                return populationAtRiskOptions.map(populationAtRisk => {
                    const population = Object.entries(
                        riskAssessmentGradingOptionCodes.populationAtRisk
                    ).filter(([_key, val]) => val === populationAtRisk.id)[0]?.[0];

                    return {
                        id: population ?? populationAtRisk.id,
                        name: populationAtRisk.name,
                    };
                });
            }
        );
    }

    getLowMediumHighOptions(): FutureData<Option[]> {
        return this.getOptionSetByCode("RTSL_ZEB_OS_LMH").map(lowMediumHighOptions => {
            return lowMediumHighOptions.map(lowMediumHigh => {
                return {
                    id:
                        Object.entries(riskAssessmentGradingOptionCodes.weightedOption).filter(
                            ([_key, val]) => val === lowMediumHigh.id
                        )[0]?.[0] ?? lowMediumHigh.id,
                    name: lowMediumHigh.name,
                };
            });
        });
    }
    getGeographicalSpreads(): FutureData<Option[]> {
        return this.getOptionSetByCode("RTSL_ZEB_OS_GEOGRAPHICAL_SPREAD").map(
            geographicalSpreadOptions => {
                return geographicalSpreadOptions.map(geographicalSpread => {
                    return {
                        id:
                            Object.entries(
                                riskAssessmentGradingOptionCodes.geographicalSpread
                            ).filter(([_key, val]) => val === geographicalSpread.id)[0]?.[0] ??
                            geographicalSpread.id,
                        name: geographicalSpread.name,
                    };
                });
            }
        );
    }

    getCapacities(): FutureData<Option[]> {
        return this.getOptionSetByCode("RTSL_ZEB_OS_CAPACITY").map(capacityOptions => {
            return capacityOptions.map(capacity => {
                return {
                    id:
                        Object.entries(riskAssessmentGradingOptionCodes.capacity).filter(
                            ([_key, val]) => val === capacity.id
                        )[0]?.[0] ?? capacity.id,
                    name: capacity.name,
                };
            });
        });
    }
    getCapabilities(): FutureData<Option[]> {
        return this.getOptionSetByCode("RTSL_ZEB_OS_CAPABILITY").map(capabilityOptions => {
            return capabilityOptions.map(capability => {
                return {
                    id:
                        Object.entries(riskAssessmentGradingOptionCodes.capability).filter(
                            ([_key, val]) => val === capability.id
                        )[0]?.[0] ?? capability.id,
                    name: capability.name,
                };
            });
        });
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
