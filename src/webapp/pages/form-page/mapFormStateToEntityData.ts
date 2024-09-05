import {
    DataSource,
    DiseaseOutbreakEventBaseAttrs,
    HazardType,
    IncidentStatus,
} from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { FormState } from "../../components/form/FormState";
import { diseaseOutbreakEventFieldIds } from "./disease-outbreak-event/mapDiseaseOutbreakEventToInitialFormState";
import {
    FormFieldState,
    getAllFieldsFromSections,
    getBooleanFieldValue,
    getDateFieldValue,
    getMultipleOptionsFieldValue,
    getStringFieldValue,
} from "../../components/form/FormFieldsState";
import {
    ConfigurableForm,
    DiseaseOutbreakEventFormData,
    RiskAssessmentGradingFormData,
} from "../../../domain/entities/ConfigurableForm";
import { Maybe } from "../../../utils/ts-utils";
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
    riskAssessmentGradingCodes,
} from "../../../domain/entities/risk-assessment/RiskAssessmentGrading";

export function mapFormStateToEntityData(
    formState: FormState,
    currentUserName: string,
    formData: ConfigurableForm
): ConfigurableForm {
    switch (formData.type) {
        case "disease-outbreak-event": {
            const dieaseEntity = mapFormStateToDiseaseOutbreakEvent(
                formState,
                currentUserName,
                formData.entity
            );
            const diseaseForm: DiseaseOutbreakEventFormData = {
                ...formData,
                entity: dieaseEntity,
            };
            return diseaseForm;
        }

        case "risk-assessment-grading": {
            const riskEntity = mapFormStateToRiskAssessmentGrading(formState);
            const riskForm: RiskAssessmentGradingFormData = {
                ...formData,
                entity: riskEntity,
            };
            return riskForm;
        }

        default:
            return formData;
    }
}

