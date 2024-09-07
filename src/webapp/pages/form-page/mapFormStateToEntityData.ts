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
import { RiskAssessmentGrading } from "../../../domain/entities/risk-assessment/RiskAssessmentGrading";
import { riskAssessmentGradingCodes } from "../../../data/repositories/consts/RiskAssessmentGradingConstants";

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

    const populationValue = allFields.find(field =>
        field.id.includes(riskAssessmentGradingCodes.populationAtRisk)
    )?.value as string;
    const attackRateValue = allFields.find(field =>
        field.id.includes(riskAssessmentGradingCodes.attackRate)
    )?.value as string;
    const geographicalSpreadValue = allFields.find(field =>
        field.id.includes(riskAssessmentGradingCodes.geographicalSpread)
    )?.value as string;
    const complexityValue = allFields.find(field =>
        field.id.includes(riskAssessmentGradingCodes.complexity)
    )?.value as string;
    const capacityValue = allFields.find(field =>
        field.id.includes(riskAssessmentGradingCodes.capacity)
    )?.value as string;
    const capabilityValue = allFields.find(field =>
        field.id.includes(riskAssessmentGradingCodes.capability)
    )?.value as string;
    const reputationalRiskValue = allFields.find(field =>
        field.id.includes(riskAssessmentGradingCodes.reputationalRisk)
    )?.value as string;
    const severityValue = allFields.find(field =>
        field.id.includes(riskAssessmentGradingCodes.severity)
    )?.value as string;

    const riskAssessmentGrading: RiskAssessmentGrading = RiskAssessmentGrading.create({
        id: "",
        lastUpdated: new Date(),
        populationAtRisk: RiskAssessmentGrading.getOptionTypeByCodePopulation(populationValue),
        attackRate: RiskAssessmentGrading.getOptionTypeByCodeWeighted(attackRateValue),
        geographicalSpread:
            RiskAssessmentGrading.getOptionTypeByCodeGeographicalSpread(geographicalSpreadValue),
        complexity: RiskAssessmentGrading.getOptionTypeByCodeWeighted(complexityValue),
        capacity: RiskAssessmentGrading.getOptionTypeByCodeCapacity(capacityValue),
        capability: RiskAssessmentGrading.getOptionTypeByCodeCapability(capabilityValue),
        reputationalRisk: RiskAssessmentGrading.getOptionTypeByCodeWeighted(reputationalRiskValue),
        severity: RiskAssessmentGrading.getOptionTypeByCodeWeighted(severityValue),
    });
    return riskAssessmentGrading;
}
