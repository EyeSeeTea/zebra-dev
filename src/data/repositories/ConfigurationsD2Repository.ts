import { D2Api, MetadataPick } from "@eyeseetea/d2-api/2.36";
import { ConfigurationsRepository as ConfigurationsRepository } from "../../domain/repositories/ConfigurationsRepository";
import { Option } from "../../domain/entities/Ref";
import { apiToFuture, FutureData } from "../api-futures";
import _ from "../../domain/entities/generic/Collection";
import { getHazardTypeByCode } from "./consts/DiseaseOutbreakConstants";
import { Future } from "../../domain/entities/generic/Future";
import { SelectableOptions } from "../../domain/entities/AppConfigurations";
import { RiskAssessmentGrading } from "../../domain/entities/risk-assessment/RiskAssessmentGrading";

const optionSetCode: Record<string, string> = {
    dataSources: "RTSL_ZEB_OS_DATA_SOURCE",
    hazardTypes: "RTSL_ZEB_OS_HAZARD_TYPE",
    hazardTypesByCode: "RTSL_ZEB_OS_HAZARD_TYPE",
    mainSyndromes: "AGENTS",
    suspectedDiseases: "RTSL_ZEB_OS_DISEASE",
    notificationSources: "RTSL_ZEB_OS_SOURCE",
    incidentStatus: "RTSL_ZEB_OS_INCIDENT_STATUS",
    populationAtRisk: "RTSL_ZEB_OS_POPULATION_AT_RISK",
    lowMediumHigh: "RTSL_ZEB_OS_LMH",
    geographicalSpread: "RTSL_ZEB_OS_GEOGRAPHICAL_SPREAD",
    capability: "RTSL_ZEB_OS_CAPABILITY",
    capacity: "RTSL_ZEB_OS_CAPACITY",
    likelihood: "RTSL_ZEB_OS_LIKELIHOOD",
    consequences: "RTSL_ZEB_OS_CONSEQUENCES",
    iapType: "RTSL_ZEB_OS_IAP_TYPE",
    phoecLevel: "RTSL_ZEB_OS_PHOEC_ACT_LEVEL",
    status: "RTSL_ZEB_OS_STATUS",
    verification: "RTSL_ZEB_OS_VERIFICATION",
};

export class ConfigurationsD2Repository implements ConfigurationsRepository {
    constructor(private api: D2Api) {}

