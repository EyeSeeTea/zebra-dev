import React, { useEffect, useState } from "react";

import i18n from "../../../utils/i18n";
import { TextInput } from "../text-input/TextInput";
import { MemberSelector } from "../member-selector/MemberSelector";
import { FormField, FormFieldState } from "./FormFieldState";
import { useDebounce } from "../../hooks/useDebounce";
import { MultipleSelector } from "../selector/MultipleSelector";
import { Selector } from "../selector/Selector";
import { RadioButtonsGroup } from "../radio-buttons-group/RadioButtonsGroup";
import { TextArea } from "../text-input/TextArea";
import { DatePicker } from "../date-picker/DatePicker";
import { Checkbox } from "../checkbox/Checkbox";

export type FieldWidgetProps = {
    onChange: (updatedField: FormFieldState) => void;
    field: FormFieldState;
    disabled?: boolean;
};

export const FieldWidget: React.FC<FieldWidgetProps> = React.memo(props => {
    const { field, onChange, disabled = false } = props;
    const [textFieldValue, setTextFieldValue] = useState<string>(
        field.type === "text" ? field.value : ""
    );
    const debouncedTextFieldValue = useDebounce(textFieldValue);

    useEffect(() => {
        if (debouncedTextFieldValue !== field.value && field.type === "text") {
            onChange(FormField.updateState(field, debouncedTextFieldValue));
        }
    }, [debouncedTextFieldValue, field, onChange]);

    switch (field.type) {
        case "select": {
            return field.multiple && field.options && Array.isArray(field.value) ? (
                <MultipleSelector
                    id={field.id}
                    placeholder={field.placeholder}
                    label={field.label}
                    selected={field.value}
                    onChange={newValue => onChange(FormField.updateState(field, newValue))}
                    options={field.options}
                    helperText={field.helperText}
                    errorText={field.errors ? field.errors.join("/n") : ""}
                    error={field.errors && field.errors.length > 0}
                    required={field.required && field.showIsRequired}
                    disabled={disabled}
                />
            ) : !field.multiple && field.options && typeof field.value === "string" ? (
                <Selector
                    id={field.id}
                    placeholder={field.placeholder}
                    label={field.label}
                    selected={field.value}
                    onChange={newValue => onChange(FormField.updateState(field, newValue))}
                    options={field.options}
                    helperText={field.helperText}
                    errorText={field.errors ? field.errors.join("/n") : ""}
                    error={field.errors && field.errors.length > 0}
                    required={field.required && field.showIsRequired}
                    disabled={disabled}
                />
            ) : (
                <span>{i18n.t("Error displaying this field in the form")}</span>
            );
        }

        case "radio": {
            return field.options && typeof field.value === "string" ? (
                <RadioButtonsGroup
                    id={field.id}
                    label={field.label}
                    selected={field.value}
                    onChange={event => onChange(FormField.updateState(field, event.target.value))}
                    options={field.options}
                    helperText={field.helperText}
                    errorText={field.errors ? field.errors.join("/n") : ""}
                    error={field.errors && field.errors.length > 0}
                    required={field.required && field.showIsRequired}
                    disabled={disabled}
                />
            ) : (
                <span>{i18n.t("Error displaying this field in the form")}</span>
            );
        }

        case "text":
            return field.multiline ? (
                <TextArea
                    id={field.id}
                    label={field.label}
                    value={textFieldValue}
                    onChange={newValue => setTextFieldValue(newValue)}
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
                    value={textFieldValue}
                    onChange={event => setTextFieldValue(event.target.value)}
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
                    onChange={newValue => onChange(FormField.updateState(field, newValue))}
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
                    onChange={newValue => onChange(FormField.updateState(field, newValue))}
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
                    onChange={newValue => onChange(FormField.updateState(field, newValue))}
                    options={field.options}
                    helperText={field.helperText}
                    errorText={field.errors ? field.errors.join("/n") : ""}
                    error={field.errors && field.errors.length > 0}
                    required={field.required && field.showIsRequired}
                    disabled={disabled}
                />
            );
        }

        default:
            return <span>{i18n.t("Error displaying this field in the form")}</span>;
    }
});
