import _ from "../../../../../domain/entities/generic/Collection";
import { DiseaseOutbreakEventBaseAttrs } from "../../../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { DiseaseOutbreakEventWithOptions } from "../../../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEventWithOptions";
import { FormState } from "../../../../components/form/FormState";
import { diseaseOutbreakEventFieldIds } from "./mapEntityToInitialFormState";
import {
    FormFieldState,
    getAllFieldsFromSections,
    getBooleanFieldValue,
    getDateFieldValue,
    getMultipleOptionsFieldValue,
    getStringFieldValue,
} from "../../../../components/form/FormFieldsState";
import {
    getHazardTypeFromString,
    dataSourceMap,
    incidentStatusMap,
} from "../../../../../data/repositories/consts/DiseaseOutbreakConstants";

type DateFieldIdsToValidate =
    | "emergedDate"
    | "detectedDate"
    | "notifiedDate"
    | "initiateInvestigation"
    | "conductEpidemiologicalAnalysis"
    | "establishCoordination";

export function mapFormStateToEntityData(
    formState: FormState,
    currentUserName: string,
    diseaseOutbreakEventWithOptions: DiseaseOutbreakEventWithOptions
): DiseaseOutbreakEventBaseAttrs {
    const { diseaseOutbreakEvent } = diseaseOutbreakEventWithOptions;

    const allFields: FormFieldState[] = getAllFieldsFromSections(formState.sections);

    const dataSource =
        dataSourceMap[getStringFieldValue(diseaseOutbreakEventFieldIds.dataSource, allFields)];

    const incidentStatus =
        incidentStatusMap[
            getStringFieldValue(diseaseOutbreakEventFieldIds.incidentStatus, allFields)
        ];

    if (!dataSource || !incidentStatus)
        throw new Error(`Data source or incident status not valid.`);

    const dateValuesByFieldId = getValidDateValuesByFieldIdFromFields(allFields);

    const diseaseOutbreakEventEditableData = {
        name: getStringFieldValue(diseaseOutbreakEventFieldIds.name, allFields),
        dataSource: dataSource,
        hazardType: getHazardTypeFromString(
            getStringFieldValue(diseaseOutbreakEventFieldIds.hazardType, allFields)
        ),
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
        incidentStatus: incidentStatus,
        emerged: {
            date: dateValuesByFieldId.emergedDate,
            narrative: getStringFieldValue(
                diseaseOutbreakEventFieldIds.emergedNarrative,
                allFields
            ),
        },
        detected: {
            date: dateValuesByFieldId.detectedDate,
            narrative: getStringFieldValue(
                diseaseOutbreakEventFieldIds.detectedNarrative,
                allFields
            ),
        },
        notified: {
            date: dateValuesByFieldId.notifiedDate,
            narrative: getStringFieldValue(
                diseaseOutbreakEventFieldIds.notifiedNarrative,
                allFields
            ),
        },
        earlyResponseActions: {
            initiateInvestigation: dateValuesByFieldId.initiateInvestigation,
            conductEpidemiologicalAnalysis: dateValuesByFieldId.conductEpidemiologicalAnalysis,
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
            establishCoordination: dateValuesByFieldId.establishCoordination,
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

function getValidDateValuesByFieldIdFromFields(
    allFields: FormFieldState[]
): Record<DateFieldIdsToValidate, Date> {
    const getFromAllFields = (fieldId: keyof typeof diseaseOutbreakEventFieldIds): Date => {
        const maybeDate = getDateFieldValue(fieldId, allFields);

        if (maybeDate === null) {
            throw new Error(`Invalid date value.`);
        } else {
            return maybeDate;
        }
    };

    return {
        emergedDate: getFromAllFields(diseaseOutbreakEventFieldIds.emergedDate),
        detectedDate: getFromAllFields(diseaseOutbreakEventFieldIds.detectedDate),
        notifiedDate: getFromAllFields(diseaseOutbreakEventFieldIds.notifiedDate),
        initiateInvestigation: getFromAllFields(diseaseOutbreakEventFieldIds.initiateInvestigation),
        conductEpidemiologicalAnalysis: getFromAllFields(
            diseaseOutbreakEventFieldIds.conductEpidemiologicalAnalysis
        ),
        establishCoordination: getFromAllFields(diseaseOutbreakEventFieldIds.establishCoordination),
    };
}
