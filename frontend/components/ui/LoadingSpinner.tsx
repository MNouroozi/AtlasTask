"use client";

import { CircularProgress, Box } from "@mui/material";

export default function LoadingSpinner() {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 200,
            }}
        >
            <CircularProgress size={40} />
        </Box>
    );
}
