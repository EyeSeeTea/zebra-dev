import React, { useCallback, useMemo } from "react";
import { Checkbox as MUICheckbox, InputLabel, FormHelperText } from "@material-ui/core";
import styled from "styled-components";

type CheckboxProps = {
    id: string;
    label?: string;
    checked: boolean;
    onChange: (isChecked: boolean) => void;
    helperText?: string;
    disabled?: boolean;
    indeterminate?: boolean;
    errorText?: string;
    error?: boolean;
    required?: boolean;
};

export const Checkbox: React.FC<CheckboxProps> = React.memo(
    ({
        id,
        label,
        checked,
        onChange,
        helperText = "",
        disabled = false,
        indeterminate = false,
        errorText = "",
        error = false,
        required = false,
    }) => {
        const handleChange = useCallback(
            (event: React.ChangeEvent<HTMLInputElement>) => {
                onChange(event.target.checked);
            },
            [onChange]
        );

        const inputProps = useMemo(() => ({ "aria-label": label || `${id}-label` }), [id, label]);

        return (
            <Container>
                <CheckboxWrapper>
                    <MUICheckbox
                        id={id}
                        checked={checked}
                        indeterminate={indeterminate}
                        onChange={handleChange}
                        disabled={disabled}
                        size="small"
                        inputProps={inputProps}
                    />

                    {label && (
                        <Label
                            className={required ? "required" : ""}
                            htmlFor={id}
                            disabled={disabled}
                        >
                            {label}
                        </Label>
                    )}
                </CheckboxWrapper>

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
`;

const CheckboxWrapper = styled.div`
    display: flex;
    align-items: center;
`;

const Label = styled(InputLabel)`
    display: inline-block;
    font-weight: 400;
    font-size: 0.938rem;
    color: ${props => props.theme.palette.text.primary};
    &.Mui-disabled {
        color: ${props => props.theme.palette.common.grey600};
    }

    &.required::after {
        content: "*";
        color: ${props => props.theme.palette.common.red};
        margin-inline-start: 4px;
    }
`;

const StyledFormHelperText = styled(FormHelperText)<{ error?: boolean }>`
    color: ${props =>
        props.error ? props.theme.palette.common.red700 : props.theme.palette.common.grey700};
`;
