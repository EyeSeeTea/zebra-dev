import i18n from "@eyeseetea/d2-ui-components/locales";
import { DiseaseOutbreakEventFormData } from "../../../../domain/entities/ConfigurableForm";
import {
    CasesDataSource,
    DataSource,
} from "../../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { TeamMember } from "../../../../domain/entities/incident-management-team/TeamMember";
import { getFieldIdFromIdsDictionary } from "../../../components/form/FormFieldsState";
import { FormSectionState } from "../../../components/form/FormSectionsState";
import { FormState } from "../../../components/form/FormState";
import { User } from "../../../components/user-selector/UserSelector";
import { Option as PresentationOption } from "../../../components/utils/option";
import { mapToPresentationOptions } from "../mapEntityToFormState";
import {
    DiseaseNames,
    HazardNames,
} from "../../../../domain/entities/disease-outbreak-event/PerformanceOverviewMetrics";

export const diseaseOutbreakEventFieldIds = {
    name: "name",
    casesDataSource: "casesDataSource",
    casesDataFile: "casesDataFile",
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
    laboratoryConfirmation: "laboratoryConfirmation",
    appropriateCaseManagementDate: "appropriateCaseManagementDate",
    appropriateCaseManagementNA: "appropriateCaseManagementNA",
    initiatePublicHealthCounterMeasuresDate: "initiatePublicHealthCounterMeasuresDate",
    initiatePublicHealthCounterMeasuresNA: "initiatePublicHealthCounterMeasuresNA",
    initiateRiskCommunicationDate: "initiateRiskCommunicationDate",
    initiateRiskCommunicationNA: "initiateRiskCommunicationNA",
    establishCoordinationNa: "establishCoordinationNa",
    establishCoordinationDate: "establishCoordinationDate",
    responseNarrative: "responseNarrative",
    incidentManagerName: "incidentManagerName",
    notes: "notes",
} as const;

export function mapTeamMemberToUser(teamMember: TeamMember): User {
    const teamRoles = teamMember.teamRoles?.map(role => role.name).join(", ");
    return {
        value: teamMember.username,
        label: teamMember.name,
        workPosition: teamMember.workPosition || "",
        teamRoles: teamRoles || "",
        phone: teamMember.phone || "",
        email: teamMember.email || "",
        status: teamMember.status || "",
        src: teamMember.photo?.toString(),
        alt: teamMember.photo ? `Photo of ${teamMember.name}` : undefined,
    };
}
type MainSectionKeys =
    | "name"
    | "casesDataSource"
    | "casesDataFile"
    | "dataSource"
    | "hazardType"
    | "mainSyndrome"
    | "suspectedDisease"
    | "notificationSource"
    | "incidentStatus"
    | "dateEmerged"
    | "dateDetected"
    | "dateNotified"
    | "responseActions"
    | "incidentManager"
    | "notes";

type ResponseActionsSubsectionKeys =
    | "initiateInvestigation"
    | "conductEpidemiologicalAnalysis"
    | "laboratoryConfirmation"
    | "appropriateCaseManagement"
    | "initiatePublicHealthCounterMeasures"
    | "initiateRiskCommunication"
    | "establishCoordination"
    | "responseNarrative";

// TODO: Thinking for the future about generate this FormState by iterating over Object.Keys(diseaseOutbreakEvent)
export function mapDiseaseOutbreakEventToInitialFormState(
    diseaseOutbreakEventWithOptions: DiseaseOutbreakEventFormData,
    editMode: boolean,
    existingEventTrackerTypes: (DiseaseNames | HazardNames)[]
): FormState {
    return diseaseOutbreakEventWithOptions.type === "disease-outbreak-event"
        ? getInitialFormStateForDiseaseOutbreakEvent(
              diseaseOutbreakEventWithOptions,
              editMode,
              existingEventTrackerTypes
          )
        : getInitialFormStateForDiseaseOutbreakCaseData(diseaseOutbreakEventWithOptions);
}

