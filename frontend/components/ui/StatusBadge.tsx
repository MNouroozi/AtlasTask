"use client";

import { Chip } from "@mui/material";
import {
    Schedule as PendingIcon,
    PlayArrow as InProgressIcon,
    CheckCircle as CompletedIcon,
    Cancel as CancelledIcon,
} from "@mui/icons-material";

interface StatusBadgeProps {
    status: "pending" | "in-progress" | "completed" | "cancelled";
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const statusConfig = {
        pending: {
            label: "در انتظار",
            color: "warning" as const,
            icon: <PendingIcon />,
        },
        "in-progress": {
            label: "در حال انجام",
            color: "primary" as const,
            icon: <InProgressIcon />,
        },
        completed: {
            label: "تکمیل شده",
            color: "success" as const,
            icon: <CompletedIcon />,
        },
        cancelled: {
            label: "لغو شده",
            color: "error" as const,
            icon: <CancelledIcon />,
        },
    };

    const config = statusConfig[status];

    return (
        <Chip
            label={config.label}
            color={config.color}
            icon={config.icon}
            size="small"
            variant="outlined"
        />
    );
}
