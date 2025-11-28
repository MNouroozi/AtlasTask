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
    Avatar,
    Chip,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Task as TaskIcon,
    PlaylistAddCheck as SubtaskIcon,
    TrendingUp as TrendingIcon,
    Flag as FlagIcon,
    Schedule as ScheduleIcon,
    ListAlt,
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import { useTasks } from '@/app/hooks/useTasks'; 

interface SidebarProps {
    open: boolean;
    onToggle: () => void;
}

export default function Sidebar({ open, onToggle }: SidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { allTasks } = useTasks();
    const completedCount = allTasks.filter(task => task.done).length;
    const pendingMainTasksCount = allTasks.filter(task => !task.done).length;

    const menuItems = [
        { 
            text: 'تسک‌ها', 
            icon: <TaskIcon sx={{ fontSize: '1.3rem' }} />, 
            path: '/', 
            badge: pendingMainTasksCount,
        },
        { 
            text: 'گزارشات', 
            icon: <ListAlt sx={{ fontSize: '1.3rem' }} />, 
             path: '/reports', 
            // badge: allTasks.reduce((total, task) => total + (task.subtasks?.length || 0), 0),
        },
    ];

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    return (
        <>
            <Drawer
                variant="persistent"
                anchor="right"
                open={open}
                sx={{
                    width: open ? 200 : 0,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 200,
                        boxSizing: 'border-box',
                        borderLeft: 'none',
                        backgroundColor: '#ffffff',
                        background: 'linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)',
                        color: '#2d3748',
                        position: 'fixed',
                        height: '100vh',
                        right: open ? 0 : -240,
                        top: 0,
                        transition: 'right 0.3s ease-in-out',
                        zIndex: 1200,
                        overflowX: 'hidden',
                        borderRight: '1px solid #e2e8f0',
                    },
                }}
            >
                <Box sx={{ 
                    p: 0.5, 
                    textAlign: 'center',
                    borderBottom: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, gap: 2 }}>
                        <Avatar
                            sx={{
                                width: 44,
                                height: 44,
                                backgroundColor: '#3b82f6',
                                border: '2px solid #dbeafe',
                            }}
                        >
                            <TrendingIcon sx={{ fontSize: '1.5rem' }} />
                        </Avatar>
                        <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="h6" sx={{ 
                                fontWeight: 800, 
                                color: '#1e40af',
                                fontSize: '1.25rem',
                                lineHeight: 1.2,
                                mb: 0.5
                            }}>
                                AtlasTask
                            </Typography>
                            <Typography variant="body2" sx={{ 
                                color: '#6b7280',
                                fontSize: '0.8rem',
                                fontWeight: 500
                            }}>
                                سیستم مدیریت
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ p: 2, flex: 1 }}>
                    <List sx={{ pt: 0, gap: 0.5 }}>
                        {menuItems.map((item) => (
                            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton
                                    onClick={() => handleNavigation(item.path)}
                                    selected={pathname === item.path}
                                    sx={{
                                        minHeight: 52,
                                        px: 2.5,
                                        py: 1.5,
                                        borderRadius: 2.0,
                                        gap: 1, // فاصله بین آیکون و متن
                                        '&.Mui-selected': {
                                            backgroundColor: '#3b82f6',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: '#2563eb',
                                            },
                                            '& .MuiListItemIcon-root': {
                                                color: 'white',
                                            },
                                        },
                                        '&:hover': {
                                            backgroundColor: '#f8fafc',
                                            transition: 'all 0.2s ease',
                                        },
                                    }}
                                >
                                    <ListItemIcon 
                                        sx={{ 
                                            minWidth: 'auto', // حذف minWidth ثابت
                                            color: pathname === item.path ? 'white' : '#6b7280',
                                            margin: 0, // حذف تمام marginها
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.text}
                                        primaryTypographyProps={{ 
                                            fontSize: '0.95rem', 
                                            fontWeight: pathname === item.path ? 700 : 600,
                                            noWrap: true,
                                        }}
                                        sx={{
                                            margin: 0, // حذف margin
                                            flex: 1,
                                            textAlign: 'right',
                                        }}
                                    />
                                    {item.badge && (
                                        <Chip 
                                            label={item.badge} 
                                            size="small"
                                            sx={{
                                                backgroundColor: pathname === item.path ? 'white' : '#ef4444',
                                                color: pathname === item.path ? '#3b82f6' : 'white',
                                                fontSize: '0.75rem',
                                                height: 22,
                                                minWidth: 22,
                                                fontWeight: 'bold',
                                                '& .MuiChip-label': {
                                                    px: 0.5,
                                                }
                                            }}
                                        />
                                    )}
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>

                    <Box sx={{ 
                        mt: 0, 
                        p: 1.5, 
                        backgroundColor: '#f8fafc',
                        borderRadius: 1.5,
                        border: '1px solid #e2e8f0',
                    }}>
                        <Typography variant="subtitle2" sx={{ 
                            mb: 2, 
                            color: '#4b5563', 
                            textAlign: 'center', 
                            fontWeight: 700,
                            fontSize: '0.9rem'
                        }}>
                            آمار امروز
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', gap: 1 }}>
                            <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                                    <FlagIcon sx={{ fontSize: '1.1rem', color: '#10b981', mr: 0.5 }} />
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>
                                        {completedCount}
                                    </Typography>
                                </Box>
                                <Typography variant="caption" sx={{ display: 'block', color: '#6b7280', fontSize: '0.75rem' }}>
                                    انجام شده
                                </Typography>
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                                    <ScheduleIcon sx={{ fontSize: '1.1rem', color: '#f59e0b', mr: 0.5 }} />
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>
                                       {pendingMainTasksCount}
                                    </Typography>
                                </Box>
                                <Typography variant="caption" sx={{ display: 'block', color: '#6b7280', fontSize: '0.75rem' }}>
                                    در انتظار
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ 
                    p: 2.5, 
                    borderTop: '1px solid #e2e8f0',
                    textAlign: 'center',
                    backgroundColor: '#f8fafc',
                }}>
                    <Typography variant="caption" sx={{ 
                        color: '#9ca3af', 
                        display: 'block', 
                        fontSize: '0.75rem',
                        fontWeight: 500
                    }}>
                        نسخه ۱.۰.۰
                    </Typography>
                </Box>
            </Drawer>

            <Drawer
                variant="persistent"
                anchor="right"
                open={!open}
                sx={{
                    width: !open ? 70 : 0,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 70,
                        boxSizing: 'border-box',
                        borderLeft: 'none',
                        backgroundColor: '#ffffff',
                        position: 'fixed',
                        height: '100vh',
                        right: 0,
                        top: 0,
                        transition: 'all 0.3s ease-in-out',
                        zIndex: 1200,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        pt: 3,
                        overflowX: 'hidden',
                        borderRight: '1px solid #e2e8f0',
                    },
                }}
            >
                <Avatar
                    sx={{
                        width: 40,
                        height: 40,
                        marginBottom: 3,
                        backgroundColor: '#3b82f6',
                        cursor: 'pointer',
                        border: '2px solid #dbeafe',
                    }}
                    onClick={onToggle}
                >
                    <TrendingIcon sx={{ fontSize: '1.3rem' }} />
                </Avatar>

                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: 1 }}>
                    {menuItems.map((item) => (
                        <Box
                            key={item.text}
                            onClick={() => handleNavigation(item.path)}
                            sx={{
                                position: 'relative',
                                cursor: 'pointer',
                                width: 44,
                                height: 44,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 1,
                                backgroundColor: pathname === item.path ? '#3b82f6' : 'transparent',
                                color: pathname === item.path ? 'white' : '#6b7280',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    backgroundColor: pathname === item.path ? '#2563eb' : '#f3f4f6',
                                },
                            }}
                        >
                            {item.badge && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: -4,
                                        left: -4,
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: 16,
                                        height: 16,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.6rem',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {item.badge}
                                </Box>
                            )}
                            {item.icon}
                        </Box>
                    ))}
                </Box>

                <Box sx={{ mt: 'auto', mb: 2 }}>
                    <Typography 
                        variant="caption" 
                        sx={{ 
                            color: '#9ca3af', 
                            fontSize: '0.6rem',
                            writingMode: 'vertical-rl',
                            textOrientation: 'mixed',
                            fontWeight: 500
                        }}
                    >
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
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        zIndex: 1199,
                        display: { xs: 'block', md: 'none' },
                    }}
                    onClick={onToggle}
                />
            )}
        </>
    );
}