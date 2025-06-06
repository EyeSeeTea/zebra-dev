import React, { useCallback, useEffect, useState } from "react";
import { TextField } from "@material-ui/core";
import { IconSearch24 } from "@dhis2/ui";
import styled from "styled-components";

import i18n from "../../../utils/i18n";
import { useDebounce } from "../../hooks/useDebounce";

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
        const debouncedValue = useDebounce(stateValue);

        useEffect(() => {
            if (debouncedValue !== value) {
                onChange(debouncedValue);
            }
        }, [debouncedValue, onChange, value]);

        const handleKeydown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
            event.stopPropagation();
        }, []);

        return (
            <Container>
                <IconContainer $disabled={disabled}>
                    <IconSearch24 />
                </IconContainer>

                <StyledTextField
                    onChange={event => updateStateValue(event.target.value)}
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
    height: 40px;
    font-size: 0.875rem;
    .MuiOutlinedInput-root {
        height: 40px;
    }
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
