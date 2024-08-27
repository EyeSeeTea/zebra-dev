import { DiseaseOutbreakEventWithOptions } from "../../../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEventWithOptions";
import { Option } from "../../../../../domain/entities/Ref";
import { getFieldIdFromIdsDictionary } from "../../../../components/form/FormFieldsState";
import { FormState } from "../../../../components/form/FormState";
import { UserOption } from "../../../../components/user-selector/UserSelector";
import { Option as PresentationOption } from "../../../../components/utils/option";

export const diseaseOutbreakEventFieldIds = {
    name: "name",
    dataSource: "dataSource",
    hazardType: "hazardType",
    mainSyndromeCode: "mainSyndromeCode",
    suspectedDiseaseCode: "suspectedDiseaseCode",
    notificationSourceCode: "notificationSourceCode",
    areasAffectedProvinceIds: "areasAffectedProvinceIds",
    areasAffectedDistrictIds: "areasAffectedDistrictIds",
    incidentStatus: "incidentStatus",
    emergedDate: "emergedDate",
    emergedNarrative: "emergedNarrative",
    detectedDate: "detectedDate",
    detectedNarrative: "detectedNarrative",
    notifiedDate: "notifiedDate",
    notifiedNarrative: "notifiedNarrative",
    initiateInvestigation: "initiateInvestigation",
    conductEpidemiologicalAnalysis: "conductEpidemiologicalAnalysis",
    laboratoryConfirmationDate: "laboratoryConfirmationDate",
    laboratoryConfirmationNA: "laboratoryConfirmationNA",
    appropriateCaseManagementDate: "appropriateCaseManagementDate",
    appropriateCaseManagementNA: "appropriateCaseManagementNA",
    initiatePublicHealthCounterMeasuresDate: "initiatePublicHealthCounterMeasuresDate",
    initiatePublicHealthCounterMeasuresNA: "initiatePublicHealthCounterMeasuresNA",
    initiateRiskCommunicationDate: "initiateRiskCommunicationDate",
    initiateRiskCommunicationNA: "initiateRiskCommunicationNA",
    establishCoordination: "establishCoordination",
    responseNarrative: "responseNarrative",
    incidentManagerName: "incidentManagerName",
    notes: "notes",
} as const;

// TODO: Thinking for the future about generate this FormState by iterating over Object.Keys(diseaseOutbreakEvent)
export function mapEntityToInitialFormState(
    diseaseOutbreakEventWithOptions: DiseaseOutbreakEventWithOptions
): FormState {
    const { diseaseOutbreakEvent, options } = diseaseOutbreakEventWithOptions;
    const {
        dataSources,
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

    const dataSourcesOptions: PresentationOption[] = mapToPresentationOptions(dataSources);
    const hazardTypesOptions: PresentationOption[] = mapToPresentationOptions(hazardTypes);
    const mainSyndromesOptions: PresentationOption[] = mapToPresentationOptions(mainSyndromes);
    const suspectedDiseasesOptions: PresentationOption[] =
        mapToPresentationOptions(suspectedDiseases);
    const notificationSourcesOptions: PresentationOption[] =
        mapToPresentationOptions(notificationSources);
    const incidentStatusOptions: PresentationOption[] = mapToPresentationOptions(incidentStatus);

    const isEBSDataSource = diseaseOutbreakEvent?.dataSource === "EBS";
    const isIBSDataSource = diseaseOutbreakEvent?.dataSource === "IBS";

    return {
        id: diseaseOutbreakEvent?.id || "",
        title: "Create Event",
        saveButtonLabel: "Save & Continue",
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
                title: "Event Source",
                id: "dataSource_section",
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: getFieldIdFromIdsDictionary("dataSource", diseaseOutbreakEventFieldIds),
                        placeholder: "Select an event source",
                        isVisible: true,
                        errors: [],
                        type: "select",
                        multiple: false,
                        options: dataSourcesOptions,
                        value: diseaseOutbreakEvent?.dataSource || "",
                        width: "300px",
                        required: true,
                        showIsRequired: false,
                    },
                ],
            },
            {
                title: "Hazard Type",
                id: "hazardType_section",
                isVisible: isEBSDataSource,
                required: true,
                fields: [
                    {
                        id: getFieldIdFromIdsDictionary("hazardType", diseaseOutbreakEventFieldIds),
                        isVisible: isEBSDataSource,
                        errors: [],
                        type: "radio",
                        multiple: false,
                        options: hazardTypesOptions,
                        value: isEBSDataSource ? diseaseOutbreakEvent?.hazardType || "" : "",
                        required: true,
                        showIsRequired: false,
                    },
                ],
            },
            {
                title: "Main Syndrome",
                id: "mainSyndrome_section",
                isVisible: isIBSDataSource,
                required: true,
                fields: [
                    {
                        id: getFieldIdFromIdsDictionary(
                            "mainSyndromeCode",
                            diseaseOutbreakEventFieldIds
                        ),
                        placeholder: "Select a syndrome",
                        isVisible: isIBSDataSource,
                        errors: [],
                        type: "select",
                        multiple: false,
                        options: mainSyndromesOptions,
                        value: isIBSDataSource ? diseaseOutbreakEvent?.mainSyndromeCode || "" : "",
                        width: "300px",
                        required: true,
                        showIsRequired: false,
                    },
                ],
            },
            {
                title: "Suspected Disease",
                id: "suspectedDisease_section",
                isVisible: !isEBSDataSource,
                required: true,
                fields: [
                    {
                        id: getFieldIdFromIdsDictionary(
                            "suspectedDiseaseCode",
                            diseaseOutbreakEventFieldIds
                        ),
                        placeholder: "Select a disease",
                        isVisible: !isEBSDataSource,
                        errors: [],
                        type: "select",
                        multiple: false,
                        options: suspectedDiseasesOptions,
                        value: isEBSDataSource
                            ? ""
                            : diseaseOutbreakEvent?.suspectedDiseaseCode || "",
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
                                disabled:
                                    diseaseOutbreakEvent?.earlyResponseActions
                                        .laboratoryConfirmation.na,
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
                                width: "65px",
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
                                disabled:
                                    diseaseOutbreakEvent?.earlyResponseActions
                                        .appropriateCaseManagement.na,
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
                                width: "65px",
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
                                disabled:
                                    diseaseOutbreakEvent?.earlyResponseActions
                                        .initiatePublicHealthCounterMeasures.na,
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
                                width: "65px",
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
                                disabled:
                                    diseaseOutbreakEvent?.earlyResponseActions
                                        .initiateRiskCommunication.na,
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
                                width: "65px",
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
