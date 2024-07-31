import React, { useCallback, useMemo } from "react";

import { TextInput } from "../text-input/TextInput";
import { UserSelector } from "../user-selector/UserSelector";
import { MultipleSelector } from "../selector/MultipleSelector";
import { Selector } from "../selector/Selector";
import { RadioButtonsGroup } from "../radio-buttons-group/RadioButtonsGroup";
import { TextArea } from "../text-input/TextArea";
import { DatePicker } from "../date-picker/DatePicker";
import { Checkbox } from "../checkbox/Checkbox";
import { FormFieldState, updateFieldState } from "./FormState";

export type FieldWidgetProps = {
    onChange: (updatedField: FormFieldState) => void;
    field: FormFieldState;
    disabled?: boolean;
};

export const FieldWidget: React.FC<FieldWidgetProps> = React.memo((props): JSX.Element => {
    const { field, onChange, disabled = false } = props;

    const handleChange = useCallback(
        (newValue: FormFieldState["value"]) => {
            onChange(updateFieldState(field, newValue));
        },
        [field, onChange]
    );

    const commonProps = useMemo(
        () => ({
            id: field.id,
            label: field.label,
            onChange: handleChange,
            helperText: field.helperText,
            errorText: field.errors ? field.errors.join("\n") : "",
            error: field.errors && field.errors.length > 0,
            required: field.required && field.showIsRequired,
            disabled: disabled,
        }),
        [
            disabled,
            field.errors,
            field.helperText,
            field.id,
            field.label,
            field.required,
            field.showIsRequired,
            handleChange,
        ]
    );

    switch (field.type) {
        case "select": {
            return field.multiple ? (
                <MultipleSelector
                    {...commonProps}
                    placeholder={field.placeholder}
                    selected={field.value}
                    options={field.options}
                />
            ) : (
                <Selector
                    {...commonProps}
                    placeholder={field.placeholder}
                    selected={field.value}
                    options={field.options}
                />
            );
        }

        case "radio": {
            return (
                <RadioButtonsGroup
                    {...commonProps}
                    selected={field.value}
                    options={field.options}
                />
            );
        }

        case "text":
            return field.multiline ? (
                <TextArea {...commonProps} value={field.value} />
            ) : (
                <TextInput {...commonProps} value={field.value} />
            );

        case "date":
            return <DatePicker {...commonProps} value={field.value} />;

        case "boolean": {
            return <Checkbox {...commonProps} checked={field.value} />;
        }

        case "user": {
            return (
                <UserSelector
                    {...commonProps}
                    placeholder={field.placeholder}
                    selected={field.value}
                    options={field.options}
                />
            );
        }
    }
});
