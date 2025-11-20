'use client';

import { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
} from '@mui/material';
import {
    Add as AddIcon,
} from '@mui/icons-material';
import { useTasks } from '@/app/hooks/useTasks';
import TaskTable from '@/components/tasks/TaskTable';
import TaskFilters from '@/components/tasks/TaskFilters';
import TaskModal from '@/components/tasks/TaskModal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { MainTask } from '@/app/types';

export default function TasksPage() {
    const {
        tasks,
        loading,
        filters,
        setFilters,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskDone,
    } = useTasks();

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<MainTask | undefined>();
    const [saveLoading, setSaveLoading] = useState(false);

    const handleCreateTask = async (taskData: Partial<MainTask>) => {
        setSaveLoading(true);
        try {
            await createTask(taskData);
        } finally {
            setSaveLoading(false);
        }
    };

    const handleUpdateTask = async (taskData: Partial<MainTask>) => {
        if (!selectedTask) return;
        
        setSaveLoading(true);
        try {
            await updateTask(selectedTask.id, taskData);
        } finally {
            setSaveLoading(false);
        }
    };

    const handleEditTask = (task: MainTask) => {
        setSelectedTask(task);
        setModalOpen(true);
    };

    const handleDeleteTask = async (taskId: number) => {
        if (window.confirm('آیا از حذف این تسک اطمینان دارید؟')) {
            try {
                await deleteTask(taskId);
            } catch (error) {
                alert('خطا در حذف تسک');
            }
        }
    };

    const handleViewSubtasks = (taskId: number) => {
        console.log('View subtasks for task:', taskId);
        // Navigate to subtasks page
    };

    const handleToggleDone = async (taskId: number, done: boolean) => {
        try {
            await toggleTaskDone(taskId, done);
        } catch (error) {
            alert('خطا در تغییر وضعیت تسک');
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedTask(undefined);
    };

    const handleSaveTask = (taskData: Partial<MainTask>) => {
        if (selectedTask) {
            return handleUpdateTask(taskData);
        } else {
            return handleCreateTask(taskData);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    مدیریت تسک‌ها
                </Typography>
                
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setModalOpen(true)}
                    sx={{ borderRadius: 2 }}
                >
                    ایجاد تسک جدید
                </Button>
            </Box>

            <TaskFilters
                filters={filters}
                onFiltersChange={setFilters}
            />

            <Card>
                <CardContent sx={{ p: '0 !important' }}>
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <TaskTable
                            tasks={tasks}
                            onEdit={handleEditTask}
                            onDelete={handleDeleteTask}
                            onViewSubtasks={handleViewSubtasks}
                            onToggleDone={handleToggleDone}
                        />
                    )}
                </CardContent>
            </Card>

            <TaskModal
                open={modalOpen}
                onClose={handleCloseModal}
                task={selectedTask}
                onSave={handleSaveTask}
                loading={saveLoading}
            />
        </Box>
    );
}