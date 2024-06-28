import React, { useEffect, useMemo, useState } from "react";
import _ from "lodash";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
} from "@material-ui/core";
import styled from "styled-components";
import { SearchInput } from "../../search-input/SearchInput";
import { Selector } from "../../selector/Selector";
import { Maybe } from "../../../../utils/ts-utils";
import i18n from "../../../../utils/i18n";

export type TableColumn = {
    value: string;
    label: string;
    dark?: boolean;
};

interface PerformanceOverviewTableProps {
    rows: {
        [key: TableColumn["value"]]: string;
    }[];
}

export const PerformanceOverviewTable: React.FC<PerformanceOverviewTableProps> = React.memo(
    ({ rows }) => {
        const [searchTerm, setSearchTerm] = useState<string>("");
        const [filterValue, setFilterValue] = useState("");
        const [filteredRows, setFilteredRows] = useState(rows);

        const columns: TableColumn[] = [
            { label: "Event", value: "event" },
            { label: "Location", value: "location" },
            { label: "Cases", value: "cases" },
            { label: "Deaths", value: "deaths" },
            { label: "Duration", value: "duration" },
            { label: "Manager", value: "manager" },
            { label: "Detect 7d", dark: true, value: "detect7d" },
            { label: "Notify 1d", dark: true, value: "notify1d" },
            { label: "ERA1", value: "era1" },
            { label: "ERA2", value: "era2" },
            { label: "ERA3", value: "era3" },
            { label: "ERA4", value: "era4" },
            { label: "ERA5", value: "era5" },
            { label: "ERA6", value: "era6" },
            { label: "ERA7", value: "era7" },
            { label: "ERI", value: "eri" },
            { label: "Respond 7d", dark: true, value: "respond7d" },
        ];

        const editRiskAssessmentColumns = [
            "era1",
            "era2",
            "era3",
            "era4",
            "era5",
            "era6",
            "era7",
            "eri",
        ];
        const columnRules: { [key: string]: number } = {
            detect7d: 7,
            notify1d: 1,
            respond7d: 7,
        };

        const calculateColumns = [...editRiskAssessmentColumns, ..._.keys(columnRules)];

        useEffect(() => {
            if (searchTerm === "") {
                setFilteredRows(rows);
            } else {
                const filtered = _.filter(rows, row => {
                    return _.some(row, cell => {
                        return _.includes(_.toLower(cell), _.toLower(searchTerm));
                    });
                });
                setFilteredRows(filtered);
            }
        }, [searchTerm, rows]);

        const getCellColor = (cellValue: Maybe<string>, column: TableColumn["value"]) => {
            // Return "orange" for empty Edit Risk Assessment column
            if (!cellValue) {
                return _.includes(editRiskAssessmentColumns, column) ? "orange" : undefined;
            }

            const value = Number(cellValue);

            // Return "red" for value greater than rule in Edit Risk Assessment column
            if (_.includes(editRiskAssessmentColumns, column)) {
                return columnRules.respond7d && value > columnRules.respond7d ? "red" : undefined;
            }

            // Get the column rule for the current column
            const rule = columnRules[column];

            // If there is no rule for the current column, return undefined
            if (rule === undefined) {
                return undefined;
            }

            // Return "green" if value is less than or equal to the rule, otherwise "red"
            return value <= rule ? "green" : "red";
        };

        const calculateMedian = (
            rows: PerformanceOverviewTableProps["rows"],
            column: TableColumn["value"]
        ) => {
            const values = rows.map(row => Number(row[column])).filter(value => !isNaN(value));
            values.sort((a, b) => a - b);
            const mid = Math.floor(values.length / 2);
            return values.length % 2 !== 0
                ? values[mid]
                : ((values[mid - 1] || 0) + (values[mid] || 0)) / 2;
        };

        const calculatePercentTargetMet = (
            rows: PerformanceOverviewTableProps["rows"],
            column: TableColumn["value"],
            target: number
        ) => {
            const count = rows.filter(row => Number(row[column]) <= target).length;
            const percentage = (count / rows.length) * 100 || 0;
            return `${percentage.toFixed(0) || 0}%`;
        };

        const buildMedianRow = useMemo(() => {
            return columns.map((column, columnIndex) => (
                <FooterTableCell key={`median-${column.value}`} $boldUnderline={columnIndex === 0}>
                    {columnIndex === 0 && "Median"}
                    {_.includes(calculateColumns, column.value)
                        ? calculateMedian(filteredRows, column.value)
                        : ""}
                </FooterTableCell>
            ));
        }, [filteredRows]);

        const buildPercentTargetMetRow = useMemo(() => {
            return columns.map((column, columnIndex) => {
                const rule = columnRules[column.value] || 7;

                return (
                    <FooterTableCell
                        key={`percent-${column.value}`}
                        $boldUnderline={columnIndex === 0}
                    >
                        {columnIndex === 0 && "% Target Met"}

                        {_.includes(calculateColumns, column.value)
                            ? calculatePercentTargetMet(filteredRows, column.value, rule)
                            : ""}
                    </FooterTableCell>
                );
            });
        }, [filteredRows]);

        return (
            <React.Fragment>
                <Container>
                    <StyledSelectorWrapper>
                        <Selector
                            id="filter"
                            selected={filterValue}
                            placeholder={i18n.t("Filter")}
                            options={[...columns]}
                            onChange={(value: string) => {
                                setFilterValue(value);
                                console.log(value);
                            }}
                        />
                    </StyledSelectorWrapper>
                    <StyledSearchInputWrapper>
                        <SearchInput value={searchTerm} onChange={value => setSearchTerm(value)} />
                    </StyledSearchInputWrapper>
                </Container>
                <StyledTableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                {columns.map(({ value, label, dark = false }) => (
                                    <HeadTableCell key={value} $dark={dark}>
                                        {label}
                                    </HeadTableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRows.map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {columns.map((column, columnIndex) => (
                                        <BodyTableCell
                                            key={`${rowIndex}-${column.value}`}
                                            color={getCellColor(row[column.value], column.value)}
                                            $boldUnderline={columnIndex === 0}
                                        >
                                            {row[column.value] || ""}
                                        </BodyTableCell>
                                    ))}
                                </TableRow>
                            ))}
                            <TableRow>{buildMedianRow}</TableRow>
                            <TableRow>{buildPercentTargetMetRow}</TableRow>
                        </TableBody>
                    </Table>
                </StyledTableContainer>
            </React.Fragment>
        );
    }
);

