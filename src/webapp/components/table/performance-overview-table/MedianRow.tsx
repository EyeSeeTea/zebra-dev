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

type MedianRowProps = {
    columns: TableColumn[];
    rows: {
        [key: TableColumn["value"]]: string;
    }[];
    calculateColumns: TableColumn["value"][];
};

export const MedianRow: React.FC<MedianRowProps> = React.memo(
    ({ rows, columns, calculateColumns }) => {
        const calculateMedian = (
            rows: PerformanceOverviewTableProps["rows"],
            column: TableColumn["value"]
        ) => {
            const values = rows.map(row => Number(row[column])).filter(value => !isNaN(value));
            values.sort((a, b) => a - b);
            const mid = Math.floor(values.length / 2);
            return values.length % 2 !== 0
                ? values[mid]
                : ((values[mid - 1] || 0) + (values[mid] || 0)) / 2;
        };

        return (
            <TableRow>
                {columns.map((column, columnIndex) => (
                    <FooterTableCell
                        key={`median-${column.value}`}
                        $boldUnderline={columnIndex === 0}
                    >
                        {columnIndex === 0 && "Median"}
                        {calculateColumns.includes(column.value)
                            ? calculateMedian(rows, column.value)
                            : ""}
                    </FooterTableCell>
                ))}
            </TableRow>
        );
    }
);

const FooterTableCell = styled(TableCell)<{ $boldUnderline: boolean }>`
    background-color: ${props => props.theme.palette.common.greyLight};
    text-decoration: ${props => props.$boldUnderline && "underline"};
    font-weight: ${props => (props.$boldUnderline || !!props.color) && "600"};
`;
