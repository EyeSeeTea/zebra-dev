import React from "react";
import { IconButton as MUIIconButton } from "@material-ui/core";
import styled from "styled-components";

type IconButtonProps = {
    icon: React.ReactNode;
    disabled?: boolean;
    onClick: () => void;
    ariaLabel?: string;
};

export const IconButton: React.FC<IconButtonProps> = React.memo(
    ({ icon, disabled = false, onClick, ariaLabel = "Icon button" }) => {
        return (
            <StyledIconButton aria-label={ariaLabel} disabled={disabled} onClick={onClick}>
                {icon}
            </StyledIconButton>
        );
    }
);

const StyledIconButton = styled(MUIIconButton)`
    color: ${props => props.theme.palette.icon.color};
    padding: 0;
`;
