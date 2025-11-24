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
import SubTaskModal from '@/components/subTasks/SubTaskModal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { MainTask, CreateSubTaskData } from '@/app/types';

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
        refetch: refetchTasks,
    } = useTasks();

    const [taskModalOpen, setTaskModalOpen] = useState(false);
    const [subTaskModalOpen, setSubTaskModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<MainTask | undefined>();
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const [saveLoading, setSaveLoading] = useState(false);

    const handleCreateTask = async (taskData: Partial<MainTask>) => {
        setSaveLoading(true);
        try {
            await createTask(taskData);
            setTaskModalOpen(false);
        } finally {
            setSaveLoading(false);
        }
    };

    const handleUpdateTask = async (taskData: Partial<MainTask>) => {
        if (!selectedTask) return;
        
        setSaveLoading(true);
        try {
            await updateTask(selectedTask.id, taskData);
            setTaskModalOpen(false);
            setSelectedTask(undefined);
        } finally {
            setSaveLoading(false);
        }
    };

    const handleEditTask = (task: MainTask) => {
        setSelectedTask(task);
        setTaskModalOpen(true);
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

    const handleToggleDone = async (taskId: number, done: boolean) => {
        try {
            await toggleTaskDone(taskId, done);
        } catch (error) {
            alert('خطا در تغییر وضعیت تسک');
        }
    };

    const handleCloseTaskModal = () => {
        setTaskModalOpen(false);
        setSelectedTask(undefined);
    };

    const handleSaveTask = (taskData: Partial<MainTask>) => {
        if (selectedTask) {
            return handleUpdateTask(taskData);
        } else {
            return handleCreateTask(taskData);
        }
    };

    const handleAddSubTask = (taskId: number) => {
        setSelectedTaskId(taskId);
        setSubTaskModalOpen(true);
    };

const handleCreateSubTask = async (subTaskData: CreateSubTaskData) => {
  if (!selectedTaskId) return;
  
  try {
    const requestBody = {
      ...subTaskData,
      main_task_id: selectedTaskId
    };

    const response = await fetch(
      `http://localhost:8080/api/main-tasks/${selectedTaskId}/subtasks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error(`خطا در ایجاد ساب‌تسک: ${response.status}`);
    }

    await response.json();
    setSubTaskModalOpen(false);
    setSelectedTaskId(null);
    refetchTasks();
  } catch (error) {
    console.error('Error creating subtask:', error);
    alert('خطا در ایجاد زیرکار');
  }
};
    const handleDeleteSubTask = async (subTaskId: number) => {
        if (confirm('آیا از حذف این زیرکار اطمینان دارید؟')) {
            try {
                const response = await fetch(`http://localhost:8080/api/subtasks/${subTaskId}`, {
                    method: "DELETE",
                });

                if (!response.ok) {
                    throw new Error(`خطا در حذف ساب‌تسک: ${response.status}`);
                }

                refetchTasks();
            } catch (error) {
                console.error('Error deleting subtask:', error);
                alert('خطا در حذف زیرکار');
            }
        }
    };

    const handleToggleSubTaskDone = async (subTaskId: number, done: boolean) => {
        try {
            const response = await fetch(`http://localhost:8080/api/subtasks/${subTaskId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ done }),
            });

            if (!response.ok) {
                throw new Error(`خطا در تغییر وضعیت ساب‌تسک: ${response.status}`);
            }

            await response.json();
            refetchTasks();
        } catch (error) {
            console.error('Error toggling subtask:', error);
            alert('خطا در تغییر وضعیت زیرکار');
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
                    onClick={() => setTaskModalOpen(true)}
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
                            onToggleDone={handleToggleDone}
                            onAddSubTask={handleAddSubTask}
                            onDeleteSubTask={handleDeleteSubTask}
                            onToggleSubTaskDone={handleToggleSubTaskDone}
                        />
                    )}
                </CardContent>
            </Card>

            <TaskModal
                open={taskModalOpen}
                onClose={handleCloseTaskModal}
                task={selectedTask}
                onSave={handleSaveTask}
                loading={saveLoading}
            />

            <SubTaskModal
                open={subTaskModalOpen}
                onClose={() => {
                    setSubTaskModalOpen(false);
                    setSelectedTaskId(null);
                }}
                onSave={handleCreateSubTask}
                loading={saveLoading}
                mainTaskId={selectedTaskId}
            />
        </Box>
    );
}