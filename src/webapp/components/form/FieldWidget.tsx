import React, { useCallback } from "react";

import { TextInput } from "../text-input/TextInput";
import { UserSelector } from "../user-selector/UserSelector";
import { MultipleSelector } from "../selector/MultipleSelector";
import { Selector } from "../selector/Selector";
import { RadioButtonsGroup } from "../radio-buttons-group/RadioButtonsGroup";
import { TextArea } from "../text-input/TextArea";
import { DatePicker } from "../date-picker/DatePicker";
import { Checkbox } from "../checkbox/Checkbox";
import { FormFieldState, updateFieldState, SheetData } from "./FormFieldsState";
import { ImportFile } from "../import-file/ImportFile";

export type FieldWidgetProps = {
    onChange: (updatedField: FormFieldState) => void;
    field: FormFieldState;
    disabled?: boolean;
    errorLabels?: Record<string, string>;
};

export const FieldWidget: React.FC<FieldWidgetProps> = React.memo((props): JSX.Element => {
    const { field, onChange, disabled = false, errorLabels } = props;

    const notifyChange = useCallback(
        (newValue: FormFieldState["value"], sheetsData?: SheetData[]) => {
            onChange(updateFieldState(field, newValue, sheetsData));
        },
        [field, onChange]
    );

    const commonProps = {
        id: field.id,
        label: field.label,
        onChange: notifyChange,
        helperText: field.helperText,
        errorText: field.errors
            ? field.errors
                  .map(error => (errorLabels && errorLabels[error] ? errorLabels[error] : error))
                  .join("\n")
            : "",
        error: field.errors && field.errors.length > 0,
        required: field.required && field.showIsRequired,
        disabled: disabled,
    };

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
                    addNewOption={field.addNewOption}
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

        case "file": {
            return (
                <ImportFile
                    {...commonProps}
                    file={field.value}
                    onChange={notifyChange}
                    fileTemplate={field.fileTemplate}
                    fileId={field.fileId}
                    fileNameLabel={field.fileNameLabel}
                />
            );
        }
    }
});
