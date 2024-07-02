import React, { useCallback } from "react";
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
    }) => {
        const handleChange = useCallback(
            (event: React.ChangeEvent<HTMLInputElement>) => {
                onChange(event.target.checked);
            },
            [onChange]
        );

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
                        inputProps={{ "aria-label": label || `${id}-label` }}
                    />
                    <Label htmlFor={id} disabled={disabled}>
                        {label}
                    </Label>
                </CheckboxWrapper>
                <StyledFormHelperText id={`${id}-helper-text`}>{helperText}</StyledFormHelperText>
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
`;

const StyledFormHelperText = styled(FormHelperText)`
    color: ${props => props.theme.palette.common.grey700};
`;
