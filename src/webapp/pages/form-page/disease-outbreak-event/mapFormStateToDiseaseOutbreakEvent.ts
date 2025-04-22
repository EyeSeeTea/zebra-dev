import { DiseaseOutbreakEventFormData } from "../../../../domain/entities/ConfigurableForm";
import {
    DiseaseOutbreakEvent,
    CasesDataSource,
    DiseaseOutbreakEventBaseAttrs,
} from "../../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Maybe } from "../../../../utils/ts-utils";
import {
    FormFieldState,
    getAllFieldsFromSections,
    getStringFieldValue,
    getMultipleOptionsFieldValue,
    getFieldFileDataById,
} from "../../../components/form/FormFieldsState";
import { FormState } from "../../../components/form/FormState";
import { getCaseDataFromField } from "./CaseDataFileFieldHelper";
import { diseaseOutbreakEventFieldIds } from "./mapDiseaseOutbreakEventToInitialFormState";

export function mapFormStateToDiseaseOutbreakEvent(
    formState: FormState,
    currentUserName: string,
    formData: DiseaseOutbreakEventFormData
): DiseaseOutbreakEvent {
    const { entity: diseaseOutbreakEvent, type: formType } = formData;
    const allFields: FormFieldState[] = getAllFieldsFromSections(formState.sections);

    return formType === "disease-outbreak-event"
        ? getDiseaseOutbreakEventFromDiseaseOutbreakForm(
              currentUserName,
              diseaseOutbreakEvent,
              allFields
          )
        : getDiseaseOutbreakEventFromDiseaseOutbreakCaseDataForm(
              currentUserName,
              diseaseOutbreakEvent,
              allFields
          );
}

function getDiseaseOutbreakEventFromDiseaseOutbreakForm(
    currentUserName: string,
    diseaseOutbreakEvent: Maybe<DiseaseOutbreakEvent>,
    allFields: FormFieldState[]
): DiseaseOutbreakEvent {
    const diseaseOutbreakEventEditableData = {
        name: getStringFieldValue(diseaseOutbreakEventFieldIds.name, allFields),
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
        incidentManagerName: getStringFieldValue(
            diseaseOutbreakEventFieldIds.incidentManagerName,
            allFields
        ),
        notes: getStringFieldValue(diseaseOutbreakEventFieldIds.notes, allFields),
        casesDataSource: getStringFieldValue(
            diseaseOutbreakEventFieldIds.casesDataSource,
            allFields
        ) as CasesDataSource,
    };

    const isCasesDataUserDefined =
        diseaseOutbreakEventEditableData.casesDataSource ===
        CasesDataSource.RTSL_ZEB_OS_CASE_DATA_SOURCE_USER_DEF;

    const uploadedCasesSheetData = isCasesDataUserDefined
        ? getFieldFileDataById(diseaseOutbreakEventFieldIds.casesDataFile, allFields)
        : undefined;

    const hasCasesDataChange = isCasesDataUserDefined && uploadedCasesSheetData;

    const casesData = hasCasesDataChange
        ? getCaseDataFromField(uploadedCasesSheetData, currentUserName)
        : diseaseOutbreakEvent?.uploadedCasesData;

    const diseaseOutbreakEventBase: DiseaseOutbreakEventBaseAttrs = {
        id: diseaseOutbreakEvent?.id || "",
        status: diseaseOutbreakEvent?.status || "ACTIVE",
        created: diseaseOutbreakEvent?.created,
        lastUpdated: diseaseOutbreakEvent?.lastUpdated,
        createdByName: diseaseOutbreakEvent?.createdByName || currentUserName,
        ...diseaseOutbreakEventEditableData,
    };
    const newDiseaseOutbreakEvent = new DiseaseOutbreakEvent({
        ...diseaseOutbreakEventBase,
        uploadedCasesData: undefined,

        // NOTICE: Not needed but required
        createdBy: undefined,
        mainSyndrome: undefined,
        suspectedDisease: undefined,
        notificationSource: undefined,
        incidentManager: undefined,
        riskAssessment: undefined,
        incidentActionPlan: undefined,
        incidentManagementTeam: undefined,
    });

    return casesData
        ? newDiseaseOutbreakEvent.addUploadedCasesData(casesData)
        : newDiseaseOutbreakEvent;
}

function getDiseaseOutbreakEventFromDiseaseOutbreakCaseDataForm(
    currentUserName: string,
    diseaseOutbreakEvent: Maybe<DiseaseOutbreakEvent>,
    allFields: FormFieldState[]
): DiseaseOutbreakEvent {
    if (!diseaseOutbreakEvent) {
        throw new Error("Disease Outbreak Event is required");
    }

    const isCasesDataUserDefined =
        diseaseOutbreakEvent.casesDataSource ===
        CasesDataSource.RTSL_ZEB_OS_CASE_DATA_SOURCE_USER_DEF;

    const uploadedCasesSheetData = isCasesDataUserDefined
        ? getFieldFileDataById(diseaseOutbreakEventFieldIds.casesDataFile, allFields)
        : undefined;

    const hasCasesDataChange = isCasesDataUserDefined && uploadedCasesSheetData;

    const casesData = hasCasesDataChange
        ? getCaseDataFromField(uploadedCasesSheetData, currentUserName)
        : diseaseOutbreakEvent.uploadedCasesData;

    const diseaseOutbreakEventBase: DiseaseOutbreakEventBaseAttrs = {
        ...diseaseOutbreakEvent,
    };
    const newDiseaseOutbreakEvent = new DiseaseOutbreakEvent({
        ...diseaseOutbreakEventBase,
        uploadedCasesData: undefined,

        // NOTICE: Not needed but required
        createdBy: undefined,
        mainSyndrome: undefined,
        suspectedDisease: undefined,
        notificationSource: undefined,
        incidentManager: undefined,
        riskAssessment: undefined,
        incidentActionPlan: undefined,
        incidentManagementTeam: undefined,
    });

    return casesData
        ? newDiseaseOutbreakEvent.addUploadedCasesData(casesData)
        : newDiseaseOutbreakEvent;
}
