'use client';

import { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

    const showSuccessToast = (message: string) => {
        toast.success(message, {
            position: "top-left",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            rtl: true,
            theme: "light",
        });
    };

    const showErrorToast = (message: string) => {
        toast.error(message, {
            position: "top-left",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            rtl: true,
            theme: "light",
        });
    };

    const handleCloseSubTaskModal = () => {
        setSubTaskModalOpen(false);
        setEditingSubTask(undefined);
        setSelectedTaskId(null);
    };

    const handleCreateTask = async (taskData: Partial<MainTask>) => {
        setSaveLoading(true);
        try {
            await createTask(taskData);
            setTaskModalOpen(false);
            showSuccessToast('تسک جدید با موفقیت ایجاد شد');
        } catch (error) {
            showErrorToast('خطا در ایجاد تسک');
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
            showSuccessToast('تسک با موفقیت ویرایش شد');
        } catch (error) {
            showErrorToast('خطا در ویرایش تسک');
        } finally {
            setSaveLoading(false);
        }
    };

    const handleEditTask = (task: MainTask) => {
        setSelectedTask(task);
        setTaskModalOpen(true);
    };

    const handleDeleteTask = async (taskId: number) => {
        const confirmed = window.confirm('آیا از حذف این تسک اطمینان دارید؟');
        
        if (confirmed) {
            try {
                await deleteTask(taskId);
                showSuccessToast('تسک با موفقیت حذف شد');
            } catch (error) {
                showErrorToast('خطا در حذف تسک');
            }
        }
    };

    const handleToggleDone = async (taskId: number, done: boolean) => {
        try {
            await toggleTaskDone(taskId, done);
            showSuccessToast(`وضعیت تسک به ${done ? 'انجام شده' : 'در حال انجام'} تغییر کرد`);
        } catch (error) {
            showErrorToast('خطا در تغییر وضعیت تسک');
        }
    };

    const handleCloseTaskModal = () => {
        setTaskModalOpen(false);
        setSelectedTask(undefined);
    };

    const handleSaveTask = (taskData: Partial<MainTask>) => {
        return selectedTask ? handleUpdateTask(taskData) : handleCreateTask(taskData);
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

    const handleSaveSubTask = async (subTaskData: CreateSubTaskData) => {
        setSaveLoading(true);
        try {
            const url = editingSubTask
                ? `http://localhost:8080/api/subtasks/${editingSubTask.id}`
                : `http://localhost:8080/api/main-tasks/${selectedTaskId}/subtasks`;
            
            const method = editingSubTask ? "PUT" : "POST";
            const body = editingSubTask 
                ? { ...subTaskData }
                : { ...subTaskData, main_task_id: selectedTaskId };

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error(`خطا در ${editingSubTask ? 'ویرایش' : 'ایجاد'} ساب‌تسک: ${response.status}`);
            }

            await response.json();
            
            refetchTasks();
            showSuccessToast(`زیرکار ${editingSubTask ? 'با موفقیت ویرایش شد' : 'جدید با موفقیت ایجاد شد'}`);
            handleCloseSubTaskModal();
        } catch (error) {
            showErrorToast(`خطا در ${editingSubTask ? 'ویرایش' : 'ایجاد'} زیرکار`);
        } finally {
            setSaveLoading(false);
        }
    };

    const handleDeleteSubTask = async (subTaskId: number) => {
        const confirmed = window.confirm('آیا از حذف این زیرکار اطمینان دارید؟');
        
        if (confirmed) {
            try {
                const response = await fetch(`http://localhost:8080/api/subtasks/${subTaskId}`, {
                    method: "DELETE",
                });

                if (!response.ok) {
                    throw new Error(`خطا در حذف ساب‌تسک: ${response.status}`);
                }

                refetchTasks();
                showSuccessToast('زیرکار با موفقیت حذف شد');
            } catch (error) {
                showErrorToast('خطا در حذف زیرکار');
            }
        }
    };

    const handleToggleSubTaskDone = async (subTaskId: number, done: boolean) => {
        try {
            const response = await fetch(`http://localhost:8080/api/subtasks/${subTaskId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ done }),
            });

            if (!response.ok) {
                throw new Error(`خطا در تغییر وضعیت ساب‌تسک: ${response.status}`);
            }

            await response.json();
            refetchTasks();
            showSuccessToast(`وضعیت زیرکار به ${done ? 'انجام شده' : 'در حال انجام'} تغییر کرد`);
        } catch (error) {
            showErrorToast('خطا در تغییر وضعیت زیرکار');
        }
    };

    return (
        <Box>
            <ToastContainer
                position="top-left"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={true}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

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
                onClose={handleCloseSubTaskModal}
                onSave={handleSaveSubTask}
                loading={saveLoading}
                mainTaskId={selectedTaskId}
                subTask={editingSubTask}
            />
        </Box>
    );
}