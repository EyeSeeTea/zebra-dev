import React from "react";
import styled from "styled-components";
import { TableCell } from "@material-ui/core";

type ColoredCellProps = {
    value: string;
    color?: string;
    boldUnderline?: boolean;
};

const StyledTableCell = styled(TableCell)<{ color?: string; boldUnderline?: boolean }>`
    background-color: ${props =>
        props.color ? props.theme.palette.common[props.color] : "initial"};
    color: ${props => (props.color ? props.theme.palette.common.white : "initial")};
    text-decoration: ${props => (props.boldUnderline ? "underline" : "none")};
    font-weight: ${props => (props.boldUnderline || props.color ? "600" : "initial")};
`;

export const ColoredCell: React.FC<ColoredCellProps> = ({ value, color, boldUnderline }) => {
    return (
        <StyledTableCell color={color} boldUnderline={boldUnderline}>
            {value}
        </StyledTableCell>
    );
};
