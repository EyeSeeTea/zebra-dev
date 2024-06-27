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
type CellType = { value?: string; color?: string };

export type TableColumn = {
    value: string;
    label: string;
    dark?: boolean;
};

interface PerformanceOverviewTableProps {
    columns: TableColumn[];
    rows: {
        [key: TableColumn["value"]]: CellType;
    }[];
}

export const PerformanceOverviewTable: React.FC<PerformanceOverviewTableProps> = React.memo(
    ({ columns, rows }) => {
        const [filteredRows, setFilteredRows] = useState(rows);

                setFilteredRows(rows);

        return (
            <React.Fragment>
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
    font-weight: ${props => (props.boldUnderline || props.color) && "700"};
`;
