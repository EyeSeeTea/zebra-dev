import React, { useCallback, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
} from "@material-ui/core";
import styled from "styled-components";
import { Maybe } from "../../../utils/ts-utils";
import i18n from "../../../utils/i18n";
import { Option } from "../utils/option";
import { Cell } from "./Cell";
import _c from "../../../domain/entities/generic/Collection";

const noop = () => {};

interface BaseColumn {
    value: string;
    label: string;
}
interface TextColumn extends BaseColumn {
    type: "text";
    underline?: boolean;
    bold?: boolean;
}
interface LinkColumn extends BaseColumn {
    type: "link";
}
interface SelectorColumn extends BaseColumn {
    type: "selector";
    options: Option[];
}

export type TableRowType = {
    [key: TableColumn["value"]]: string;
};
export type TableColumn = TextColumn | LinkColumn | SelectorColumn;
interface BasicTableProps {
    columns: TableColumn[];
    rows: TableRowType[];
    onChange?: (cell: Maybe<string>, rowIndex: number, column: TableColumn["value"]) => void;
    showRowIndex?: boolean;
    onOrderBy?: (direction: "asc" | "desc") => void;
}

export const BasicTable: React.FC<BasicTableProps> = React.memo(
    ({ columns, rows, onChange = noop, showRowIndex = false, onOrderBy }) => {
        const [order, setOrder] = useState<"asc" | "desc">();

        const orderBy = useCallback(() => {
            const updatedOrder = order === "asc" ? "desc" : "asc";
            setOrder(prevOrder => (prevOrder === "asc" ? "desc" : "asc"));
            onOrderBy && onOrderBy(updatedOrder);
        }, [onOrderBy, order]);

        return (
            <StyledTable stickyHeader>
                <TableHead>
                    <TableRow>
                        {showRowIndex && <TableCell />}
                        {columns.map(({ value, label }) =>
                            label === "Assessment Date" ? (
                                <TableCell key={value} sortDirection={order}>
                                    <TableSortLabel
                                        direction={order}
                                        onClick={orderBy}
                                        active={true}
                                    >
                                        {label}
                                    </TableSortLabel>
                                </TableCell>
                            ) : (
                                <TableCell key={value} sortDirection={order}>
                                    {i18n.t(label)}
                                </TableCell>
                            )
                        )}
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
        font-weight: 600;
        height: 2.25rem;
        & .MuiTableCell-root {
            white-space: nowrap;
            background-color: ${props => props.theme.palette.common.greyLight};
        }
    }
    & .MuiTableBody-root {
        color: ${props => props.theme.palette.common.grey};
        background-color: ${props => props.theme.palette.common.white};
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
