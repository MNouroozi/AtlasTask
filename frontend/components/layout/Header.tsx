'use client';

import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Breadcrumbs,
    Chip,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Notifications as NotificationsIcon,
    AccountCircle as AccountCircleIcon,
    Home as HomeIcon,
} from '@mui/icons-material';
import { usePathname } from 'next/navigation';

interface HeaderProps {
    onMenuClick: () => void;
    sidebarOpen: boolean;
}

export default function Header({ onMenuClick, sidebarOpen }: HeaderProps) {
    const pathname = usePathname();

    const getPageTitle = () => {
        switch (pathname) {
            case '/':
                return 'داشبورد';
            case '/tasks':
                return 'مدیریت تسک‌ها';
            case '/subtasks':
                return 'ساب تسک‌ها';
            default:
                return 'داشبورد';
        }
    };

    return (
        <AppBar 
            position="static" 
            elevation={0}
            sx={{
                backgroundColor: 'white',
                color: 'text.primary',
                borderBottom: '1px solid',
                borderColor: 'divider',
                backdropFilter: 'blur(8px)',
            }}
        >
            <Toolbar sx={{ minHeight: '80px !important', px: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <IconButton
                        edge="start"
                        aria-label="menu"
                        onClick={onMenuClick}
                        sx={{ 
                            mr: 2,
                            color: 'primary.main',
                            backgroundColor: 'primary.50',
                            '&:hover': {
                                backgroundColor: 'primary.100',
                            }
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Breadcrumbs 
                            sx={{ 
                                mb: 1,
                                '& .MuiBreadcrumbs-separator': { mx: 1 }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                <HomeIcon sx={{ fontSize: 18, mr: 0.5 }} />
                                <Typography variant="body2">خانه</Typography>
                            </Box>
                            <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                                {getPageTitle()}
                            </Typography>
                        </Breadcrumbs>
                        
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                fontWeight: 700,
                                color: 'text.primary',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            {getPageTitle()}
                            <Chip 
                                label="آنلاین" 
                                size="small" 
                                color="success" 
                                variant="outlined"
                                sx={{ height: 24, fontSize: '0.7rem' }}
                            />
                        </Typography>
                    </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton 
                        sx={{ 
                            color: 'text.secondary',
                            backgroundColor: 'grey.50',
                            '&:hover': {
                                backgroundColor: 'grey.100',
                                color: 'primary.main'
                            }
                        }}
                    >
                        <NotificationsIcon />
                    </IconButton>
                    
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1,
                            p: 1,
                            borderRadius: 2,
                            backgroundColor: 'primary.50',
                            border: '1px solid',
                            borderColor: 'primary.100',
                        }}
                    >
                        <AccountCircleIcon sx={{ color: 'primary.main' }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1 }}>
                                مدیر سیستم
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Admin
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
}