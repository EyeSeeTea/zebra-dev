import { DiseaseOutbreakEventBaseAttrs } from "../../../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { DiseaseOutbreakEventWithOptions } from "../../../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEventWithOptions";
import {
    FormFieldState,
    FormState,
    getAllFieldsFromSections,
    getFieldValueById,
} from "../../../../components/form/FormState";
import { CodedNamedRef } from "../../../../../domain/entities/Ref";
import { getFieldIdFromIdsDictionary } from "../../../../components/form/FormState";
import { UserOption } from "../../../../components/user-selector/UserSelector";
import { Option } from "../../../../components/utils/option";

export const diseaseOutbreakEventFieldIds = {
    name: "name",
    hazardType: "hazardType",
    mainSyndromeCode: "mainSyndromeCode",
    suspectedDiseaseCode: "suspectedDiseaseCode",
    notificationSourceCode: "notificationSourceCode",
    areasAffectedProvinceIds: "areasAffectedProvinceIds",
    areasAffectedDistrictIds: "areasAffectedDistrictIds",
    incidentStatus: "incidentStatus",
    emergedDate: "emerged_date",
    emergedNarrative: "emerged_narrative",
    detectedDate: "detected_date",
    detectedNarrative: "detected_narrative",
    notifiedDate: "notified_date",
    notifiedNarrative: "notified_narrative",
    initiateInvestigation: "initiateInvestigation",
    conductEpidemiologicalAnalysis: "conductEpidemiologicalAnalysis",
    laboratoryConfirmationDate: "laboratoryConfirmation_date",
    laboratoryConfirmationNA: "laboratoryConfirmation_na",
    appropriateCaseManagementDate: "appropriateCaseManagement_date",
    appropriateCaseManagementNA: "appropriateCaseManagement_na",
    initiatePublicHealthCounterMeasuresDate: "initiatePublicHealthCounterMeasures_date",
    initiatePublicHealthCounterMeasuresNA: "initiatePublicHealthCounterMeasures_na",
    initiateRiskCommunicationDate: "initiateRiskCommunication_date",
    initiateRiskCommunicationNA: "initiateRiskCommunication_na",
    establishCoordination: "establishCoordination",
    responseNarrative: "responseNarrative",
    incidentManagerName: "incidentManagerName",
    notes: "notes",
} as const;

