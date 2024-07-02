import React, { useEffect, useMemo, useState } from "react";
import _ from "../../../../domain/entities/generic/Collection";
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

type PerformanceOverviewTableProps = {
    columns: TableColumn[];
    columnRules: {
        [key: TableColumn["value"]]: number;
    };
    editRiskAssessmentColumns: TableColumn["value"][];
    rows: {
        [key: TableColumn["value"]]: string;
    }[];
};

export const PerformanceOverviewTable: React.FC<PerformanceOverviewTableProps> = React.memo(
    ({ rows, columns, columnRules, editRiskAssessmentColumns }) => {
        const [searchTerm, setSearchTerm] = useState<string>("");
        const [filterValue, setFilterValue] = useState("");
        const [filteredRows, setFilteredRows] = useState(rows);

        const calculateColumns = [...editRiskAssessmentColumns, ...Object.keys(columnRules)];

        useEffect(() => {
            if (searchTerm === "") {
                setFilteredRows(rows);
            } else {
                const filtered = _(rows)
                    .filter(row => {
                        return _(Object.values(row)).some(cell => {
                            return cell.toLowerCase().includes(searchTerm.toLowerCase());
                        });
                    })
                    .value();
                setFilteredRows(filtered);
            }
        }, [searchTerm, rows]);

        const getCellColor = (cellValue: Maybe<string>, column: TableColumn["value"]) => {
            // Return "orange" for empty Edit Risk Assessment column
            if (!cellValue) {
                return editRiskAssessmentColumns.includes(column) ? "orange" : undefined;
            }

            const value = Number(cellValue);

            // Return "red" for value greater than rule in Edit Risk Assessment column
            if (editRiskAssessmentColumns.includes(column)) {
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
                    {calculateColumns.includes(column.value)
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

                        {calculateColumns.includes(column.value)
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
