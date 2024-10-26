import { D2Api, MetadataPick } from "@eyeseetea/d2-api/2.36";
import { AppConfigurationRepository } from "../../domain/repositories/AppConfigurationRepository";
import { Option } from "../../domain/entities/Ref";
import { apiToFuture, FutureData } from "../api-futures";

import _ from "../../domain/entities/generic/Collection";
import { getHazardTypeByCode } from "./consts/DiseaseOutbreakConstants";

import { Future } from "../../domain/entities/generic/Future";
import { AppConfigurations } from "../../domain/entities/AppConfigurations";
import { RiskAssessmentGrading } from "../../domain/entities/risk-assessment/RiskAssessmentGrading";

const MAIN_SYNDROME_OPTION_SET_CODE = "AGENTS";
export const SUSPECTED_DISEASE_OPTION_SET_CODE = "RTSL_ZEB_OS_DISEASE";
export const NOTIFICATION_SOURCE_OPTION_SET_CODE = "RTSL_ZEB_OS_SOURCE";
const optionSetCode = {
    dataSources: "RTSL_ZEB_OS_DATA_SOURCE",
    hazardTypes: "RTSL_ZEB_OS_HAZARD_TYPE",
    hazardTypesByCode: "RTSL_ZEB_OS_HAZARD_TYPE",
    mainSyndromes: MAIN_SYNDROME_OPTION_SET_CODE,
    suspectedDiseases: SUSPECTED_DISEASE_OPTION_SET_CODE,
    notificationSources: NOTIFICATION_SOURCE_OPTION_SET_CODE,
    incidentStatus: "RTSL_ZEB_OS_INCIDENT_STATUS",
    populationAtRisk: "RTSL_ZEB_OS_POPULATION_AT_RISK",
    lowMediumHigh: "RTSL_ZEB_OS_LOW_MEDIUM_HIGH",
    geographicalSpread: "RTSL_ZEB_OS_GEOGRAPHICAL_SPREAD",
    capability: "RTSL_ZEB_OS_CAPABILITY",
    capacity: "RTSL_ZEB_OS_CAPACITY",
};
export const optionSetsFields = {
    name: true,
    code: true,
    options: { id: true, name: true, code: true },
} as const;

export type D2OptionSet = MetadataPick<{
    optionSets: { fields: typeof optionSetsFields };
}>["optionSets"][number];

export class AppConfigurationD2Repository implements AppConfigurationRepository {
    constructor(private api: D2Api) {}

