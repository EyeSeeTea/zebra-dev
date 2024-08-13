import {
    DiseaseOutbreakEventBaseAttrs,
    IncidentStatusType,
} from "../../../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { DiseaseOutbreakEventWithOptions } from "../../../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEventWithOptions";
import {
    FormFieldState,
    FormState,
    getAllFieldsFromSections,
    getDateFieldValue,
    getMultipleOptionsFieldValue,
    getBooleanFieldValue,
    getStringFieldValue,
} from "../../../../components/form/FormState";
import { Option } from "../../../../../domain/entities/Ref";
import { getFieldIdFromIdsDictionary } from "../../../../components/form/FormState";
import { UserOption } from "../../../../components/user-selector/UserSelector";
import { Option as PresentationOption } from "../../../../components/utils/option";
import { isHazardType } from "../../../../../data/repositories/consts/DiseaseOutbreakConstants";

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

    const hazardTypesOptions: PresentationOption[] = mapToPresentationOptions(hazardTypes);
    const mainSyndromesOptions: PresentationOption[] = mapToPresentationOptions(mainSyndromes);
    const suspectedDiseasesOptions: PresentationOption[] =
        mapToPresentationOptions(suspectedDiseases);
    const notificationSourcesOptions: PresentationOption[] =
        mapToPresentationOptions(notificationSources);
    const incidentStatusOptions: PresentationOption[] = mapToPresentationOptions(incidentStatus);

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
                        maxWidth: "600px",
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
                        maxWidth: "600px",
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
                        maxWidth: "600px",
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

function mapToPresentationOptions(options: Option[]): PresentationOption[] {
    return options.map(
        (option): PresentationOption => ({
            value: option.id,
            label: option.name,
        })
    );
}

export function mapFormStateToEntityData(
    formState: FormState,
    currentUserName: string,
    diseaseOutbreakEventWithOptions: DiseaseOutbreakEventWithOptions
): DiseaseOutbreakEventBaseAttrs {
    const { diseaseOutbreakEvent } = diseaseOutbreakEventWithOptions;

    const allFields: FormFieldState[] = getAllFieldsFromSections(formState.sections);

    const hazardType = getStringFieldValue(diseaseOutbreakEventFieldIds.hazardType, allFields);

    const diseaseOutbreakEventEditableData = {
        name: getStringFieldValue(diseaseOutbreakEventFieldIds.name, allFields),
        hazardType: isHazardType(hazardType) ? hazardType : "Unknown",
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
        eventId: diseaseOutbreakEvent?.eventId,
        created: diseaseOutbreakEvent?.created || new Date(),
        lastUpdated: diseaseOutbreakEvent?.lastUpdated || new Date(),
        createdByName: diseaseOutbreakEvent?.createdByName || currentUserName,
        ...diseaseOutbreakEventEditableData,
    };

    return diseaseOutbreakEventBase;
}
