import { TextField } from "@material-ui/core";
import i18n from "../../../utils/i18n";
import React, { useCallback } from "react";
import styled from "styled-components";
import { Button } from "../button/Button";

type AddNewOptionProps = {
    value: string;
    onAddNewOption: () => void;
    onChangeValue: (value: string) => void;
};

export const AddNewOption: React.FC<AddNewOptionProps> = React.memo(
    ({ value, onAddNewOption, onChangeValue }) => {
        const handleKeydown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
            event.stopPropagation();
        }, []);

        return (
            <>
                <StyledTextField
                    color="secondary"
                    fullWidth={false}
                    variant="standard"
                    placeholder={i18n.t("Add new option")}
                    onChange={e => onChangeValue(e.target.value)}
                    value={value}
                    onKeyDown={handleKeydown}
                    onClickCapture={e => {
                        e.stopPropagation();
                    }}
                />

                <Button onClick={onAddNewOption}>{i18n.t("Add")}</Button>
            </>
        );
    }
);

const StyledTextField = styled(TextField)<{ error?: boolean }>`
    height: 40px;
    .MuiOutlinedInput-root {
        height: 40px;
    }
    .MuiFormHelperText-root {
        color: ${props =>
            props.error ? props.theme.palette.common.red700 : props.theme.palette.common.grey700};
    }
    .MuiInputBase-input {
        padding-inline: 12px;
        padding-block: 10px;
    }
`;
