import { useCallback, useEffect, useState } from "react";

import { Maybe } from "../../../../utils/ts-utils";
import i18n from "../../../../utils/i18n";
import { useAppContext } from "../../../contexts/app-context";
import { Id } from "../../../../domain/entities/Ref";
import { FormState } from "../../../components/form/FormState";
import { RouteName, useRoutes } from "../../../hooks/useRoutes";
import { mapFormStateToEntityData } from "./utils/mapFormStateToEntityData";
import { updateAndValidateFormState } from "./utils/updateDiseaseOutbreakEventFormState";
import { mapDiseaseOutbreakEventToInitialFormState } from "./utils/mapEntityToInitialFormState";
import { FormFieldState } from "../../../components/form/FormFieldsState";
import { FormType } from "../FormPage";
import { ConfigurableForm, FormLables } from "../../../../domain/entities/ConfigurableForm";

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

    const [globalMessage, setGlobalMessage] = useState<Maybe<GlobalMessage>>();
    const [formState, setFormState] = useState<FormLoadState>({ kind: "loading" });
    const [configurableForm, setConfigurableForm] = useState<ConfigurableForm>();
    const [formLabels, setFormLabels] = useState<FormLables>();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        //SNEHA TO DO : cases based on form type

        switch (formType) {
            case "disease-outbreak-event":
                compositionRoot.diseaseOutbreakEvent.getWithOptions.execute(id).run(
                    diseaseOutbreakEventWithOptionsData => {
                        if (
                            diseaseOutbreakEventWithOptionsData.data.type ===
                            "disease-outbreak-event"
                        ) {
                            setConfigurableForm(diseaseOutbreakEventWithOptionsData);
                            setFormLabels(diseaseOutbreakEventWithOptionsData.labels);
                            setFormState({
                                kind: "loaded",
                                data: mapDiseaseOutbreakEventToInitialFormState(
                                    diseaseOutbreakEventWithOptionsData.data,
                                    !!id
                                ),
                            });
                        } else {
                            setFormState({
                                kind: "error",
                                message: i18n.t(`Create Event form cannot be loaded`),
                            });
                            setGlobalMessage({
                                text: i18n.t(`An error occurred while loading Create Event form:}`),
                                type: "error",
                            });
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
    }, [compositionRoot.diseaseOutbreakEvent.getWithOptions, formType, id]);

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

        switch (configurableForm.data.type) {
            case "disease-outbreak-event": {
                const diseaseOutbreakEventData = mapFormStateToEntityData(
                    formState.data,
                    currentUser.username,
                    configurableForm.data
                );

                compositionRoot.diseaseOutbreakEvent.save.execute(diseaseOutbreakEventData).run(
                    diseaseOutbreakEventId => {
                        compositionRoot.diseaseOutbreakEvent.mapDiseaseOutbreakEventToAlerts
                            .execute(diseaseOutbreakEventId, diseaseOutbreakEventData)
                            .run(
                                () => {
                                    setIsLoading(false);
                                    goTo(RouteName.EVENT_TRACKER, { id: diseaseOutbreakEventId });
                                },
                                err => {
                                    console.error({ err });
                                    setIsLoading(false);
                                }
                            );

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
            }
        }
    }, [
        compositionRoot.diseaseOutbreakEvent.mapDiseaseOutbreakEventToAlerts,
        compositionRoot.diseaseOutbreakEvent.save,
        currentUser.username,
        configurableForm,
        formState,
        goTo,
    ]);

    const onCancelForm = useCallback(() => {
        goTo(RouteName.DASHBOARD);
    }, [goTo]);

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
