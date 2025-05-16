import { createTheme } from "@material-ui/core/styles";

// Color palette from https://ui.dhis2.nu/principles/color
const colors = {
    accentSecondary: "#fb8c00",
    accentSecondaryLight: "#f57c00",
    accentSecondaryDark: "#ff9800",

    greyBlack: "#494949",
    grey: "#9E9E9E",
    greyLight: "#E0E0E0",
    greyLight2: "#F0F0F0",
    greyDisabled: "#8E8E8E",
    blueGrey: "#ECEFF1",
    snow: "#F4F6F8",

    negative: "#E53935",
    warning: "#F19C02",
    positive: "#3D9305",
    info: "#EAF4FF",

    black: "#000000",
    white: "#FFFFFF",

    blue900: "#093371",
    blue800: "#0d47a1",
    blue700: "#1565c0",
    blue600: "#147cd7",
    blue500: "#2196f3",
    blue400: "#42a5f5",
    blue300: "#90caf9",
    blue200: "#c5e3fc",
    blue100: "#e3f2fd",
    blue050: "#f5fbff",

    teal900: "#00332b",
    teal800: "#004d40",
    teal700: "#00695c",
    teal600: "#00796b",
    teal500: "#00897b",
    teal400: "#009688",
    teal300: "#4db6ac",
    teal200: "#b2dfdb",
    teal100: "#e0f2f1",
    teal050: "#f1f9f9",

    red900: "#330202",
    red800: "#891515",
    red700: "#b71c1c",
    red600: "#c62828",
    red500: "#d32f2f",
    red400: "#f44336",
    red300: "#e57373",
    red200: "#ffcdd2",
    red100: "#ffe5e8",
    red050: "#fff5f6",

    yellow900: "#6f3205",
    yellow800: "#bb460d",
    yellow700: "#e56408",
    yellow600: "#ff8302",
    yellow500: "#ff9302",
    yellow400: "#ffa902",
    yellow300: "#ffc324",
    yellow200: "#ffe082",
    yellow100: "#ffecb3",
    yellow050: "#fff8e1",

    green900: "#103713",
    green800: "#1b5e20",
    green700: "#2e7d32",
    green600: "#388e3c",
    green500: "#43a047",
    green400: "#4caf50",
    green300: "#a5d6a7",
    green200: "#c8e6c9",
    green100: "#e8f5e9",
    green050: "#f4fbf4",

    grey900: "#212934",
    grey800: "#404b5a",
    grey700: "#4a5768",
    grey600: "#6e7a8a",
    grey500: "#a0adba",
    grey400: "#d5dde5",
    grey300: "#e8edf2",
    grey200: "#f3f5f7",
    grey100: "#f8f9fa",
    grey050: "#fbfcfd",

    green: "#008B45",
    red: "#E4312B",
    orange: "#FABE5F",
    grey1: "#2F2727",
    grey2: "#4B4343",
    grey3: "#8C8484",
    grey4: "#bfbebe",

    background1: "#F5F5F5",
};

const palette = {
    common: {
        ...colors,
    },
    action: {
        active: colors.grey900,
        disabled: colors.grey500,
    },
    text: {
        primary: colors.grey900,
        secondary: colors.grey800,
        disabled: colors.grey600,
        hint: colors.grey700,
    },
    primary: {
        main: colors.green,
        dark: colors.green800,
        light: colors.green300,
        contrastText: colors.white,
    },
    secondary: {
        main: colors.teal500,
        light: colors.teal100,
        dark: colors.teal700,
        contrastText: colors.white,
    },
    error: {
        main: colors.red600,
        text: colors.red700, // Custom extension, not used by default
    },
    background: {
        paper: colors.white,
        default: colors.grey100,
    },
    divider: colors.greyLight,

    //Custom colors collection, not used by default in MUI
    shadow: colors.grey,
    status: {
        negative: colors.red,
        warning: colors.orange,
        positive: colors.green,
        info: colors.grey900,
    },
    button: {
        backgroundPrimary: colors.green,
        textPrimary: colors.white,
        backgroundSecondary: colors.grey100,
        borderDarkSecondary: colors.grey500,
        textSecondary: colors.grey900,
        iconSecondary: colors.grey600,
    },
    link: {
        color: colors.blue800,
    },
    sidebar: {
        background: colors.grey200,
        text: colors.grey800,
        hover: colors.grey900,
    },
    icon: {
        color: colors.grey700,
        hover: colors.grey900,
    },
    header: {
        color: colors.green600,
    },
    flag: {
        red: colors.red,
        black: colors.black,
        orange: colors.orange,
    },
    stats: {
        green: colors.green,
        red: colors.red,
        normal: colors.green700,
        grey: colors.grey900,
        title: colors.black,
        subtitle: colors.grey3,
        pretitle: colors.grey3,
    },
};