function getInitialFormStateForDiseaseOutbreakEvent(
    diseaseOutbreakEventWithOptions: DiseaseOutbreakEventFormData,
    editMode: boolean,
    existingEventTrackerTypes: (DiseaseNames | HazardNames)[]
): FormState {
    const {
        entity: diseaseOutbreakEvent,
        options,
        caseDataFileTemplete,
        uploadedCasesDataFile,
        uploadedCasesDataFileId,
    } = diseaseOutbreakEventWithOptions;

    const {
        dataSources,
        incidentManagers,
        hazardTypes,
        mainSyndromes,
        suspectedDiseases,
        notificationSources,
        incidentStatus,
        casesDataSource,
    } = options;

    //If An Event Tracker has already been created for a given suspected disease or harzd type,
    //then do not allow to create another one. Remove it from dropwdown options
    const filteredHazardTypes = hazardTypes.filter(hazardType => {
        return !existingEventTrackerTypes.includes(hazardType.name as HazardNames);
    });
    const filteredSuspectedDiseases = suspectedDiseases.filter(suspectedDisease => {
        return !existingEventTrackerTypes.includes(suspectedDisease.name as DiseaseNames);
    });

    const teamMemberOptions: User[] = incidentManagers.map(tm => mapTeamMemberToUser(tm));
    const dataSourcesOptions: PresentationOption[] = mapToPresentationOptions(dataSources);
    const casesDataSourceOptions: PresentationOption[] = mapToPresentationOptions(casesDataSource);
    const hazardTypesOptions: PresentationOption[] = mapToPresentationOptions(filteredHazardTypes);
    const mainSyndromesOptions: PresentationOption[] = mapToPresentationOptions(mainSyndromes);
    const suspectedDiseasesOptions: PresentationOption[] =
        mapToPresentationOptions(filteredSuspectedDiseases);
    const notificationSourcesOptions: PresentationOption[] =
        mapToPresentationOptions(notificationSources);
    const incidentStatusOptions: PresentationOption[] = mapToPresentationOptions(incidentStatus);

    const isEBSDataSource =
        diseaseOutbreakEvent?.dataSource === DataSource.RTSL_ZEB_OS_DATA_SOURCE_EBS;
    const isIBSDataSource =
        diseaseOutbreakEvent?.dataSource === DataSource.RTSL_ZEB_OS_DATA_SOURCE_IBS;
    const isCasesDataUserDefined =
        diseaseOutbreakEvent?.casesDataSource ===
        CasesDataSource.RTSL_ZEB_OS_CASE_DATA_SOURCE_USER_DEF;

    const fromIdsDictionary = (key: keyof typeof diseaseOutbreakEventFieldIds) =>
        getFieldIdFromIdsDictionary(key, diseaseOutbreakEventFieldIds);

    const responseActionSubsections: Record<ResponseActionsSubsectionKeys, FormSectionState> = {
        initiateInvestigation: {
            title: "1. Initiate investigation or deploy an investigation/response.",
            id: "1. Initiate investigation or deploy an investigation/response.",
            isVisible: true,
            required: true,
            fields: [
                {
                    id: fromIdsDictionary("initiateInvestigation"),
                    label: "Date Completed",
                    isVisible: true,
                    errors: [],
                    type: "date",
                    value: diseaseOutbreakEvent?.earlyResponseActions.initiateInvestigation || null,
                    width: "200px",
                    required: true,
                    showIsRequired: false,
                },
            ],
        },
        conductEpidemiologicalAnalysis: {
            title: "2. Conduct epidemiological analysis of burden, severity, and risk factors, and perform initial risk assessment.",
            id: "2. Conduct epidemiological analysis of burden, severity, and risk factors, and perform initial risk assessment.",
            isVisible: true,
            required: true,
            fields: [
                {
                    id: fromIdsDictionary("conductEpidemiologicalAnalysis"),
                    label: "Date Completed",
                    isVisible: true,
                    errors: [],
                    type: "date",
                    value:
                        diseaseOutbreakEvent?.earlyResponseActions.conductEpidemiologicalAnalysis ||
                        null,
                    width: "200px",
                    required: true,
                    showIsRequired: false,
                },
            ],
        },
        laboratoryConfirmation: {
            id: "3. Obtain laboratory confirmation of the outbreak etiology.",
            title: "3. Obtain laboratory confirmation of the outbreak etiology.",
            isVisible: true,
            required: true,
            fields: [
                {
                    id: fromIdsDictionary("laboratoryConfirmation"),
                    label: "Date Completed",
                    isVisible: true,
                    errors: [],
                    type: "date",
                    value:
                        diseaseOutbreakEvent?.earlyResponseActions.laboratoryConfirmation || null,
                    width: "200px",
                    required: true,
                    showIsRequired: false,
                },
            ],
        },
        appropriateCaseManagement: {
            id: "4. Initiate appropriate case management and infection prevention and control (IPC) measures in health facilities.",
            title: "4. Initiate appropriate case management and infection prevention and control (IPC) measures in health facilities.",
            isVisible: true,
            required: true,
            fields: [
                {
                    id: fromIdsDictionary("appropriateCaseManagementDate"),
                    label: "Date Completed",
                    isVisible: true,
                    errors: [],
                    type: "date",
                    value:
                        diseaseOutbreakEvent?.earlyResponseActions.appropriateCaseManagement.date ||
                        null,
                    width: "200px",
                    hasNotApplicable: true,
                    required: true,
                    showIsRequired: false,
                    disabled:
                        diseaseOutbreakEvent?.earlyResponseActions.appropriateCaseManagement.na,
                },
                {
                    id: fromIdsDictionary("appropriateCaseManagementNA"),
                    label: i18n.t("N/A"),
                    isVisible: true,
                    errors: [],
                    type: "boolean",
                    value:
                        diseaseOutbreakEvent?.earlyResponseActions.appropriateCaseManagement.na ||
                        false,
                    width: "65px",
                    notApplicableFieldId: fromIdsDictionary("appropriateCaseManagementDate"),
                },
            ],
        },
        initiatePublicHealthCounterMeasures: {
            id: "5. Initiate appropriate public health countermeasures in affected communities.",
            title: "5. Initiate appropriate public health countermeasures in affected communities.",
            isVisible: true,
            required: true,
            fields: [
                {
                    id: fromIdsDictionary("initiatePublicHealthCounterMeasuresDate"),
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
                    label: i18n.t("N/A"),
                    id: fromIdsDictionary("initiatePublicHealthCounterMeasuresNA"),
                    isVisible: true,
                    errors: [],
                    type: "boolean",
                    value:
                        diseaseOutbreakEvent?.earlyResponseActions
                            .initiatePublicHealthCounterMeasures.na || false,
                    width: "65px",
                    notApplicableFieldId: fromIdsDictionary(
                        "initiatePublicHealthCounterMeasuresDate"
                    ),
                },
            ],
        },
        initiateRiskCommunication: {
            id: "6. Initiate appropriate risk communication and community engagement activities.",
            title: "6. Initiate appropriate risk communication and community engagement activities.",
            isVisible: true,
            required: true,
            fields: [
                {
                    id: fromIdsDictionary("initiateRiskCommunicationDate"),
                    label: "Date Completed",
                    isVisible: true,
                    errors: [],
                    type: "date",
                    value:
                        diseaseOutbreakEvent?.earlyResponseActions.initiateRiskCommunication.date ||
                        null,
                    width: "200px",
                    hasNotApplicable: true,
                    required: true,
                    showIsRequired: false,
                    disabled:
                        diseaseOutbreakEvent?.earlyResponseActions.initiateRiskCommunication.na,
                },
                {
                    id: fromIdsDictionary("initiateRiskCommunicationNA"),
                    label: i18n.t("N/A"),
                    isVisible: true,
                    errors: [],
                    type: "boolean",
                    value:
                        diseaseOutbreakEvent?.earlyResponseActions.initiateRiskCommunication.na ||
                        false,
                    width: "65px",
                    notApplicableFieldId: fromIdsDictionary("initiateRiskCommunicationDate"),
                },
            ],
        },
        establishCoordination: {
            title: "7. Establish a coordination mechanism.",
            id: "7. Establish a coordination mechanism.",
            isVisible: true,
            required: true,
            fields: [
                {
                    id: fromIdsDictionary("establishCoordinationDate"),
                    label: "Date Completed",
                    isVisible: true,
                    errors: [],
                    type: "date",
                    value:
                        diseaseOutbreakEvent?.earlyResponseActions.establishCoordination.date ||
                        null,
                    width: "200px",
                    hasNotApplicable: true,
                    required: true,
                    showIsRequired: false,
                    disabled: diseaseOutbreakEvent?.earlyResponseActions.establishCoordination.na,
                },
                {
                    id: fromIdsDictionary("establishCoordinationNa"),
                    label: i18n.t("N/A"),
                    isVisible: true,
                    errors: [],
                    type: "boolean",
                    value:
                        diseaseOutbreakEvent?.earlyResponseActions.establishCoordination.na ||
                        false,
                    width: "65px",
                    notApplicableFieldId: fromIdsDictionary("establishCoordinationDate"),
                },
            ],
        },
        responseNarrative: {
            title: "8. Response narrative",
            id: "8. Response narrative",
            isVisible: true,
            fields: [
                {
                    id: fromIdsDictionary("responseNarrative"),
                    isVisible: true,
                    errors: [],
                    type: "text",
                    value: diseaseOutbreakEvent?.earlyResponseActions.responseNarrative || "",
                    multiline: true,
                    showIsRequired: false,
                },
            ],
        },
    };

    const mainSections: Record<MainSectionKeys, FormSectionState> = {
        name: {
            title: "Event Name",
            id: "name_section",
            isVisible: true,
            required: true,
            fields: [
                {
                    id: fromIdsDictionary("name"),
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
        casesDataSource: {
            title: "Cases Data Source",
            id: "casesDataSource_section",
            isVisible: true,
            required: true,
            fields: [
                {
                    id: fromIdsDictionary("casesDataSource"),
                    placeholder: "Select the cases data source",
                    isVisible: true,
                    errors: [],
                    type: "select",
                    multiple: false,
                    options: casesDataSourceOptions,
                    value: diseaseOutbreakEvent?.casesDataSource || "",
                    width: "300px",
                    required: true,
                    showIsRequired: false,
                    disabled: editMode && isCasesDataUserDefined,
                },
            ],
        },
        casesDataFile: {
            title: "Cases Data File",
            id: "casesDataFile_section",
            isVisible: isCasesDataUserDefined,
            required: true,
            fields: [
                {
                    id: fromIdsDictionary("casesDataFile"),
                    isVisible: isCasesDataUserDefined,
                    errors: [],
                    type: "file",
                    value: isCasesDataUserDefined ? uploadedCasesDataFile : undefined,
                    required: true,
                    showIsRequired: false,
                    data: undefined,
                    fileId: isCasesDataUserDefined ? uploadedCasesDataFileId : undefined,
                    fileTemplate: caseDataFileTemplete,
                    fileNameLabel:
                        isCasesDataUserDefined && uploadedCasesDataFileId
                            ? i18n.t("HISTORICAL_CASE_DATA")
                            : undefined,
                    helperText:
                        editMode && isCasesDataUserDefined
                            ? i18n.t(
                                  "In order to add or replace cases, you need to download the current file and add the new ones."
                              )
                            : i18n.t("Please, download the template and add the required data."),
                },
            ],
        },
        dataSource: {
            title: "Event Source",
            id: "dataSource_section",
            isVisible: true,
            required: true,
            fields: [
                {
                    id: fromIdsDictionary("dataSource"),
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
                    disabled: editMode,
                },
            ],
        },
        hazardType: {
            title: "Hazard Type",
            id: "hazardType_section",
            isVisible: isEBSDataSource,
            required: true,
            fields: [
                {
                    id: fromIdsDictionary("hazardType"),
                    isVisible: isEBSDataSource,
                    errors: [],
                    type: "radio",
                    multiple: false,
                    options: hazardTypesOptions,
                    value: isEBSDataSource ? diseaseOutbreakEvent?.hazardType || "" : "",
                    required: true,
                    showIsRequired: false,
                    disabled: editMode,
                },
            ],
        },
        mainSyndrome: {
            title: "Main Syndrome",
            id: "mainSyndrome_section",
            isVisible: isIBSDataSource,
            required: true,
            fields: [
                {
                    id: fromIdsDictionary("mainSyndromeCode"),
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
        suspectedDisease: {
            title: "Suspected Disease",
            id: "suspectedDisease_section",
            isVisible: isIBSDataSource,
            required: true,
            fields: [
                {
                    id: fromIdsDictionary("suspectedDiseaseCode"),
                    placeholder: "Select a disease",
                    isVisible: isIBSDataSource,
                    errors: [],
                    type: "select",
                    multiple: false,
                    options: suspectedDiseasesOptions,
                    value: isIBSDataSource ? diseaseOutbreakEvent?.suspectedDiseaseCode || "" : "",
                    width: "300px",
                    required: true,
                    showIsRequired: false,
                    disabled: editMode,
                },
            ],
        },
        notificationSource: {
            title: "Notification Source",
            id: "notificationSource_section",
            isVisible: true,
            required: true,
            fields: [
                {
                    id: fromIdsDictionary("notificationSourceCode"),
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
        incidentStatus: {
            title: "Incident Status",
            id: "incidentStatus_section",
            isVisible: true,
            required: true,
            fields: [
                {
                    id: fromIdsDictionary("incidentStatus"),
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
        dateEmerged: {
            title: "Date Emerged",
            id: "emerged_section",
            isVisible: true,
            required: true,
            fields: [
                {
                    id: fromIdsDictionary("emergedDate"),
                    isVisible: true,
                    errors: [],
                    type: "date",
                    value: diseaseOutbreakEvent?.emerged.date || null,
                    width: "200px",
                    required: true,
                    showIsRequired: false,
                },
                {
                    id: fromIdsDictionary("emergedNarrative"),
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
        dateDetected: {
            title: "Date Detected",
            id: "detected_section",
            isVisible: true,
            required: true,
            fields: [
                {
                    id: fromIdsDictionary("detectedDate"),
                    isVisible: true,
                    errors: [],
                    type: "date",
                    value: diseaseOutbreakEvent?.detected.date || null,
                    width: "200px",
                    required: true,
                    showIsRequired: false,
                },
                {
                    id: fromIdsDictionary("detectedNarrative"),
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
        dateNotified: {
            title: "Date Notified",
            id: "notified",
            isVisible: true,
            required: true,
            fields: [
                {
                    id: fromIdsDictionary("notifiedDate"),
                    isVisible: true,
                    errors: [],
                    type: "date",
                    value: diseaseOutbreakEvent?.notified.date || null,
                    width: "200px",
                    required: true,
                    showIsRequired: false,
                },
                {
                    id: fromIdsDictionary("notifiedNarrative"),
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
        responseActions: {
            title: "What early response actions have been completed?",
            id: "response_actions_completed_section",
            isVisible: true,
            required: true,
            direction: "column",
            fields: [],
            subsections: [
                responseActionSubsections.initiateInvestigation,
                responseActionSubsections.conductEpidemiologicalAnalysis,
                responseActionSubsections.laboratoryConfirmation,
                responseActionSubsections.appropriateCaseManagement,
                responseActionSubsections.initiatePublicHealthCounterMeasures,
                responseActionSubsections.initiateRiskCommunication,
                responseActionSubsections.establishCoordination,
                responseActionSubsections.responseNarrative,
            ],
        },
        incidentManager: {
            title: "Assign Incident Manager",
            id: "incidentManager_section",
            isVisible: true,
            required: true,
            fields: [
                {
                    id: fromIdsDictionary("incidentManagerName"),
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
        notes: {
            title: "Notes",
            id: "notes_section",
            isVisible: true,
            required: false,
            fields: [
                {
                    id: fromIdsDictionary("notes"),
                    isVisible: true,
                    errors: [],
                    type: "text",
                    value: diseaseOutbreakEvent?.notes || "",
                    multiline: true,
                },
            ],
        },
    };

    return {
        id: diseaseOutbreakEvent?.id || "",
        title: "Create Event",
        saveButtonLabel: "Save & Continue",
        isValid: false,
        sections: [
            mainSections.name,
            mainSections.casesDataSource,
            mainSections.casesDataFile,
            mainSections.dataSource,
            mainSections.hazardType,
            mainSections.suspectedDisease,
            mainSections.mainSyndrome,
            mainSections.notificationSource,
            mainSections.incidentStatus,
            mainSections.dateEmerged,
            mainSections.dateDetected,
            mainSections.dateNotified,
            mainSections.responseActions,
            mainSections.incidentManager,
            mainSections.notes,
        ],
    };
}

function getInitialFormStateForDiseaseOutbreakCaseData(
    diseaseOutbreakEventWithOptions: DiseaseOutbreakEventFormData
): FormState {
    const {
        entity: diseaseOutbreakEvent,
        caseDataFileTemplete,
        uploadedCasesDataFile,
        uploadedCasesDataFileId,
    } = diseaseOutbreakEventWithOptions;

    return {
        id: diseaseOutbreakEvent?.id || "",
        title: "Event cases data",
        saveButtonLabel: "Save",
        isValid: false,
        sections: [
            {
                title: "Cases Data File",
                id: "casesDataFile_section",
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: "casesDataFile",
                        isVisible: true,
                        errors: [],
                        type: "file",
                        value: uploadedCasesDataFile,
                        required: true,
                        showIsRequired: false,
                        data: undefined,
                        fileId: uploadedCasesDataFileId,
                        fileTemplate: caseDataFileTemplete,
                        fileNameLabel: uploadedCasesDataFileId
                            ? i18n.t("HISTORICAL_CASE_DATA")
                            : undefined,

                        helperText: i18n.t(
                            "In order to add or replace cases, you need to download the current file and add the new ones."
                        ),
                    },
                ],
            },
        ],
    };
}
