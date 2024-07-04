import React, { useCallback, useEffect, useState } from "react";
import { TextField } from "@material-ui/core";
import { IconSearch24 } from "@dhis2/ui";
import styled from "styled-components";

import i18n from "../../../utils/i18n";

type SearchInputProps = {
    value: string;
    onChange: (event: string) => void;
    placeholder?: string;
    disabled?: boolean;
};

const INPUT_PROPS = { "aria-label": "search" };

export const SearchInput: React.FC<SearchInputProps> = React.memo(
    ({ value, onChange, placeholder = "", disabled = false }) => {
        const [stateValue, updateStateValue] = useState(value);

        useEffect(() => updateStateValue(value), [value]);

        const onChangeDebounced = React.useMemo(
            () =>
                debounce((value: string) => {
                    if (onChange) onChange(value);
                }, 400),
            [onChange]
        );

        const handleChange = useCallback(
            (event: React.ChangeEvent<HTMLInputElement>) => {
                const value = event.target.value;
                onChangeDebounced(value);
                updateStateValue(value);
            },
            [onChangeDebounced, updateStateValue]
        );

        const handleKeydown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
            event.stopPropagation();
        }, []);

        return (
            <Container>
                <IconContainer $disabled={disabled}>
                    <IconSearch24 />
                </IconContainer>

                <StyledTextField
                    onChange={handleChange}
                    placeholder={placeholder || i18n.t("Search")}
                    value={stateValue}
                    role="searchbox"
                    onKeyDown={handleKeydown}
                    disabled={disabled}
                    variant="outlined"
                    inputProps={INPUT_PROPS}
                />
            </Container>
        );
    }
);

function debounce<F extends (...args: any[]) => any>(func: F, delay: number) {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const debounced = (...args: Parameters<F>): void => {
        if (timeout !== null) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => func(...args), delay);
    };

    return debounced;
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
`;

const IconContainer = styled.div<{ $disabled?: boolean }>`
    height: 100%;
    position: absolute;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    padding-inline-start: 24px;
    padding-inline-end: 8px;
    svg {
        color: ${props =>
            props.$disabled ? props.theme.palette.common.grey3 : props.theme.palette.common.grey2};
    }
`;

const StyledTextField = styled(TextField)<{ error?: boolean }>`
    font-weight: 400;
    font-size: 0.875rem;
    color: ${props => props.theme.palette.common.grey1};
    .MuiFormHelperText-root {
        color: ${props =>
            props.error ? props.theme.palette.common.red700 : props.theme.palette.common.grey700};
    }
    .MuiOutlinedInput-notchedOutline {
        border-color: ${props => props.theme.palette.common.grey4};
    }
    .MuiInputBase-input {
        background-color: ${props => props.theme.palette.common.background1};
        padding-inline-end: 12px;
        padding-block: 10px;
        padding-inline-start: 64px;
    }
`;
