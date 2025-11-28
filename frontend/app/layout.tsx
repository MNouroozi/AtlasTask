import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../lib/theme";
import { Vazirmatn } from "next/font/google";
import { TasksProvider } from '@/app/context/TasksContext';
import DashboardLayout from "../components/layout/DashboardLayout";
import "./globals.css";

const vazirmatn = Vazirmatn({
    subsets: ["arabic"],
    display: "swap",
    variable: "--font-vazirmatn",
});

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
            <body className={vazirmatn.className}>
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
