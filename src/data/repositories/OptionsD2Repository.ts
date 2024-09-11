import _ from "../../domain/entities/generic/Collection";
import { D2Api, MetadataPick } from "../../types/d2-api";
import { Code, Option } from "../../domain/entities/Ref";
import { apiToFuture, FutureData } from "../api-futures";
import { OptionsRepository } from "../../domain/repositories/OptionsRepository";
import { assertOrError } from "./utils/AssertOrError";
import { getHazardTypeByCode } from "./consts/DiseaseOutbreakConstants";

import {
    Capability1,
    Capability2,
    HighCapacity,
    HighGeographicalSpread,
    HighPopulationAtRisk,
    HighWeightedOption,
    LowCapacity,
    LowGeographicalSpread,
    LowPopulationAtRisk,
    LowWeightedOption,
    MediumCapacity,
    MediumGeographicalSpread,
    MediumPopulationAtRisk,
    MediumWeightedOption,
    RiskAssessmentGrading,
} from "../../domain/entities/risk-assessment/RiskAssessmentGrading";

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

    getHazardTypesByCode(): FutureData<Option[]> {
        return this.getOptionSetByCode("RTSL_ZEB_OS_HAZARD_TYPE");
    }

    getHazardTypes(): FutureData<Option[]> {
        return this.getHazardTypesByCode().map(hazardTypes => {
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
    getPopulationAtRisks(): FutureData<
        Array<LowPopulationAtRisk | MediumPopulationAtRisk | HighPopulationAtRisk>
    > {
        return this.getOptionSetByCode("RTSL_ZEB_OS_POPULATION_AT_RISK").map(
            populationAtRiskOptions => {
                return populationAtRiskOptions.map(populationAtRisk => {
                    return RiskAssessmentGrading.getOptionTypeByCodePopulation(populationAtRisk.id);
                });
            }
        );
    }

    getLowMediumHighWeightedOptions(): FutureData<
        Array<LowWeightedOption | MediumWeightedOption | HighWeightedOption>
    > {
        return this.getOptionSetByCode("RTSL_ZEB_OS_LMH").map(lowMediumHighOptions => {
            return lowMediumHighOptions.map(lowMediumHigh => {
                return RiskAssessmentGrading.getOptionTypeByCodeWeighted(lowMediumHigh.id);
            });
        });
    }
    getGeographicalSpreads(): FutureData<
        Array<LowGeographicalSpread | MediumGeographicalSpread | HighGeographicalSpread>
    > {
        return this.getOptionSetByCode("RTSL_ZEB_OS_GEOGRAPHICAL_SPREAD").map(
            geographicalSpreadOptions => {
                return geographicalSpreadOptions.map(geographicalSpread => {
                    return RiskAssessmentGrading.getOptionTypeByCodeGeographicalSpread(
                        geographicalSpread.id
                    );
                });
            }
        );
    }

    getCapacities(): FutureData<Array<LowCapacity | MediumCapacity | HighCapacity>> {
        return this.getOptionSetByCode("RTSL_ZEB_OS_CAPACITY").map(capacityOptions => {
            return capacityOptions.map(capacity => {
                return RiskAssessmentGrading.getOptionTypeByCodeCapacity(capacity.id);
            });
        });
    }
    getCapabilities(): FutureData<Array<Capability1 | Capability2>> {
        return this.getOptionSetByCode("RTSL_ZEB_OS_CAPABILITY").map(capabilityOptions => {
            return capabilityOptions.map(capability => {
                return RiskAssessmentGrading.getOptionTypeByCodeCapability(capability.id);
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
    getLowMediumHighOptions(): FutureData<Option[]> {
        return this.getOptionSetByCode("RTSL_ZEB_OS_LMH");
    }
    getLowMediumHighOption(optionCode: Code): FutureData<Option> {
        return this.get(optionCode, "RTSL_ZEB_OS_LMH");
    }

    getLikelihoodOptions(): FutureData<Option[]> {
        return this.getOptionSetByCode("RTSL_ZEB_OS_LIKELIHOOD");
    }
    getLikelihoodOption(optionCode: Code): FutureData<Option> {
        return this.get(optionCode, "RTSL_ZEB_OS_LIKELIHOOD");
    }

    getConsequencesOptions(): FutureData<Option[]> {
        return this.getOptionSetByCode("RTSL_ZEB_OS_CONSEQUENCES");
    }
    getConsequencesOption(optionCode: Code): FutureData<Option> {
        return this.get(optionCode, "RTSL_ZEB_OS_CONSEQUENCES");
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
