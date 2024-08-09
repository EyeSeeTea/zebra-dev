import { FormControlLabel, InputLabel, Radio, RadioGroup, FormHelperText } from "@material-ui/core";
import React from "react";
import styled from "styled-components";

import { Option } from "../utils/option";

type RadioButtonsGroupProps<Value extends string = string> = {
    id: string;
    selected: string;
    label?: string;
    onChange: (value: string) => void;
    options: Option<Value>[];
    gap?: string;
    helperText?: string;
    errorText?: string;
    error?: boolean;
    disabled?: boolean;
    required?: boolean;
};

export function RadioButtonsGroup<Value extends string>({
    id,
    selected,
    label,
    onChange,
    options,
    gap = "24px",
    helperText = "",
    errorText = "",
    error = false,
    disabled = false,
    required = false,
}: RadioButtonsGroupProps<Value>): JSX.Element {
    const handleChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
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

            <StyledRadioGroup
                aria-label={id}
                name={id}
                value={selected}
                onChange={handleChange}
                gap={gap}
            >
                {options.map(option => (
                    <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<StyledRadio />}
                        label={option.label}
                        disabled={option.disabled || disabled}
                        aria-label={option.label}
                    />
                ))}
            </StyledRadioGroup>

            <StyledFormHelperText id={`${id}-helper-text`} error={error && !!errorText}>
                {error && !!errorText ? errorText : helperText}
            </StyledFormHelperText>
        </Container>
    );
}

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

const StyledRadioGroup = styled(RadioGroup)<{ gap: string }>`
    flex-direction: row;
    gap: ${props => props.gap};
`;

const StyledRadio = styled(Radio)`
    padding: 5px;
    .MuiSvgIcon-root {
        width: 1.125rem;
        height: 1.125rem;
    }
`;

const StyledFormHelperText = styled(FormHelperText)<{ error?: boolean }>`
    color: ${props =>
        props.error ? props.theme.palette.common.red700 : props.theme.palette.common.grey700};
`;
