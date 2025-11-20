'use client';

import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    Typography,
    IconButton,
    Badge,
    Tooltip,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Task as TaskIcon,
    PlaylistAddCheck as SubtaskIcon,
    ChevronRight as ChevronRightIcon,
    ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';

interface SidebarProps {
    open: boolean;
    onToggle: () => void;
}

export default function Sidebar({ open, onToggle }: SidebarProps) {
    const router = useRouter();
    const pathname = usePathname();

    const menuItems = [
        { text: 'داشبورد', icon: <DashboardIcon />, path: '/', badge: null },
        { text: 'مدیریت تسک‌ها', icon: <TaskIcon />, path: '/tasks', badge: 5 },
        { text: 'ساب تسک‌ها', icon: <SubtaskIcon />, path: '/subtasks', badge: 12 },
    ];

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    return (
        <>
            {/* سایدبار اصلی (حالت باز) */}
            <Drawer
                variant="persistent"
                anchor="right"
                open={open}
                sx={{
                    width: open ? 280 : 0,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 280,
                        boxSizing: 'border-box',
                        borderLeft: 'none',
                        backgroundColor: 'white',
                        boxShadow: '4px 0 20px rgba(0,0,0,0.08)',
                        position: 'fixed',
                        height: '100vh',
                        right: open ? 0 : -280,
                        top: 0,
                        transition: 'right 0.3s ease-in-out',
                        zIndex: 1200,
                    },
                }}
            >
                <Box sx={{ 
                    p: 3, 
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
                                AtlasTask
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                سیستم مدیریت هوشمند
                            </Typography>
                        </Box>
                        <IconButton 
                            onClick={onToggle}
                            size="small"
                            sx={{
                                color: 'white',
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.3)',
                                }
                            }}
                        >
                            <ChevronRightIcon />
                        </IconButton>
                    </Box>
                </Box>

                <Box sx={{ p: 2, flex: 1 }}>
                    <Typography 
                        variant="caption" 
                        sx={{ 
                            px: 2, 
                            color: 'text.secondary',
                            fontWeight: 600,
                            letterSpacing: '0.5px',
                            display: 'block',
                            mb: 1
                        }}
                    >
                        منوی اصلی
                    </Typography>
                    
                    <List sx={{ pt: 1 }}>
                        {menuItems.map((item) => (
                            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton
                                    onClick={() => handleNavigation(item.path)}
                                    selected={pathname === item.path}
                                    sx={{
                                        minHeight: 52,
                                        px: 2,
                                        borderRadius: 2,
                                        '&.Mui-selected': {
                                            backgroundColor: 'primary.main',
                                            color: 'white',
                                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                                            '&:hover': {
                                                backgroundColor: 'primary.dark',
                                            },
                                            '& .MuiListItemIcon-root': {
                                                color: 'white',
                                            },
                                        },
                                        '&:hover': {
                                            backgroundColor: 'primary.50',
                                            transition: 'all 0.2s ease',
                                        },
                                    }}
                                >
                                    <ListItemIcon 
                                        sx={{ 
                                            minWidth: 40,
                                            color: pathname === item.path ? 'white' : 'primary.main',
                                            mr: 2, // تغییر از margin-left به margin-right برای RTL
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.text}
                                        primaryTypographyProps={{ 
                                            fontSize: '0.9rem', 
                                            fontWeight: pathname === item.path ? 700 : 600 
                                        }}
                                    />
                                    {item.badge && (
                                        <Badge 
                                            badgeContent={item.badge} 
                                            color="error"
                                            sx={{
                                                '& .MuiBadge-badge': {
                                                    fontSize: '0.7rem',
                                                    height: 18,
                                                    minWidth: 18,
                                                }
                                            }}
                                        />
                                    )}
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>

                <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ 
                        backgroundColor: 'grey.50', 
                        borderRadius: 2, 
                        p: 2,
                        textAlign: 'center'
                    }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            نسخه ۱.۰.۰
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            توسعه داده شده با ❤️
                        </Typography>
                    </Box>
                </Box>
            </Drawer>

            {/* سایدبار کوچک (حالت بسته) */}
            <Drawer
                variant="persistent"
                anchor="right"
                open={!open}
                sx={{
                    width: !open ? 80 : 0,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 80,
                        boxSizing: 'border-box',
                        borderLeft: 'none',
                        backgroundColor: 'white',
                        boxShadow: '4px 0 20px rgba(0,0,0,0.08)',
                        position: 'fixed',
                        height: '100vh',
                        right: 0,
                        top: 0,
                        transition: 'all 0.3s ease-in-out',
                        zIndex: 1200,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        pt: 2,
                        overflowX: 'hidden',
                    },
                }}
            >
                <Tooltip title="باز کردن منو" placement="left">
                    <IconButton 
                        onClick={onToggle}
                        sx={{
                            mb: 3,
                            color: 'primary.main',
                            backgroundColor: 'primary.50',
                            '&:hover': {
                                backgroundColor: 'primary.100',
                            }
                        }}
                    >
                        <ChevronLeftIcon />
                    </IconButton>
                </Tooltip>

                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    {menuItems.map((item) => (
                        <Tooltip key={item.text} title={item.text} placement="left">
                            <IconButton
                                onClick={() => handleNavigation(item.path)}
                                sx={{
                                    mb: 2,
                                    color: pathname === item.path ? 'white' : 'primary.main',
                                    backgroundColor: pathname === item.path ? 'primary.main' : 'transparent',
                                    width: 48,
                                    height: 48,
                                    '&:hover': {
                                        backgroundColor: pathname === item.path ? 'primary.dark' : 'primary.50',
                                    },
                                }}
                            >
                                {item.badge ? (
                                    <Badge 
                                        badgeContent={item.badge} 
                                        color="error"
                                        sx={{
                                            '& .MuiBadge-badge': {
                                                fontSize: '0.6rem',
                                                height: 16,
                                                minWidth: 16,
                                                top: 4,
                                                right: 4,
                                            }
                                        }}
                                    >
                                        {item.icon}
                                    </Badge>
                                ) : (
                                    item.icon
                                )}
                            </IconButton>
                        </Tooltip>
                    ))}
                </Box>

                {/* ورژن در حالت کوچک */}
                <Box sx={{ mt: 'auto', mb: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                        v1.0.0
                    </Typography>
                </Box>
            </Drawer>

            {open && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1199,
                        display: { xs: 'block', md: 'none' },
                    }}
                    onClick={onToggle}
                />
            )}
        </>
    );
}