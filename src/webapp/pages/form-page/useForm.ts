import { useCallback, useEffect, useState } from "react";
import { Maybe } from "../../../utils/ts-utils";
import i18n from "../../../utils/i18n";
import { useAppContext } from "../../contexts/app-context";
import { Id } from "../../../domain/entities/Ref";
import { FormState } from "../../components/form/FormState";
import { RouteName, useRoutes } from "../../hooks/useRoutes";
import { mapFormStateToEntityData } from "./mapFormStateToEntityData";
import { updateAndValidateFormState } from "./utils/updateDiseaseOutbreakEventFormState";
import { FormFieldState } from "../../components/form/FormFieldsState";
import { FormType } from "./FormPage";
import { ConfigurableForm, FormLables } from "../../../domain/entities/ConfigurableForm";
import { mapEntityToFormState } from "./mapEntityToFormState";
import { useCurrentEventTracker } from "../../contexts/current-event-tracker-context";
import {
    addNewCustomQuestionSection,
    getAnotherOptionSection,
} from "./risk-assessment/mapRiskAssessmentToInitialFormState";
import {
    addNewResponseActionSection,
    getAnotherResponseActionSection,
} from "./incident-action/mapIncidentActionToInitialFormState";
import { useExistingEventTrackerTypes } from "../../contexts/existing-event-tracker-types-context";
import { useCheckWritePermission } from "../../hooks/useHasCurrentUserCaptureAccess";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import { usePerformanceOverview } from "../dashboard/usePerformanceOverview";
import { useIncidentActionPlan } from "../incident-action-plan/useIncidentActionPlan";
import { DiseaseOutbreakEvent } from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";

export type GlobalMessage = {
    text: string;
    type: "warning" | "success" | "error";
};

export type FormStateLoaded = {
    kind: "loaded";
    data: FormState;
};

export type FormStateLoading = {
    kind: "loading";
};

export type FormStateError = {
    kind: "error";
    message: string;
};

export type FormLoadState = FormStateLoaded | FormStateLoading | FormStateError;

type State = {
    formLabels: Maybe<FormLables>;
    globalMessage: Maybe<GlobalMessage>;
    formState: FormLoadState;
    isLoading: boolean;
    handleFormChange: (updatedField: FormFieldState) => void;
    onPrimaryButtonClick: () => void;
    onCancelForm: () => void;
    handleAddNew: () => void;
    handleRemove: (id: string) => void;
};

