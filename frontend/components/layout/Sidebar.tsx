"use client";

import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    Typography,
    Divider,
} from "@mui/material";
import {
    Dashboard as DashboardIcon,
    Task as TaskIcon,
    PlaylistAddCheck as SubtaskIcon,
    Settings as SettingsIcon,
    Folder as FolderIcon,
} from "@mui/icons-material";

interface SidebarProps {
    open: boolean;
    onToggle: () => void;
}

export default function Sidebar({ open, onToggle }: SidebarProps) {
    const menuItems = [
        { text: "داشبورد", icon: <DashboardIcon />, path: "/" },
        { text: "مدیریت تسک‌ها", icon: <TaskIcon />, path: "/tasks" },
        { text: "ساب تسک‌ها", icon: <SubtaskIcon />, path: "/subtasks" },
        { text: "دسته‌بندی‌ها", icon: <FolderIcon />, path: "/categories" },
    ];

    const bottomMenuItems = [
        { text: "تنظیمات", icon: <SettingsIcon />, path: "/settings" },
    ];

    return (
        <Drawer
            variant="persistent"
            anchor="right"
            open={open}
            sx={{
                width: 280,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: 280,
                    boxSizing: "border-box",
                    borderLeft: "1px solid #e0e0e0",
                    backgroundColor: "#fafafa",
                },
            }}
        >
            <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
                <Typography
                    variant="h6"
                    color="primary"
                    sx={{ fontWeight: 600 }}
                >
                    AtlasTask
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    سیستم مدیریت تسک
                </Typography>
            </Box>

            <List sx={{ pt: 1, flex: 1 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                px: 2.5,
                                borderRadius: 1,
                                mx: 1,
                                mb: 0.5,
                                "&:hover": {
                                    backgroundColor: "primary.light",
                                    color: "white",
                                    "& .MuiListItemIcon-root": {
                                        color: "white",
                                    },
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{ minWidth: 40, color: "primary.main" }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{
                                    fontSize: "0.9rem",
                                    fontWeight: 500,
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Divider />

            <List>
                {bottomMenuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                px: 2.5,
                                borderRadius: 1,
                                mx: 1,
                                mt: 0.5,
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{ fontSize: "0.9rem" }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
}
