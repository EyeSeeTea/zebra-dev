import {
    DataSource,
    DiseaseOutbreakEventBaseAttrs,
    HazardType,
    IncidentStatusType,
} from "../../../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { FormState } from "../../../../components/form/FormState";
import { diseaseOutbreakEventFieldIds } from "../mapDiseaseOutbreakEventToInitialFormState";
import {
    FormFieldState,
    getAllFieldsFromSections,
    getBooleanFieldValue,
    getDateFieldValue,
    getMultipleOptionsFieldValue,
    getStringFieldValue,
} from "../../../../components/form/FormFieldsState";
import { DiseaseOutbreakEventFormData } from "../../../../../domain/entities/ConfigurableForm";

export function mapFormStateToEntityData(
    formState: FormState,
    currentUserName: string,
    configurableDiseaseOutbreakEventForm: DiseaseOutbreakEventFormData
): DiseaseOutbreakEventBaseAttrs {
    const diseaseOutbreakEvent = configurableDiseaseOutbreakEventForm.entity;
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
        ) as IncidentStatusType,
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
