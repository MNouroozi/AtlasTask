'use client';

import { Card, CardContent, Typography, Box, Chip, IconButton } from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Subtitles as SubtasksIcon,
} from '@mui/icons-material';
import StatusBadge from '../ui/StatusBadge';
import { Task } from '@/app/types';

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (taskId: string) => void;
    onViewSubtasks: (taskId: string) => void;
}

export default ({task, onEdit, onDelete, onViewSubtasks}: TaskCardProps) => {
    const priorityColors = {
        low: 'success',
        medium: 'warning',
        high: 'error',
    } as const;

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                        {task.title}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                            size="small"
                            onClick={() => onEdit(task)}
                            color="primary"
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={() => onViewSubtasks(task.id)}
                            color="info"
                        >
                            <SubtasksIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={() => onDelete(task.id)}
                            color="error"
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, lineHeight: 1.6 }}
                >
                    {task.description}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                    <StatusBadge status={task.status} />

                    <Chip
                        label={task.priority === 'high' ? 'بالا' : task.priority === 'medium' ? 'متوسط' : 'پایین'}
                        color={priorityColors[task.priority as keyof typeof priorityColors]}
                        size="small"
                        variant="outlined"
                    />

                    <Typography variant="caption" color="text.secondary">
                        مسئول: {task.assignee}
                    </Typography>

                    {task.dueDate && (
                        <Typography variant="caption" color="text.secondary">
                            مهلت: {new Date(task.dueDate).toLocaleDateString('fa-IR')}
                        </Typography>
                    )}
                </Box>

                {task.tags.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                        {task.tags.map((tag: string, index: number) => (
                            <Chip
                                key={index}
                                label={tag}
                                size="small"
                                variant="filled"
                                sx={{ backgroundColor: 'grey.100' }}
                            />
                        ))}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}