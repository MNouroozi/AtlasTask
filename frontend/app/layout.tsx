import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../lib/theme";
import { TasksProvider } from '@/app/context/TasksContext';
import DashboardLayout from "../components/layout/DashboardLayout";
import "./globals.css";

export const metadata: Metadata = {
    title: "AtlasTask - مدیریت تسک‌ها",
    description: "سیستم مدیریت تسک‌های پیشرفته",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fa" dir="rtl">
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100;200;300;400;500;600;700;800;900&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                 <TasksProvider>
                    <AppRouterCacheProvider>
                        <ThemeProvider theme={theme}>
                            <DashboardLayout>{children}</DashboardLayout>
                        </ThemeProvider>
                    </AppRouterCacheProvider>
                </TasksProvider>
            </body>
        </html>
    );
}