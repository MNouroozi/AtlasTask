'use client';

import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
} from '@mui/material';
import {
    Add as AddIcon,
} from '@mui/icons-material';

export default function SubtasksPage() {
    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    مدیریت ساب تسک‌ها
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ borderRadius: 2 }}
                    disabled
                >
                    ایجاد ساب تسک جدید
                </Button>
            </Box>

            <Card>
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        🚧 در حال توسعه
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        بخش مدیریت ساب تسک‌ها به زودی راه‌اندازی خواهد شد
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}