import React from "react";
import { Button as MUIButton } from "@material-ui/core";

type ButtonProps = {
    children?: React.ReactNode;
    variant?: "contained" | "outlined";
    color?: "primary" | "secondary";
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
            <MUIButton
                variant={variant}
                color={color}
                disabled={disabled}
                startIcon={startIcon}
                disableElevation
                onClick={onClick}
            >
                {children}
            </MUIButton>
        );
    }
);
