import { Backdrop, CircularProgress } from "@material-ui/core";
import React from "react";
import styled from "styled-components";

export const Loader: React.FC = () => (
    <StyledBackdrop open={true}>
        <StyledLoaderContainer>
            <CircularProgress color="inherit" size={50} />
        </StyledLoaderContainer>
    </StyledBackdrop>
);

const StyledLoaderContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const StyledBackdrop = styled(Backdrop)`
    color: ${props => props.theme.palette.common.white};
    z-index: 2;
`;
