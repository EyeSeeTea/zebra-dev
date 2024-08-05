import React, { useCallback } from "react";
import { TableCell, Link } from "@material-ui/core";
import styled from "styled-components";
import { Selector } from "../selector/Selector";
import { TableColumn } from "./BasicTable";

const noop = () => {};

type CellProps = {
    value: string;
    rowIndex: number;
    column: TableColumn;
    onChange?: (value: string, rowIndex: number, column: TableColumn["value"]) => void;
};

export const Cell: React.FC<CellProps> = React.memo(
    ({ value, rowIndex, column, onChange = noop }) => {
        const [selectorValue, setSelectorValue] = React.useState<string>(value);
        const handleChange = useCallback(
            (value: string) => {
                setSelectorValue(value);
                onChange(value, rowIndex, column.value);
            },
            [onChange, rowIndex, column.value]
        );

        switch (column.type) {
            case "link":
                return (
                    <StyledTableCell>
                        <StyledLink onClick={() => onChange(value, rowIndex, column.value)}>
                            {value}
                        </StyledLink>
                    </StyledTableCell>
                );
            case "selector":
                return (
                    <StyledTableCell>
                        <Selector
                            id={`selector-${rowIndex}-${column.value}`}
                            options={column.options}
                            selected={selectorValue}
                            onChange={handleChange}
                        />
                    </StyledTableCell>
                );
            case "text":
            default:
                return (
                    <StyledTableCell $underline={column.underline} $bold={column.bold}>
                        {value}
                    </StyledTableCell>
                );
        }
    }
);

const StyledTableCell = styled(TableCell)<{ $underline?: boolean; $bold?: boolean }>`
    text-decoration: ${props => (props.$underline ? "underline" : "initial")};
    font-weight: ${props => (props.$bold ? 700 : 400)};
`;

const StyledLink = styled(Link)`
    color: ${props => props.theme.palette.common.blue600};
    text-decoration: underline;
    cursor: pointer;
`;
