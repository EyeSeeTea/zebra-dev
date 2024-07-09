import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { Maybe } from "../../../../utils/ts-utils";
import i18n from "../../../../utils/i18n";
import { useAppContext } from "../../../contexts/app-context";
import { Id } from "../../../../domain/entities/Ref";
import { FormState } from "../../../components/form/FormState";
import { FormFieldState } from "../../../components/form/FormFieldState";
import { FormType } from "../FormPage";
import { DiseaseOutbreakEvent } from "../../../../domain/entities/DiseaseOutbreakEvent";

export type GlobalMessage = {
    text: string;
    type: "warning" | "success" | "error";
};

export type DiseaseOutbreakEventFormStateLoaded = {
    kind: "loaded";
    data: FormState;
};

export type DiseaseOutbreakEventFormStateLoading = {
    kind: "loading";
};

export type DiseaseOutbreakEventFormStateError = {
    kind: "error";
    message: string;
};

export type DiseaseOutbreakEventFormState =
    | DiseaseOutbreakEventFormStateLoaded
    | DiseaseOutbreakEventFormStateLoading
    | DiseaseOutbreakEventFormStateError;

export function useDiseaseOutbreakEventForm(
    formType: FormType,
    diseaseOutbreakEventId?: Id
): {
    globalMessage: Maybe<GlobalMessage>;
    formState: DiseaseOutbreakEventFormState;
    handleFormChange: (newFormState: FormState, updatedField: FormFieldState) => void;
    onSaveForm: () => void;
    onCancelForm: () => void;
} {
    const { compositionRoot } = useAppContext();
    const history = useHistory();

    const [globalMessage, setGlobalMessage] = useState<Maybe<GlobalMessage>>();
    const [formState, setFormState] = useState<DiseaseOutbreakEventFormState>({ kind: "loading" });
    const [diseaseOutbreakEvent, setDiseaseOutbreakEvent] = useState<DiseaseOutbreakEvent>();

    useEffect(() => {
        if (diseaseOutbreakEventId) {
            compositionRoot.diseaseOutbreakEvent.get.execute(diseaseOutbreakEventId).run(
                diseaseOutbreakEventData => {
                    if (!diseaseOutbreakEventData) {
                        setFormState({
                            kind: "error",
                            message: i18n.t(`Create Event form cannot be loaded`),
                        });
                        setGlobalMessage({
                            text: i18n.t(`An error occurred while loading Create Event form`),
                            type: "error",
                        });
                    } else {
                        setDiseaseOutbreakEvent(diseaseOutbreakEventData);
                    }
                },
                error => {
                    setFormState({
                        kind: "error",
                        message: i18n.t(`Create Event form cannot be loaded`),
                    });
                    setGlobalMessage({
                        text: i18n.t(
                            `An error occurred while loading Create Event form: ${error.message}`
                        ),
                        type: "error",
                    });
                }
            );
        }
    }, [compositionRoot.diseaseOutbreakEvent.get, diseaseOutbreakEventId]);

    useEffect(() => {
        if ((diseaseOutbreakEventId && diseaseOutbreakEvent) || !diseaseOutbreakEventId) {
            // TODO: create state using also data from useCase
            setFormState({
                kind: "loaded",
                data: mapDataToState(diseaseOutbreakEvent),
            });
        }
    }, [diseaseOutbreakEvent, diseaseOutbreakEventId]);

    const handleFormChange = useCallback(
        (newFormState: FormState, updatedField: FormFieldState) => {
            // TODO: Validate and update state
            setFormState({
                kind: "loaded",
                data: newFormState,
            });
        },
        []
    );

    const onSaveForm = useCallback(() => {}, []);

    const onCancelForm = useCallback(() => {
        history.push(`/`);
    }, [history]);

    return {
        globalMessage,
        formState,
        handleFormChange,
        onSaveForm,
        onCancelForm,
    };
}

