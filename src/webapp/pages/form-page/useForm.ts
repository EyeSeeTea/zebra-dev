import { useCallback, useEffect, useState } from "react";
import { Maybe } from "../../../utils/ts-utils";
import i18n from "../../../utils/i18n";
import { useAppContext } from "../../contexts/app-context";
import { Id } from "../../../domain/entities/Ref";
import { FormState } from "../../components/form/FormState";
import { RouteName, useRoutes } from "../../hooks/useRoutes";
import { mapFormStateToEntityData } from "./mapFormStateToEntityData";
import { updateAndValidateFormState } from "./disease-outbreak-event/utils/updateDiseaseOutbreakEventFormState";
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
};

export function useForm(formType: FormType, id?: Id): State {
    const { compositionRoot, currentUser } = useAppContext();
    const { goTo } = useRoutes();
    const { getCurrentEventTracker } = useCurrentEventTracker();

    const [globalMessage, setGlobalMessage] = useState<Maybe<GlobalMessage>>();
    const [formState, setFormState] = useState<FormLoadState>({ kind: "loading" });
    const [configurableForm, setConfigurableForm] = useState<ConfigurableForm>();
    const [currentEventTrackerState, setCurrentEventTrackerState] =
        useState<Maybe<DiseaseOutbreakEvent>>();
    const [formLabels, setFormLabels] = useState<FormLables>();
    const [isLoading, setIsLoading] = useState(false);
    const currentEventTracker = getCurrentEventTracker();

    useEffect(() => {
        if (currentEventTrackerState?.id === currentEventTracker?.id) return;

        compositionRoot.getWithOptions.execute(formType, currentEventTracker, id).run(
            formData => {
                setConfigurableForm(formData);
                setFormLabels(formData.labels);
                setFormState({
                    kind: "loaded",
                    data: mapEntityToFormState(formData, !!id),
                });
                setCurrentEventTrackerState(currentEventTracker);
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
                setCurrentEventTrackerState(currentEventTracker);
            }
        );
    }, [
        compositionRoot.getWithOptions,
        formType,
        id,
        currentEventTracker,
        currentEventTrackerState?.id,
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
            case "incident-response-action":
                setFormState(prevState => {
                    if (prevState.kind === "loaded") {
                        const otherSections = prevState.data.sections.filter(
                            section => section.id !== "addNewResponseActionSection"
                        );
                        const addAnotherSection = getAnotherResponseActionSection();
                        const newResponseActionSection = addNewResponseActionSection(
                            prevState.data.sections
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
    }, [configurableForm, formState]);

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
                        kind: "loaded",
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
        if (formState.kind !== "loaded" || !configurableForm || !formState.data.isValid) return;

        setIsLoading(true);

        const formData = mapFormStateToEntityData(
            formState.data,
            currentUser.username,
            configurableForm
        );

        compositionRoot.save.execute(formData).run(
            diseaseOutbreakEventId => {
                setIsLoading(false);

                switch (formData.type) {
                    case "disease-outbreak-event":
                        if (diseaseOutbreakEventId && formData.entity) {
                            compositionRoot.diseaseOutbreakEvent.mapDiseaseOutbreakEventToAlerts
                                .execute(diseaseOutbreakEventId, formData.entity)
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
                            formType: "incident-response-action",
                        });
                        setGlobalMessage({
                            text: i18n.t(`Incident Action Plan saved successfully`),
                            type: "success",
                        });
                        break;
                    case "incident-response-action":
                        if (currentEventTracker?.id) goTo(RouteName.INCIDENT_ACTION_PLAN);
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
        formState,
        configurableForm,
        currentUser.username,
        compositionRoot,
        currentEventTracker,
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
                case "incident-response-action":
                    goTo(RouteName.INCIDENT_ACTION_PLAN);
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
    };
}