export function mapEntityToInitialFormState(
    diseaseOutbreakEventWithOptions: DiseaseOutbreakEventWithOptions
): FormState {
    const { diseaseOutbreakEvent, options } = diseaseOutbreakEventWithOptions;
    const {
        teamMembers,
        organisationUnits,
        hazardTypes,
        mainSyndromes,
        suspectedDiseases,
        notificationSources,
        incidentStatus,
    } = options;

    const teamMemberOptions: UserOption[] = teamMembers.map(tm => ({
        value: tm.username,
        label: tm.name,
        workPosition: tm.role?.name || "",
        phone: tm.phone || "",
        email: tm.email || "",
        status: tm.status || "",
        src: tm.photo?.toString(),
        alt: tm.photo ? `Photo of ${tm.name}` : undefined,
    }));

    const provinceOptions: Option[] = organisationUnits
        .filter(ou => ou.level === "Province")
        .map(ou => ({ value: ou.id, label: ou.name }));

    const districtOptions: Option[] = organisationUnits
        .filter(ou => ou.level === "District")
        .map(ou => ({ value: ou.id, label: ou.name }));

    const hazardTypesOptions: Option[] = mapToPresentationOptions(hazardTypes);
    const mainSyndromesOptions: Option[] = mapToPresentationOptions(mainSyndromes);
    const suspectedDiseasesOptions: Option[] = mapToPresentationOptions(suspectedDiseases);
    const notificationSourcesOptions: Option[] = mapToPresentationOptions(notificationSources);
    const incidentStatusOptions: Option[] = mapToPresentationOptions(incidentStatus);

    return {
        id: diseaseOutbreakEvent?.id || "",
        title: "Create Event",
        saveButtonLabel: "Save & continue",
        isValid: false,
        sections: [
            {
                title: "Event Name",
                id: "name_section",
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: getFieldIdFromIdsDictionary("name", diseaseOutbreakEventFieldIds),
                        isVisible: true,
                        helperText: "Be specific. Include disease, date, and region",
                        errors: [],
                        type: "text",
                        value: diseaseOutbreakEvent?.name || "",
                        multiline: false,
                        required: true,
                        showIsRequired: false,
                    },
                ],
            },
            {
                title: "Hazard Type",
                id: "hazardType_section",
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: getFieldIdFromIdsDictionary("hazardType", diseaseOutbreakEventFieldIds),
                        isVisible: true,
                        errors: [],
                        type: "radio",
                        multiple: false,
                        options: hazardTypesOptions,
                        value: diseaseOutbreakEvent?.hazardType || "",
                        required: true,
                        showIsRequired: false,
                    },
                ],
            },
            {
                title: "Main Syndrome",
                id: "mainSyndrome_section",
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: getFieldIdFromIdsDictionary(
                            "mainSyndromeCode",
                            diseaseOutbreakEventFieldIds
                        ),
                        placeholder: "Select a syndrome",
                        isVisible: true,
                        errors: [],
                        type: "select",
                        multiple: false,
                        options: mainSyndromesOptions,
                        value: diseaseOutbreakEvent?.mainSyndromeCode || "",
                        width: "300px",
                        required: true,
                        showIsRequired: false,
                    },
                ],
            },
            {
                title: "Suspected Disease",
                id: "suspectedDisease_section",
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: getFieldIdFromIdsDictionary(
                            "suspectedDiseaseCode",
                            diseaseOutbreakEventFieldIds
                        ),
                        placeholder: "Select a disease",
                        isVisible: true,
                        errors: [],
                        type: "select",
                        multiple: false,
                        options: suspectedDiseasesOptions,
                        value: diseaseOutbreakEvent?.suspectedDiseaseCode || "",
                        width: "300px",
                        required: true,
                        showIsRequired: false,
                    },
                ],
            },
            {
                title: "Notification Source",
                id: "notificationSource_section",
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: getFieldIdFromIdsDictionary(
                            "notificationSourceCode",
                            diseaseOutbreakEventFieldIds
                        ),
                        placeholder: "Select source",
                        isVisible: true,
                        errors: [],
                        type: "select",
                        multiple: false,
                        options: notificationSourcesOptions,
                        value: diseaseOutbreakEvent?.notificationSourceCode || "",
                        width: "300px",
                        required: true,
                        showIsRequired: false,
                    },
                ],
            },
            {
                title: "Areas Affected",
                id: "areasAffected_section",
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: getFieldIdFromIdsDictionary(
                            "areasAffectedProvinceIds",
                            diseaseOutbreakEventFieldIds
                        ),
                        label: "Provinces",
                        isVisible: true,
                        errors: [],
                        type: "select",
                        multiple: true,
                        options: provinceOptions,
                        value: diseaseOutbreakEvent?.areasAffectedProvinceIds || [],
                        width: "400px",
                        required: true,
                        showIsRequired: false,
                    },
                    {
                        id: getFieldIdFromIdsDictionary(
                            "areasAffectedDistrictIds",
                            diseaseOutbreakEventFieldIds
                        ),
                        label: "Districts",
                        isVisible: true,
                        errors: [],
                        type: "select",
                        multiple: true,
                        options: districtOptions,
                        value: diseaseOutbreakEvent?.areasAffectedDistrictIds || [],
                        width: "400px",
                        required: true,
                        showIsRequired: false,
                    },
                ],
            },
            {
                title: "Incident Status",
                id: "incidentStatus_section",
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: getFieldIdFromIdsDictionary(
                            "incidentStatus",
                            diseaseOutbreakEventFieldIds
                        ),
                        isVisible: true,
                        errors: [],
                        type: "radio",
                        multiple: false,
                        options: incidentStatusOptions,
                        value: diseaseOutbreakEvent?.incidentStatus || "",
                        required: true,
                        showIsRequired: false,
                    },
                ],
            },
            {
                title: "Date Emerged",
                id: "emerged_section",
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: getFieldIdFromIdsDictionary(
                            "emergedDate",
                            diseaseOutbreakEventFieldIds
                        ),
                        isVisible: true,
                        errors: [],
                        type: "date",
                        value: diseaseOutbreakEvent?.emerged.date || null,
                        width: "200px",
                        required: true,
                        showIsRequired: false,
                    },
                    {
                        id: getFieldIdFromIdsDictionary(
                            "emergedNarrative",
                            diseaseOutbreakEventFieldIds
                        ),
                        isVisible: true,
                        label: "Narrative",
                        helperText: "Provide concise details",
                        errors: [],
                        type: "text",
                        value: diseaseOutbreakEvent?.emerged.narrative || "",
                        multiline: false,
                        width: "600px",
                        required: true,
                        showIsRequired: false,
                    },
                ],
            },
            {
                title: "Date Detected",
                id: "detected_section",
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: getFieldIdFromIdsDictionary(
                            "detectedDate",
                            diseaseOutbreakEventFieldIds
                        ),
                        isVisible: true,
                        errors: [],
                        type: "date",
                        value: diseaseOutbreakEvent?.detected.date || null,
                        width: "200px",
                        required: true,
                        showIsRequired: false,
                    },
                    {
                        id: getFieldIdFromIdsDictionary(
                            "detectedNarrative",
                            diseaseOutbreakEventFieldIds
                        ),
                        isVisible: true,
                        label: "Narrative",
                        helperText: "Provide concise details",
                        errors: [],
                        type: "text",
                        value: diseaseOutbreakEvent?.detected.narrative || "",
                        multiline: false,
                        width: "600px",
                        required: true,
                        showIsRequired: false,
                    },
                ],
            },
            {
                title: "Date Notified",
                id: "notified",
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: getFieldIdFromIdsDictionary(
                            "notifiedDate",
                            diseaseOutbreakEventFieldIds
                        ),
                        isVisible: true,
                        errors: [],
                        type: "date",
                        value: diseaseOutbreakEvent?.notified.date || null,
                        width: "200px",
                        required: true,
                        showIsRequired: false,
                    },
                    {
                        id: getFieldIdFromIdsDictionary(
                            "notifiedNarrative",
                            diseaseOutbreakEventFieldIds
                        ),
                        isVisible: true,
                        label: "Narrative",
                        helperText: "Provide concise details",
                        errors: [],
                        type: "text",
                        value: diseaseOutbreakEvent?.notified.narrative || "",
                        multiline: false,
                        width: "600px",
                        required: true,
                        showIsRequired: false,
                    },
                ],
            },
            {
                title: "What early response actions have been completed?",
                id: "response_actions_completed_section",
                isVisible: true,
                required: true,
                direction: "column",
                fields: [],
                subsections: [
                    {
                        title: "1. Initiate investigation or deploy an investigation/response.",
                        id: "1. Initiate investigation or deploy an investigation/response.",
                        isVisible: true,
                        required: true,
                        fields: [
                            {
                                id: getFieldIdFromIdsDictionary(
                                    "initiateInvestigation",
                                    diseaseOutbreakEventFieldIds
                                ),
                                label: "Date Completed",
                                isVisible: true,
                                errors: [],
                                type: "date",
                                value:
                                    diseaseOutbreakEvent?.earlyResponseActions
                                        .initiateInvestigation || null,
                                width: "200px",
                                required: true,
                                showIsRequired: false,
                            },
                        ],
                    },
                    {
                        title: "2. Conduct epidemiological analysis of burden, severity, and risk factors, and perform initial risk assessment.",
                        id: "2. Conduct epidemiological analysis of burden, severity, and risk factors, and perform initial risk assessment.",
                        isVisible: true,
                        required: true,
                        fields: [
                            {
                                id: getFieldIdFromIdsDictionary(
                                    "conductEpidemiologicalAnalysis",
                                    diseaseOutbreakEventFieldIds
                                ),
                                label: "Date Completed",
                                isVisible: true,
                                errors: [],
                                type: "date",
                                value:
                                    diseaseOutbreakEvent?.earlyResponseActions
                                        .conductEpidemiologicalAnalysis || null,
                                width: "200px",
                                required: true,
                                showIsRequired: false,
                            },
                        ],
                    },
                    {
                        id: "3. Obtain laboratory confirmation of the outbreak etiology.",
                        title: "3. Obtain laboratory confirmation of the outbreak etiology.",
                        isVisible: true,
                        required: true,
                        fields: [
                            {
                                id: getFieldIdFromIdsDictionary(
                                    "laboratoryConfirmationDate",
                                    diseaseOutbreakEventFieldIds
                                ),
                                label: "Date Completed",
                                isVisible: true,
                                errors: [],
                                type: "date",
                                value:
                                    diseaseOutbreakEvent?.earlyResponseActions
                                        .laboratoryConfirmation.date || null,
                                width: "200px",
                                hasNotApplicable: true,
                                required: true,
                                showIsRequired: false,
                            },
                            {
                                id: getFieldIdFromIdsDictionary(
                                    "laboratoryConfirmationNA",
                                    diseaseOutbreakEventFieldIds
                                ),
                                label: "N/A",
                                isVisible: true,
                                errors: [],
                                type: "boolean",
                                value:
                                    diseaseOutbreakEvent?.earlyResponseActions
                                        .laboratoryConfirmation.na || false,
                                width: "100px",
                                notApplicableFieldId: getFieldIdFromIdsDictionary(
                                    "laboratoryConfirmationDate",
                                    diseaseOutbreakEventFieldIds
                                ),
                            },
                        ],
                    },
                    {
                        id: "4. Initiate appropriate case management and infection prevention and control (IPC) measures in health facilities.",
                        title: "4. Initiate appropriate case management and infection prevention and control (IPC) measures in health facilities.",
                        isVisible: true,
                        required: true,
                        fields: [
                            {
                                id: getFieldIdFromIdsDictionary(
                                    "appropriateCaseManagementDate",
                                    diseaseOutbreakEventFieldIds
                                ),
                                label: "Date Completed",
                                isVisible: true,
                                errors: [],
                                type: "date",
                                value:
                                    diseaseOutbreakEvent?.earlyResponseActions
                                        .appropriateCaseManagement.date || null,
                                width: "200px",
                                hasNotApplicable: true,
                                required: true,
                                showIsRequired: false,
                            },
                            {
                                id: getFieldIdFromIdsDictionary(
                                    "appropriateCaseManagementNA",
                                    diseaseOutbreakEventFieldIds
                                ),
                                label: "N/A",
                                isVisible: true,
                                errors: [],
                                type: "boolean",
                                value:
                                    diseaseOutbreakEvent?.earlyResponseActions
                                        .appropriateCaseManagement.na || false,
                                width: "100px",
                                notApplicableFieldId: getFieldIdFromIdsDictionary(
                                    "appropriateCaseManagementDate",
                                    diseaseOutbreakEventFieldIds
                                ),
                            },
                        ],
                    },
                    {
                        id: "5. Initiate appropriate public health countermeasures in affected communities.",
                        title: "5. Initiate appropriate public health countermeasures in affected communities.",
                        isVisible: true,
                        required: true,
                        fields: [
                            {
                                id: getFieldIdFromIdsDictionary(
                                    "initiatePublicHealthCounterMeasuresDate",
                                    diseaseOutbreakEventFieldIds
                                ),
                                label: "Date Completed",
                                isVisible: true,
                                errors: [],
                                type: "date",
                                value:
                                    diseaseOutbreakEvent?.earlyResponseActions
                                        .initiatePublicHealthCounterMeasures.date || null,
                                width: "200px",
                                hasNotApplicable: true,
                                required: true,
                                showIsRequired: false,
                            },
                            {
                                label: "N/A",
                                id: getFieldIdFromIdsDictionary(
                                    "initiatePublicHealthCounterMeasuresNA",
                                    diseaseOutbreakEventFieldIds
                                ),
                                isVisible: true,
                                errors: [],
                                type: "boolean",
                                value:
                                    diseaseOutbreakEvent?.earlyResponseActions
                                        .initiatePublicHealthCounterMeasures.na || false,
                                width: "100px",
                                notApplicableFieldId: getFieldIdFromIdsDictionary(
                                    "initiatePublicHealthCounterMeasuresDate",
                                    diseaseOutbreakEventFieldIds
                                ),
                            },
                        ],
                    },
                    {
                        id: "6. Initiate appropriate risk communication and community engagement activities.",
                        title: "6. Initiate appropriate risk communication and community engagement activities.",
                        isVisible: true,
                        required: true,
                        fields: [
                            {
                                id: getFieldIdFromIdsDictionary(
                                    "initiateRiskCommunicationDate",
                                    diseaseOutbreakEventFieldIds
                                ),
                                label: "Date Completed",
                                isVisible: true,
                                errors: [],
                                type: "date",
                                value:
                                    diseaseOutbreakEvent?.earlyResponseActions
                                        .initiateRiskCommunication.date || null,
                                width: "200px",
                                hasNotApplicable: true,
                                required: true,
                                showIsRequired: false,
                            },
                            {
                                id: getFieldIdFromIdsDictionary(
                                    "initiateRiskCommunicationNA",
                                    diseaseOutbreakEventFieldIds
                                ),
                                label: "N/A",
                                isVisible: true,
                                errors: [],
                                type: "boolean",
                                value:
                                    diseaseOutbreakEvent?.earlyResponseActions
                                        .initiateRiskCommunication.na || false,
                                width: "100px",
                                notApplicableFieldId: getFieldIdFromIdsDictionary(
                                    "initiateRiskCommunicationDate",
                                    diseaseOutbreakEventFieldIds
                                ),
                            },
                        ],
                    },
                    {
                        title: "7. Establish a coordination mechanism.",
                        id: "7. Establish a coordination mechanism.",
                        isVisible: true,
                        required: true,
                        fields: [
                            {
                                id: getFieldIdFromIdsDictionary(
                                    "establishCoordination",
                                    diseaseOutbreakEventFieldIds
                                ),
                                label: "Date Completed",
                                isVisible: true,
                                errors: [],
                                type: "date",
                                value:
                                    diseaseOutbreakEvent?.earlyResponseActions
                                        .establishCoordination || null,
                                width: "200px",
                                required: true,
                                showIsRequired: false,
                            },
                        ],
                    },
                    {
                        title: "8. Response narrative",
                        id: "8. Response narrative",
                        isVisible: true,
                        required: true,
                        fields: [
                            {
                                id: getFieldIdFromIdsDictionary(
                                    "responseNarrative",
                                    diseaseOutbreakEventFieldIds
                                ),
                                isVisible: true,
                                errors: [],
                                type: "text",
                                value:
                                    diseaseOutbreakEvent?.earlyResponseActions.responseNarrative ||
                                    "",
                                multiline: true,
                                required: true,
                                showIsRequired: false,
                            },
                        ],
                    },
                ],
            },
            {
                title: "Assign Incident Manager",
                id: "incidentManager_section",
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: getFieldIdFromIdsDictionary(
                            "incidentManagerName",
                            diseaseOutbreakEventFieldIds
                        ),
                        placeholder: "Select a manager",
                        isVisible: true,
                        errors: [],
                        type: "user",
                        options: teamMemberOptions,
                        value: diseaseOutbreakEvent?.incidentManagerName || "",
                        required: true,
                        showIsRequired: false,
                    },
                ],
            },
            {
                title: "Notes",
                id: "notes_section",
                isVisible: true,
                required: false,
                fields: [
                    {
                        id: getFieldIdFromIdsDictionary("notes", diseaseOutbreakEventFieldIds),
                        isVisible: true,
                        errors: [],
                        type: "text",
                        value: diseaseOutbreakEvent?.notes || "",
                        multiline: true,
                    },
                ],
            },
        ],
    };
}

