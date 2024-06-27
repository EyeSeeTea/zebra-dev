import React from "react";
import { Button as MUIButton } from "@material-ui/core";
import styled from "styled-components";

type ButtonProps = {
    children?: React.ReactNode;
    variant?: "contained" | "outlined";
    color?: "primary" | "secondary" | "dark-secondary";
    disabled?: boolean;
    startIcon?: React.ReactNode;
    onClick: () => void;
};

export const Button: React.FC<ButtonProps> = React.memo(
    ({
        children,
        variant = "contained",
        color = "primary",
        disabled = false,
        startIcon,
        onClick,
    }) => {
        return (
            <StyledButton
                variant={variant}
                color={color === "dark-secondary" ? "secondary" : color}
                disabled={disabled}
                startIcon={startIcon}
                disableElevation
                $darkBorder={color === "dark-secondary"}
                onClick={onClick}
            >
                {children}
            </StyledButton>
        );
    }
);

const StyledButton = styled(MUIButton)<{ $darkBorder: boolean }>`
    border-color: ${props =>
        props.$darkBorder ? props.theme.palette.button.borderDarkSecondary : "initial"};
`;
