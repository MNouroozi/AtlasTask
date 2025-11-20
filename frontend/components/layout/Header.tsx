"use client";

import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Badge,
    Avatar,
    Box,
} from "@mui/material";
import {
    Menu as MenuIcon,
    Notifications as NotificationsIcon,
    AccountCircle,
} from "@mui/icons-material";

interface HeaderProps {
    onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: "white",
                color: "text.primary",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                borderBottom: "1px solid #e0e0e0",
            }}
        >
            <Toolbar
                sx={{
                    justifyContent: "space-between",
                    minHeight: "64px !important",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                        edge="start"
                        sx={{ mr: 2, color: "text.primary" }}
                        onClick={onMenuClick}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ fontWeight: 600 }}
                    >
                        AtlasTask
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton size="small" sx={{ color: "text.primary" }}>
                        <Badge badgeContent={4} color="error">
                            <NotificationsIcon fontSize="small" />
                        </Badge>
                    </IconButton>
                    <Avatar
                        sx={{ width: 32, height: 32, bgcolor: "primary.main" }}
                    >
                        <AccountCircle fontSize="small" />
                    </Avatar>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