    getSelectableOptions(): FutureData<SelectableOptions> {
        return apiToFuture(
            this.api.metadata.get({
                optionSets: { fields: optionSetsFields },
            })
        ).flatMap(optionsResponse => {
            const selectableOptions = this.createEmptySelectableOptions();
            Object.entries(optionSetCode).map(([key, value]) => {
                if (key === "dataSources") {
                    const dataSources = optionsResponse.optionSets.find(
                        optionSet => optionSet.code === value
                    );
                    if (dataSources)
                        selectableOptions.eventTrackerConfigurations.dataSources =
                            this.mapD2OptionSetToOptions(dataSources);
                } else if (key === "hazardTypes") {
                    const hazardTypes = optionsResponse.optionSets.find(
                        optionSet => optionSet.code === value
                    );
                    if (hazardTypes) {
                        const hazardOptions = this.mapD2OptionSetToOptions(hazardTypes);
                        selectableOptions.eventTrackerConfigurations.hazardTypes =
                            this.getHazardTypes(hazardOptions);
                    }
                } else if (key === "mainSyndromes") {
                    const mainSyndromes = optionsResponse.optionSets.find(
                        optionSet => optionSet.code === value
                    );
                    if (mainSyndromes)
                        selectableOptions.eventTrackerConfigurations.mainSyndromes =
                            this.mapD2OptionSetToOptions(mainSyndromes);
                } else if (key === "suspectedDiseases") {
                    const suspectedDiseases = optionsResponse.optionSets.find(
                        optionSet => optionSet.code === value
                    );
                    if (suspectedDiseases)
                        selectableOptions.eventTrackerConfigurations.suspectedDiseases =
                            this.mapD2OptionSetToOptions(suspectedDiseases);
                } else if (key === "notificationSources") {
                    const notificationSources = optionsResponse.optionSets.find(
                        optionSet => optionSet.code === value
                    );
                    if (notificationSources)
                        selectableOptions.eventTrackerConfigurations.notificationSources =
                            this.mapD2OptionSetToOptions(notificationSources);
                } else if (key === "incidentStatus") {
                    const incidentStatus = optionsResponse.optionSets.find(
                        optionSet => optionSet.code === value
                    );
                    if (incidentStatus)
                        selectableOptions.eventTrackerConfigurations.incidentStatus =
                            this.mapD2OptionSetToOptions(incidentStatus);
                } else if (key === "populationAtRisk") {
                    const populationAtRisk = optionsResponse.optionSets.find(
                        optionSet => optionSet.code === value
                    );
                    if (populationAtRisk)
                        selectableOptions.riskAssessmentGradingConfigurations.populationAtRisk =
                            populationAtRisk.options.map(populationAtRisk => {
                                return RiskAssessmentGrading.getOptionTypeByCodePopulation(
                                    populationAtRisk.code
                                );
                            });
                } else if (key === "lowMediumHigh") {
                    const lowMediumHighResponse = optionsResponse.optionSets.find(
                        optionSet => optionSet.code === value
                    );
                    if (lowMediumHighResponse) {
                        selectableOptions.riskAssessmentGradingConfigurations.lowMediumHigh =
                            lowMediumHighResponse.options.map(lowMediumHigh => {
                                return RiskAssessmentGrading.getOptionTypeByCodeWeighted(
                                    lowMediumHigh.code
                                );
                            });

                        const lmhOptions = this.mapD2OptionSetToOptions(lowMediumHighResponse);
                        selectableOptions.riskAssessmentSummaryConfigurations.overallRiskGlobal =
                            lmhOptions;
                        selectableOptions.riskAssessmentSummaryConfigurations.overallRiskNational =
                            lmhOptions;
                        selectableOptions.riskAssessmentSummaryConfigurations.overallRiskRegional =
                            lmhOptions;
                        selectableOptions.riskAssessmentSummaryConfigurations.overAllConfidencGlobal =
                            lmhOptions;
                        selectableOptions.riskAssessmentSummaryConfigurations.overAllConfidencNational =
                            lmhOptions;
                        selectableOptions.riskAssessmentSummaryConfigurations.overAllConfidencRegional =
                            lmhOptions;
                        selectableOptions.riskAssessmentQuestionnaireConfigurations.risk =
                            lmhOptions;
                    }
                } else if (key === "geographicalSpread") {
                    const geographicalSpreadOptions = optionsResponse.optionSets.find(
                        optionSet => optionSet.code === value
                    );
                    if (geographicalSpreadOptions)
                        selectableOptions.riskAssessmentGradingConfigurations.geographicalSpread =
                            geographicalSpreadOptions.options.map(geographicalSpread => {
                                return RiskAssessmentGrading.getOptionTypeByCodeGeographicalSpread(
                                    geographicalSpread.code
                                );
                            });
                } else if (key === "capability") {
                    const capabilityOptions = optionsResponse.optionSets.find(
                        optionSet => optionSet.code === value
                    );
                    if (capabilityOptions)
                        selectableOptions.riskAssessmentGradingConfigurations.capability =
                            capabilityOptions.options.map(capability => {
                                return RiskAssessmentGrading.getOptionTypeByCodeCapability(
                                    capability.code
                                );
                            });
                } else if (key === "capacity") {
                    const capacityOptions = optionsResponse.optionSets.find(
                        optionSet => optionSet.code === value
                    );
                    if (capacityOptions)
                        selectableOptions.riskAssessmentGradingConfigurations.capacity =
                            capacityOptions.options.map(capacity => {
                                return RiskAssessmentGrading.getOptionTypeByCodeCapacity(
                                    capacity.code
                                );
                            });
                } else if (key === "likelihood") {
                    const likelihoodOptions = optionsResponse.optionSets.find(
                        optionSet => optionSet.code === value
                    );
                    if (likelihoodOptions)
                        selectableOptions.riskAssessmentQuestionnaireConfigurations.likelihood =
                            this.mapD2OptionSetToOptions(likelihoodOptions);
                } else if (key === "consequences") {
                    const consequencesOptions = optionsResponse.optionSets.find(
                        optionSet => optionSet.code === value
                    );
                    if (consequencesOptions)
                        selectableOptions.riskAssessmentQuestionnaireConfigurations.consequences =
                            this.mapD2OptionSetToOptions(consequencesOptions);
                } else if (key === "iapType") {
                    const iapTypes = optionsResponse.optionSets.find(
                        optionSet => optionSet.code === value
                    );
                    if (iapTypes)
                        selectableOptions.incidentActionPlanConfigurations.iapType =
                            this.mapD2OptionSetToOptions(iapTypes);
                } else if (key === "phoecLevel") {
                    const phoecLevels = optionsResponse.optionSets.find(
                        optionSet => optionSet.code === value
                    );
                    if (phoecLevels)
                        selectableOptions.incidentActionPlanConfigurations.phoecLevel =
                            this.mapD2OptionSetToOptions(phoecLevels);
                } else if (key === "status") {
                    const statuses = optionsResponse.optionSets.find(
                        optionSet => optionSet.code === value
                    );
                    if (statuses)
                        selectableOptions.incidentResponseActionConfigurations.status =
                            this.mapD2OptionSetToOptions(statuses);
                } else if (key === "verification") {
                    const verifications = optionsResponse.optionSets.find(
                        optionSet => optionSet.code === value
                    );
                    if (verifications)
                        selectableOptions.incidentResponseActionConfigurations.verification =
                            this.mapD2OptionSetToOptions(verifications);
                }
            });

            return Future.success(selectableOptions);
        });
    }

    private createEmptySelectableOptions(): SelectableOptions {
        const selectableOptions: SelectableOptions = {
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
        return selectableOptions;
    }

    private mapD2OptionSetToOptions(optionSet: D2OptionSet): Option[] {
        return optionSet.options.map(
            (option): Option => ({
                id: option.code,
                name: option.name,
            })
        );
    }

    private getHazardTypes(hazardTypesByCode: Option[]): Option[] {
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

export const optionSetsFields = {
    name: true,
    code: true,
    options: { id: true, name: true, code: true },
} as const;

export type D2OptionSet = MetadataPick<{
    optionSets: { fields: typeof optionSetsFields };
}>["optionSets"][number];
