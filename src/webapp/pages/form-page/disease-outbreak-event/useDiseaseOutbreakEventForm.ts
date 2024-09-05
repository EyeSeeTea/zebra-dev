import { useCallback, useEffect, useState } from "react";

import { Maybe } from "../../../../utils/ts-utils";
import i18n from "../../../../utils/i18n";
import { useAppContext } from "../../../contexts/app-context";
import { Id } from "../../../../domain/entities/Ref";
import { FormState } from "../../../components/form/FormState";
import { RouteName, useRoutes } from "../../../hooks/useRoutes";
import {
    DiseaseOutbreakEventLabels,
    DiseaseOutbreakEventWithOptions,
} from "../../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEventWithOptions";
import { mapFormStateToEntityData } from "./utils/mapFormStateToEntityData";
import { updateDiseaseOutbreakEventFormState } from "./utils/updateDiseaseOutbreakEventFormState";
import { mapEntityToInitialFormState } from "./utils/mapEntityToInitialFormState";
import { FormFieldState } from "../../../components/form/FormFieldsState";

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

type State = {
    formLabels: Maybe<DiseaseOutbreakEventLabels>;
    globalMessage: Maybe<GlobalMessage>;
    formState: DiseaseOutbreakEventFormState;
    isLoading: boolean;
    handleFormChange: (updatedField: FormFieldState) => void;
    onSaveForm: () => void;
    onCancelForm: () => void;
};

// TODO: Thinking for the future about making this more generic
export function useDiseaseOutbreakEventForm(diseaseOutbreakEventId?: Id): State {
    const { compositionRoot, currentUser } = useAppContext();
    const { goTo } = useRoutes();

    const [globalMessage, setGlobalMessage] = useState<Maybe<GlobalMessage>>();
    const [formState, setFormState] = useState<DiseaseOutbreakEventFormState>({ kind: "loading" });
    const [diseaseOutbreakEventWithOptions, setDiseaseOutbreakEventWithOptions] =
        useState<DiseaseOutbreakEventWithOptions>();
    const [formLabels, setFormLabels] = useState<DiseaseOutbreakEventLabels>();
    const [isSaved, setIsSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        compositionRoot.diseaseOutbreakEvent.getWithOptions.execute(diseaseOutbreakEventId).run(
            diseaseOutbreakEventWithOptionsData => {
                setDiseaseOutbreakEventWithOptions(diseaseOutbreakEventWithOptionsData);
                setFormLabels(diseaseOutbreakEventWithOptionsData.labels);
                setFormState({
                    kind: "loaded",
                    data: mapEntityToInitialFormState(
                        diseaseOutbreakEventWithOptionsData,
                        !!diseaseOutbreakEventId
                    ),
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
    }, [compositionRoot.diseaseOutbreakEvent.getWithOptions, diseaseOutbreakEventId]);

    const handleFormChange = useCallback(
        (updatedField: FormFieldState) => {
            setFormState(prevState => {
                if (prevState.kind === "loaded" && diseaseOutbreakEventWithOptions) {
                    return {
                        kind: "loaded",
                        data: updateDiseaseOutbreakEventFormState(
                            prevState.data,
                            updatedField,
                            diseaseOutbreakEventWithOptions
                        ),
                    };
                } else {
                    return prevState;
                }
            });
        },
        [diseaseOutbreakEventWithOptions]
    );

    const onSaveForm = useCallback(() => {
        if (
            formState.kind !== "loaded" ||
            !diseaseOutbreakEventWithOptions ||
            !formState.data.isValid
        )
            return;

        setIsLoading(true);

        try {
            const diseaseOutbreakEventData = mapFormStateToEntityData(
                formState.data,
                currentUser.username,
                diseaseOutbreakEventWithOptions
            );

            compositionRoot.diseaseOutbreakEvent.save.execute(diseaseOutbreakEventData).run(
                () => {
                    setGlobalMessage({
                        text: i18n.t(`Disease Outbreak saved successfully`),
                        type: "success",
                    });
                    setIsLoading(false);
                    setIsSaved(true);
                },
                err => {
                    setGlobalMessage({
                        text: i18n.t(`Error saving disease outbreak: ${err.message}`),
                        type: "error",
                    });
                    setIsLoading(false);
                    setIsSaved(false);
                }
            );
        } catch (error) {
            setGlobalMessage({
                text: i18n.t(`Error saving disease outbreak: ${error}`),
                type: "error",
            });
            setIsLoading(false);
            setIsSaved(false);
            return;
        }
    }, [
        compositionRoot.diseaseOutbreakEvent.save,
        currentUser.username,
        diseaseOutbreakEventWithOptions,
        formState,
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
