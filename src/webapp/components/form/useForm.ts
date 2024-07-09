import { useCallback, useEffect, useState } from "react";

import { Form, FormState } from "./FormState";
import { FormFieldState } from "./FormFieldState";

export function useForm(
    formState: FormState,
    onFormChange: (newFormState: FormState, updatedField: FormFieldState) => void
): {
    formLocalState: FormState;
    handleUpdateFormField: (updatedField: FormFieldState) => void;
} {
    const [formLocalState, setFormLocalState] = useState<FormState>(formState);

    useEffect(() => {
        setFormLocalState({
            ...formState,
        });
    }, [formState]);

    const handleUpdateFormField = useCallback(
        (updatedField: FormFieldState) => {
            const newFormState = Form.updateFormState(formState, updatedField);
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
