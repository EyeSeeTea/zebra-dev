import { useCallback, useEffect, useState } from "react";
import { useSnackbar } from "@eyeseetea/d2-ui-components";

import { Maybe } from "../../../utils/ts-utils";
import i18n from "../../../utils/i18n";
import { useAppContext } from "../../contexts/app-context";
import { Id } from "../../../domain/entities/Ref";
import { FormState, isValidForm } from "../../components/form/FormState";
import { RouteName, useRoutes } from "../../hooks/useRoutes";
import { mapFormStateToEntityData } from "./mapFormStateToEntityData";
import { updateAndValidateFormState } from "./utils/updateAndValidateFormState";
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
import { useNationalPerformanceOverview } from "../dashboard/useNationalPerformanceOverview";
import { useIncidentActionPlan } from "../incident-action-plan/useIncidentActionPlan";
import { RiskAssessmentQuestionnaire } from "../../../domain/entities/risk-assessment/RiskAssessmentQuestionnaire";
import { ModalData } from "../../components/form/Form";
import { useDiseaseOutbreakEventForm } from "./disease-outbreak-event/useDiseaseOutbreakEventForm";
import { useResourceForm } from "./resources/useResourceForm";
import { useResources } from "../resources/useResources";

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
    openModal: boolean;
    modalData?: ModalData;
    setOpenModal: (open: boolean) => void;
    handleFormChange: (updatedField: FormFieldState) => void;
    onPrimaryButtonClick: () => void;
    onCancelForm: () => void;
    handleAddNew: () => void;
    handleRemove: (id: string) => void;
};

export function useForm(formType: FormType, id?: Id): State {
    const { compositionRoot, currentUser, configurations } = useAppContext();
    const { goTo } = useRoutes();

    const { getCurrentEventTracker } = useCurrentEventTracker();
    const currentEventTracker = getCurrentEventTracker();
    const { existingEventTrackerTypes } = useExistingEventTrackerTypes();
    const { dataNationalPerformanceOverview } = useNationalPerformanceOverview();
    const { isIncidentManager } = useIncidentActionPlan(currentEventTracker?.id ?? "");
    const snackbar = useSnackbar();
    useCheckWritePermission(formType);

    const [globalMessage, setGlobalMessage] = useState<Maybe<GlobalMessage>>();
    const [formState, setFormState] = useState<FormLoadState>({ kind: "loading" });
    const [configurableForm, setConfigurableForm] = useState<ConfigurableForm>();
    const [formLabels, setFormLabels] = useState<FormLables>();
    const [isLoading, setIsLoading] = useState(false);
    const [formSectionsToDelete, setFormSectionsToDelete] = useState<string[]>([]);
    const [entityData, setEntityData] = useState<ConfigurableForm>();
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState<ModalData>();

    const { onSaveDiseaseOutbreakEvent } = useDiseaseOutbreakEventForm({
        editMode: !!id,
        setIsLoading,
        setGlobalMessage,
        setOpenModal,
        setModalData,
    });

    const { onSaveResourceForm } = useResourceForm({
        editMode: !!id,
        setOpenModal,
        setModalData,
        setGlobalMessage,
        setIsLoading,
    });
    const { userPermissions: resourcePermissions } = useResources();

    const allDataPerformanceEvents = dataNationalPerformanceOverview?.map(
        event => event.suspectedDisease
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
                    setConfigurableForm(formData);
                    setFormLabels(formData.labels);
                    setFormState({
                        kind: "loaded",
                        data: mapEntityToFormState({
                            configurableForm: formData,
                            editMode: !!id,
                            existingEventTrackerTypes: existingEventTrackerTypes,
                            isIncidentManager: isIncidentManager,
                            resourcePermissions: resourcePermissions,
                        }),
                    });
                    setEntityData(formData);
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
        resourcePermissions,
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
            if (formState.kind !== "loaded" || !entityData) return;

            switch (entityData.type) {
                case "risk-assessment-questionnaire": {
                    const sectionIndexToDelete = formState.data.sections
                        .filter(section => section.title?.includes("Custom Question"))
                        .findIndex(section => section.id === id);

                    const entityId = entityData.entity?.additionalQuestions?.find(
                        (_, index) => index === sectionIndexToDelete
                    )?.id;

                    if (entityId) {
                        setFormSectionsToDelete(prevState => [...prevState, entityId]);

                        const updatedEntityData: ConfigurableForm = {
                            ...entityData,
                            entity: {
                                ...entityData.entity,
                                additionalQuestions: entityData.entity?.additionalQuestions?.filter(
                                    (_, index) => index !== sectionIndexToDelete
                                ),
                            } as RiskAssessmentQuestionnaire,
                        };

                        setEntityData(updatedEntityData);
                    }
                    break;
                }
                case "incident-response-actions": {
                    const sectionIndexToDelete = formState.data.sections.findIndex(
                        section => section.id === id
                    );

                    const entityId = entityData.entity?.find(
                        (_, index) => index === sectionIndexToDelete
                    )?.id;

                    if (entityId) {
                        setFormSectionsToDelete(prevState => [...prevState, entityId]);

                        const updatedEntityData: ConfigurableForm = {
                            ...entityData,
                            entity: entityData.entity.filter(
                                (_, index) => index !== sectionIndexToDelete
                            ),
                        };
                        setEntityData(updatedEntityData);
                    }
                    break;
                }
                default:
                    break;
            }

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
                            isValid: isValidForm(formSections),
                        },
                    };
                } else {
                    return prevState;
                }
            });
        },
        [entityData, formState]
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
        if (formState.kind !== "loaded" || !configurableForm || !formState.data.isValid) return;

        const formData = mapFormStateToEntityData({
            formState: formState.data,
            currentUserName: currentUser.username,
            formData: configurableForm,
            appDefaults: configurations.appDefaults,
        });

        if (
            formData.type === "disease-outbreak-event" ||
            formData.type === "disease-outbreak-event-case-data"
        ) {
            onSaveDiseaseOutbreakEvent(formData);
        } else if (formData.type === "resource") {
            onSaveResourceForm(formData);
        } else {
            setIsLoading(true);
            compositionRoot.save.execute(formData, configurations, !!id, formSectionsToDelete).run(
                _diseaseOutbreakEventId => {
                    setIsLoading(false);
                    switch (formData.type) {
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
        }
    }, [
        compositionRoot.save,
        configurableForm,
        configurations,
        currentEventTracker?.id,
        currentUser.username,
        formSectionsToDelete,
        formState,
        goTo,
        id,
        onSaveDiseaseOutbreakEvent,
        onSaveResourceForm,
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
                case "resource":
                    goTo(RouteName.RESOURCES);
                    break;
                default:
                    goTo(RouteName.EVENT_TRACKER, {
                        id: currentEventTracker.id,
                    });
                    break;
            }
        } else {
            goTo(RouteName.ZEBRA_DASHBOARD);
        }
    }, [currentEventTracker, formType, goTo]);

    return {
        formLabels,
        globalMessage,
        formState,
        isLoading,
        openModal,
        modalData,
        setOpenModal,
        handleFormChange,
        onPrimaryButtonClick,
        onCancelForm,
        handleAddNew,
        handleRemove,
    };
}
