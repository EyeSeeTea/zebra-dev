import { useCallback, useEffect, useState } from "react";

import { Maybe } from "../../../../utils/ts-utils";
import i18n from "../../../../utils/i18n";
import { useAppContext } from "../../../contexts/app-context";
import { Id } from "../../../../domain/entities/Ref";
import { FormFieldState, FormState } from "../../../components/form/FormState";
import { RouteName, useRoutes } from "../../../hooks/useRoutes";
import {
    DiseaseOutbreakEventLables,
    DiseaseOutbreakEventWithOptions,
} from "../../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEventWithOptions";
import {
    mapEntityToInitialFormState,
    mapFormStateToEntityData,
} from "./utils/diseaseOutbreakEventFormMapper";
import { updateDiseaseOutbreakEventFormState } from "./utils/updateDiseaseOutbreakEventFormState";

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
    formLabels: Maybe<DiseaseOutbreakEventLables>;
    globalMessage: Maybe<GlobalMessage>;
    formState: DiseaseOutbreakEventFormState;
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
    const [formLabels, setFormLabels] = useState<DiseaseOutbreakEventLables>();

    useEffect(() => {
        compositionRoot.diseaseOutbreakEvent.getWithOptions.execute(diseaseOutbreakEventId).run(
            diseaseOutbreakEventWithOptionsData => {
                setDiseaseOutbreakEventWithOptions(diseaseOutbreakEventWithOptionsData);
                setFormLabels(diseaseOutbreakEventWithOptionsData.labels);
                setFormState({
                    kind: "loaded",
                    data: mapEntityToInitialFormState(diseaseOutbreakEventWithOptionsData),
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
                            diseaseOutbreakEventWithOptions,
                            currentUser.username
                        ),
                    };
                } else {
                    return prevState;
                }
            });
        },
        [currentUser.username, diseaseOutbreakEventWithOptions]
    );

    const onSaveForm = useCallback(() => {
        if (formState.kind !== "loaded" || !diseaseOutbreakEventWithOptions) return;

        const diseaseOutbreakEventData = mapFormStateToEntityData(
            formState.data,
            currentUser.username,
            diseaseOutbreakEventWithOptions
        );
        console.debug("Event saved:", diseaseOutbreakEventData);

        // TODO: Integrate with save use case
        // compositionRoot.diseaseOutbreakEvent.save.execute(diseaseOutbreakEventData).run(
        //     () => {
        //         setGlobalMessage({
        //             text: i18n.t(`Disease Outbreak saved successfully`),
        //             type: "success",
        //         });
        //     },
        //     err => {
        //         setGlobalMessage({
        //             text: i18n.t(`Error saving disease outbreak: ${err.message}`),
        //             type: "success",
        //         });
        //     }
        // );

        compositionRoot.diseaseOutbreakEvent.mapOutbreakToDistrict.execute().run(
            data => {
                console.debug({ data });
            },
            err => {
                console.error({ err });
            }
        );
    }, [
        compositionRoot.diseaseOutbreakEvent.mapOutbreakToDistrict,
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
        handleFormChange,
        onSaveForm,
        onCancelForm,
    };
}
