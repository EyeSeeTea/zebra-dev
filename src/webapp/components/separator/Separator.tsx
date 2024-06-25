import React from "react";
import styled from "styled-components";

interface SeparatorProps {
    margin?: string;
}

export const Separator: React.FC<SeparatorProps> = React.memo(({ margin = "" }) => {
    return <StyledSeparator margin={margin} />;
});

const StyledSeparator = styled.hr<{ margin?: string }>`
    border: none;
    height: 1px;
    background-color: ${props => props.theme.palette.common.grey4};
    margin-block: ${props => props.margin || "24px"};
`;
