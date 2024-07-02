import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Link } from "@material-ui/core";
import styled from "styled-components";
import { Maybe } from "../../../utils/ts-utils";
import i18n from "../../../utils/i18n";
import { SelectorOption } from "../selector/utils/selectorHelper";
import { Cell } from "./Cell";

interface BaseColumn {
    value: string;
    label: string;
}
interface TextColumn extends BaseColumn {
    type: "text";
    underline?: boolean;
}
interface LinkColumn extends BaseColumn {
    type: "link";
}
interface SelectorColumn extends BaseColumn {
    type: "selector";
    options: SelectorOption[];
}

export type TableColumn = TextColumn | LinkColumn | SelectorColumn;
interface BasicTableProps {
    columns: TableColumn[];
    rows: {
        [key: TableColumn["value"]]: string;
    }[];
    onChange?: (cell: Maybe<string>, rowIndex: number, column: TableColumn["value"]) => void;
    showRowIndex?: boolean;
}

export const BasicTable: React.FC<BasicTableProps> = React.memo(
    ({ columns, rows, onChange = () => {}, showRowIndex = false }) => {
        return (
            <StyledTable>
                <TableHead>
                    <TableRow>
                        {showRowIndex && <TableCell />}
                        {columns.map(({ value, label }) => (
                            <TableCell key={value}>{i18n.t(label)}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {showRowIndex && <IndexTableCell>{rowIndex + 1}</IndexTableCell>}
                            {columns.map(column => (
                                <Cell
                                    key={`${rowIndex}-${column.value}`}
                                    value={row[column.value] || ""}
                                    rowIndex={rowIndex}
                                    column={column}
                                    onChange={onChange}
                                />
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </StyledTable>
        );
    }
);

const StyledTable = styled(Table)`
    border-collapse: collapse;
    & .MuiTableHead-root {
        color: ${props => props.theme.palette.common.grey1};
        background-color: ${props => props.theme.palette.common.greyLight};
        font-weight: 600;
        height: 2.25rem;
        & .MuiTableCell-root {
            white-space: nowrap;
        }
    }
    & .MuiTableBody-root {
        color: ${props => props.theme.palette.common.grey};
    }
    & .MuiTableCell-root {
        font-size: 0.75rem;
        padding-block: 0.375rem;
        border: 1px solid ${props => props.theme.palette.common.grey4};
        height: 1.875rem;
    }
`;

const IndexTableCell = styled(TableCell)`
    min-width: 2.25rem;
    padding-inline: 0.375rem;
    text-align: center;
`;

const StyledTableCell = styled(TableCell)<{ $underline?: boolean }>`
    ${props => props.$underline && "text-decoration: underline;"}
`;

const StyledLink = styled(Link)`
    color: ${props => props.theme.palette.common.blue600};
    text-decoration: underline;
    cursor: pointer;
`;
