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

type CellType = { value?: string; color?: string };

export type TableColumn = {
    value: string;
    label: string;
    dark?: boolean;
};

interface PerformanceOverviewTableProps {
    rows: {
        [key: TableColumn["value"]]: CellType;
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

        useEffect(() => {
            if (searchTerm === "") {
                setFilteredRows(rows);
            } else {
                const filtered = _.filter(rows, row => {
                    return _.some(row, cell => {
                        return _.includes(_.toLower(cell.value), _.toLower(searchTerm));
                    });
                });
                setFilteredRows(filtered);
            }
        }, [searchTerm, rows]);

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
                                    <HeadTableCell key={value} dark={dark}>
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
                                            color={row[column.value]?.color}
                                            boldUnderline={columnIndex === 0}
                                        >
                                            {row[column.value]?.value || ""}
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
        font-size: 0.75rem;
        white-space: nowrap;

        border: 1px solid ${props => props.theme.palette.common.grey};
        padding-inline: 0.5rem;
        padding-block: 0.625rem;
    }
`;

const HeadTableCell = styled(TableCell)<{ dark?: boolean }>`
    background-color: ${props => (props.dark ? props.theme.palette.common.grey2 : "initial")};
    color: ${props => (props.dark ? props.theme.palette.common.white : "initial")};
    font-weight: 600;
`;

const BodyTableCell = styled(TableCell)<{ color?: string; boldUnderline?: boolean }>`
    background-color: ${props =>
        props.color ? props.theme.palette.common[props.color] : "initial"};
    color: ${props => (props.color ? props.theme.palette.common.white : "initial")};
    text-decoration: ${props => props.boldUnderline && "underline"};
    font-weight: ${props => (props.boldUnderline || props.color) && "600"};
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
