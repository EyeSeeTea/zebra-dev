import i18n from "../../../utils/i18n";
import React, { useState, useEffect } from "react";
import { Popover, InputAdornment } from "@material-ui/core";
import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "./DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { IconCalendar24 } from "@dhis2/ui";
import { TextInput } from "../text-input/TextInput";
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
        const [startDate, setStartDate] = useState<Date | null>(
            moment(value[0]).startOf("month").toDate()
        );
        const [endDate, setEndDate] = useState<Date | null>(moment(value[1]).toDate());

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

        const handleStartDateChange = (date: Date | null) => {
            setStartDate(date);
        };

        const handleEndDateChange = (date: Date | null) => {
            setEndDate(date);
        };

        const formatDuration = (startDate: Date | null, endDate: Date | null) => {
            return `${moment(startDate).format("DD/MM/yyyy")} — ${moment(endDate).format(
                "DD/MM/yyyy"
            )}`;
        };

        const onCancel = () => {
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
                <TextInput
                    id="date-range-picker"
                    value={`${value.length ? formatDuration(startDate, endDate) : placeholder}`}
                    onChange={() => {}}
                    onClick={handleOpen}
                    inputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconCalendar24 />
                            </InputAdornment>
                        ),
                    }}
                />
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
                                onChange={handleStartDateChange}
                            />
                            <DatePicker
                                id="end-date"
                                label="End Date"
                                value={endDate}
                                onChange={handleEndDateChange}
                            />
                        </Container>
                        <Container>
                            <Button onClick={onCancel} variant="outlined" color="secondary">
                                {i18n.t("Cancel")}
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
    justify-content: space-between;
`;
