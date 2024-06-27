import React, { useEffect, useState } from "react";
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

        return (
            <React.Fragment>
                <Container>
                    <StyledSelector
                        id="filter"
                        selected={filterValue}
                        options={[...columns]}
                        onChange={(value: string) => {
                            setFilterValue(value);
                            console.log(value);
                        }}
                    />
                    <StyledSearchInput
                        value={searchTerm}
                        onChange={value => setSearchTerm(value)}
                    />
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
        background-color: ${props => props.theme.palette.common.greyLight};
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

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-block-end: 1rem;
    margin-right: auto;
`;

const StyledSelector = styled(Selector)`
    max-width: 10rem;
    width: 100px;
    height: 100%;
`;

const StyledSearchInput = styled(SearchInput)`
    max-width: 19rem;
    width: 100px;
    height: 100%;
`;