function mapToPresentationOptions(options: CodedNamedRef[]): Option[] {
    return options.map(option => ({
        value: option.code,
        label: option.name,
    }));
}

export function mapFormStateToEntityData(
    formState: FormState,
    currentUserName: string,
    diseaseOutbreakEventWithOptions: DiseaseOutbreakEventWithOptions
): DiseaseOutbreakEventBaseAttrs {
    const { diseaseOutbreakEvent } = diseaseOutbreakEventWithOptions;

    const allFields: FormFieldState[] = getAllFieldsFromSections(formState.sections);

    // TODO fix this: return value types
    const diseaseOutbreakEventEditableData = {
        name: getFieldValueById(diseaseOutbreakEventFieldIds.name, allFields) || "",
        hazardType: getFieldValueById(diseaseOutbreakEventFieldIds.hazardType, allFields) || "",
        mainSyndromeCode:
            getFieldValueById(diseaseOutbreakEventFieldIds.mainSyndromeCode, allFields) || "",
        suspectedDiseaseCode:
            getFieldValueById(diseaseOutbreakEventFieldIds.suspectedDiseaseCode, allFields) || "",
        notificationSourceCode:
            getFieldValueById(diseaseOutbreakEventFieldIds.notificationSourceCode, allFields) || "",
        areasAffectedProvinceIds:
            getFieldValueById(diseaseOutbreakEventFieldIds.areasAffectedProvinceIds, allFields) ||
            [],
        areasAffectedDistrictIds:
            getFieldValueById(diseaseOutbreakEventFieldIds.areasAffectedDistrictIds, allFields) ||
            [],
        incidentStatus:
            getFieldValueById(diseaseOutbreakEventFieldIds.incidentStatus, allFields) || "",
        emerged: {
            date: getFieldValueById(diseaseOutbreakEventFieldIds.emergedDate, allFields) || null,
            narrative:
                getFieldValueById(diseaseOutbreakEventFieldIds.emergedNarrative, allFields) || "",
        },
        detected: {
            date: getFieldValueById(diseaseOutbreakEventFieldIds.detectedDate, allFields) || null,
            narrative:
                getFieldValueById(diseaseOutbreakEventFieldIds.detectedNarrative, allFields) || "",
        },
        notified: {
            date: getFieldValueById(diseaseOutbreakEventFieldIds.notifiedDate, allFields) || null,
            narrative:
                getFieldValueById(diseaseOutbreakEventFieldIds.notifiedNarrative, allFields) || "",
        },
        earlyResponseActions: {
            initiateInvestigation:
                getFieldValueById(diseaseOutbreakEventFieldIds.initiateInvestigation, allFields) ||
                null,
            conductEpidemiologicalAnalysis:
                getFieldValueById(
                    diseaseOutbreakEventFieldIds.conductEpidemiologicalAnalysis,
                    allFields
                ) || null,
            laboratoryConfirmation: {
                laboratoryConfirmationDate:
                    getFieldValueById(
                        diseaseOutbreakEventFieldIds.laboratoryConfirmationDate,
                        allFields
                    ) || null,
                laboratoryConfirmationNA:
                    getFieldValueById(
                        diseaseOutbreakEventFieldIds.laboratoryConfirmationNA,
                        allFields
                    ) || true,
            },
            appropriateCaseManagement: {
                appropriateCaseManagementDate:
                    getFieldValueById(
                        diseaseOutbreakEventFieldIds.appropriateCaseManagementDate,
                        allFields
                    ) || null,
                appropriateCaseManagementNA:
                    getFieldValueById(
                        diseaseOutbreakEventFieldIds.appropriateCaseManagementNA,
                        allFields
                    ) || true,
            },
            initiatePublicHealthCounterMeasures: {
                initiatePublicHealthCounterMeasuresDate:
                    getFieldValueById(
                        diseaseOutbreakEventFieldIds.initiatePublicHealthCounterMeasuresDate,
                        allFields
                    ) || null,
                initiatePublicHealthCounterMeasuresNA:
                    getFieldValueById(
                        diseaseOutbreakEventFieldIds.initiatePublicHealthCounterMeasuresNA,
                        allFields
                    ) || true,
            },
            initiateRiskCommunication: {
                initiateRiskCommunicationDate:
                    getFieldValueById(
                        diseaseOutbreakEventFieldIds.initiateRiskCommunicationDate,
                        allFields
                    ) || null,
                initiateRiskCommunicationNA:
                    getFieldValueById(
                        diseaseOutbreakEventFieldIds.initiateRiskCommunicationNA,
                        allFields
                    ) || true,
            },
            establishCoordination:
                getFieldValueById(diseaseOutbreakEventFieldIds.establishCoordination, allFields) ||
                null,
            responseNarrative:
                getFieldValueById(diseaseOutbreakEventFieldIds.responseNarrative, allFields) || "",
        },
        incidentManagerName:
            getFieldValueById(diseaseOutbreakEventFieldIds.incidentManagerName, allFields) ||
            undefined,
        notes: getFieldValueById(diseaseOutbreakEventFieldIds.notes, allFields) || "",
    };

    const diseaseOutbreakEventBase: DiseaseOutbreakEventBaseAttrs = {
        id: diseaseOutbreakEvent?.id || "",
        created: diseaseOutbreakEvent?.created || new Date(),
        lastUpdated: diseaseOutbreakEvent?.lastUpdated || new Date(),
        createdByName: diseaseOutbreakEvent?.createdByName || currentUserName,
        ...diseaseOutbreakEventEditableData,
    } as unknown as DiseaseOutbreakEventBaseAttrs; // TODO fix this type

    return {
        ...diseaseOutbreakEventBase,
    };
}
