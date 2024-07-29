import { useCallback, useEffect, useState } from "react";

import { updateFormState, FormState, FormFieldState } from "./FormState";

type State = {
    formLocalState: FormState;
    handleUpdateFormField: (updatedField: FormFieldState) => void;
};

export function useForm(
    formState: FormState,
    onFormChange: (newFormState: FormState, updatedField: FormFieldState) => void
): State {
    const [formLocalState, setFormLocalState] = useState<FormState>(formState);

    useEffect(() => {
        setFormLocalState({
            ...formState,
        });
    }, [formState]);

    const handleUpdateFormField = useCallback(
        (updatedField: FormFieldState) => {
            const newFormState = updateFormState(formState, updatedField);
            setFormLocalState(newFormState);
            onFormChange(newFormState, updatedField);
        },
        [formState, onFormChange]
    );

    return {
        formLocalState,
        handleUpdateFormField,
    };
}