    getAppConfigurations(): FutureData<AppConfigurations> {
        return apiToFuture(
            this.api.metadata.get({
                optionSets: { fields: optionSetsFields },
            })
        ).flatMap(response => {
            const appConfig: AppConfigurations = {
                eventTrackerConfigurations: {
                    dataSources: [],
                    hazardTypes: [],
                    mainSyndromes: [],
                    suspectedDiseases: [],
                    notificationSources: [],
                    incidentStatus: [],
                    incidentManagers: [],
                },
                riskAssessmentGradingConfigurations: {
                    populationAtRisk: [],
                    lowMediumHigh: [],
                    geographicalSpread: [],
                    capability: [],
                    capacity: [],
                },
                riskAssessmentSummaryConfigurations: {
                    overAllConfidencGlobal: [],
                    overAllConfidencNational: [],
                    overAllConfidencRegional: [],
                    overallRiskGlobal: [],
                    overallRiskNational: [],
                    overallRiskRegional: [],
                    riskAssessors: [],
                },
                riskAssessmentQuestionnaireConfigurations: {
                    consequences: [],
                    likelihood: [],
                    risk: [],
                },
                incidentActionPlanConfigurations: {
                    iapType: [],
                    phoecLevel: [],
                },
                incidentResponseActionConfigurations: {
                    searchAssignRO: [],
                    status: [],
                    verification: [],
                },
            };

            Object.entries(optionSetCode).map(([key, value]) => {
                if (key === "dataSources") {
                    const dataSources = response.optionSets.find(
                        optionSet => optionSet.code === value
                    );
                    if (dataSources)
                        appConfig.eventTrackerConfigurations.dataSources =
                            this.mapD2OptionSetToOptions(dataSources);
                } else if (key === "hazardTypes") {
                    const hazardTypes = response.optionSets.find(
                        optionSet => optionSet.code === value
                    );
                    if (hazardTypes) {
                        const hazardOptions = this.mapD2OptionSetToOptions(hazardTypes);
                        // appConfig.eventTrackerConfigurations.hazardTypesByCode =
                        //     this.mapD2OptionSetToOptions(hazardTypes);
                        appConfig.eventTrackerConfigurations.hazardTypes =
                            this.getHazardTypes(hazardOptions);
                    }
                } else if (key === "mainSyndromes") {
                    const mainSyndromes = response.optionSets.find(
                        optionSet => optionSet.code === value
                    );
                    if (mainSyndromes)
                        appConfig.eventTrackerConfigurations.mainSyndromes =
                            this.mapD2OptionSetToOptions(mainSyndromes);
                } else if (key === "suspectedDiseases") {
                    const suspectedDiseases = response.optionSets.find(
                        optionSet => optionSet.code === value
                    );
                    if (suspectedDiseases)
                        appConfig.eventTrackerConfigurations.suspectedDiseases =
                            this.mapD2OptionSetToOptions(suspectedDiseases);
                } else if (key === "notificationSources") {
                    const notificationSources = response.optionSets.find(
                        optionSet => optionSet.code === value
                    );
                    if (notificationSources)
                        appConfig.eventTrackerConfigurations.notificationSources =
                            this.mapD2OptionSetToOptions(notificationSources);
                } else if (key === "incidentStatus") {
                    const incidentStatus = response.optionSets.find(
                        optionSet => optionSet.code === value
                    );
                    if (incidentStatus)
                        appConfig.eventTrackerConfigurations.incidentStatus =
                            this.mapD2OptionSetToOptions(incidentStatus);
                } else if (key === "populationAtRisk") {
                    const populationAtRisk = response.optionSets.find(
                        optionSet => optionSet.code === value
                    );
                    if (populationAtRisk)
                        appConfig.riskAssessmentGradingConfigurations.populationAtRisk =
                            populationAtRisk.options.map(populationAtRisk => {
                                return RiskAssessmentGrading.getOptionTypeByCodePopulation(
                                    populationAtRisk.code
                                );
                            });
                } else if (key === "lowMediumHigh") {
                    const lowMediumHighOptions = response.optionSets.find(
                        optionSet => optionSet.code === value
                    );
                    if (lowMediumHighOptions) {
                        appConfig.riskAssessmentGradingConfigurations.lowMediumHigh =
                            lowMediumHighOptions.options.map(lowMediumHigh => {
                                return RiskAssessmentGrading.getOptionTypeByCodeWeighted(
                                    lowMediumHigh.code
                                );
                            });
                        appConfig.riskAssessmentSummaryConfigurations.overallRiskGlobal =
                            this.mapD2OptionSetToOptions(lowMediumHighOptions);
                        appConfig.riskAssessmentSummaryConfigurations.overallRiskNational =
                            this.mapD2OptionSetToOptions(lowMediumHighOptions);
                        appConfig.riskAssessmentSummaryConfigurations.overallRiskRegional =
                            this.mapD2OptionSetToOptions(lowMediumHighOptions);
                        appConfig.riskAssessmentSummaryConfigurations.overAllConfidencGlobal =
                            this.mapD2OptionSetToOptions(lowMediumHighOptions);
                        appConfig.riskAssessmentSummaryConfigurations.overAllConfidencNational =
                            this.mapD2OptionSetToOptions(lowMediumHighOptions);
                        appConfig.riskAssessmentSummaryConfigurations.overAllConfidencRegional =
                            this.mapD2OptionSetToOptions(lowMediumHighOptions);
                    }
                } else if (key === "geographicalSpread") {
                    const geographicalSpreadOptions = response.optionSets.find(
                        optionSet => optionSet.code === value
                    );
                    if (geographicalSpreadOptions)
                        appConfig.riskAssessmentGradingConfigurations.geographicalSpread =
                            geographicalSpreadOptions.options.map(geographicalSpread => {
                                return RiskAssessmentGrading.getOptionTypeByCodeGeographicalSpread(
                                    geographicalSpread.code
                                );
                            });
                } else if (key === "capability") {
                    const capabilityOptions = response.optionSets.find(
                        optionSet => optionSet.code === value
                    );
                    if (capabilityOptions)
                        appConfig.riskAssessmentGradingConfigurations.capability =
                            capabilityOptions.options.map(capability => {
                                return RiskAssessmentGrading.getOptionTypeByCodeCapability(
                                    capability.code
                                );
                            });
                } else if (key === "capacity") {
                    const capacityOptions = response.optionSets.find(
                        optionSet => optionSet.code === value
                    );
                    if (capacityOptions)
                        appConfig.riskAssessmentGradingConfigurations.capacity =
                            capacityOptions.options.map(capacity => {
                                return RiskAssessmentGrading.getOptionTypeByCodeCapacity(
                                    capacity.code
                                );
                            });
                }
            });

            return Future.success(appConfig);
        });
    }

    mapD2OptionSetToOptions(optionSet: D2OptionSet): Option[] {
        return optionSet.options.map(
            (option): Option => ({
                id: option.code,
                name: option.name,
            })
        );
    }

    getHazardTypes(hazardTypesByCode: Option[]): Option[] {
        return _(hazardTypesByCode)
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
    }
}
