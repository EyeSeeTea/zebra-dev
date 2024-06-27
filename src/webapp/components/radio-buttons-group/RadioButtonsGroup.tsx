import { FormControlLabel, Radio, RadioGroup, FormHelperText } from "@material-ui/core";
import React from "react";
import styled from "styled-components";

export type RadioOption<T extends string = string> = {
    value: T;
    label: string;
    disabled?: boolean;
};

type RadioButtonsGroupProps = {
    id: string;
    selected: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    options: RadioOption[];
    gap?: string;
    helperText?: string;
    errorText?: string;
    error?: boolean;
};

export const RadioButtonsGroup: React.FC<RadioButtonsGroupProps> = React.memo(
    ({
        id,
        selected,
        onChange,
        options,
        gap = "24px",
        helperText = "",
        errorText = "",
        error = false,
    }) => {
        return (
            <>
                <StyledRadioGroup
                    aria-label={id}
                    name={id}
                    value={selected}
                    onChange={onChange}
                    gap={gap}
                >
                    {options.map(option => (
                        <FormControlLabel
                            key={option.value}
                            value={option.value}
                            control={<StyledRadio />}
                            label={option.label}
                            disabled={option.disabled}
                            aria-label={option.label}
                        />
                    ))}
                </StyledRadioGroup>
                <StyledFormHelperText id={`${id}-helper-text`} error={error && !!errorText}>
                    {error && !!errorText ? errorText : helperText}
                </StyledFormHelperText>
            </>
        );
    }
);

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