const StyledTableContainer = styled(TableContainer)`
    border-radius: 4px;
    border: 1px solid ${props => props.theme.palette.common.grey1};

    & .MuiTable-root {
        border-collapse: collapse;
        border-style: hidden;
    }
    & .MuiTableHead-root {
        color: ${props => props.theme.palette.common.greyBlack};
        background-color: ${props => props.theme.palette.common.grey4};
    }
    & .MuiTableBody-root {
        color: ${props => props.theme.palette.common.grey};
    }
    & .MuiTableCell-root {
        min-width: 2rem;
        font-size: 0.75rem;
        white-space: nowrap;
        border: 1px solid ${props => props.theme.palette.common.grey};
        padding-inline: 0.5rem;
        padding-block: 0.625rem;
    }
`;

const HeadTableCell = styled(TableCell)<{ $dark?: boolean }>`
    background-color: ${props => (props.$dark ? props.theme.palette.common.grey2 : "initial")};
    color: ${props => (props.$dark ? props.theme.palette.common.white : "initial")};
    font-weight: 600;
`;

const BodyTableCell = styled(TableCell)<{ color?: string; $boldUnderline: boolean }>`
    background-color: ${props =>
        props.color ? props.theme.palette.common[props.color] : "initial"};
    color: ${props => (props.color ? props.theme.palette.common.white : "initial")};
    text-decoration: ${props => props.$boldUnderline && "underline"};
    font-weight: ${props => (props.$boldUnderline || !!props.color) && "600"};
`;

const FooterTableCell = styled(TableCell)<{ $boldUnderline: boolean }>`
    background-color: ${props => props.theme.palette.common.greyLight};
    text-decoration: ${props => props.$boldUnderline && "underline"};
    font-weight: ${props => (props.$boldUnderline || !!props.color) && "600"};
`;

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    width: 100%;
`;

const Wrapper = styled.div<{ width: string }>`
    width: ${({ width }) => width};
    max-width: ${({ width }) => width};
`;

const StyledSelectorWrapper = styled(Wrapper).attrs({ width: "10rem" })``;

const StyledSearchInputWrapper = styled(Wrapper).attrs({ width: "19rem" })``;
