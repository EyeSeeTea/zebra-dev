import i18n from "@eyeseetea/d2-ui-components/locales";
import { DiseaseOutbreakEventFormData } from "../../../../domain/entities/ConfigurableForm";
import { CasesDataSource } from "../../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { TeamMember } from "../../../../domain/entities/incident-management-team/TeamMember";
import { getFieldIdFromIdsDictionary } from "../../../components/form/FormFieldsState";
import { FormSectionState } from "../../../components/form/FormSectionsState";
import { FormState } from "../../../components/form/FormState";
import { User } from "../../../components/user-selector/UserSelector";
import { Option as PresentationOption } from "../../../components/utils/option";
import { mapToPresentationOptions } from "../mapEntityToFormState";
import { DiseaseNames } from "../../../../domain/entities/disease-outbreak-event/PerformanceOverviewMetrics";

export const diseaseOutbreakEventFieldIds = {
    name: "name",
    casesDataSource: "casesDataSource",
    casesDataFile: "casesDataFile",
    mainSyndromeCode: "mainSyndromeCode",
    suspectedDiseaseCode: "suspectedDiseaseCode",
    notificationSourceCode: "notificationSourceCode",
    areasAffectedProvinceIds: "areasAffectedProvinceIds",
    areasAffectedDistrictIds: "areasAffectedDistrictIds",
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
    | "mainSyndrome"
    | "suspectedDisease"
    | "notificationSource"
    | "incidentManager"
    | "notes";

// TODO: Thinking for the future about generate this FormState by iterating over Object.Keys(diseaseOutbreakEvent)
export function mapDiseaseOutbreakEventToInitialFormState(
    diseaseOutbreakEventWithOptions: DiseaseOutbreakEventFormData,
    editMode: boolean,
    existingEventTrackerTypes: DiseaseNames[]
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
    existingEventTrackerTypes: DiseaseNames[]
): FormState {
    const {
        entity: diseaseOutbreakEvent,
        options,
        caseDataFileTemplete,
        uploadedCasesDataFile,
        uploadedCasesDataFileId,
    } = diseaseOutbreakEventWithOptions;

    const {
        incidentManagers,
        mainSyndromes,
        suspectedDiseases,
        notificationSources,
        casesDataSource,
    } = options;

    //If An Event Tracker has already been created for a given suspected disease or harzd type,
    //then do not allow to create another one. Remove it from dropwdown options
    const filteredSuspectedDiseases = suspectedDiseases.filter(suspectedDisease => {
        return !existingEventTrackerTypes.includes(suspectedDisease.name as DiseaseNames);
    });

    const teamMemberOptions: User[] = incidentManagers.map(tm => mapTeamMemberToUser(tm));
    const casesDataSourceOptions: PresentationOption[] = mapToPresentationOptions(casesDataSource);
    const mainSyndromesOptions: PresentationOption[] = mapToPresentationOptions(mainSyndromes);
    const suspectedDiseasesOptions: PresentationOption[] =
        mapToPresentationOptions(filteredSuspectedDiseases);
    const notificationSourcesOptions: PresentationOption[] =
        mapToPresentationOptions(notificationSources);

    const isCasesDataUserDefined =
        diseaseOutbreakEvent?.casesDataSource ===
        CasesDataSource.RTSL_ZEB_OS_CASE_DATA_SOURCE_USER_DEF;

    const fromIdsDictionary = (key: keyof typeof diseaseOutbreakEventFieldIds) =>
        getFieldIdFromIdsDictionary(key, diseaseOutbreakEventFieldIds);

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
        mainSyndrome: {
            title: "Main Syndrome",
            id: "mainSyndrome_section",
            isVisible: true,
            required: true,
            fields: [
                {
                    id: fromIdsDictionary("mainSyndromeCode"),
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
        suspectedDisease: {
            title: "Suspected Disease",
            id: "suspectedDisease_section",
            isVisible: true,
            required: true,
            fields: [
                {
                    id: fromIdsDictionary("suspectedDiseaseCode"),
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
                    type: "text-editor",
                    value: diseaseOutbreakEvent?.notes || "",
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
            mainSections.suspectedDisease,
            mainSections.mainSyndrome,
            mainSections.notificationSource,
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
