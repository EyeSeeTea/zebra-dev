import i18n from "../../../utils/i18n";
import React, { useState, useMemo, useCallback } from "react";
import { Popover, InputAdornment, TextField, InputLabel } from "@material-ui/core";
import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "./DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { IconCalendar24 } from "@dhis2/ui";
import { Button } from "../button/Button";
import styled from "styled-components";

type DateRangePickerProps = {
    label?: string;
    value: string[];
    onChange: (dates: string[]) => void;
    placeholder?: string;
};

const ID = "date-range-picker";

export const DateRangePicker: React.FC<DateRangePickerProps> = React.memo(
    ({ label = "", value, placeholder = "", onChange }) => {
        const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
        const [startDate, setStartDate] = useState<Date | null>(null);
        const [endDate, setEndDate] = useState<Date | null>(null);

        const handleOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
            setAnchorEl(event.currentTarget);
        }, []);

        const onCleanValues = useCallback(() => {
            setStartDate(null);
            setEndDate(null);
        }, []);

        const handleClose = useCallback(() => {
            setAnchorEl(null);
            if (!value.length) {
                onCleanValues();
            }
        }, [onCleanValues, value.length]);

        const formatDurationValue = useMemo(() => {
            if (!value || value.length !== 2) {
                return placeholder;
            }

            return `${moment(startDate).format("DD/MM/yyyy")} — ${moment(endDate).format(
                "DD/MM/yyyy"
            )}`;
        }, [startDate, endDate, placeholder, value]);

        const onReset = useCallback(() => {
            onChange([]);
            onCleanValues();
            setAnchorEl(null);
        }, [onChange, onCleanValues]);

        const onSave = useCallback(() => {
            if (startDate && endDate) {
                setAnchorEl(null);
                onChange([
                    moment(startDate).format("YYYY-MM-DD"),
                    moment(endDate).format("YYYY-MM-DD"),
                ]);
            }
        }, [endDate, onChange, startDate]);

        return (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TextFieldContainer>
                    {label && <Label htmlFor={ID}>{label}</Label>}
                    <StyledTextField
                        id={ID}
                        value={formatDurationValue}
                        onClick={handleOpen}
                        variant="outlined"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconCalendar24 />
                                </InputAdornment>
                            ),
                        }}
                    />
                </TextFieldContainer>
                <Popover
                    id="date-range-picker-popover"
                    open={!!anchorEl}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                    }}
                >
                    <PopoverContainer>
                        <Container>
                            <DatePicker
                                id="start-date"
                                label="Start Date"
                                value={startDate}
                                onChange={date => setStartDate(date)}
                                maxDate={endDate ?? undefined}
                                disableFuture
                            />
                            <DatePicker
                                id="end-date"
                                label="End Date"
                                value={endDate}
                                onChange={date => setEndDate(date)}
                                disableFuture
                            />
                        </Container>
                        <Container>
                            <Button onClick={onReset} variant="outlined" color="secondary">
                                {i18n.t("Reset")}
                            </Button>
                            <Button onClick={onSave}>{i18n.t("Save")}</Button>
                        </Container>
                    </PopoverContainer>
                </Popover>
            </LocalizationProvider>
        );
    }
);

const PopoverContainer = styled.div`
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Container = styled.div`
    width: 100%;
    display: flex;
    gap: 5px;
    justify-content: space-between;
`;

const TextFieldContainer = styled.div`
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

const StyledTextField = styled(TextField)`
    height: 40px;
    .MuiOutlinedInput-root {
        height: 40px;
    }
    .MuiFormHelperText-root {
        color: ${props => props.theme.palette.common.grey700};
    }
    .MuiInputBase-input {
        padding-inline: 12px;
        padding-block: 10px;
    }
`;
