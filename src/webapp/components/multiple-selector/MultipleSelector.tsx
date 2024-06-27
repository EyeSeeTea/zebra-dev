import React, { useCallback } from "react";
import styled from "styled-components";
import { Select, InputLabel, MenuItem, FormHelperText, Chip } from "@material-ui/core";
import { IconChevronDown24, IconCross16 } from "@dhis2/ui";

export type MultipleSelectorOption<T extends string = string> = {
    value: T;
    label: string;
    disabled?: boolean;
};

type MultipleSelectorProps<T extends string = string> = {
    id: string;
    selected: T[];
    onChange: (value: MultipleSelectorOption["value"][]) => void;
    options: MultipleSelectorOption<T>[];
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    helperText?: string;
    errorText?: string;
    error?: boolean;
};

export const MultipleSelector: React.FC<MultipleSelectorProps> = React.memo(
    ({
        id,
        label = "",
        placeholder = "",
        selected,
        onChange,
        options,
        disabled = false,
        helperText = "",
        errorText = "",
        error = false,
    }) => {
        const getLabelFromValue = useCallback(
            (value: MultipleSelectorOption["value"]) => {
                return options.find(option => option.value === value)?.label || "";
            },
            [options]
        );

        const handleChange = useCallback(
            (
                event: React.ChangeEvent<{
                    value: unknown;
                }>,
                _child: React.ReactNode
            ) => {
                const value = event.target.value as MultipleSelectorOption["value"][];
                onChange(value);
            },
            [onChange]
        );

        const handleDelete = useCallback(
            (
                event: React.MouseEvent<HTMLDivElement, MouseEvent>,
                value: MultipleSelectorOption["value"]
            ) => {
                event.stopPropagation();
                onChange(selected?.filter(selection => selection !== value));
            },
            [onChange, selected]
        );

        return (
            <Container>
                {label && <Label htmlFor={id}>{label}</Label>}
                <StyledSelect
                    labelId={label || `${id}-label`}
                    id={id}
                    value={selected}
                    onChange={handleChange}
                    disabled={disabled}
                    variant="outlined"
                    IconComponent={IconChevronDown24}
                    error={error}
                    renderValue={(selected: unknown) =>
                        (selected as MultipleSelectorOption["value"][])?.length ? (
                            <div>
                                {(selected as MultipleSelectorOption["value"][]).map(value => (
                                    <SelectedChip
                                        key={value}
                                        label={getLabelFromValue(value)}
                                        deleteIcon={<IconCross16 />}
                                        onDelete={event => handleDelete(event, value)}
                                        onMouseDown={event => handleDelete(event, value)}
                                    />
                                ))}
                            </div>
                        ) : (
                            placeholder
                        )
                    }
                    displayEmpty
                    multiple
                >
                    {options.map(option => (
                        <MenuItem
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </MenuItem>
                    ))}
                </StyledSelect>
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

const Label = styled(InputLabel)`
    display: inline-block;
    font-weight: 400;
    font-size: 0.875rem;
    color: ${props => props.theme.palette.text.primary};
    margin-block-end: 8px;
`;

const StyledFormHelperText = styled(FormHelperText)<{ error?: boolean }>`
    color: ${props =>
        props.error ? props.theme.palette.common.red700 : props.theme.palette.common.grey700};
`;

const StyledSelect = styled(Select)<{ error?: boolean }>`
    .MuiOutlinedInput-notchedOutline {
        border-color: ${props =>
            props.error ? props.theme.palette.common.red600 : props.theme.palette.common.grey500};
    }
    .MuiSelect-root {
        padding-inline-start: 12px;
        padding-inline-end: 6px;
        padding-block: 10px;
        &:focus {
            background-color: ${props => props.theme.palette.common.white};
        }
    }
`;

const SelectedChip = styled(Chip)`
    margin-inline-end: 16px;
    font-weight: 400;
    font-size: 0.813rem;
    padding-inline-end: 8px;
    svg {
        color: ${props => props.theme.palette.common.grey600};
        cursor: pointer;
        &:hover {
            color: ${props => props.theme.palette.common.grey900};
        }
    }
`;
