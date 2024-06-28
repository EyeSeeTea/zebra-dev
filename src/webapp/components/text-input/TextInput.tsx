import React from "react";
import { TextField, InputLabel } from "@material-ui/core";
import styled from "styled-components";

type TextInputProps = {
    id: string;
    label?: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    helperText?: string;
    errorText?: string;
    required?: boolean;
    disabled?: boolean;
    error?: boolean;
};

export const TextInput: React.FC<TextInputProps> = React.memo(
    ({
        id,
        label,
        value,
        onChange,
        helperText = "",
        errorText = "",
        required = false,
        disabled = false,
        error = false,
    }) => {
        return (
            <Container>
                {label && (
                    <Label className={required ? "required" : ""} htmlFor={id}>
                        {label}
                    </Label>
                )}
                <StyledTextField
                    id={id}
                    value={value}
                    onChange={onChange}
                    helperText={error && !!errorText ? errorText : helperText}
                    error={error}
                    disabled={disabled}
                    required={required}
                    variant="outlined"
                />
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

const StyledTextField = styled(TextField)<{ error?: boolean }>`
    .MuiFormHelperText-root {
        color: ${props =>
            props.error ? props.theme.palette.common.red700 : props.theme.palette.common.grey700};
    }
    .MuiInputBase-input {
        padding-inline: 12px;
        padding-block: 10px;
    }
`;