function mapFormStateToDiseaseOutbreakEvent(
    formState: FormState,
    currentUserName: string,
    diseaseOutbreakEvent: Maybe<DiseaseOutbreakEventBaseAttrs>
): DiseaseOutbreakEventBaseAttrs {
    const allFields: FormFieldState[] = getAllFieldsFromSections(formState.sections);

    const diseaseOutbreakEventEditableData = {
        name: getStringFieldValue(diseaseOutbreakEventFieldIds.name, allFields),
        dataSource: getStringFieldValue(
            diseaseOutbreakEventFieldIds.dataSource,
            allFields
        ) as DataSource,
        hazardType: getStringFieldValue(
            diseaseOutbreakEventFieldIds.hazardType,
            allFields
        ) as HazardType,
        mainSyndromeCode: getStringFieldValue(
            diseaseOutbreakEventFieldIds.mainSyndromeCode,
            allFields
        ),
        suspectedDiseaseCode: getStringFieldValue(
            diseaseOutbreakEventFieldIds.suspectedDiseaseCode,
            allFields
        ),
        notificationSourceCode: getStringFieldValue(
            diseaseOutbreakEventFieldIds.notificationSourceCode,
            allFields
        ),
        areasAffectedProvinceIds: getMultipleOptionsFieldValue(
            diseaseOutbreakEventFieldIds.areasAffectedProvinceIds,
            allFields
        ),
        areasAffectedDistrictIds: getMultipleOptionsFieldValue(
            diseaseOutbreakEventFieldIds.areasAffectedDistrictIds,
            allFields
        ),
        incidentStatus: getStringFieldValue(
            diseaseOutbreakEventFieldIds.incidentStatus,
            allFields
        ) as IncidentStatus,
        emerged: {
            date: getDateFieldValue(diseaseOutbreakEventFieldIds.emergedDate, allFields) as Date,
            narrative: getStringFieldValue(
                diseaseOutbreakEventFieldIds.emergedNarrative,
                allFields
            ),
        },
        detected: {
            date: getDateFieldValue(diseaseOutbreakEventFieldIds.detectedDate, allFields) as Date,
            narrative: getStringFieldValue(
                diseaseOutbreakEventFieldIds.detectedNarrative,
                allFields
            ),
        },
        notified: {
            date: getDateFieldValue(diseaseOutbreakEventFieldIds.notifiedDate, allFields) as Date,
            narrative: getStringFieldValue(
                diseaseOutbreakEventFieldIds.notifiedNarrative,
                allFields
            ),
        },
        earlyResponseActions: {
            initiateInvestigation: getDateFieldValue(
                diseaseOutbreakEventFieldIds.initiateInvestigation,
                allFields
            ) as Date,
            conductEpidemiologicalAnalysis: getDateFieldValue(
                diseaseOutbreakEventFieldIds.conductEpidemiologicalAnalysis,
                allFields
            ) as Date,
            laboratoryConfirmation: {
                date: getDateFieldValue(
                    diseaseOutbreakEventFieldIds.laboratoryConfirmationDate,
                    allFields
                ) as Date,
                na: getBooleanFieldValue(
                    diseaseOutbreakEventFieldIds.laboratoryConfirmationNA,
                    allFields
                ),
            },
            appropriateCaseManagement: {
                date: getDateFieldValue(
                    diseaseOutbreakEventFieldIds.appropriateCaseManagementDate,
                    allFields
                ) as Date,
                na: getBooleanFieldValue(
                    diseaseOutbreakEventFieldIds.appropriateCaseManagementNA,
                    allFields
                ),
            },
            initiatePublicHealthCounterMeasures: {
                date: getDateFieldValue(
                    diseaseOutbreakEventFieldIds.initiatePublicHealthCounterMeasuresDate,
                    allFields
                ) as Date,
                na: getBooleanFieldValue(
                    diseaseOutbreakEventFieldIds.initiatePublicHealthCounterMeasuresNA,
                    allFields
                ),
            },
            initiateRiskCommunication: {
                date: getDateFieldValue(
                    diseaseOutbreakEventFieldIds.initiateRiskCommunicationDate,
                    allFields
                ) as Date,
                na: getBooleanFieldValue(
                    diseaseOutbreakEventFieldIds.initiateRiskCommunicationNA,
                    allFields
                ),
            },
            establishCoordination: getDateFieldValue(
                diseaseOutbreakEventFieldIds.establishCoordination,
                allFields
            ) as Date,
            responseNarrative: getStringFieldValue(
                diseaseOutbreakEventFieldIds.responseNarrative,
                allFields
            ),
        },
        incidentManagerName: getStringFieldValue(
            diseaseOutbreakEventFieldIds.incidentManagerName,
            allFields
        ),
        notes: getStringFieldValue(diseaseOutbreakEventFieldIds.notes, allFields),
    };

    const diseaseOutbreakEventBase: DiseaseOutbreakEventBaseAttrs = {
        id: diseaseOutbreakEvent?.id || "",
        created: diseaseOutbreakEvent?.created || new Date(),
        lastUpdated: diseaseOutbreakEvent?.lastUpdated || new Date(),
        createdByName: diseaseOutbreakEvent?.createdByName || currentUserName,
        ...diseaseOutbreakEventEditableData,
    };

    return diseaseOutbreakEventBase;
}