export function useForm(formType: FormType, id?: Id): State {
    const { compositionRoot, currentUser, configurations } = useAppContext();
    const { goTo } = useRoutes();
    const { changeCurrentEventTracker, getCurrentEventTracker } = useCurrentEventTracker();
    const [globalMessage, setGlobalMessage] = useState<Maybe<GlobalMessage>>();
    const [formState, setFormState] = useState<FormLoadState>({ kind: "loading" });
    const [configurableForm, setConfigurableForm] = useState<ConfigurableForm>();
    const [formLabels, setFormLabels] = useState<FormLables>();
    const [isLoading, setIsLoading] = useState(false);
    const currentEventTracker = getCurrentEventTracker();
    const { existingEventTrackerTypes } = useExistingEventTrackerTypes();
    const { dataPerformanceOverview } = usePerformanceOverview();
    const { isIncidentManager } = useIncidentActionPlan(currentEventTracker?.id ?? "");
    useCheckWritePermission(formType);
    const snackbar = useSnackbar();

    const allDataPerformanceEvents = dataPerformanceOverview?.map(
        event => event.hazardType || event.suspectedDisease
    );
    const existingEventTrackers =
        existingEventTrackerTypes.length === 0
            ? allDataPerformanceEvents
            : existingEventTrackerTypes;

    useEffect(() => {
        compositionRoot.getConfigurableForm
            .execute({
                formType: formType,
                eventTrackerDetails: currentEventTracker,
                configurations: configurations,
                id: id,
                responseActionId: id,
            })
            .run(
                formData => {
                    console.log({
                        responseActions: formData.entity,
                        currentEventTrackerResponseActions:
                            currentEventTracker?.incidentActionPlan?.responseActions,
                    });
                    setConfigurableForm(formData);
                    setFormLabels(formData.labels);
                    setFormState({
                        kind: "loaded",
                        data: mapEntityToFormState({
                            configurableForm: formData,
                            editMode: !!id,
                            existingEventTrackerTypes: existingEventTrackerTypes,
                            isIncidentManager: isIncidentManager,
                        }),
                    });
                },
                error => {
                    setFormState({
                        kind: "error",
                        message: i18n.t(`Form cannot be loaded`),
                    });
                    setGlobalMessage({
                        text: i18n.t(`An error occurred while loading form: ${error.message}`),
                        type: "error",
                    });
                }
            );
    }, [
        compositionRoot.getConfigurableForm,
        formType,
        id,
        currentEventTracker,
        configurations,
        existingEventTrackers,
        snackbar,
        goTo,
        isIncidentManager,
        existingEventTrackerTypes,
    ]);

    const handleAddNew = useCallback(() => {
        if (formState.kind !== "loaded" || !configurableForm) return;

        switch (configurableForm.type) {
            case "risk-assessment-questionnaire": {
                setFormState(prevState => {
                    if (prevState.kind === "loaded") {
                        const otherSections = prevState.data.sections.filter(
                            section => section.id !== "addNewOptionSection"
                        );
                        const addAnotherSection = getAnotherOptionSection();

                        const newCustomQuestionSection = addNewCustomQuestionSection(
                            prevState.data.sections
                        );

                        const updatedData = {
                            ...prevState.data,
                            sections: [
                                ...otherSections,
                                newCustomQuestionSection,
                                addAnotherSection,
                            ],
                        };

                        const allNewFields = newCustomQuestionSection.fields;

                        const updatedAndValidatedData = allNewFields.reduce(
                            (acc, updatedFields) => {
                                return updateAndValidateFormState(
                                    acc,
                                    updatedFields,
                                    configurableForm
                                );
                            },
                            updatedData
                        );

                        return {
                            kind: "loaded",
                            data: updatedAndValidatedData,
                        };
                    } else {
                        return prevState;
                    }
                });
                break;
            }
            case "incident-response-actions":
                setFormState(prevState => {
                    if (prevState.kind === "loaded") {
                        const otherSections = prevState.data.sections.filter(
                            section => section.id !== "addNewResponseActionSection"
                        );
                        const addAnotherSection = getAnotherResponseActionSection();
                        const newResponseActionSection = addNewResponseActionSection(
                            prevState.data.sections,
                            configurations,
                            isIncidentManager
                        );

                        const updatedData = {
                            ...prevState.data,
                            sections: [
                                ...otherSections,
                                newResponseActionSection,
                                addAnotherSection,
                            ],
                        };

                        const allNewFields = newResponseActionSection.fields;

                        const updatedAndValidatedData = allNewFields.reduce(
                            (acc, updatedFields) => {
                                return updateAndValidateFormState(
                                    acc,
                                    updatedFields,
                                    configurableForm
                                );
                            },
                            updatedData
                        );

                        return {
                            kind: "loaded",
                            data: updatedAndValidatedData,
                        };
                    } else {
                        return prevState;
                    }
                });
                break;
            default:
                break;
        }
    }, [configurableForm, configurations, formState.kind, isIncidentManager]);

    const handleRemove = useCallback(
        (id: string) => {
            if (formState.kind !== "loaded" || !configurableForm || !currentEventTracker) return;

            const formData = mapFormStateToEntityData(
                formState.data,
                currentUser.username,
                configurableForm
            );

            switch (formData.type) {
                case "risk-assessment-questionnaire": {
                    setFormState(prevState => {
                        if (prevState.kind === "loaded") {
                            const formSections = prevState.data.sections.filter(
                                section => section.id !== id
                            );

                            return {
                                kind: "loaded",
                                data: {
                                    ...prevState.data,
                                    sections: formSections,
                                },
                            };
                        } else {
                            return prevState;
                        }
                    });
                    break;
                }
                case "incident-response-actions": {
                    const sectionIndex = formState.data.sections.findIndex(
                        section => section.id === id
                    );
                    const responseActionToDeleteId = formData.entity[sectionIndex]?.id;
                    const updatedFormData: ConfigurableForm = {
                        ...formData,
                        entity: formData.entity.filter(
                            responseAction => responseAction.id !== responseActionToDeleteId
                        ),
                    };

                    console.log({
                        updatedFormData,
                        responseActionToDeleteId,
                        id,
                        formStateData: formState.data.sections,
                        formData,
                    });

                    if (!responseActionToDeleteId) return;

                    compositionRoot.incidentActionPlan.deleteResponseAction
                        .execute(responseActionToDeleteId)
                        .run(
                            () => {
                                const updatedEventTracker = new DiseaseOutbreakEvent({
                                    ...currentEventTracker,
                                    // @ts-ignore
                                    incidentActionPlan: {
                                        ...currentEventTracker.incidentActionPlan,
                                        responseActions: updatedFormData.entity,
                                    },
                                });

                                changeCurrentEventTracker(updatedEventTracker);

                                setFormState(prevState => {
                                    if (prevState.kind === "loaded") {
                                        const formSections = prevState.data.sections.filter(
                                            section => section.id !== id
                                        );

                                        return {
                                            kind: "loaded",
                                            data: {
                                                ...prevState.data,
                                                sections: formSections,
                                            },
                                        };
                                    } else {
                                        return prevState;
                                    }
                                });

                                setGlobalMessage({
                                    text: i18n.t(`Response Action deleted successfully`),
                                    type: "success",
                                });
                            },
                            err => {
                                setGlobalMessage({
                                    text: i18n.t(`Error deleting response action: ${err.message}`),
                                    type: "error",
                                });
                            }
                        );

                    break;
                }
                default:
                    break;
            }
        },
        [
            changeCurrentEventTracker,
            compositionRoot.incidentActionPlan.deleteResponseAction,
            configurableForm,
            currentEventTracker,
            currentUser.username,
            formState,
        ]
    );

    const handleFormChange = useCallback(
        (updatedField: FormFieldState) => {
            setFormState(prevState => {
                if (prevState.kind === "loaded" && configurableForm) {
                    const updatedData = updateAndValidateFormState(
                        prevState.data,
                        updatedField,
                        configurableForm
                    );
                    return {
                        kind: "loaded" as const,
                        data: updatedData,
                    };
                } else {
                    return prevState;
                }
            });
        },
        [configurableForm]
    );

    const onPrimaryButtonClick = useCallback(() => {
        const { eventTrackerConfigurations } = configurations.selectableOptions;
        if (formState.kind !== "loaded" || !configurableForm || !formState.data.isValid) return;

        setIsLoading(true);

        const formData = mapFormStateToEntityData(
            formState.data,
            currentUser.username,
            configurableForm
        );

        compositionRoot.save.execute(formData, configurations).run(
            diseaseOutbreakEventId => {
                setIsLoading(false);

                switch (formData.type) {
                    case "disease-outbreak-event":
                        if (diseaseOutbreakEventId && formData.entity) {
                            compositionRoot.diseaseOutbreakEvent.mapDiseaseOutbreakEventToAlerts
                                .execute(
                                    diseaseOutbreakEventId,
                                    formData.entity,
                                    eventTrackerConfigurations.hazardTypes,
                                    eventTrackerConfigurations.suspectedDiseases
                                )
                                .run(
                                    () => {},
                                    err => {
                                        console.error({ err });
                                    }
                                );
                            goTo(RouteName.EVENT_TRACKER, {
                                id: diseaseOutbreakEventId,
                            });
                            setGlobalMessage({
                                text: i18n.t(`Disease Outbreak saved successfully`),
                                type: "success",
                            });
                        }
                        break;

                    case "risk-assessment-grading":
                        if (currentEventTracker?.id)
                            goTo(RouteName.EVENT_TRACKER, {
                                id: currentEventTracker?.id,
                            });
                        setGlobalMessage({
                            text: i18n.t(`Risk Assessment Grading saved successfully`),
                            type: "success",
                        });
                        break;
                    case "risk-assessment-summary":
                        goTo(RouteName.CREATE_FORM, {
                            formType: "risk-assessment-questionnaire",
                        });
                        setGlobalMessage({
                            text: i18n.t(`Risk Assessment Summary saved successfully`),
                            type: "success",
                        });
                        break;
                    case "risk-assessment-questionnaire":
                        goTo(RouteName.CREATE_FORM, {
                            formType: "risk-assessment-grading",
                        });
                        setGlobalMessage({
                            text: i18n.t(`Risk Assessment Questionnaire saved successfully`),
                            type: "success",
                        });
                        break;
                    case "incident-action-plan":
                        goTo(RouteName.CREATE_FORM, {
                            formType: "incident-response-actions",
                        });
                        setGlobalMessage({
                            text: i18n.t(`Incident Action Plan saved successfully`),
                            type: "success",
                        });
                        break;
                    case "incident-response-actions":
                        if (currentEventTracker?.id)
                            goTo(RouteName.INCIDENT_ACTION_PLAN, {
                                id: currentEventTracker?.id,
                            });
                        setGlobalMessage({
                            text: i18n.t(`Incident Response Actions saved successfully`),
                            type: "success",
                        });
                        break;
                    case "incident-response-action":
                        if (currentEventTracker?.id)
                            goTo(RouteName.INCIDENT_ACTION_PLAN, {
                                id: currentEventTracker?.id,
                            });
                        setGlobalMessage({
                            text: i18n.t(`Incident Response Actions saved successfully`),
                            type: "success",
                        });
                        break;
                    case "incident-management-team-member-assignment":
                        if (currentEventTracker?.id)
                            goTo(RouteName.IM_TEAM_BUILDER, {
                                id: currentEventTracker?.id,
                            });
                        setGlobalMessage({
                            text: i18n.t(`Incident Management Team Member saved successfully`),
                            type: "success",
                        });
                        break;
                }
            },
            err => {
                setGlobalMessage({
                    text: i18n.t(`Error saving disease outbreak: ${err.message}`),
                    type: "error",
                });
            }
        );
    }, [
        configurations,
        formState,
        configurableForm,
        currentUser.username,
        compositionRoot,
        currentEventTracker?.id,
        goTo,
    ]);

    const onCancelForm = useCallback(() => {
        if (currentEventTracker) {
            switch (formType) {
                case "incident-management-team-member-assignment":
                    goTo(RouteName.IM_TEAM_BUILDER, {
                        id: currentEventTracker.id,
                    });
                    break;
                case "incident-action-plan":
                case "incident-response-actions":
                case "incident-response-action":
                    goTo(RouteName.INCIDENT_ACTION_PLAN, {
                        id: currentEventTracker.id,
                    });
                    break;
                default:
                    goTo(RouteName.EVENT_TRACKER, {
                        id: currentEventTracker.id,
                    });
                    break;
            }
        } else {
            goTo(RouteName.DASHBOARD);
        }
    }, [currentEventTracker, formType, goTo]);

    return {
        formLabels,
        globalMessage,
        formState,
        isLoading,
        handleFormChange,
        onPrimaryButtonClick,
        onCancelForm,
        handleAddNew,
        handleRemove,
    };
}
