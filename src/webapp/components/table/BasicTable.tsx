import React from "react";
import _ from "lodash";
import { Table, TableBody, TableCell, TableHead, TableRow, Link } from "@material-ui/core";
import styled from "styled-components";
import { Maybe } from "../../../utils/ts-utils";
import { User } from "../../../domain/entities/User";

type TableCellData = Maybe<string | User>;

export type TableColumn = { name: string; type?: "link" | "select" };

interface BasicTableProps {
    columns: TableColumn[];
    rows: {
        [key: TableColumn["name"]]: string | User;
    }[];
    onChange?: (cell: TableCellData, rowIndex: number, column: TableColumn["name"]) => void;
}

export const BasicTable: React.FC<BasicTableProps> = React.memo(
    ({ columns, rows, onChange = () => {} }) => {
        const renderCell = (cell: TableCellData, rowIndex: number, { name, type }: TableColumn) => {
            if (!cell) {
                return "";
            }
            switch (type) {
                case "link":
                    return (
                        <StyledLink onClick={() => onChange(cell, rowIndex, name)}>
                            {_.isObject(cell) ? cell.name : cell}
                        </StyledLink>
                    );
                default:
                    return _.isObject(cell) ? cell.name : cell;
            }
        };

        return (
            <StyledTable>
                <TableHead>
                    <TableRow>
                        {columns.map(({ name }) => (
                            <TableCell key={name}>{_.startCase(name)}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {columns.map(column => (
                                <TableCell key={`${rowIndex}-${column.name}`}>
                                    {renderCell(row[column.name], rowIndex, column)}
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