function mapDataToState(diseaseOutbreakEvent?: DiseaseOutbreakEvent): FormState {
    // TODO: create real form state, this is an example
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
                        id: "name",
                        isVisible: true,
                        helperText: "Be specific. Include disease, date, and region",
                        errors: [],
                        type: "text",
                        value: diseaseOutbreakEvent?.name || "",
                        multiline: false,
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
                        id: "hazardType",
                        isVisible: true,
                        errors: [],
                        type: "radio",
                        options: [
                            {
                                value: "Biological:Human",
                                label: "Biological: Human",
                            },
                            {
                                value: "Biological:Animal",
                                label: "Biological: Animal",
                            },
                            {
                                value: "Chemical",
                                label: "Chemical",
                            },
                            {
                                value: "Environmental",
                                label: "Environmental",
                            },
                            {
                                value: "Unknown",
                                label: "Unknown",
                            },
                        ],
                        value: diseaseOutbreakEvent?.hazardType || "",
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
                        id: "mainSyndrome",
                        placeholder: "Select a syndrome",
                        isVisible: true,
                        errors: [],
                        type: "select",
                        options: [
                            {
                                value: "Syndrome 1",
                                label: "Syndrome 1",
                            },
                            {
                                value: "Syndrome 2",
                                label: "Syndrome 2",
                            },
                        ],
                        value: diseaseOutbreakEvent?.mainSyndrome.id || "",
                        width: "300px",
                    },
                    {
                        id: "mainSyndrome_other",
                        isVisible: false,
                        helperText: "Add new option",
                        errors: [],
                        type: "text",
                        value: "",
                        multiline: false,
                        width: "300px",
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
                        id: "suspectedDisease",
                        placeholder: "Select a disease",
                        isVisible: true,
                        errors: [],
                        type: "select",
                        options: [
                            {
                                value: "Disease 1",
                                label: "Disease 1",
                            },
                            {
                                value: "Disease 2",
                                label: "Disease 2",
                            },
                        ],
                        value: diseaseOutbreakEvent?.suspectedDisease.id || "",
                        width: "300px",
                    },
                    {
                        id: "suspectedDisease_other",
                        isVisible: false,
                        required: false,
                        helperText: "Add new option",
                        errors: [],
                        type: "text",
                        value: "",
                        multiline: false,
                        width: "300px",
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
                        id: "notificationSource",
                        placeholder: "Select source",
                        isVisible: true,
                        errors: [],
                        type: "select",
                        options: [
                            {
                                value: "Source 1",
                                label: "Source 1",
                            },
                            {
                                value: "Source 2",
                                label: "Source 2",
                            },
                        ],
                        value: diseaseOutbreakEvent?.notificationSource.id || "",
                        width: "300px",
                    },
                    {
                        id: "notificationSource_other",
                        isVisible: false,
                        helperText: "Add new option",
                        errors: [],
                        type: "text",
                        value: "",
                        multiline: false,
                        width: "300px",
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
                        id: "areasAffected_provinces",
                        label: "Provinces",
                        isVisible: true,
                        errors: [],
                        type: "select",
                        multiple: true,
                        options: [
                            {
                                value: "Province 1",
                                label: "Province 1",
                            },
                            {
                                value: "Province 2",
                                label: "Province 2",
                            },
                        ],
                        value:
                            diseaseOutbreakEvent?.areasAffected.provinces.map(
                                province => province.id
                            ) || [],
                        width: "400px",
                    },
                    {
                        id: "areasAffected_districts",
                        label: "Districts",
                        isVisible: true,
                        errors: [],
                        type: "select",
                        multiple: true,
                        options: [
                            {
                                value: "District 1",
                                label: "District 1",
                            },
                            {
                                value: "District 2",
                                label: "District 2",
                            },
                        ],
                        value:
                            diseaseOutbreakEvent?.areasAffected.districts.map(
                                district => district.id
                            ) || [],
                        width: "400px",
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
                        id: "incidentStatus",
                        isVisible: true,
                        errors: [],
                        type: "radio",
                        options: [
                            {
                                value: "Watch",
                                label: "Watch",
                            },
                            {
                                value: "Alert",
                                label: "Alert",
                            },
                            {
                                value: "Respond",
                                label: "Respond",
                            },
                            {
                                value: "Closed",
                                label: "Closed",
                            },
                            {
                                value: "Discarded",
                                label: "Discarded",
                            },
                        ],
                        value: diseaseOutbreakEvent?.incidentStatus || "",
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
                        id: "emerged_date",
                        isVisible: true,
                        errors: [],
                        type: "date",
                        value: diseaseOutbreakEvent?.emerged.date || null,
                        width: "200px",
                    },
                    {
                        id: "emerged_narrative",
                        isVisible: true,
                        label: "Narrative",
                        helperText: "Provide concise details",
                        errors: [],
                        type: "text",
                        value: diseaseOutbreakEvent?.emerged.narrative || "",
                        multiline: false,
                        width: "600px",
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
                        id: "detected_date",
                        isVisible: true,
                        errors: [],
                        type: "date",
                        value: diseaseOutbreakEvent?.detected.date || null,
                        width: "200px",
                    },
                    {
                        id: "detected_narrative",
                        isVisible: true,
                        label: "Narrative",
                        helperText: "Provide concise details",
                        errors: [],
                        type: "text",
                        value: diseaseOutbreakEvent?.detected.narrative || "",
                        multiline: false,
                        width: "600px",
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
                        id: "notified_date",
                        isVisible: true,
                        errors: [],
                        type: "date",
                        value: diseaseOutbreakEvent?.notified.date || null,
                        width: "200px",
                    },
                    {
                        id: "notified_narrative",
                        isVisible: true,
                        label: "Narrative",
                        helperText: "Provide concise details",
                        errors: [],
                        type: "text",
                        value: diseaseOutbreakEvent?.notified.narrative || "",
                        multiline: false,
                        width: "600px",
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
                                label: "Date Completed",
                                id: "1. Date Completed",
                                isVisible: true,
                                errors: [],
                                type: "date",
                                value: null,
                                width: "200px",
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
                                id: "2. Date Completed",
                                label: "Date Completed",
                                isVisible: true,
                                errors: [],
                                type: "date",
                                value: null,
                                width: "200px",
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
                                id: "3_date_completed",
                                label: "Date Completed",
                                isVisible: true,
                                errors: [],
                                type: "date",
                                value: null,
                                width: "200px",
                            },
                            {
                                label: "N/A",
                                id: "notApplicable_3_date_completed",
                                isVisible: true,
                                errors: [],
                                type: "boolean",
                                value: false,
                                width: "100px",
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
                                id: "4_date_completed",
                                label: "Date Completed",
                                isVisible: true,
                                errors: [],
                                type: "date",
                                value: null,
                                width: "200px",
                            },
                            {
                                label: "N/A",
                                id: "notApplicable_4_date_completed",
                                isVisible: true,
                                errors: [],
                                type: "boolean",
                                value: false,
                                width: "100px",
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
                                id: "5_date_completed",
                                label: "Date Completed",
                                isVisible: true,
                                errors: [],
                                type: "date",
                                value: null,
                                width: "200px",
                            },
                            {
                                label: "N/A",
                                id: "notApplicable_5_date_completed",
                                isVisible: true,
                                errors: [],
                                type: "boolean",
                                value: false,
                                width: "100px",
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
                                id: "6_date_completed",
                                label: "Date Completed",
                                isVisible: true,
                                errors: [],
                                type: "date",
                                value: null,
                                width: "200px",
                            },
                            {
                                label: "N/A",
                                id: "notApplicable_6_date_completed",
                                isVisible: true,
                                errors: [],
                                type: "boolean",
                                value: false,
                                width: "100px",
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
                                id: "7. Date Completed",
                                label: "Date Completed",
                                isVisible: true,
                                errors: [],
                                type: "date",
                                value: null,
                                width: "200px",
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
                                id: "responseNarrative",
                                isVisible: true,
                                errors: [],
                                type: "text",
                                value: diseaseOutbreakEvent?.responseNarrative || "",
                                multiline: true,
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
                        id: "incidentManager",
                        placeholder: "Select a manager",
                        isVisible: true,
                        errors: [],
                        type: "member",
                        options: [
                            {
                                value: "1",
                                label: "member 1",
                                workPosition: "workPosition",
                                phone: "PhoneNumber",
                                email: "Email",
                                status: "Available",
                                src: "url 1",
                            },
                            {
                                value: "2",
                                label: "member 2",
                                workPosition: "workPosition",
                                phone: "PhoneNumber",
                                email: "Email",
                                status: "Unavailable",
                                src: "url 2",
                            },
                        ],
                        value: diseaseOutbreakEvent?.incidentManager.id,
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
                        id: "notes",
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
