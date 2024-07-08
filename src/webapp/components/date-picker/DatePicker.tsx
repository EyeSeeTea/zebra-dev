import React from "react";
import styled from "styled-components";
import { InputLabel } from "@material-ui/core";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker as DatePickerMUI } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { IconCalendar24 } from "@dhis2/ui";

type DatePickerProps = {
    id: string;
    label?: string;
    value: Date | null;
    onChange: (value: Date | null) => void;
    helperText?: string;
    errorText?: string;
    disabled?: boolean;
    error?: boolean;
    required?: boolean;
};

export const DatePicker: React.FC<DatePickerProps> = React.memo(
    ({
        id,
        label,
        value,
        onChange,
        disabled = false,
        helperText = "",
        errorText = "",
        error = false,
        required = false,
    }) => {
        return (
            <Container>
                {label && (
                    <Label className={required ? "required" : ""} htmlFor={id}>
                        {label}
                    </Label>
                )}

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <StyledDatePicker
                        value={value}
                        onChange={onChange}
                        format="dd/MM/yyyy"
                        slots={{ openPickerIcon: IconCalendar24 }}
                        error={error}
                        disabled={disabled}
                        slotProps={{
                            textField: {
                                helperText: error && !!errorText ? errorText : helperText,
                                "aria-label": label || `${id}-label`,
                                id: id,
                            },
                        }}
                    />
                </LocalizationProvider>
            </Container>
        );
    }
);

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const Label = styled(InputLabel)`
    display: inline-block;
    font-weight: 700;
    font-size: 0.875rem;
    color: ${props => props.theme.palette.text.primary};
    margin-block-end: 8px;

    &.required::after {
        content: "*";
        color: ${props => props.theme.palette.common.red};
        margin-inline-start: 4px;
    }
`;

const StyledDatePicker = styled(DatePickerMUI)<{ error?: boolean; disabled?: boolean }>`
    & .MuiInputBase-root {
        border-radius: 3px;
        background-color: ${props =>
            props.disabled ? props.theme.palette.common.grey100 : props.theme.palette.common.white};
    }
    & .Mui-focused {
        border-color: ${props => props.theme.palette.common.blue600};
    }
    input {
        padding-inline: 12px;
        padding-block: 10px;
        font-weight: 400;
        font-size: 0.875rem;
        color: ${props =>
            props.disabled ? props.theme.palette.text.disabled : props.theme.palette.text.primary};
    }
    .MuiInputBase-input::placeholder {
        color: ${props =>
            props.disabled ? props.theme.palette.text.disabled : props.theme.palette.text.primary};
    }
    .MuiOutlinedInput-notchedOutline {
        border-color: ${props =>
            props.error ? props.theme.palette.common.red600 : props.theme.palette.common.grey500};
    }
    .MuiIconButton-edgeEnd {
        color: ${props => props.theme.palette.icon.color};
    }
    .MuiFormHelperText-root {
        font-weight: 400;
        font-size: "0.75rem";
        margin-inline-start: 0;
        color: ${props =>
            props.error ? props.theme.palette.common.red700 : props.theme.palette.common.grey700};
    }
`;
