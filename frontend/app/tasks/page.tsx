'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useTasks } from '@/app/hooks/useTasks';
import TaskTable from '@/components/tasks/TaskTable';
import TaskFilters from '@/components/tasks/TaskFilters';
import TaskModal from '@/components/tasks/TaskModal';
import SubTaskModal from '@/components/subTasks/SubTaskModal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { MainTask, CreateSubTaskData, SubTask } from '@/app/types';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function TasksPage() {
    const { tasks, loading, filters, setFilters, createTask, updateTask, deleteTask, toggleTaskDone, refetch: refetchTasks } = useTasks();

    const [taskModalOpen, setTaskModalOpen] = useState(false);
    const [subTaskModalOpen, setSubTaskModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<MainTask | undefined>();
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const [editingSubTask, setEditingSubTask] = useState<SubTask | null>(null);
    const [saveLoading, setSaveLoading] = useState(false);

    const editingSubTaskRef = useRef<SubTask | null>(null);

    useEffect(() => {
        editingSubTaskRef.current = editingSubTask;
    }, [editingSubTask]);

    // تابع برای نمایش toast موفقیت‌آمیز
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

    // تابع برای نمایش toast خطا
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

    // تابع برای نمایش confirmation با SweetAlert
    const showConfirmDialog = (title: string, text: string, confirmButtonText: string = "بله، حذف شود") => {
        return Swal.fire({
            title: title,
            text: text,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d32f2f',
            cancelButtonColor: '#757575',
            confirmButtonText: confirmButtonText,
            cancelButtonText: 'انصراف',
            reverseButtons: true,
            customClass: {
                confirmButton: 'swal2-confirm',
                cancelButton: 'swal2-cancel'
            }
        });
    };

    const handleCreateTask = async (taskData: Partial<MainTask>) => {
        setSaveLoading(true);
        try { 
            await createTask(taskData);
            showSuccessToast('تسک با موفقیت ایجاد شد');
            setTaskModalOpen(false); 
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
            showSuccessToast('تسک با موفقیت به‌روزرسانی شد');
            setTaskModalOpen(false); 
            setSelectedTask(undefined); 
        } catch (error) {
            showErrorToast('خطا در به‌روزرسانی تسک');
        } finally { 
            setSaveLoading(false); 
        }
    };

    const handleEditTask = (task: MainTask) => { 
        setSelectedTask(task); 
        setTaskModalOpen(true); 
    };

    const handleDeleteTask = async (taskId: number) => { 
        const result = await showConfirmDialog(
            'حذف تسک',
            'آیا از حذف این تسک اطمینان دارید؟ این عمل غیرقابل بازگشت است.',
            'بله، حذف شود'
        );
        
        if (result.isConfirmed) { 
            try { 
                await deleteTask(taskId);
                showSuccessToast('تسک با موفقیت حذف شد');
            } catch { 
                showErrorToast('خطا در حذف تسک'); 
            } 
        } 
    };

    const handleToggleDone = async (taskId: number, done: boolean) => { 
        try { 
            await toggleTaskDone(taskId, done);
            const message = done ? 'تسک به وضعیت انجام شده تغییر یافت' : 'تسک به وضعیت انجام نشده تغییر یافت';
            showSuccessToast(message);
        } catch { 
            showErrorToast('خطا در تغییر وضعیت تسک'); 
        } 
    };

    const handleCloseTaskModal = () => { 
        setTaskModalOpen(false); 
        setSelectedTask(undefined); 
    };

    const handleSaveTask = (taskData: Partial<MainTask>) => selectedTask ? handleUpdateTask(taskData) : handleCreateTask(taskData);

    const handleAddSubTask = (taskId: number) => { 
        setEditingSubTask(null);
        setSelectedTaskId(taskId); 
        setSubTaskModalOpen(true); 
    };

    const handleEditSubTask = (subTask: SubTask) => { 
        editingSubTaskRef.current = subTask;
        setEditingSubTask(subTask);
        setSelectedTaskId(subTask.main_task_id);
        setSubTaskModalOpen(true);
    };

    const handleCloseSubTaskModal = () => {
        setSubTaskModalOpen(false);
        setTimeout(() => {
            setEditingSubTask(null);
            setSelectedTaskId(null);
            editingSubTaskRef.current = null;
        }, 100);
    };

    const handleSaveSubTask = async (data: CreateSubTaskData) => {
        setSaveLoading(true);
        try {
            const currentEditingSubTask = editingSubTaskRef.current;
            const requestBody = currentEditingSubTask ? { ...data } : { ...data, main_task_id: selectedTaskId };
            const url = currentEditingSubTask
                ? `http://localhost:8080/api/subtasks/${currentEditingSubTask.id}`
                : `http://localhost:8080/api/main-tasks/${selectedTaskId}/subtasks`;
            const method = currentEditingSubTask ? "PUT" : "POST";

            const response = await fetch(url, { 
                method, 
                headers: { "Content-Type": "application/json" }, 
                body: JSON.stringify(requestBody) 
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`خطا در ذخیره ساب‌تسک: ${response.status} - ${errorText}`);
            }
            
            await response.json();
            
            const message = currentEditingSubTask ? 'زیرکار با موفقیت به‌روزرسانی شد' : 'زیرکار با موفقیت ایجاد شد';
            showSuccessToast(message);
            
            refetchTasks();
            handleCloseSubTaskModal();
        } catch (error) { 
            showErrorToast('خطا در ذخیره زیرکار'); 
        } finally { 
            setSaveLoading(false); 
        }
    };

    const handleDeleteSubTask = async (subTaskId: number) => { 
        const result = await showConfirmDialog(
            'حذف زیرکار',
            'آیا از حذف این زیرکار اطمینان دارید؟',
            'بله، حذف شود'
        );
        
        if (result.isConfirmed) { 
            try { 
                const response = await fetch(`http://localhost:8080/api/subtasks/${subTaskId}`, { method: "DELETE" }); 
                if (!response.ok) throw new Error('خطا در حذف');
                showSuccessToast('زیرکار با موفقیت حذف شد');
                refetchTasks(); 
            } catch { 
                showErrorToast('خطا در حذف زیرکار'); 
            } 
        } 
    };

    const handleToggleSubTaskDone = async (subTaskId: number, done: boolean) => { 
        try { 
            const response = await fetch(`http://localhost:8080/api/subtasks/${subTaskId}`, { 
                method: "PUT", 
                headers: { "Content-Type": "application/json" }, 
                body: JSON.stringify({ done }) 
            }); 
            if (!response.ok) throw new Error('خطا در تغییر وضعیت');
            await response.json();
            
            const message = done ? 'زیرکار به وضعیت انجام شده تغییر یافت' : 'زیرکار به وضعیت انجام نشده تغییر یافت';
            showSuccessToast(message);
            
            refetchTasks(); 
        } catch { 
            showErrorToast('خطا در تغییر وضعیت زیرکار'); 
        } 
    };

    return (
        <Box>
            {/* کامپوننت ToastContainer برای نمایش toastها */}
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
                <Typography variant="h4" sx={{ fontWeight: 600 }}>مدیریت تسک‌ها</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setTaskModalOpen(true)} sx={{ borderRadius: 2 }}>
                    ایجاد تسک جدید
                </Button>
            </Box>

            <TaskFilters filters={filters} onFiltersChange={setFilters} />

            <Card>
                <CardContent sx={{ p: '0 !important' }}>
                    {loading ? <LoadingSpinner /> : <TaskTable
                        tasks={tasks}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        onToggleDone={handleToggleDone}
                        onAddSubTask={handleAddSubTask}
                        onEditSubTask={handleEditSubTask}
                        onDeleteSubTask={handleDeleteSubTask}
                        onToggleSubTaskDone={handleToggleSubTaskDone}
                    />}
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