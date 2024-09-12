import i18n from "../../../utils/i18n";
import React, { useState, useEffect, useMemo } from "react";
import { Popover, InputAdornment, TextField } from "@material-ui/core";
import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "./DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { IconCalendar24 } from "@dhis2/ui";
import { Button } from "../button/Button";
import styled from "styled-components";

type DateRangePickerProps = {
    value: string[];
    onChange: (dates: string[]) => void;
    placeholder?: string;
};

export const DateRangePicker: React.FC<DateRangePickerProps> = React.memo(
    ({ value, placeholder = "", onChange }) => {
        const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
        const [startDate, setStartDate] = useState<Date | null>(null);
        const [endDate, setEndDate] = useState<Date | null>(null);

        useEffect(() => {
            if (!value || value.length !== 2) {
                setStartDate(moment().startOf("month").toDate());
                setEndDate(moment().toDate());
            }
        }, [value]);

        // Adjust startDate if endDate < startDate
        useEffect(() => {
            if (endDate && startDate && moment(endDate).isBefore(startDate)) {
                setStartDate(endDate);
            }
        }, [startDate, endDate]);

        const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
            setAnchorEl(event.currentTarget);
        };

        const handleClose = () => {
            setAnchorEl(null);
        };

        const formatDurationValue = useMemo(() => {
            if (!value || value.length !== 2) {
                return placeholder;
            }

            return `${moment(startDate).format("DD/MM/yyyy")} — ${moment(endDate).format(
                "DD/MM/yyyy"
            )}`;
        }, [startDate, endDate, placeholder, value]);

        const onReset = () => {
            onChange([]);
            setAnchorEl(null);
        };

        const onSave = () => {
            if (startDate && endDate) {
                setAnchorEl(null);
                onChange([
                    moment(startDate).format("YYYY-MM-DD"),
                    moment(endDate).format("YYYY-MM-DD"),
                ]);
            }
        };

        return (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TextFieldContainer>
                    <StyledTextField
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
                            />
                            <DatePicker
                                id="end-date"
                                label="End Date"
                                value={endDate}
                                onChange={date => setEndDate(date)}
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

const TextFieldContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const PopoverContainer = styled.div`
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
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