export const muiTheme = createTheme({
    // colors,
    palette,
    typography: {
        fontFamily: "Roboto, Helvetica, Arial, sans-serif",
        // useNextVariants: true,
    },
    overrides: {
        MuiDivider: {
            light: {
                backgroundColor: palette.divider, // No light dividers for now
            },
        },
        MuiOutlinedInput: {
            root: {
                backgroundColor: colors.white,
                borderRadius: "3px",
                borderColor: colors.grey500,
                "&$disabled": {
                    backgroundColor: colors.grey100,
                },
                "&$disabled $notchedOutline": {
                    borderColor: colors.grey500,
                },
                "&$error $notchedOutline": {
                    borderColor: colors.red600,
                },
                "&$focused $notchedOutline": {
                    borderColor: colors.blue600,
                },
            },
            notchedOutline: {
                borderColor: colors.grey500,
            },
            input: {
                color: colors.grey900,
                fontWeight: 400,
                fontSize: "0.875rem",
                "&:disabled": {
                    color: colors.grey600,
                },
            },
        },
        MuiFormHelperText: {
            root: {
                fontWeight: 400,
                fontSize: "0.75rem",
                color: colors.grey700,
            },
            contained: {
                marginInlineStart: 0,
            },
        },
        MuiRadio: {
            colorSecondary: {
                color: colors.grey600,
                "&$disabled": {
                    color: colors.grey400,
                },
            },
        },
        MuiFormControlLabel: {
            label: {
                color: colors.grey900,
                fontWeight: 400,
                fontSize: "0.938rem",
                "&$disabled": {
                    color: colors.grey600,
                },
            },
        },
        MuiSelect: {
            select: {
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 0,
                color: colors.grey900,
                fontWeight: 400,
                fontSize: "0.875rem",
                "&$disabled": {
                    color: colors.grey600,
                },
            },
            iconOutlined: {
                color: colors.grey700,
                "&$disabled": {
                    color: colors.grey700,
                },
            },
        },
        MuiChip: {
            root: {
                backgroundColor: colors.grey200,
                borderRadius: "100px",
                border: "none",
            },
            label: {
                fontSize: "0.813rem",
                fontWeight: 400,
                color: colors.grey900,
            },
            deleteIcon: {
                color: colors.grey600,
            },
        },
        MuiCheckbox: {
            colorSecondary: {
                color: colors.grey600,
                "&$disabled": {
                    color: colors.grey400,
                },
            },
        },
        MuiButton: {
            label: {
                fontSize: "0.875rem",
                textTransform: "none",
                fontWeight: 500,
            },
            outlinedPrimary: {
                "&$disabled": {
                    borderColor: colors.grey300,
                    "& .MuiButton-label": {
                        color: colors.grey500,
                    },
                    "& .MuiButton-startIcon": {
                        color: colors.grey500,
                    },
                },
            },
            containedSecondary: {
                color: colors.grey400,
                borderColor: colors.grey300,
                backgroundColor: colors.grey100,
                "& .MuiButton-label": {
                    fontWeight: 400,
                    color: colors.grey900,
                },
                "& .MuiButton-startIcon": {
                    color: colors.grey600,
                },
                "&:hover": {
                    backgroundColor: colors.grey200,
                },
                "&$disabled": {
                    "& .MuiButton-label": {
                        color: colors.grey500,
                    },
                    "& .MuiButton-startIcon": {
                        color: colors.grey500,
                    },
                },
            },
            outlinedSecondary: {
                color: colors.grey400,
                borderColor: colors.grey400,
                backgroundColor: colors.grey100,
                "& .MuiButton-label": {
                    fontWeight: 400,
                    color: colors.grey900,
                },
                "& .MuiButton-startIcon": {
                    color: colors.grey600,
                },
                "&:hover": {
                    backgroundColor: colors.grey200,
                    borderColor: colors.grey500,
                },
                "&$disabled": {
                    borderColor: colors.grey300,
                    "& .MuiButton-label": {
                        color: colors.grey500,
                    },
                    "& .MuiButton-startIcon": {
                        color: colors.grey500,
                    },
                },
            },
        },
        MuiCard: {
            root: {
                borderColor: colors.grey300,
            },
        },
        MuiDrawer: {
            paper: {
                backgroundColor: colors.grey200,
            },
        },
        MuiBackdrop: {
            root: {
                backgroundColor: colors.grey,
            },
        },
    },
});
