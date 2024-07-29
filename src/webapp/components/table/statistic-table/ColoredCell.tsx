import React from "react";
import styled from "styled-components";
import { TableCell } from "@material-ui/core";
import { CellStatus, CellStatusValues } from "./useTableCell";

type ColoredCellProps = {
    value: string;
    color?: CellStatusValues;
};

const cellStatusColor = {
    [CellStatus.Valid]: "green",
    [CellStatus.Alert]: "red",
    [CellStatus.Warning]: "orange",
};

export const ColoredCell: React.FC<ColoredCellProps> = ({ value, color }) => {
    return (
        <StyledTableCell color={color ? cellStatusColor[color] : undefined}>
            {value}
        </StyledTableCell>
    );
};

const StyledTableCell = styled(TableCell)<{ color?: string }>`
    background-color: ${props =>
        props.color ? props.theme.palette.common[props.color] : "initial"};
    color: ${props => (props.color ? props.theme.palette.common.white : "initial")};
    font-weight: ${props => (props.color ? "600" : "initial")};
`;
