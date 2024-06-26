import React from "react";
import _ from "lodash";
import { Table, TableBody, TableCell, TableHead, TableRow, Link } from "@material-ui/core";
import styled from "styled-components";
import { Maybe } from "../../../utils/ts-utils";

interface TableCellData {
    value: string;
    type?: "link";
    link?: string;
}

export type TableColumn = string;

interface BasicTableProps {
    columns: TableColumn[];
    rows: {
        [key: TableColumn]: TableCellData;
    }[];
    onChange?: (cell: Maybe<TableCellData>, rowIndex: number, column: TableColumn) => void;
}

export const BasicTable: React.FC<BasicTableProps> = React.memo(
    ({ columns, rows, onChange = () => {} }) => {
        const renderCell = (cell: Maybe<TableCellData>, rowIndex: number, column: TableColumn) => {
            if (!cell) {
                return "";
            }
            switch (cell.type) {
                case "link":
                    return (
                        <StyledLink href="#" onClick={() => onChange(cell, rowIndex, column)}>
                            {cell.value}
                        </StyledLink>
                    );
                default:
                    return cell.value;
            }
        };

        return (
            <StyledTable>
                <TableHead>
                    <TableRow>
                        {columns.map(column => (
                            <TableCell key={column}>{_.startCase(column)}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {columns.map(column => (
                                <TableCell key={`${rowIndex}-${column}`}>
                                    {renderCell(row[column], rowIndex, column)}
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
`;
