import React from "react";
import { IconButton as MUIIconButton } from "@material-ui/core";
import styled from "styled-components";

type IconButtonProps = {
    icon: React.ReactNode;
    disabled?: boolean;
    onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onMouseDown?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    ariaLabel?: string;
    className?: string;
};

export const IconButton: React.FC<IconButtonProps> = React.memo(
    ({
        icon,
        disabled = false,
        onClick,
        ariaLabel = "Icon button",
        onMouseDown,
        className = "",
    }) => {
        return (
            <StyledIconButton
                className={className}
                aria-label={ariaLabel}
                disabled={disabled}
                onClick={onClick}
                onMouseDown={onMouseDown}
            >
                {icon}
            </StyledIconButton>
        );
    }
);

const StyledIconButton = styled(MUIIconButton)`
    color: ${props => props.theme.palette.icon.color};
    padding: 0;
`;
