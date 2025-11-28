'use client';

import { useMemo, useState } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Chip,
    LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    Divider,
    alpha,
    Button,
    useTheme,
} from '@mui/material';
import {
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    TrendingUp as TrendingIcon,
    Assignment as TaskIcon,
    PlaylistAddCheck as SubTaskIcon,
    CalendarToday as TodayIcon,
    ArrowBack as BackIcon,
} from '@mui/icons-material';
import { useTasks } from '@/app/hooks/useTasks';
import { convertToJalali } from '@/lib/dateConverter';
import { useRouter } from 'next/navigation';

type ViewMode = 'overview' | 'overdue' | 'today' | 'completed' | 'pending';

export default function ReportsPage() {
    const { allTasks, pendingCount, completedCount } = useTasks();
    const router = useRouter();
    const theme = useTheme();
    const [viewMode, setViewMode] = useState<ViewMode>('overview');
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    const stats = useMemo(() => {
        const overdueTasks = allTasks.filter(task => 
            task.due_date && new Date(task.due_date) < today && !task.done
        );

        const todayTasks = allTasks.filter(task => 
            task.due_date && task.due_date.split('T')[0] === todayString && !task.done
        );

        const totalSubtasks = allTasks.reduce((total, task) => 
            total + (task.subtasks?.length || 0), 0
        );

        const completedSubtasks = allTasks.reduce((total, task) => 
            total + (task.subtasks?.filter(st => st.done)?.length || 0), 0
        );

        const pendingSubtasks = totalSubtasks - completedSubtasks;

        const completionRate = allTasks.length > 0 ? 
            (completedCount / allTasks.length) * 100 : 0;

        const subtaskCompletionRate = totalSubtasks > 0 ? 
            (completedSubtasks / totalSubtasks) * 100 : 0;

        return {
            overdueTasks,
            todayTasks,
            totalSubtasks,
            completedSubtasks,
            pendingSubtasks,
            completionRate,
            subtaskCompletionRate,
            totalTasks: allTasks.length,
        };
    }, [allTasks, completedCount, todayString]);

    const convertToPersianNumbers = (num: number): string => {
        const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return num.toString().replace(/\d/g, (digit) => persianNumbers[parseInt(digit)]);
    };

    const handleCategoryClick = (category: ViewMode, title: string) => {
        setViewMode(category);
        setSelectedCategory(title);
    };

    const handleBackToOverview = () => {
        setViewMode('overview');
        setSelectedCategory('');
    };

    const handleTaskClick = (taskId: number) => {
        router.push('/');
    };

    const handleViewInTasks = (filterType: ViewMode) => {
        const params = new URLSearchParams();
        
        switch (filterType) {
            case 'overdue':
                params.set('filter', 'overdue');
                break;
            case 'today':
                params.set('filter', 'today');
                break;
            case 'completed':
                params.set('done', 'done');
                break;
            case 'pending':
                params.set('done', 'pending');
                break;
        }
        
        router.push(`/?${params.toString()}`);
    };

    const StatCard = ({ 
        title, 
        value, 
        subtitle, 
        color, 
        icon,
        progress,
        onClick 
    }: {
        title: string;
        value: number;
        subtitle: string;
        color: string;
        icon: React.ReactNode;
        progress?: number;
        onClick?: () => void;
    }) => (
        <Card 
            sx={{ 
                height: '100%',
                background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
                border: `1px solid ${alpha(color, 0.2)}`,
                borderRadius: 3,
                transition: 'all 0.3s ease',
                cursor: onClick ? 'pointer' : 'default',
                '&:hover': {
                    transform: onClick ? 'translateY(-4px)' : 'none',
                    boxShadow: onClick ? `0 8px 25px ${alpha(color, 0.15)}` : 'none',
                }
            }}
            onClick={onClick}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                        sx={{
                            p: 1,
                            borderRadius: 2,
                            backgroundColor: alpha(color, 0.1),
                            color: color,
                            mr: 2,
                        }}
                    >
                        {icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h4" fontWeight="bold" color={color}>
                            {convertToPersianNumbers(value)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" fontWeight="500">
                            {title}
                        </Typography>
                    </Box>
                </Box>
                {progress !== undefined && (
                    <Box sx={{ mt: 2 }}>
                        <LinearProgress 
                            variant="determinate" 
                            value={progress} 
                            sx={{ 
                                height: 6, 
                                borderRadius: 3,
                                backgroundColor: alpha(color, 0.2),
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: color,
                                }
                            }} 
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            {subtitle}
                        </Typography>
                    </Box>
                )}
                {!progress && (
                    <Typography variant="caption" color="text.secondary">
                        {subtitle}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );

    const TaskListItem = ({ task }: { task: any }) => (
        <Box>
            <ListItem 
                sx={{ 
                    py: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    }
                }}
                onClick={() => handleTaskClick(task.id)}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
                    <ListItemIcon sx={{ minWidth: 36, mr: 1 }}>
                        <Box
                            sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: task.done ? '#10b981' : '#f59e0b',
                            }}
                        />
                    </ListItemIcon>
                    <Typography 
                        variant="body1" 
                        fontWeight="500"
                        sx={{ 
                            textDecoration: task.done ? 'line-through' : 'none',
                            color: task.done ? 'text.secondary' : 'text.primary',
                            flex: 1
                        }}
                    >
                        {task.title}
                    </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', ml: 7 }}>
                    {task.due_date && (
                        <Chip
                            label={convertToJalali(task.due_date)}
                            size="small"
                            variant="outlined"
                            color={new Date(task.due_date) < today ? "error" : "primary"}
                            sx={{ height: 24, fontSize: '0.75rem' }}
                        />
                    )}
                    {task.subtasks && task.subtasks.length > 0 && (
                        <Chip
                            label={`${convertToPersianNumbers(task.subtasks.filter((st: any) => st.done).length)}/${convertToPersianNumbers(task.subtasks.length)} زیرکار`}
                            size="small"
                            variant="outlined"
                            color="info"
                            sx={{ height: 24, fontSize: '0.75rem' }}
                        />
                    )}
                    <Chip
                        label={task.done ? 'انجام شده' : 'در حال انجام'}
                        size="small"
                        color={task.done ? "success" : "warning"}
                        variant={task.done ? "filled" : "outlined"}
                        sx={{ height: 24, fontSize: '0.75rem' }}
                    />
                </Box>
            </ListItem>
        </Box>
    );

    const TaskListCard = ({ 
        title, 
        tasks, 
        icon,
        color,
        emptyMessage,
        showViewAllButton = false,
        viewAllFilter
    }: {
        title: string;
        tasks: any[];
        icon: React.ReactNode;
        color: string;
        emptyMessage: string;
        showViewAllButton?: boolean;
        viewAllFilter?: ViewMode;
    }) => (
        <Card 
            sx={{ 
                height: '100%',
                borderRadius: 3,
                border: `1px solid ${alpha(color, 0.2)}`,
            }}
        >
            <CardContent sx={{ p: 0 }}>
                <Box 
                    sx={{ 
                        p: 2, 
                        backgroundColor: alpha(color, 0.05),
                        borderBottom: `1px solid ${alpha(color, 0.1)}`,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: showViewAllButton ? 1 : 0 }}>
                        <Box sx={{ color, mr: 1 }}>{icon}</Box>
                        <Typography variant="h6" fontWeight="600">
                            {title}
                        </Typography>
                        <Chip 
                            label={convertToPersianNumbers(tasks.length)} 
                            size="small" 
                            sx={{ 
                                ml: 'auto',
                                backgroundColor: color,
                                color: 'white',
                                fontWeight: 'bold'
                            }} 
                        />
                    </Box>
                    {showViewAllButton && viewAllFilter && tasks.length > 0 && (
                        <Button
                            size="small"
                            onClick={() => handleViewInTasks(viewAllFilter)}
                            sx={{ 
                                color,
                                fontSize: '0.75rem',
                                p: 0,
                                minWidth: 'auto',
                                '&:hover': {
                                    backgroundColor: alpha(color, 0.1),
                                }
                            }}
                        >
                            مشاهده همه در صفحه تسک‌ها
                        </Button>
                    )}
                </Box>
                
                <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                    {tasks.length === 0 ? (
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                {emptyMessage}
                            </Typography>
                        </Box>
                    ) : (
                        tasks.map((task, index) => (
                            <Box key={task.id}>
                                <TaskListItem task={task} />
                                {index < tasks.length - 1 && <Divider variant="inset" component="li" />}
                            </Box>
                        ))
                    )}
                </Box>
            </CardContent>
        </Card>
    );

    const renderOverview = () => (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
                📊 گزارشات جامع
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="کل تسک‌ها"
                        value={stats.totalTasks}
                        subtitle="تعداد کل تسک‌ها"
                        color="#3b82f6"
                        icon={<TrendingIcon />}
                        onClick={() => handleCategoryClick('overview', 'همه تسک‌ها')}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="تسک‌های انجام شده"
                        value={completedCount}
                        subtitle="تسک‌های تکمیل شده"
                        color="#10b981"
                        icon={<CheckCircleIcon />}
                        progress={stats.completionRate}
                        onClick={() => handleCategoryClick('completed', 'تسک‌های انجام شده')}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="تسک‌های در انتظار"
                        value={pendingCount}
                        subtitle="تسک‌های در حال انجام"
                        color="#f59e0b"
                        icon={<ScheduleIcon />}
                        onClick={() => handleCategoryClick('pending', 'تسک‌های در حال انجام')}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="زیرکارها"
                        value={stats.totalSubtasks}
                        subtitle={`${convertToPersianNumbers(stats.completedSubtasks)} انجام شده`}
                        color="#8b5cf6"
                        icon={<SubTaskIcon />}
                        progress={stats.subtaskCompletionRate}
                    />
                </Grid>

                <Grid item xs={12} lg={6}>
                    <TaskListCard
                        title="⏰ تسک‌های معوقه"
                        tasks={stats.overdueTasks}
                        icon={<WarningIcon color="error" />}
                        color="#ef4444"
                        emptyMessage="هیچ تسک معوقه وجود ندارد ✅"
                        showViewAllButton={true}
                        viewAllFilter="overdue"
                    />
                </Grid>

                <Grid item xs={12} lg={6}>
                    <TaskListCard
                        title="📅 تسک‌های امروز"
                        tasks={stats.todayTasks}
                        icon={<TodayIcon color="primary" />}
                        color="#3b82f6"
                        emptyMessage="هیچ تسک برای امروز وجود ندارد 🎉"
                        showViewAllButton={true}
                        viewAllFilter="today"
                    />
                </Grid>

                <Grid item xs={12}>
                    <Card sx={{ 
                        borderRadius: 3, 
                        border: '1px solid', 
                        borderColor: 'divider',
                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h5" fontWeight="600" gutterBottom sx={{ mb: 3 }}>
                                📈 خلاصه عملکرد
                            </Typography>
                            <Grid container spacing={4}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Box sx={{ textAlign: 'center', p: 2 }}>
                                        <Typography variant="h2" fontWeight="bold" color="#10b981">
                                            {convertToPersianNumbers(Math.round(stats.completionRate))}%
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary" fontWeight="500">
                                            نرخ تکمیل تسک‌ها
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Box sx={{ textAlign: 'center', p: 2 }}>
                                        <Typography variant="h2" fontWeight="bold" color="#8b5cf6">
                                            {convertToPersianNumbers(Math.round(stats.subtaskCompletionRate))}%
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary" fontWeight="500">
                                            نرخ تکمیل زیرکارها
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Box sx={{ textAlign: 'center', p: 2 }}>
                                        <Typography variant="h2" fontWeight="bold" color="#f59e0b">
                                            {convertToPersianNumbers(stats.overdueTasks.length)}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary" fontWeight="500">
                                            تسک‌های معوقه
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Box sx={{ textAlign: 'center', p: 2 }}>
                                        <Typography variant="h2" fontWeight="bold" color="#3b82f6">
                                            {convertToPersianNumbers(stats.todayTasks.length)}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary" fontWeight="500">
                                            تسک‌های امروز
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );

    const renderCategoryView = () => {
        let filteredTasks: any[] = [];
        let title = '';
        let color = '#3b82f6';
        let icon = <TaskIcon />;
        let filterType: ViewMode = 'overview';

        switch (viewMode) {
            case 'overdue':
                filteredTasks = stats.overdueTasks;
                title = 'تسک‌های معوقه';
                color = '#ef4444';
                icon = <WarningIcon />;
                filterType = 'overdue';
                break;
            case 'today':
                filteredTasks = stats.todayTasks;
                title = 'تسک‌های امروز';
                color = '#3b82f6';
                icon = <TodayIcon />;
                filterType = 'today';
                break;
            case 'completed':
                filteredTasks = allTasks.filter(task => task.done);
                title = 'تسک‌های انجام شده';
                color = '#10b981';
                icon = <CheckCircleIcon />;
                filterType = 'completed';
                break;
            case 'pending':
                filteredTasks = allTasks.filter(task => !task.done);
                title = 'تسک‌های در حال انجام';
                color = '#f59e0b';
                icon = <ScheduleIcon />;
                filterType = 'pending';
                break;
        }

        return (
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                    <Button
                        startIcon={<BackIcon />}
                        onClick={handleBackToOverview}
                        variant="outlined"
                    >
                        بازگشت به گزارشات
                    </Button>
                    <Box sx={{ color, display: 'flex', alignItems: 'center', gap: 1 }}>
                        {icon}
                        <Typography variant="h4" fontWeight="bold">
                            {title}
                        </Typography>
                    </Box>
                    <Chip 
                        label={convertToPersianNumbers(filteredTasks.length)} 
                        sx={{ 
                            backgroundColor: color,
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1rem'
                        }} 
                    />
                    <Button
                        variant="contained"
                        onClick={() => handleViewInTasks(filterType)}
                        sx={{ 
                            ml: 'auto',
                            backgroundColor: color,
                            '&:hover': {
                                backgroundColor: color,
                                opacity: 0.9,
                            }
                        }}
                    >
                        مشاهده در صفحه تسک‌ها
                    </Button>
                </Box>

                <TaskListCard
                    title={title}
                    tasks={filteredTasks}
                    icon={icon}
                    color={color}
                    emptyMessage={`هیچ ${title} وجود ندارد`}
                />
            </Box>
        );
    };

    return (
        <Box sx={{ p: 3 }}>
            {viewMode === 'overview' ? renderOverview() : renderCategoryView()}
        </Box>
    );
}