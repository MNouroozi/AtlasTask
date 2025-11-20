"use client";

import { createTheme } from "@mui/material/styles";
import { faIR } from "@mui/material/locale";

export const theme = createTheme(
    {
        direction: "rtl",
        typography: {
            fontFamily: "var(--font-vazirmatn), sans-serif",
            fontSize: 14,
            h4: {
                fontSize: "1.5rem",
                fontWeight: 600,
            },
            h6: {
                fontSize: "1.1rem",
                fontWeight: 600,
            },
        },
        palette: {
            primary: {
                main: "#1976d2",
                light: "#42a5f5",
                dark: "#1565c0",
            },
            secondary: {
                main: "#dc004e",
                light: "#ff5983",
                dark: "#9a0036",
            },
            background: {
                default: "#f8f9fa",
                paper: "#ffffff",
            },
            success: {
                main: "#2e7d32",
            },
            warning: {
                main: "#ed6c02",
            },
            error: {
                main: "#d32f2f",
            },
        },
        components: {
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                        border: "1px solid #e0e0e0",
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        textTransform: "none",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        padding: "6px 16px",
                    },
                    contained: {
                        boxShadow: "none",
                        "&:hover": {
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        },
                    },
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        "& .MuiInputBase-root": {
                            fontSize: "0.875rem",
                            borderRadius: 8,
                        },
                    },
                },
            },
            MuiTableCell: {
                styleOverrides: {
                    root: {
                        textAlign: "center",
                        padding: "12px 16px",
                        fontSize: "0.875rem",
                        borderBottom: "1px solid #e0e0e0",
                    },
                    head: {
                        fontWeight: 600,
                        backgroundColor: "#f8f9fa",
                        fontSize: "0.875rem",
                    },
                },
            },
            MuiTableSortLabel: {
                styleOverrides: {
                    root: {
                        "&.Mui-active": {
                            color: "#1976d2",
                        },
                    },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: {
                        fontSize: "0.75rem",
                        height: 24,
                    },
                },
            },
        },
    },
    faIR,
);
