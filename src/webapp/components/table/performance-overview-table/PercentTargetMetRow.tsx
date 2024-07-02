import React from "react";
import _ from "../../../../domain/entities/generic/Collection";
import { TableCell, TableRow } from "@material-ui/core";
import styled from "styled-components";
import { PerformanceOverviewTableProps } from "./PerformanceOverviewTable";

export type TableColumn = {
    value: string;
    label: string;
    dark?: boolean;
};

type PercentTargetMetRowProps = {
    columns: TableColumn[];
    rows: {
        [key: TableColumn["value"]]: string;
    }[];
    columnRules: {
        [key: TableColumn["value"]]: number;
    };
    calculateColumns: TableColumn["value"][];
};

export const PercentTargetMetRow: React.FC<PercentTargetMetRowProps> = React.memo(
    ({ rows, columns, columnRules, calculateColumns }) => {
        const calculatePercentTargetMet = (
            rows: PerformanceOverviewTableProps["rows"],
            column: TableColumn["value"],
            target: number
        ) => {
            const count = rows.filter(row => Number(row[column]) <= target).length;
            const percentage = (count / rows.length) * 100 || 0;
            return `${percentage.toFixed(0) || 0}%`;
        };

        return (
            <TableRow>
                {columns.map((column, columnIndex) => {
                    const rule = columnRules[column.value] || 7;

                    return (
                        <FooterTableCell
                            key={`percent-${column.value}`}
                            $boldUnderline={columnIndex === 0}
                        >
                            {columnIndex === 0 && "% Target Met"}

                            {calculateColumns.includes(column.value)
                                ? calculatePercentTargetMet(rows, column.value, rule)
                                : ""}
                        </FooterTableCell>
                    );
                })}
            </TableRow>
        );
    }
);

const FooterTableCell = styled(TableCell)<{ $boldUnderline: boolean }>`
    background-color: ${props => props.theme.palette.common.greyLight};
    text-decoration: ${props => props.$boldUnderline && "underline"};
    font-weight: ${props => (props.$boldUnderline || !!props.color) && "600"};
`;
