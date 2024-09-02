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
import { useCurrentEventTrackerId } from "../../contexts/current-event-tracker-context";

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
    onSaveForm: () => void;
    onCancelForm: () => void;
};

export function useForm(formType: FormType, id?: Id): State {
    const { compositionRoot, currentUser } = useAppContext();
    const { goTo } = useRoutes();
    const { currentEventTrackerId } = useCurrentEventTrackerId();

    const [globalMessage, setGlobalMessage] = useState<Maybe<GlobalMessage>>();
    const [formState, setFormState] = useState<FormLoadState>({ kind: "loading" });
    const [configurableForm, setConfigurableForm] = useState<ConfigurableForm>();
    const [formLabels, setFormLabels] = useState<FormLables>();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        compositionRoot.getWithOptions.execute(formType, currentEventTrackerId, id).run(
            formData => {
                setConfigurableForm(formData);
                setFormLabels(formData.labels);
                setFormState({
                    kind: "loaded",
                    data: mapEntityToFormState(formData, !!id),
                });
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
    }, [compositionRoot.getWithOptions, currentEventTrackerId, formType, id]);

    const handleFormChange = useCallback(
        (updatedField: FormFieldState) => {
            setFormState(prevState => {
                if (prevState.kind === "loaded" && configurableForm) {
                    return {
                        kind: "loaded",
                        data: updateAndValidateFormState(
                            prevState.data,
                            updatedField,
                            configurableForm,
                            currentUser.username
                        ),
                    };
                } else {
                    return prevState;
                }
            });
        },
        [currentUser.username, configurableForm]
    );

    const onSaveForm = useCallback(() => {
        if (formState.kind !== "loaded" || !configurableForm || !formState.data.isValid) return;

        setIsLoading(true);

        const formData = mapFormStateToEntityData(
            formState.data,
            currentUser.username,
            configurableForm
        );
        compositionRoot.save.execute(formData).run(
            diseaseOutbreakEventId => {
                if (
                    formData.type === "disease-outbreak-event" &&
                    diseaseOutbreakEventId &&
                    formData.entity
                ) {
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
                }

                setIsLoading(false);
                setGlobalMessage({
                    text: i18n.t(`Disease Outbreak saved successfully`),
                    type: "success",
                });
            },
            err => {
                setGlobalMessage({
                    text: i18n.t(`Error saving disease outbreak: ${err.message}`),
                    type: "error",
                });
                setIsLoading(false);
            }
        );
    }, [formState, configurableForm, currentUser.username, compositionRoot, goTo]);

    const onCancelForm = useCallback(() => {
        if (currentEventTrackerId)
            goTo(RouteName.EVENT_TRACKER, {
                id: currentEventTrackerId,
            });
        else goTo(RouteName.DASHBOARD);
    }, [currentEventTrackerId, goTo]);

    return {
        formLabels,
        globalMessage,
        formState,
        isLoading,
        handleFormChange,
        onSaveForm,
        onCancelForm,
    };
}
