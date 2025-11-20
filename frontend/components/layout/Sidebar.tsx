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
        <Drawer
            variant="persistent"
            anchor="right"
            open={open}
            sx={{
                width: 280,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 280,
                    boxSizing: 'border-box',
                    borderLeft: 'none',
                    backgroundColor: 'white',
                    boxShadow: '4px 0 20px rgba(0,0,0,0.08)',
                    position: 'fixed',
                    height: '100vh',
                    right: 0,
                    top: 0,
                    transition: 'width 0.3s ease',
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
                        {open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
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
                        letterSpacing: '0.5px'
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
                                        transform: 'translateX(-4px)',
                                        transition: 'all 0.2s ease',
                                    },
                                }}
                            >
                                <ListItemIcon 
                                    sx={{ 
                                        minWidth: 40,
                                        color: pathname === item.path ? 'white' : 'primary.main'
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
    );
}