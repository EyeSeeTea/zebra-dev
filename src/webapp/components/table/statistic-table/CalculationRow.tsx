import React from "react";
import { TableCell, TableRow } from "@material-ui/core";
import styled from "styled-components";
import { TableColumn } from "./StatisticTable";

type CalculationRowProps = {
    columns: TableColumn[];
    calculateColumns: string[];
    label: string;
    calculate: (column: string) => string | number;
};

export const CalculationRow: React.FC<CalculationRowProps> = React.memo(
    ({ columns, calculateColumns, label, calculate }) => {
        const [labelColumn, ...otherColumns] = columns;
        return (
            <TableRow>
                <FooterTableCell key={`${label}-${labelColumn?.value}`} $boldUnderline>
                    {label}
                </FooterTableCell>
                {otherColumns.map(column => (
                    <FooterTableCell key={`${label}-${column.value}`}>
                        {calculateColumns.includes(column.value) ? calculate(column.value) : ""}
                    </FooterTableCell>
                ))}
            </TableRow>
        );
    }
);

const FooterTableCell = styled(TableCell)<{ $boldUnderline?: boolean }>`
    background-color: ${props => props.theme.palette.common.greyLight};
    text-decoration: ${props => props.$boldUnderline && "underline"};
    font-weight: ${props => (props.$boldUnderline || !!props.color) && "600"};
`;
