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
import Swal from 'sweetalert2';
import { useTasks } from '@/app/hooks/useTasks';
import TaskTable from '@/components/tasks/TaskTable';
import TaskFilters from '@/components/tasks/TaskFilters';
import TaskModal from '@/components/tasks/TaskModal';
import SubTaskModal from '@/components/subTasks/SubTaskModal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { MainTask, CreateSubTaskData, SubTask } from '@/app/types';

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
    const [editingSubTask, setEditingSubTask] = useState<SubTask | undefined>();

    const showSuccessAlert = (title: string) => {
        Swal.fire({
            title: title,
            icon: 'success',
            confirmButtonText: 'باشه',
            confirmButtonColor: '#3b82f6',
            width: 400,
            customClass: {
                popup: 'rounded-2xl'
            }
        });
    };

    const showErrorAlert = (title: string) => {
        Swal.fire({
            title: title,
            icon: 'error',
            confirmButtonText: 'متوجه شدم',
            confirmButtonColor: '#ef4444',
            width: 400,
            customClass: {
                popup: 'rounded-2xl'
            }
        });
    };

    const showConfirmDialog = (title: string, confirmButtonText: string = 'بله، حذف شود') => {
        return Swal.fire({
            title: title,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: confirmButtonText,
            cancelButtonText: 'انصراف',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            width: 450,
            customClass: {
                popup: 'rounded-2xl'
            }
        });
    };

    const handleCreateTask = async (taskData: Partial<MainTask>) => {
        setSaveLoading(true);
        try {
            await createTask(taskData);
            setTaskModalOpen(false);
            showSuccessAlert('تسک جدید با موفقیت ایجاد شد');
        } catch (error) {
            showErrorAlert('خطا در ایجاد تسک');
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
            showSuccessAlert('تسک با موفقیت ویرایش شد');
        } catch (error) {
            showErrorAlert('خطا در ویرایش تسک');
        } finally {
            setSaveLoading(false);
        }
    };

    const handleEditTask = (task: MainTask) => {
        setSelectedTask(task);
        setTaskModalOpen(true);
    };

    const handleDeleteTask = async (taskId: number) => {
        const result = await showConfirmDialog('آیا از حذف این تسک اطمینان دارید؟', 'بله، حذف شود');
        
        if (result.isConfirmed) {
            try {
                await deleteTask(taskId);
                showSuccessAlert('تسک با موفقیت حذف شد');
            } catch (error) {
                showErrorAlert('خطا در حذف تسک');
            }
        }
    };

    const handleToggleDone = async (taskId: number, done: boolean) => {
        try {
            await toggleTaskDone(taskId, done);
            showSuccessAlert(`وضعیت تسک به ${done ? 'انجام شده' : 'در حال انجام'} تغییر کرد`);
        } catch (error) {
            showErrorAlert('خطا در تغییر وضعیت تسک');
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
        setEditingSubTask(undefined);
        setSelectedTaskId(taskId);
        setSubTaskModalOpen(true);
    };

    const handleEditSubTask = (subTask: SubTask) => {
        setEditingSubTask(subTask);
        setSelectedTaskId(subTask.main_task_id);
        setSubTaskModalOpen(true);
    };

    const handleCreateSubTask = async (subTaskData: CreateSubTaskData) => {
        if (!selectedTaskId) return;
        
        setSaveLoading(true);
        try {
            const response = await fetch(
                `http://localhost:8080/api/main-tasks/${selectedTaskId}/subtasks`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(subTaskData),
                }
            );

            if (!response.ok) {
                throw new Error(`خطا در ایجاد ساب‌تسک: ${response.status}`);
            }

            await response.json();
            setSubTaskModalOpen(false);
            setSelectedTaskId(null);
            refetchTasks();
            showSuccessAlert('زیرکار جدید با موفقیت ایجاد شد');
        } catch (error) {
            showErrorAlert('خطا در ایجاد زیرکار');
        } finally {
            setSaveLoading(false);
        }
    };

    const handleUpdateSubTask = async (subTaskData: CreateSubTaskData) => {
        if (!editingSubTask) return;
        
        setSaveLoading(true);
        try {
            const response = await fetch(
                `http://localhost:8080/api/subtasks/${editingSubTask.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(subTaskData),
                }
            );

            if (!response.ok) {
                throw new Error(`خطا در ویرایش ساب‌تسک: ${response.status}`);
            }

            await response.json();
            setSubTaskModalOpen(false);
            setEditingSubTask(undefined);
            setSelectedTaskId(null);
            refetchTasks();
            showSuccessAlert('زیرکار با موفقیت ویرایش شد');
        } catch (error) {
            showErrorAlert('خطا در ویرایش زیرکار');
        } finally {
            setSaveLoading(false);
        }
    };

    const handleSaveSubTask = (subTaskData: CreateSubTaskData) => {
        if (editingSubTask) {
            return handleUpdateSubTask(subTaskData);
        } else {
            return handleCreateSubTask(subTaskData);
        }
    };

    const handleDeleteSubTask = async (subTaskId: number) => {
        const result = await showConfirmDialog('آیا از حذف این زیرکار اطمینان دارید؟', 'بله، حذف شود');
        
        if (result.isConfirmed) {
            try {
                const response = await fetch(`http://localhost:8080/api/subtasks/${subTaskId}`, {
                    method: "DELETE",
                });

                if (!response.ok) {
                    throw new Error(`خطا در حذف ساب‌تسک: ${response.status}`);
                }

                refetchTasks();
                showSuccessAlert('زیرکار با موفقیت حذف شد');
            } catch (error) {
                showErrorAlert('خطا در حذف زیرکار');
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
            showSuccessAlert(`وضعیت زیرکار به ${done ? 'انجام شده' : 'در حال انجام'} تغییر کرد`);
        } catch (error) {
            showErrorAlert('خطا در تغییر وضعیت زیرکار');
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
                            onEditSubTask={handleEditSubTask}
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
                    setEditingSubTask(undefined);
                    setSelectedTaskId(null);
                }}
                onSave={handleSaveSubTask}
                loading={saveLoading}
                mainTaskId={selectedTaskId}
                subTask={editingSubTask}
            />
        </Box>
    );
}