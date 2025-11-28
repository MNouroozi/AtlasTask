'use client';

import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Breadcrumbs,
    Chip,
    Badge,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Notifications as NotificationsIcon,
    AccountCircle as AccountCircleIcon,
    Home as HomeIcon,
    ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { usePathname } from 'next/navigation';

interface HeaderProps {
    onMenuClick: () => void;
    sidebarOpen: boolean;
    
    headerHeight?: number; 
    primaryColor?: string; 
    backgroundColor?: string; 
    textColor?: string; 
}

export default function Header({ 
    onMenuClick, 
    sidebarOpen,
    headerHeight = 70,
    primaryColor = '#3b82f6',
    backgroundColor = '#ffffff',
    textColor = '#1e293b'
}: HeaderProps) {
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

    
    const dynamicStyles = {
        appBar: {
            backgroundColor: backgroundColor,
            color: textColor,
            borderBottom: '1px solid #e2e8f0',
            backdropFilter: 'blur(10px)',
            background: `linear-gradient(135deg, ${backgroundColor} 0%, ${backgroundColor}dd 100%)`,
        },
        toolbar: {
            minHeight: `${headerHeight}px !important`,
            px: 3,
        },
        menuButton: {
            color: primaryColor,
            backgroundColor: `${primaryColor}15`,
            '&:hover': {
                backgroundColor: `${primaryColor}25`,
            }
        },
        breadcrumbActive: {
            color: primaryColor,
        },
        notificationButton: {
            color: textColor,
            backgroundColor: `${textColor}08`,
            '&:hover': {
                backgroundColor: `${textColor}15`,
                color: primaryColor
            }
        },
        userSection: {
            backgroundColor: `${primaryColor}10`,
            border: `1px solid ${primaryColor}20`,
        }
    };

    return (
        <AppBar 
            position="static" 
            elevation={0}
            sx={dynamicStyles.appBar}
        >
            <Toolbar sx={dynamicStyles.toolbar}>
                {}
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, gap: 2 }}>
                    <IconButton
                        edge="start"
                        aria-label="menu"
                        onClick={onMenuClick}
                        sx={dynamicStyles.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Breadcrumbs 
                            separator={<ChevronRightIcon sx={{ fontSize: 16, color: '#64748b' }} />}
                            sx={{ 
                                '& .MuiBreadcrumbs-ol': {
                                    alignItems: 'center'
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', color: '#64748b' }}>
                                <HomeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                    خانه
                                </Typography>
                            </Box>
                            <Typography variant="caption" sx={{ ...dynamicStyles.breadcrumbActive, fontWeight: 600 }}>
                                {getPageTitle()}
                            </Typography>
                        </Breadcrumbs>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    fontWeight: 700,
                                    color: textColor,
                                    fontSize: '1.25rem'
                                }}
                            >
                                {getPageTitle()}
                            </Typography>
                            <Chip 
                                label="آنلاین" 
                                size="small" 
                                sx={{ 
                                    height: 22,
                                    fontSize: '0.65rem',
                                    fontWeight: 600,
                                    backgroundColor: '#10b98115',
                                    color: '#10b981',
                                    border: '1px solid #10b98130'
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
                
                {}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Badge 
                        badgeContent={3} 
                        color="error"
                        sx={{
                            '& .MuiBadge-badge': {
                                fontSize: '0.6rem',
                                height: 16,
                                minWidth: 16,
                            }
                        }}
                    >
                        <IconButton 
                            sx={dynamicStyles.notificationButton}
                        >
                            <NotificationsIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                    </Badge>
                    
                    {}
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1.5,
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            ...dynamicStyles.userSection,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: `${primaryColor}15`,
                                border: `1px solid ${primaryColor}30`,
                            }
                        }}
                    >
                        <Box sx={{ 
                            width: 36, 
                            height: 36, 
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: primaryColor,
                            color: 'white'
                        }}>
                            <AccountCircleIcon sx={{ fontSize: 20 }} />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography 
                                variant="subtitle2" 
                                sx={{ 
                                    fontWeight: 600, 
                                    lineHeight: 1.2,
                                    fontSize: '0.85rem'
                                }}
                            >
                                مدیر سیستم
                            </Typography>
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    color: '#64748b',
                                    fontSize: '0.75rem'
                                }}
                            >
                                Admin
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
}