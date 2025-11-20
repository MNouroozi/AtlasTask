"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                backgroundColor: "#f8f9fa",
            }}
        >
            <Sidebar open={sidebarOpen} onToggle={toggleSidebar} />
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    marginRight: sidebarOpen ? "280px" : "0px",
                    transition: "margin-right 0.3s ease",
                }}
            >
                <Header onMenuClick={toggleSidebar} />
                <Box component="main" sx={{ flex: 1, p: 3 }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}
