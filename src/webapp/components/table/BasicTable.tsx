import React from "react";
import _ from "lodash";
import { Table, TableBody, TableCell, TableHead, TableRow, Link } from "@material-ui/core";
import styled from "styled-components";
import { Maybe } from "../../../utils/ts-utils";
import { Selector, SelectorOption } from "../selector/Selector";

interface BaseColumn {
    name: string;
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
        [key: TableColumn["name"]]: string;
    }[];
    onChange?: (cell: Maybe<string>, rowIndex: number, column: TableColumn["name"]) => void;
    showRowIndex?: boolean;
}

export const BasicTable: React.FC<BasicTableProps> = React.memo(
    ({ columns, rows, onChange = () => {}, showRowIndex = false }) => {
        const Cell = (cell: string, rowIndex: number, column: TableColumn) => {
            const [selectorValue, setSelectorValue] = React.useState<string>(cell);
            if ("type" in column && column.type === "link") {
                return (
                    <StyledLink onClick={() => onChange(cell, rowIndex, column.name)}>
                        {cell}
                    </StyledLink>
                );
            } else if ("type" in column && column.type === "selector") {
                const handleChange = (value: string) => {
                    setSelectorValue(value);
                    onChange(value, rowIndex, column.name);
                };
                return (
                    <Selector
                        id={`selector-${rowIndex}-${column.name}`}
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
                        <TableCell />
                        {columns.map(({ name }) => (
                            <TableCell key={name}>{_.startCase(name)}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {showRowIndex && <TableCell>{rowIndex + 1}</TableCell>}
                            {columns.map(column => (
                                <TableCell key={`${rowIndex}-${column.name}`}>
                                    {Cell(row[column.name] || "", rowIndex, column)}
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
