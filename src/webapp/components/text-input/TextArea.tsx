import React, { useCallback } from "react";
import styled from "styled-components";
import { FormHelperText, TextareaAutosize } from "@material-ui/core";

type TextAreaProps = {
    id: string;
    label?: string;
    value: string;
    onChange: (text: string) => void;
    disabled?: boolean;
    helperText?: string;
    errorText?: string;
    error?: boolean;
    required?: boolean;
};

export const TextArea: React.FC<TextAreaProps> = React.memo(
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
        const handleChange = useCallback(
            (event: React.ChangeEvent<HTMLTextAreaElement>) => {
                onChange(event.target.value);
            },
            [onChange]
        );

        return (
            <Container>
                {label && (
                    <Label className={required ? "required" : ""} htmlFor={id}>
                        {label}
                    </Label>
                )}

                <StyledTextareaAutosize
                    id={id}
                    aria-label={label || `${id}-label`}
                    value={value}
                    onChange={handleChange}
                    minRows={3}
                    disabled={disabled}
                    $hasError={error}
                />

                <StyledFormHelperText id={`${id}-helper-text`} error={error && !!errorText}>
                    {error && !!errorText ? errorText : helperText}
                </StyledFormHelperText>
            </Container>
        );
    }
);

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const Label = styled.label`
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

const StyledTextareaAutosize = styled(TextareaAutosize)<{
    $hasError?: boolean;
    disabled?: boolean;
}>`
    display: inline-block;
    font-family: Roboto, Arial, sans-serif;
    font-weight: 400;
    font-size: 0.875rem;
    padding-inline: 12px;
    padding-block: 10px;
    color: ${props => props.theme.palette.common.grey900};
    background-color: ${props =>
        props.disabled ? props.theme.palette.common.grey100 : props.theme.palette.common.white};
    border-radius: 3px;
    border-color: ${props =>
        props.$hasError ? props.theme.palette.common.red600 : props.theme.palette.common.grey500};
    &:focus-visible {
        outline: none;
        border-color: ${props => props.theme.palette.common.blue600};
        border-width: 2px;
    }
    &:hover:focus-visible {
        border-color: ${props => props.theme.palette.common.blue600};
    }
    &:hover {
        border-color: ${props => props.theme.palette.common.black};
    }
`;

const StyledFormHelperText = styled(FormHelperText)<{ error?: boolean }>`
    color: ${props =>
        props.error ? props.theme.palette.common.red700 : props.theme.palette.common.grey700};
`;
