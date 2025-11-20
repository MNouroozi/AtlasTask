"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
                backgroundColor: "#f8fafc",
                direction: "rtl",
            }}
        >
            <ToastContainer
                position="top-left"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={true}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            
            <Sidebar open={sidebarOpen} onToggle={toggleSidebar} />
            
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    width: `calc(100% - ${sidebarOpen ? '280px' : '0px'})`,
                    transition: 'width 0.3s ease',
                    marginRight: 'auto',
                }}
            >
                <Header onMenuClick={toggleSidebar} sidebarOpen={sidebarOpen} />
                <Box 
                    component="main" 
                    sx={{ 
                        flex: 1, 
                        p: 3,
                        maxWidth: '100%',
                        overflow: 'auto',
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
}