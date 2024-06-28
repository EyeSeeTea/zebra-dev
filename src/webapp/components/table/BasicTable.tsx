import React from "react";
import _ from "lodash";
import { Table, TableBody, TableCell, TableHead, TableRow, Link } from "@material-ui/core";
import styled from "styled-components";
import { Maybe } from "../../../utils/ts-utils";
import { Selector, SelectorOption } from "../selector/Selector";
import i18n from "../../../utils/i18n";

interface BaseColumn {
    value: string;
    label: string;
}
interface LinkColumn extends BaseColumn {
    type: "link";
}
interface SelectorColumn extends BaseColumn {
    type: "selector";
    options: SelectorOption[];
}

export type TableColumn = BaseColumn | LinkColumn | SelectorColumn;
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
        const Cell = (cell: string, rowIndex: number, column: TableColumn) => {
            const [selectorValue, setSelectorValue] = React.useState<string>(cell);
            if ("type" in column && column.type === "link") {
                return (
                    <StyledLink onClick={() => onChange(cell, rowIndex, column.value)}>
                        {cell}
                    </StyledLink>
                );
            } else if ("type" in column && column.type === "selector") {
                const handleChange = (value: string) => {
                    setSelectorValue(value);
                    onChange(value, rowIndex, column.value);
                };
                return (
                    <Selector
                        id={`selector-${rowIndex}-${column.value}`}
                        options={column.options}
                        selected={selectorValue}
                        onChange={handleChange}
                    />
                );
            }
            return cell;
        };

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
                            {showRowIndex && <TableCell>{rowIndex + 1}</TableCell>}
                            {columns.map(column => (
                                <TableCell key={`${rowIndex}-${column.value}`}>
                                    {Cell(row[column.value] || "", rowIndex, column)}
                                </TableCell>
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
        color: ${props => props.theme.palette.common.greyBlack};
        background-color: ${props => props.theme.palette.common.greyLight};
    }
    & .MuiTableBody-root {
        color: ${props => props.theme.palette.common.grey};
    }
    & .MuiTableCell-root {
        border: 1px solid ${props => props.theme.palette.common.grey};
    }
`;

const StyledLink = styled(Link)`
    color: ${props => props.theme.palette.common.blue600};
    text-decoration: underline;
    cursor: pointer;
`;
