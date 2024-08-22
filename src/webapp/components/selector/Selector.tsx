import React, { useCallback } from "react";
import styled from "styled-components";
import { Select, InputLabel, MenuItem, FormHelperText } from "@material-ui/core";
import { IconChevronDown24 } from "@dhis2/ui";
import { getLabelFromValue } from "./utils/selectorHelper";
import { Option } from "../utils/option";
import { SearchInput } from "../search-input/SearchInput";

type SelectorProps<Value extends string = string> = {
    id: string;
    selected: Value;
    onChange: (value: Value) => void;
    options: Option<Value>[];
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    helperText?: string;
    errorText?: string;
    error?: boolean;
    required?: boolean;
    disableSearch?: boolean;
};

export function Selector<Value extends string>({
    id,
    label,
    placeholder = "",
    selected,
    onChange,
    options,
    disabled = false,
    helperText = "",
    errorText = "",
    error = false,
    required = false,
    disableSearch = false,
}: SelectorProps<Value>): JSX.Element {
    const [searchTerm, setSearchTerm] = React.useState<string>("");

    const filteredOptions = React.useMemo(
        () =>
            options.filter(option => option.label.toLowerCase().includes(searchTerm.toLowerCase())),
        [searchTerm, options]
    );

    const handleSearchChange = useCallback((text: string) => {
        setSearchTerm(text ?? "");
    }, []);

    const handleSelectChange = useCallback(
        (
            event: React.ChangeEvent<{
                value: unknown;
            }>
        ) => {
            const value = event.target.value as Value;
            if (value && filteredOptions.find(option => option.value === value)) {
                setSearchTerm("");
                onChange(value);
            }
        },
        [filteredOptions, onChange]
    );

    return (
        <Container>
            {label && (
                <Label className={required ? "required" : ""} htmlFor={id}>
                    {label}
                </Label>
            )}

            <StyledSelect
                labelId={label || `${id}-label`}
                id={id}
                value={selected}
                onChange={handleSelectChange}
                onClose={() => setSearchTerm("")}
                onOpen={() => setSearchTerm("")}
                disabled={disabled}
                variant="outlined"
                IconComponent={IconChevronDown24}
                error={error}
                renderValue={(selected: unknown) =>
                    getLabelFromValue(selected as Value, options) || placeholder
                }
                displayEmpty
            >
                {!disableSearch && (
                    <SearchContainer
                        onClickCapture={e => {
                            e.stopPropagation();
                        }}
                    >
                        <SearchInput value={searchTerm} onChange={handleSearchChange} />
                    </SearchContainer>
                )}
                {filteredOptions.map(option => (
                    <MenuItem key={option.value} value={option.value} disabled={option.disabled}>
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

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const SearchContainer = styled.div`
    display: flex;
    width: auto;
    padding-inline: 16px;
    padding-block-start: 10px;
    padding-block-end: 12px;
    > div {
        width: calc(100% - 10px);
    }
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

const StyledFormHelperText = styled(FormHelperText)<{ error?: boolean }>`
    color: ${props =>
        props.error ? props.theme.palette.common.red700 : props.theme.palette.common.grey700};
`;

const StyledSelect = styled(Select)<{ error?: boolean }>`
    height: 40px;
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
