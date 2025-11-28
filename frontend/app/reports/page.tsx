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

type ViewMode = 'overview' | 'overdue' | 'today' | 'completed' | 'pending' | 'subtasks';

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

        const allSubtasks = allTasks.flatMap(task => 
            (task.subtasks || []).map(subtask => ({
                ...subtask,
                mainTaskTitle: task.title,
                mainTaskId: task.id
            }))
        );

        const overdueSubtasks = allSubtasks.filter(subtask => 
            subtask.created_at && new Date(subtask.created_at) < today && !subtask.done
        );

        const todaySubtasks = allSubtasks.filter(subtask => 
            subtask.created_at && subtask.created_at.split('T')[0] === todayString && !subtask.done
        );

        return {
            overdueTasks,
            todayTasks,
            totalSubtasks,
            completedSubtasks,
            pendingSubtasks,
            completionRate,
            subtaskCompletionRate,
            totalTasks: allTasks.length,
            allSubtasks,
            overdueSubtasks,
            todaySubtasks,
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

    const handleTaskClick = (task: any) => {
        const params = new URLSearchParams();
        params.set('taskId', task.id.toString());
        params.set('done', task.done ? 'done' : 'pending');
        router.push(`/?${params.toString()}`);
    };

    const handleSubTaskClick = (subtask: any) => {
        const params = new URLSearchParams();
        params.set('taskId', subtask.mainTaskId.toString());
        params.set('subtaskId', subtask.id.toString());
        router.push(`/?${params.toString()}`);
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
            case 'subtasks':
                params.set('view', 'subtasks');
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
                borderRadius: 2,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 25px ${alpha(color, 0.15)}`,
                }
            }}
            onClick={onClick}
        >
            <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box
                        sx={{
                            p: 1,
                            borderRadius: 1.5,
                            backgroundColor: alpha(color, 0.1),
                            color: color,
                            mr: 1.5,
                        }}
                    >
                        {icon}
                    </Box>
                    <Box sx={{ flex: 1, textAlign: 'right' }}>
                        <Typography variant="h4" fontWeight="bold" color={color} fontSize="1.5rem">
                            {convertToPersianNumbers(value)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" fontWeight="500" fontSize="0.8rem">
                            {title}
                        </Typography>
                    </Box>
                </Box>
                {progress !== undefined && (
                    <Box sx={{ mt: 1.5 }}>
                        <LinearProgress 
                            variant="determinate" 
                            value={progress} 
                            sx={{ 
                                height: 4, 
                                borderRadius: 2,
                                backgroundColor: alpha(color, 0.2),
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: color,
                                }
                            }} 
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', fontSize: '0.7rem' }}>
                            {subtitle}
                        </Typography>
                    </Box>
                )}
                {!progress && (
                    <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
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
                    py: 1,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    }
                }}
                onClick={() => handleTaskClick(task)}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32, mr: 1 }}>
                        <Box
                            sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                backgroundColor: task.done ? '#10b981' : '#f59e0b',
                            }}
                        />
                    </ListItemIcon>
                    <Typography 
                        variant="body2" 
                        fontWeight="500"
                        sx={{ 
                            textDecoration: task.done ? 'line-through' : 'none',
                            color: task.done ? 'text.secondary' : 'text.primary',
                            flex: 1,
                            textAlign: 'right',
                            fontSize: '0.8rem'
                        }}
                    >
                        {task.title}
                    </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mr: 6 }}>
                    {task.due_date && (
                        <Chip
                            label={convertToJalali(task.due_date)}
                            size="small"
                            variant="outlined"
                            color={new Date(task.due_date) < today ? "error" : "primary"}
                            sx={{ height: 20, fontSize: '0.65rem' }}
                        />
                    )}
                    {task.subtasks && task.subtasks.length > 0 && (
                        <Chip
                            label={`${convertToPersianNumbers(task.subtasks.filter((st: any) => st.done).length)}/${convertToPersianNumbers(task.subtasks.length)} زیرکار`}
                            size="small"
                            variant="outlined"
                            color="info"
                            sx={{ height: 20, fontSize: '0.65rem' }}
                        />
                    )}
                    <Chip
                        label={task.done ? 'انجام شده' : 'در حال انجام'}
                        size="small"
                        color={task.done ? "success" : "warning"}
                        variant={task.done ? "filled" : "outlined"}
                        sx={{ height: 20, fontSize: '0.65rem' }}
                    />
                </Box>
            </ListItem>
        </Box>
    );

    const SubTaskListItem = ({ subtask }: { subtask: any }) => (
        <Box>
            <ListItem 
                sx={{ 
                    py: 1,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    }
                }}
                onClick={() => handleSubTaskClick(subtask)}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32, mr: 1 }}>
                        <Box
                            sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                backgroundColor: subtask.done ? '#10b981' : '#f59e0b',
                            }}
                        />
                    </ListItemIcon>
                    <Box sx={{ flex: 1, textAlign: 'right' }}>
                        <Typography 
                            variant="body2" 
                            fontWeight="500"
                            sx={{ 
                                textDecoration: subtask.done ? 'line-through' : 'none',
                                color: subtask.done ? 'text.secondary' : 'text.primary',
                                fontSize: '0.8rem'
                            }}
                        >
                            {subtask.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                            {subtask.mainTaskTitle}
                        </Typography>
                    </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mr: 6 }}>
                    {subtask.due_date && (
                        <Chip
                            label={convertToJalali(subtask.due_date)}
                            size="small"
                            variant="outlined"
                            color={new Date(subtask.due_date) < today ? "error" : "primary"}
                            sx={{ height: 20, fontSize: '0.65rem' }}
                        />
                    )}
                    <Chip
                        label={subtask.done ? 'انجام شده' : 'در حال انجام'}
                        size="small"
                        color={subtask.done ? "success" : "warning"}
                        variant={subtask.done ? "filled" : "outlined"}
                        sx={{ height: 20, fontSize: '0.65rem' }}
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
        viewAllFilter,
        type = 'tasks'
    }: {
        title: string;
        tasks: any[];
        icon: React.ReactNode;
        color: string;
        emptyMessage: string;
        showViewAllButton?: boolean;
        viewAllFilter?: ViewMode;
        type?: 'tasks' | 'subtasks';
    }) => (
        <Card 
            sx={{ 
                height: '100%',
                borderRadius: 2,
                border: `1px solid ${alpha(color, 0.2)}`,
            }}
        >
            <CardContent sx={{ p: 0 }}>
                <Box 
                    sx={{ 
                        p: 1.5, 
                        backgroundColor: alpha(color, 0.05),
                        borderBottom: `1px solid ${alpha(color, 0.1)}`,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: showViewAllButton ? 0.5 : 0 }}>
                        <Box sx={{ color, mr: 1 }}>{icon}</Box>
                        <Typography variant="h6" fontWeight="600" fontSize="0.9rem" sx={{ flex: 1, textAlign: 'right' }}>
                            {title}
                        </Typography>
                        <Chip 
                            label={convertToPersianNumbers(tasks.length)} 
                            size="small" 
                            sx={{ 
                                backgroundColor: color,
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '0.7rem',
                                height: 20
                            }} 
                        />
                    </Box>
                    {showViewAllButton && viewAllFilter && tasks.length > 0 && (
                        <Button
                            size="small"
                            onClick={() => handleViewInTasks(viewAllFilter)}
                            sx={{ 
                                color,
                                fontSize: '0.7rem',
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
                
                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {tasks.length === 0 ? (
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary" fontSize="0.8rem">
                                {emptyMessage}
                            </Typography>
                        </Box>
                    ) : (
                        tasks.map((item, index) => (
                            <Box key={item.id}>
                                {type === 'subtasks' ? 
                                    <SubTaskListItem subtask={item} /> : 
                                    <TaskListItem task={item} />
                                }
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
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 3, textAlign: 'right', fontSize: '1.5rem' }}>
                📊 گزارشات جامع
            </Typography>

            <Grid container spacing={2}>
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
                        onClick={() => handleCategoryClick('subtasks', 'همه زیرکارها')}
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

                <Grid item xs={12} lg={6}>
                    <TaskListCard
                        title="⏰ زیرکارهای معوقه"
                        tasks={stats.overdueSubtasks}
                        icon={<WarningIcon color="error" />}
                        color="#ef4444"
                        emptyMessage="هیچ زیرکار معوقه وجود ندارد ✅"
                        type="subtasks"
                    />
                </Grid>

                <Grid item xs={12} lg={6}>
                    <TaskListCard
                        title="📅 زیرکارهای امروز"
                        tasks={stats.todaySubtasks}
                        icon={<TodayIcon color="primary" />}
                        color="#3b82f6"
                        emptyMessage="هیچ زیرکار برای امروز وجود ندارد 🎉"
                        type="subtasks"
                    />
                </Grid>
            </Grid>
        </Box>
    );

    const renderCategoryView = () => {
        let filteredItems: any[] = [];
        let title = '';
        let color = '#3b82f6';
        let icon = <TaskIcon />;
        let filterType: ViewMode = 'overview';
        let type: 'tasks' | 'subtasks' = 'tasks';

        switch (viewMode) {
            case 'overdue':
                filteredItems = stats.overdueTasks;
                title = 'تسک‌های معوقه';
                color = '#ef4444';
                icon = <WarningIcon />;
                filterType = 'overdue';
                break;
            case 'today':
                filteredItems = stats.todayTasks;
                title = 'تسک‌های امروز';
                color = '#3b82f6';
                icon = <TodayIcon />;
                filterType = 'today';
                break;
            case 'completed':
                filteredItems = allTasks.filter(task => task.done);
                title = 'تسک‌های انجام شده';
                color = '#10b981';
                icon = <CheckCircleIcon />;
                filterType = 'completed';
                break;
            case 'pending':
                filteredItems = allTasks.filter(task => !task.done);
                title = 'تسک‌های در حال انجام';
                color = '#f59e0b';
                icon = <ScheduleIcon />;
                filterType = 'pending';
                break;
            case 'subtasks':
                filteredItems = stats.allSubtasks;
                title = 'همه زیرکارها';
                color = '#8b5cf6';
                icon = <SubTaskIcon />;
                filterType = 'subtasks';
                type = 'subtasks';
                break;
        }

        return (
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1, flexWrap: 'wrap' }}>
                    <Button
                        startIcon={<BackIcon />}
                        onClick={handleBackToOverview}
                        variant="outlined"
                        size="small"
                    >
                        بازگشت به گزارشات
                    </Button>
                    <Box sx={{ color, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {icon}
                        <Typography variant="h4" fontWeight="bold" fontSize="1.3rem">
                            {title}
                        </Typography>
                    </Box>
                    <Chip 
                        label={convertToPersianNumbers(filteredItems.length)} 
                        sx={{ 
                            backgroundColor: color,
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.8rem'
                        }} 
                    />
                    <Button
                        variant="contained"
                        onClick={() => handleViewInTasks(filterType)}
                        sx={{ 
                            ml: 'auto',
                            backgroundColor: color,
                            fontSize: '0.8rem',
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
                    tasks={filteredItems}
                    icon={icon}
                    color={color}
                    emptyMessage={`هیچ ${title} وجود ندارد`}
                    type={type}
                />
            </Box>
        );
    };

    return (
        <Box sx={{ p: 2 }}>
            {viewMode === 'overview' ? renderOverview() : renderCategoryView()}
        </Box>
    );
}