function mapFormStateToRiskAssessmentGrading(formState: FormState): RiskAssessmentGrading {
    const allFields: FormFieldState[] = getAllFieldsFromSections(formState.sections);

    const populationAtRiskSection = allFields.find(field =>
        field.id.includes(riskAssessmentGradingCodes.populationAtRisk)
    );
    const populationValue = populationAtRiskSection?.value as string;
    if (!populationAtRiskSection) throw new Error("Population at risk section not found");

    const attackrateSection = allFields.find(field =>
        field.id.includes(riskAssessmentGradingCodes.attackRate)
    );
    const attackRateValue = attackrateSection?.value as string;
    if (!attackrateSection) throw new Error("Attack rate section not found");

    const geographicalSpreadSection = allFields.find(field =>
        field.id.includes(riskAssessmentGradingCodes.geographicalSpread)
    );
    const geographicalSpreadValue = geographicalSpreadSection?.value as string;
    if (!geographicalSpreadSection) throw new Error("Geographical spread section not found");

    const complexitySection = allFields.find(field =>
        field.id.includes(riskAssessmentGradingCodes.complexity)
    );
    const complexityValue = complexitySection?.value as string;
    if (!complexitySection) throw new Error("Complexity section not found");

    const capacitySection = allFields.find(field =>
        field.id.includes(riskAssessmentGradingCodes.capacity)
    );
    const capacityValue = capacitySection?.value as string;
    if (!capacitySection) throw new Error("Capacity section not found");

    const capabilitySection = allFields.find(field =>
        field.id.includes(riskAssessmentGradingCodes.capability)
    );
    const capabilityValue = capabilitySection?.value as string;
    if (!capabilitySection) throw new Error("Capability section not found");

    const reputationalRiskSection = allFields.find(field =>
        field.id.includes(riskAssessmentGradingCodes.reputationalRisk)
    );
    const reputationalRiskValue = reputationalRiskSection?.value as string;
    if (!reputationalRiskSection) throw new Error("Reputational risk section not found");

    const severitySection = allFields.find(field =>
        field.id.includes(riskAssessmentGradingCodes.severity)
    );
    const severityValue = severitySection?.value as string;
    if (!severitySection) throw new Error("Severity section not found");

    const riskAssessmentGrading: RiskAssessmentGrading = RiskAssessmentGrading.create({
        id: "",
        lastUpdated: new Date(),
        populationAtRisk: {
            type: populationValue,
            weight: getWeightBasedOnOptionType(populationValue),
        } as LowPopulationAtRisk | MediumPopulationAtRisk | HighPopulationAtRisk,
        attackRate: {
            type: attackRateValue,
            weight: getWeightBasedOnOptionType(attackRateValue),
        } as LowWeightedOption | MediumWeightedOption | HighWeightedOption,
        geographicalSpread: {
            type: geographicalSpreadValue,
            weight: getWeightBasedOnOptionType(geographicalSpreadValue),
        } as LowGeographicalSpread | MediumGeographicalSpread | HighGeographicalSpread,
        complexity: {
            type: complexityValue,
            weight: getWeightBasedOnOptionType(complexityValue),
        } as LowWeightedOption | MediumWeightedOption | HighWeightedOption,
        capacity: {
            type: capacityValue,
            weight: getWeightBasedOnOptionType(capacityValue),
        } as LowCapacity | MediumCapacity | HighCapacity,
        capability: {
            type: capabilityValue,
            weight: getWeightBasedOnOptionType(capabilityValue),
        } as Capability1 | Capability2,
        reputationalRisk: {
            type: reputationalRiskValue,
            weight: getWeightBasedOnOptionType(reputationalRiskValue),
        } as LowWeightedOption | MediumWeightedOption | HighWeightedOption,
        severity: {
            type: severityValue,
            weight: getWeightBasedOnOptionType(severityValue),
        } as LowWeightedOption | MediumWeightedOption | HighWeightedOption,
    });
    return riskAssessmentGrading;
}

export function getWeightBasedOnOptionType(optionType: string) {
    switch (optionType) {
        case "HighPercentage":
        case "High":
        case "MoreThanOneProvince":
        case "NationalInternationalLevel":
        case "Grade3":
            return 3;
        case "Medium":
        case "MediumPercentage":
        case "MoretThanOneDistrict":
        case "Capability2":
        case "ProvincialLevel":
        case "Grade2":
            return 2;
        case "Low":
        case "LessPercentage":
        case "WithinDistrict":
        case "Capability1":
        case "ProvincialNationalLevel":
        case "Grade1":
            return 1;
    }
}
