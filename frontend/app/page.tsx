"use client";
import 'react-toastify/dist/ReactToastify.css';
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import {
    Task as TaskIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    Cancel as CancelIcon,
} from "@mui/icons-material";

export default function HomePage() {
    const stats = [
        {
            title: "تسک‌های فعال",
            value: "۱۲",
            color: "primary.main",
            icon: <TaskIcon sx={{ fontSize: 40 }} />,
        },
        {
            title: "تکمیل شده",
            value: "۸",
            color: "success.main",
            icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
        },
        {
            title: "در حال انجام",
            value: "۴",
            color: "warning.main",
            icon: <ScheduleIcon sx={{ fontSize: 40 }} />,
        },
        {
            title: "لغو شده",
            value: "۲",
            color: "error.main",
            icon: <CancelIcon sx={{ fontSize: 40 }} />,
        },
    ];

    return (
        <Box>
            <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: 600, mb: 4 }}
            >
                داشبورد مدیریت تسک‌ها
            </Typography>

            <Grid container spacing={3}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card
                            sx={{
                                textAlign: "center",
                                transition: "transform 0.2s",
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                },
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ color: stat.color, mb: 2 }}>
                                    {stat.icon}
                                </Box>
                                <Typography
                                    variant="h3"
                                    component="div"
                                    sx={{
                                        color: stat.color,
                                        fontWeight: 700,
                                        mb: 1,
                                    }}
                                >
                                    {stat.value}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ fontWeight: 500 }}
                                >
                                    {stat.title}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: "300px" }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                فعالیت‌های اخیر
                            </Typography>
                            <Typography color="text.secondary">
                                نمودار فعالیت‌ها به زودی اضافه خواهد شد...
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: "300px" }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                وضعیت تسک‌ها
                            </Typography>
                            <Typography color="text.secondary">
                                آمار وضعیت تسک‌ها به زودی اضافه خواهد شد...
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}