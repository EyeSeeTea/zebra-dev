import React from "react";

import { TextInput } from "../text-input/TextInput";
import { MemberSelector } from "../member-selector/MemberSelector";
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

export const FieldWidget: React.FC<FieldWidgetProps> = React.memo(props => {
    const { field, onChange, disabled = false } = props;

    switch (field.type) {
        case "select": {
            return field.multiple ? (
                <MultipleSelector
                    id={field.id}
                    placeholder={field.placeholder}
                    label={field.label}
                    selected={field.value}
                    onChange={newValue => onChange(updateFieldState(field, newValue))}
                    options={field.options}
                    helperText={field.helperText}
                    errorText={field.errors ? field.errors.join("/n") : ""}
                    error={field.errors && field.errors.length > 0}
                    required={field.required && field.showIsRequired}
                    disabled={disabled}
                />
            ) : (
                <Selector
                    id={field.id}
                    placeholder={field.placeholder}
                    label={field.label}
                    selected={field.value}
                    onChange={newValue => onChange(updateFieldState(field, newValue))}
                    options={field.options}
                    helperText={field.helperText}
                    errorText={field.errors ? field.errors.join("/n") : ""}
                    error={field.errors && field.errors.length > 0}
                    required={field.required && field.showIsRequired}
                    disabled={disabled}
                />
            );
        }

        case "radio": {
            return (
                <RadioButtonsGroup
                    id={field.id}
                    label={field.label}
                    selected={field.value}
                    onChange={event => onChange(updateFieldState(field, event.target.value))}
                    options={field.options}
                    helperText={field.helperText}
                    errorText={field.errors ? field.errors.join("/n") : ""}
                    error={field.errors && field.errors.length > 0}
                    required={field.required && field.showIsRequired}
                    disabled={disabled}
                />
            );
        }

        case "text":
            return field.multiline ? (
                <TextArea
                    id={field.id}
                    label={field.label}
                    value={field.value}
                    onChange={newValue => onChange(updateFieldState(field, newValue))}
                    helperText={field.helperText}
                    errorText={field.errors ? field.errors.join("/n") : ""}
                    error={field.errors && field.errors.length > 0}
                    required={field.required && field.showIsRequired}
                    disabled={disabled}
                />
            ) : (
                <TextInput
                    id={field.id}
                    label={field.label}
                    value={field.value}
                    onChange={newValue => onChange(updateFieldState(field, newValue))}
                    helperText={field.helperText}
                    errorText={field.errors ? field.errors.join("/n") : ""}
                    error={field.errors && field.errors.length > 0}
                    required={field.required && field.showIsRequired}
                    disabled={disabled}
                />
            );

        case "date":
            return (
                <DatePicker
                    id={field.id}
                    label={field.label}
                    value={field.value}
                    onChange={newValue => onChange(updateFieldState(field, newValue))}
                    helperText={field.helperText}
                    errorText={field.errors ? field.errors.join("/n") : ""}
                    error={field.errors && field.errors.length > 0}
                    required={field.required && field.showIsRequired}
                    disabled={disabled}
                />
            );

        case "boolean": {
            return (
                <Checkbox
                    id={field.id}
                    label={field.label}
                    checked={field.value}
                    onChange={newValue => onChange(updateFieldState(field, newValue))}
                    helperText={field.helperText}
                    disabled={disabled}
                />
            );
        }

        case "member": {
            return (
                <MemberSelector
                    id={field.id}
                    placeholder={field.placeholder}
                    label={field.label}
                    selected={field.value}
                    onChange={newValue => onChange(updateFieldState(field, newValue))}
                    options={field.options}
                    helperText={field.helperText}
                    errorText={field.errors ? field.errors.join("/n") : ""}
                    error={field.errors && field.errors.length > 0}
                    required={field.required && field.showIsRequired}
                    disabled={disabled}
                />
            );
        }
    }
});
